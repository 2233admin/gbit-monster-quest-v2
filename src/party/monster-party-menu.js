import { Menu } from '../common/menu/menu.js';
import { SCENE_KEYS } from '../scenes/scene-keys.js';

/**
 * @typedef {keyof typeof MONSTER_PARTY_MENU_OPTIONS} MonsterPartyMenuOptions
 */

/** @enum {MonsterPartyMenuOptions} */
export const MONSTER_PARTY_MENU_OPTIONS = Object.freeze({
  SELECT: 'SELECT',
  MOVE: 'MOVE',
  SUMMARY: 'SUMMARY',
  RELEASE: 'RELEASE',
  CANCEL: 'CANCEL',
});

/** @type {Object<string, string>} */
const MONSTER_PARTY_MENU_LABELS = Object.freeze({
  [MONSTER_PARTY_MENU_OPTIONS.SELECT]: '选择',
  [MONSTER_PARTY_MENU_OPTIONS.MOVE]: '移动',
  [MONSTER_PARTY_MENU_OPTIONS.SUMMARY]: '详情',
  [MONSTER_PARTY_MENU_OPTIONS.RELEASE]: '放生',
  [MONSTER_PARTY_MENU_OPTIONS.CANCEL]: '取消',
});

export class MonsterPartyMenu extends Menu {
  /**
   * @param {Phaser.Scene} scene
   * @param {string} previousSceneName
   */
  constructor(scene, previousSceneName) {
    /** @type {MonsterPartyMenuOptions[]} */
    const availableOptions = [
      MONSTER_PARTY_MENU_OPTIONS.SELECT,
      MONSTER_PARTY_MENU_OPTIONS.SUMMARY,
      MONSTER_PARTY_MENU_OPTIONS.CANCEL,
    ];
    if (previousSceneName === SCENE_KEYS.WORLD_SCENE) {
      availableOptions.splice(0, 1, MONSTER_PARTY_MENU_OPTIONS.MOVE);
      availableOptions.splice(2, 0, MONSTER_PARTY_MENU_OPTIONS.RELEASE);
    }
    const availableLabels = availableOptions.map((option) => MONSTER_PARTY_MENU_LABELS[option]);
    super(scene, availableOptions, availableLabels);
  }
}
