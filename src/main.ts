import { Game } from './app';

const game = new Game();
game.start();

// For debugging in console
(window as any).game = game;
