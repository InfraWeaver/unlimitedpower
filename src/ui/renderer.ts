import { GameState, OreType } from '../game/state';
import { getDisplayPassiveRate } from '../game/mining';
import { getTimeToAutoUnlock, formatTimeMs } from '../game/progression';
import { getSmeltProgress, getSmeltRate } from '../game/smelting';
import { getToolValue, getCraftCost } from '../game/crafting';

export function renderResources(state: GameState, container: HTMLElement): void {
  container.innerHTML = `
    <div class="resource-item">
      <div class="resource-label">Copper Ore</div>
      <div class="resource-value">${Math.floor(state.resources.copper.ore)}</div>
    </div>
    <div class="resource-item">
      <div class="resource-label">Coins</div>
      <div class="resource-value">${Math.floor(state.resources.coins)}</div>
    </div>
    <div class="resource-item">
      <div class="resource-label">Copper Bars</div>
      <div class="resource-value">${Math.floor(state.resources.copper.bars)}</div>
    </div>
    <div class="resource-item">
      <div class="resource-label">Tools</div>
      <div class="resource-value">${Math.floor(state.resources.tools)}</div>
    </div>
  `;
}

export function renderMiningPanel(state: GameState, container: HTMLElement, onOreClick: () => void): void {
  const passiveRate = getDisplayPassiveRate(state);
  const timeToUnlock = getTimeToAutoUnlock(state);
  const isUnlocked = state.progression.autoUnlockTriggered;

  container.innerHTML = `
    <div class="mining-panel">
      <div class="mining-stats">
        <div class="stat-box">
          <div class="stat-label">Passive Rate</div>
          <div class="stat-value">${passiveRate.toFixed(1)}/s</div>
        </div>
        <div class="stat-box">
          <div class="stat-label">Click Bonus</div>
          <div class="stat-value">+${state.mining.clickBonus}</div>
        </div>
      </div>

      <div class="ore-deposit" id="ore-deposit">
        <div class="ore-deposit-text">
          <div class="ore-deposit-label">TAP THE ORE!</div>
          <div class="ore-deposit-amount">⛏️</div>
        </div>
      </div>

      <div class="auto-unlock-info${isUnlocked ? ' unlocked' : ''}">
        ${
          isUnlocked
            ? '✓ Auto-Mining Unlocked! Keep tapping for bonus ore.'
            : `Auto-Mining unlocks in: ${formatTimeMs(timeToUnlock)}`
        }
      </div>
    </div>
  `;

  document.getElementById('ore-deposit')?.addEventListener('click', onOreClick);
}

export function renderSmeltingPanel(
  state: GameState,
  container: HTMLElement,
  onQueueOre: (ore: OreType, amount: number) => void
): void {
  const smeltRate = getSmeltRate(state);

  const oreHTML = state.progression.unlockedOres
    .map((ore) => {
      const progress = getSmeltProgress(ore, state);
      const oreData = state.resources[ore];
      return `
        <div class="ore-smelting-item">
          <div class="ore-name">${ore.toUpperCase()}</div>
          <div class="ore-stats">
            <div>Ore: ${Math.floor(oreData.ore)}</div>
            <div>Bars: ${Math.floor(oreData.bars)}</div>
            <div>Queued: ${oreData.bars > 0 ? Math.floor(state.smelting[ore].queuedOre) : '-'}</div>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${progress}%"></div>
          </div>
          <div class="ore-actions">
            <button class="queue-button" data-ore="${ore}" data-amount="10">Queue 10</button>
            <button class="queue-button" data-ore="${ore}" data-amount="100">Queue 100</button>
          </div>
        </div>
      `;
    })
    .join('');

  container.innerHTML = `
    <div class="smelting-panel">
      <div class="smelting-info">
        <div class="stat-label">Smelt Rate</div>
        <div class="stat-value">${smeltRate.toFixed(1)} bars/s</div>
      </div>
      <div class="ore-list">
        ${oreHTML}
      </div>
    </div>
  `;

  document.querySelectorAll('.queue-button').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const ore = (e.target as HTMLElement).getAttribute('data-ore') as OreType;
      const amount = parseInt((e.target as HTMLElement).getAttribute('data-amount') || '1');
      onQueueOre(ore, amount);
    });
  });
}

