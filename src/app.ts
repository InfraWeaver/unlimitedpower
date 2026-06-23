import { GameState, createInitialState } from './game/state';
import { handleMiningClick, updatePassiveMining } from './game/mining';
import { updateProgression } from './game/progression';
import { render } from './ui/renderer';

export class Game {
  private state: GameState;
  private resourcesContainer: HTMLElement;
  private contentContainer: HTMLElement;
  private lastFrameTime: number = 0;
  private animationFrameId: number | null = null;

  constructor() {
    this.state = createInitialState();
    this.resourcesContainer = document.getElementById('resources-container')!;
    this.contentContainer = document.getElementById('content-container')!;

    if (!this.resourcesContainer || !this.contentContainer) {
      throw new Error('Required DOM elements not found');
    }
  }

  private handleOreClick = (): void => {
    this.state = handleMiningClick(this.state);
    this.renderFrame();
  };

  private update = (deltaMs: number): void => {
    this.state = updatePassiveMining(this.state, deltaMs);
    this.state = updateProgression(this.state, deltaMs);
  };

  private renderFrame = (): void => {
    render(this.state, this.resourcesContainer, this.contentContainer, this.handleOreClick);
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
  }

  public getState(): GameState {
    return this.state;
  }

  public setState(newState: GameState): void {
    this.state = newState;
    this.renderFrame();
  }
}
