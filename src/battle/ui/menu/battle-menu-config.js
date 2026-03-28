import { KENNEY_FUTURE_NARROW_FONT_NAME } from '../../../assets/font-keys.js';
import Phaser from '../../../lib/phaser.js';

/** @type {Phaser.Types.GameObjects.Text.TextStyle} */
export const BATTLE_UI_TEXT_STYLE = Object.freeze({
  fontFamily: KENNEY_FUTURE_NARROW_FONT_NAME,
  color: '#e8e4f0',
  fontSize: '30px',
  shadow: {
    offsetX: 1,
    offsetY: 1,
    color: '#000000',
    blur: 2,
    fill: true,
  },
});
