import Phaser from '../lib/phaser.js';

/**
 * Upgraded color palette — deeper, more saturated, with shadow/accent colors.
 * Each theme has: main (panel fill), border, shadow, accent, textMain, textAccent
 */
export const UI_THEME = Object.freeze({
  1: {
    main: 0x1a2a3a,
    border: 0x4a9ec5,
    shadow: 0x0a1520,
    accent: 0x5bc0eb,
    textMain: '#e8f4f8',
    textAccent: '#5bc0eb',
  },
  2: {
    main: 0x1a2e1f,
    border: 0x4ab86a,
    shadow: 0x0a1a0f,
    accent: 0x6dd58c,
    textMain: '#e8f8ed',
    textAccent: '#6dd58c',
  },
  3: {
    main: 0x251a3a,
    border: 0x8b5ec5,
    shadow: 0x120a20,
    accent: 0xb07aeb,
    textMain: '#f0e8f8',
    textAccent: '#b07aeb',
  },
});

/** Battle-specific colors */
export const BATTLE_THEME = Object.freeze({
  infoPanel: {
    fill: 0x1c1c2e,
    border: 0xe85d75,
    shadow: 0x0e0e18,
  },
  menuPanel: {
    fill: 0x1c1c2e,
    border: 0x7c4ddb,
    shadow: 0x0e0e18,
  },
  hp: {
    label: '#FF6505',
    name: '#e8e4f0',
    level: '#e85d75',
  },
  text: {
    color: '#e8e4f0',
    shadow: '#000000',
  },
});

const SHADOW_OFFSET = 6;
const SHADOW_ALPHA = 0.45;
const CORNER_RADIUS = 12;

/**
 * Draw a premium panel: rounded rect with drop shadow + border.
 * @param {Phaser.GameObjects.Graphics} graphics
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 * @param {{ fill: number, border: number, shadow: number }} colors
 * @param {{ alpha?: number, borderWidth?: number, radius?: number }} [opts]
 */
export function drawPanel(graphics, x, y, width, height, colors, opts = {}) {
  const alpha = opts.alpha ?? 0.92;
  const borderWidth = opts.borderWidth ?? 4;
  const radius = opts.radius ?? CORNER_RADIUS;

  // drop shadow
  graphics.fillStyle(colors.shadow, SHADOW_ALPHA);
  graphics.fillRoundedRect(x + SHADOW_OFFSET, y + SHADOW_OFFSET, width, height, radius);

  // main fill
  graphics.fillStyle(colors.fill, alpha);
  graphics.fillRoundedRect(x, y, width, height, radius);

  // border
  graphics.lineStyle(borderWidth, colors.border, 1);
  graphics.strokeRoundedRect(x, y, width, height, radius);

  // inner highlight (top edge)
  graphics.lineStyle(1, colors.border, 0.3);
  graphics.strokeRoundedRect(x + 2, y + 2, width - 4, height - 4, radius - 1);
}

/**
 * Animate a container sliding in from an edge.
 * @param {Phaser.Scene} scene
 * @param {Phaser.GameObjects.Container} container
 * @param {{ fromX?: number, fromY?: number, toX: number, toY: number, duration?: number }} config
 * @param {() => void} [callback]
 */
export function slideIn(scene, container, config, callback) {
  const fromX = config.fromX ?? config.toX;
  const fromY = config.fromY ?? config.toY + 40;
  const duration = config.duration ?? 200;

  container.setPosition(fromX, fromY);
  container.setAlpha(0);

  scene.tweens.add({
    targets: container,
    x: config.toX,
    y: config.toY,
    alpha: 1,
    duration,
    ease: 'Back.easeOut',
    onComplete: callback,
  });
}

/**
 * Pulse tween for cursor (scale oscillation).
 * @param {Phaser.Scene} scene
 * @param {Phaser.GameObjects.Image} cursor
 * @returns {Phaser.Tweens.Tween}
 */
export function createCursorPulse(scene, cursor) {
  return scene.tweens.add({
    targets: cursor,
    scaleX: { from: cursor.scaleX, to: cursor.scaleX * 1.2 },
    scaleY: { from: cursor.scaleY, to: cursor.scaleY * 1.2 },
    duration: 600,
    yoyo: true,
    repeat: -1,
    ease: 'Sine.easeInOut',
  });
}