export function renderCraftingPanel(
  state: GameState,
  container: HTMLElement,
  onCraft: (ore: OreType) => void,
  onSell: () => void
): void {
  const toolValue = getToolValue(state);

  const oreHTML = state.progression.unlockedOres
    .map((ore) => {
      const barCost = getCraftCost(ore);
      const hasEnoughBars = state.resources[ore].bars >= barCost;
      return `
        <button
          class="craft-button ${!hasEnoughBars ? 'disabled' : ''}"
          data-ore="${ore}"
          ${!hasEnoughBars ? 'disabled' : ''}
        >
          Craft ${ore.toUpperCase()} Tool
          <br><small>(need ${barCost} bars)</small>
        </button>
      `;
    })
    .join('');

  container.innerHTML = `
    <div class="crafting-panel">
      <div class="crafting-section">
        <h3>Craft Tools</h3>
        <div class="craft-buttons">
          ${oreHTML}
        </div>
      </div>

      <div class="crafting-section">
        <h3>Sell Tools</h3>
        <div class="tool-value">Each tool: ${Math.floor(toolValue)} coins</div>
        <div class="tools-available">You have: ${Math.floor(state.resources.tools)} tools</div>
        <button class="sell-button" ${state.resources.tools === 0 ? 'disabled' : ''}>
          Sell All (${Math.floor(state.resources.tools * toolValue)} coins)
        </button>
      </div>
    </div>
  `;

  document.querySelectorAll('.craft-button').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const ore = (e.target as HTMLElement).getAttribute('data-ore') as OreType;
      onCraft(ore);
    });
  });

  document.querySelector('.sell-button')?.addEventListener('click', onSell);
}

export function renderTabNavigation(
  state: GameState,
  container: HTMLElement,
  onSwitchTab: (tab: 'mining' | 'smelting' | 'crafting' | 'upgrades') => void
): void {
  const tabs = ['mining', 'smelting', 'crafting', 'upgrades'] as const;

  container.innerHTML = tabs
    .map(
      (tab) => `
    <button class="tab-button ${state.ui.activeTab === tab ? 'active' : ''}" data-tab="${tab}">
      ${tab.charAt(0).toUpperCase() + tab.slice(1)}
    </button>
  `
    )
    .join('');

  document.querySelectorAll('.tab-button').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const tab = (e.target as HTMLElement).getAttribute('data-tab') as typeof tabs[number];
      onSwitchTab(tab);
    });
  });
}

export function render(
  state: GameState,
  container: HTMLElement,
  contentContainer: HTMLElement,
  onOreClick: () => void,
  onQueueOre: (ore: OreType, amount: number) => void,
  onCraft: (ore: OreType) => void,
  onSell: () => void,
  onSwitchTab: (tab: 'mining' | 'smelting' | 'crafting' | 'upgrades') => void
): void {
  renderResources(state, container);

  const activeTab = state.ui.activeTab;

  // Create tab container if it doesn't exist
  if (!document.getElementById('tab-nav')) {
    const tabNav = document.createElement('div');
    tabNav.id = 'tab-nav';
    tabNav.className = 'tab-navigation';
    contentContainer.insertBefore(tabNav, contentContainer.firstChild);
  }

  renderTabNavigation(state, document.getElementById('tab-nav')!, onSwitchTab);

  // Create content area if it doesn't exist
  if (!document.getElementById('tab-content')) {
    const tabContent = document.createElement('div');
    tabContent.id = 'tab-content';
    tabContent.className = 'tab-content';
    contentContainer.appendChild(tabContent);
  }

  // Render active tab content
  const contentArea = document.getElementById('tab-content')!;

  if (activeTab === 'mining') {
    renderMiningPanel(state, contentArea, onOreClick);
  } else if (activeTab === 'smelting') {
    renderSmeltingPanel(state, contentArea, onQueueOre);
  } else if (activeTab === 'crafting') {
    renderCraftingPanel(state, contentArea, onCraft, onSell);
  } else {
    contentArea.innerHTML = '<div class="coming-soon">Upgrades coming soon!</div>';
  }
}
