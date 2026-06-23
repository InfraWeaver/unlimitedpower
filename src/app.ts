import { GameState, OreType, createInitialState } from './game/state';
import { handleMiningClick, updatePassiveMining } from './game/mining';
import { updateProgression } from './game/progression';
import { updateSmelting, queueOreForSmelting } from './game/smelting';
import { craftTools, sellTools } from './game/crafting';
import { purchaseUpgrade } from './game/upgrades';
import { saveGame, loadGame } from './game/saves';
import { performPrestige } from './game/prestige';
import { updateAutomation, toggleAutomation } from './game/automation';
import { hireWorker, updateWorkerMorale } from './game/workers';
import { checkForRandomEvent } from './game/events';
import { render } from './ui/renderer';
import { GAME_CONFIG } from './game/constants';

export class Game {
  private state: GameState;
  private resourcesContainer: HTMLElement;
  private contentContainer: HTMLElement;
  private lastFrameTime: number = 0;
  private animationFrameId: number | null = null;

  constructor() {
    const savedState = loadGame();
    this.state = savedState || createInitialState();
    this.resourcesContainer = document.getElementById('resources-container')!;
    this.contentContainer = document.getElementById('content-container')!;

    if (!this.resourcesContainer || !this.contentContainer) {
      throw new Error('Required DOM elements not found');
    }

    // Save game periodically (every 5 seconds)
    setInterval(() => saveGame(this.state), 5000);
  }

  private handleOreClick = (): void => {
    this.state = handleMiningClick(this.state);
    this.renderFrame();
  };

  private update = (deltaMs: number): void => {
    this.state = updatePassiveMining(this.state, deltaMs);
    this.state = updateSmelting(this.state, deltaMs);
    this.state = updateProgression(this.state, deltaMs);
    this.state = updateAutomation(this.state);
    this.state = updateWorkerMorale(this.state, deltaMs);
    this.state = checkForRandomEvent(this.state);
  };

  private handleQueueOre = (ore: OreType, amount: number): void => {
    this.state = queueOreForSmelting(this.state, ore, amount);
    this.renderFrame();
  };

  private handleCraftTools = (ore: OreType): void => {
    this.state = craftTools(this.state, ore, 1);
    this.renderFrame();
  };

  private handleSellTools = (): void => {
    this.state = sellTools(this.state, this.state.resources.tools);
    this.renderFrame();
  };

  private switchTab = (tab: 'mining' | 'smelting' | 'crafting' | 'upgrades' | 'stats' | 'prestige' | 'automation' | 'workers'): void => {
    this.state = {
      ...this.state,
      ui: { ...this.state.ui, activeTab: tab },
    };
    this.renderFrame();
  };

  private handleBuyUpgrade = (upgradeId: keyof typeof GAME_CONFIG.UPGRADES): void => {
    this.state = purchaseUpgrade(this.state, upgradeId);
    this.renderFrame();
  };

  private handlePrestige = (): void => {
    this.state = performPrestige(this.state);
    this.renderFrame();
  };

  private handleToggleAutomation = (feature: 'autoSmelt' | 'autoCraft' | 'autoSell'): void => {
    this.state = toggleAutomation(this.state, feature);
    this.renderFrame();
  };

  private handleHireWorker = (workerType: 'miner' | 'smelter' | 'crafter'): void => {
    this.state = hireWorker(this.state, workerType);
    this.renderFrame();
  };

  private renderFrame = (): void => {
    render(
      this.state,
      this.resourcesContainer,
      this.contentContainer,
      this.handleOreClick,
      this.handleQueueOre,
      this.handleCraftTools,
      this.handleSellTools,
      this.switchTab,
      this.handleBuyUpgrade,
      this.handlePrestige,
      this.handleToggleAutomation,
      this.handleHireWorker
    );
  };

  private gameLoop = (currentTime: number): void => {
    if (this.lastFrameTime === 0) {
      this.lastFrameTime = currentTime;
    }

    const deltaMs = currentTime - this.lastFrameTime;
    this.lastFrameTime = currentTime;

    this.update(deltaMs);
    this.renderFrame();

    this.animationFrameId = requestAnimationFrame(this.gameLoop);
  };

  public start(): void {
    console.log('Game started');
    this.renderFrame();
    this.animationFrameId = requestAnimationFrame(this.gameLoop);
  }

  public stop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    saveGame(this.state);
  }

  public getState(): GameState {
    return this.state;
  }

  public setState(newState: GameState): void {
    this.state = newState;
    this.renderFrame();
  }
}
