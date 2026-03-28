import Phaser from '../lib/phaser.js';

// ═══════════════════════════════════════════════════════════════
//  明日方舟 × 苏联构成主义 — 工业美学主题系统
//  斜切角多边形面板 / 红黑金配色 / 硬边几何 / 信息密度
// ═══════════════════════════════════════════════════════════════

/** 3 selectable themes — all share the industrial aesthetic */
export const UI_THEME = Object.freeze({
  1: {
    main: 0x121218,
    border: 0xc02030,
    shadow: 0x080808,
    accent: 0xe8c44a,
    textMain: '#e0dcd0',
    textAccent: '#e8c44a',
  },
  2: {
    main: 0x101814,
    border: 0xc02030,
    shadow: 0x080808,
    accent: 0x4ae868,
    textMain: '#d0dcd4',
    textAccent: '#4ae868',
  },
  3: {
    main: 0x14101c,
    border: 0xc02030,
    shadow: 0x080808,
    accent: 0xa868e8,
    textMain: '#d8d0e0',
    textAccent: '#a868e8',
  },
});

/** Battle-specific colors — industrial red + amber */
export const BATTLE_THEME = Object.freeze({
  infoPanel: {
    fill: 0x0e0e14,
    border: 0xc02030,
    shadow: 0x060608,
  },
  menuPanel: {
    fill: 0x0e0e14,
    border: 0xe8c44a,
    shadow: 0x060608,
  },
  hp: {
    label: '#e8c44a',
    name: '#e0dcd0',
    level: '#c02030',
  },
  text: {
    color: '#e0dcd0',
    shadow: '#000000',
  },
});

/** Standard cut size for panel corners */
const CUT = 16;
const SHADOW_OFFSET = 4;
const SHADOW_ALPHA = 0.5;

/**
 * Draw a chamfered (斜切角) polygon panel — Arknights / Soviet industrial style.
 *
 *   ┌──────────────────┐
 *   │  cut              cut │
 *   │ ╱                    ╲ │
 *
 * Top-left and bottom-right corners are chamfered (cut at 45°).
 * Top-right and bottom-left stay sharp 90°.
 *
 * @param {Phaser.GameObjects.Graphics} graphics
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 * @param {{ fill: number, border: number, shadow: number }} colors
 * @param {{ alpha?: number, borderWidth?: number, cut?: number, stripe?: boolean }} [opts]
 */
export function drawPanel(graphics, x, y, w, h, colors, opts = {}) {
  const alpha = opts.alpha ?? 0.92;
  const bw = opts.borderWidth ?? 2;
  const c = opts.cut ?? CUT;

  // build chamfered polygon points
  const pts = [
    x + c, y,           // top-left chamfer start
    x + w, y,            // top-right (sharp)
    x + w, y + h - c,    // bottom-right chamfer start
    x + w - c, y + h,    // bottom-right chamfer end
    x, y + h,            // bottom-left (sharp)
    x, y + c,            // top-left chamfer end
  ];

  // drop shadow
  graphics.fillStyle(colors.shadow, SHADOW_ALPHA);
  _fillPoly(graphics, pts.map((v, i) => v + (i % 2 === 0 ? SHADOW_OFFSET : SHADOW_OFFSET)));

  // main fill
  graphics.fillStyle(colors.fill, alpha);
  _fillPoly(graphics, pts);

  // border
  graphics.lineStyle(bw, colors.border, 1);
  _strokePoly(graphics, pts);

  // inner border accent line (1px inset)
  graphics.lineStyle(1, colors.border, 0.25);
  const inset = 3;
  const ptsInner = [
    x + c + inset, y + inset,
    x + w - inset, y + inset,
    x + w - inset, y + h - c - inset,
    x + w - c - inset, y + h - inset,
    x + inset, y + h - inset,
    x + inset, y + c + inset,
  ];
  _strokePoly(graphics, ptsInner);

  // optional hazard stripe along top edge
  if (opts.stripe) {
    _drawStripe(graphics, x + c, y, w - c, 4, colors.border);
  }
}

/**
 * Draw diagonal warning stripes (Soviet/industrial decoration).
 * @param {Phaser.GameObjects.Graphics} g
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 * @param {number} color
 */
function _drawStripe(g, x, y, w, h, color) {
  g.fillStyle(color, 0.6);
  g.fillRect(x, y, w, h);
}

/**
 * Fill a polygon from flat [x,y,x,y,...] array.
 * @param {Phaser.GameObjects.Graphics} g
 * @param {number[]} pts
 */
