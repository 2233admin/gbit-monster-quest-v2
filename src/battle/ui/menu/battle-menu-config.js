import { FUSION_PIXEL_FONT_NAME } from '../../../assets/font-keys.js';
import Phaser from '../../../lib/phaser.js';

/** @type {Phaser.Types.GameObjects.Text.TextStyle} */
export const BATTLE_UI_TEXT_STYLE = Object.freeze({
  fontFamily: FUSION_PIXEL_FONT_NAME,
  color: '#e8e4f0',
  fontSize: '36px',
  shadow: {
    offsetX: 1,
    offsetY: 1,
    color: '#000000',
    blur: 2,
    fill: true,
  },
});
