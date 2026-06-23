import { GameState } from '../game/state';
import { getDisplayPassiveRate } from '../game/mining';
import { getTimeToAutoUnlock, formatTimeMs } from '../game/progression';

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

export function render(state: GameState, container: HTMLElement, contentContainer: HTMLElement, onOreClick: () => void): void {
  renderResources(state, container);
  renderMiningPanel(state, contentContainer, onOreClick);
}