function _fillPoly(g, pts) {
  g.beginPath();
  g.moveTo(pts[0], pts[1]);
  for (let i = 2; i < pts.length; i += 2) {
    g.lineTo(pts[i], pts[i + 1]);
  }
  g.closePath();
  g.fillPath();
}

/**
 * Stroke a polygon from flat [x,y,x,y,...] array.
 * @param {Phaser.GameObjects.Graphics} g
 * @param {number[]} pts
 */
function _strokePoly(g, pts) {
  g.beginPath();
  g.moveTo(pts[0], pts[1]);
  for (let i = 2; i < pts.length; i += 2) {
    g.lineTo(pts[i], pts[i + 1]);
  }
  g.closePath();
  g.strokePath();
}

/**
 * Animate a container sliding in — sharp military snap.
 * @param {Phaser.Scene} scene
 * @param {Phaser.GameObjects.Container} container
 * @param {{ fromX?: number, fromY?: number, toX: number, toY: number, duration?: number }} config
 * @param {() => void} [callback]
 */
export function slideIn(scene, container, config, callback) {
  const fromX = config.fromX ?? config.toX + 60;
  const fromY = config.fromY ?? config.toY;
  const duration = config.duration ?? 150;

  container.setPosition(fromX, fromY);
  container.setAlpha(0);

  scene.tweens.add({
    targets: container,
    x: config.toX,
    y: config.toY,
    alpha: 1,
    duration,
    ease: 'Power3',
    onComplete: callback,
  });
}

/**
 * Cursor pulse — sharp angular scale.
 * @param {Phaser.Scene} scene
 * @param {Phaser.GameObjects.Image} cursor
 * @returns {Phaser.Tweens.Tween}
 */
export function createCursorPulse(scene, cursor) {
  return scene.tweens.add({
    targets: cursor,
    scaleX: { from: cursor.scaleX, to: cursor.scaleX * 1.15 },
    scaleY: { from: cursor.scaleY, to: cursor.scaleY * 1.15 },
    duration: 400,
    yoyo: true,
    repeat: -1,
    ease: 'Stepped',
    easeParams: [3],
  });
}

/**
 * Floating damage number — pops up + fades out.
 * @param {Phaser.Scene} scene
 * @param {number} x
 * @param {number} y
 * @param {number} damage
 * @param {{ critical?: boolean, effective?: number }} [opts] effective: 1=normal, 2=super, 0.5=not very
 */
export function showDamageNumber(scene, x, y, damage, opts = {}) {
  const isCrit = opts.critical ?? false;
  const effective = opts.effective ?? 1;

  let color = '#FFFFFF';
  let size = 28;
  if (isCrit) { color = '#e8c44a'; size = 38; }
  if (effective >= 2) { color = '#ff4444'; }
  if (effective <= 0.5) { color = '#888888'; size = 22; }

  const txt = scene.add.text(x, y, `${damage}`, {
    fontFamily: 'Fusion Pixel',
    fontSize: `${size}px`,
    color,
    stroke: '#000000',
    strokeThickness: 3,
  }).setOrigin(0.5).setDepth(999);

  scene.tweens.add({
    targets: txt,
    y: y - 50,
    alpha: { from: 1, to: 0 },
    scale: isCrit ? { from: 1.5, to: 0.8 } : { from: 1, to: 0.6 },
    duration: 800,
    ease: 'Power2',
    onComplete: () => txt.destroy(),
  });
}

/**
 * Camera shake on hit.
 * @param {Phaser.Scene} scene
 * @param {number} [intensity=0.01]
 * @param {number} [duration=150]
 */
export function cameraShake(scene, intensity = 0.01, duration = 150) {
  scene.cameras.main.shake(duration, intensity);
}

/**
 * Show effectiveness text ("效果拔群!" / "效果不佳...").
 * @param {Phaser.Scene} scene
 * @param {number} effective multiplier
 */
export function showEffectivenessText(scene, effective) {
  if (effective === 1) return;

  const msg = effective >= 2 ? '效果拔群！' : '效果不佳...';
  const color = effective >= 2 ? '#ff4444' : '#888888';

  const txt = scene.add.text(scene.scale.width / 2, scene.scale.height / 2 - 40, msg, {
    fontFamily: 'Fusion Pixel',
    fontSize: '32px',
    color,
    stroke: '#000000',
    strokeThickness: 4,
  }).setOrigin(0.5).setDepth(999).setAlpha(0);

  scene.tweens.add({
    targets: txt,
    alpha: { from: 0, to: 1 },
    y: txt.y - 20,
    duration: 300,
    hold: 600,
    yoyo: true,
    onComplete: () => txt.destroy(),
  });
}
