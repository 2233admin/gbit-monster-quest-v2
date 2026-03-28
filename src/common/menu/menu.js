import Phaser from '../../lib/phaser.js';
import { UI_ASSET_KEYS } from '../../assets/asset-keys.js';
import { KENNEY_FUTURE_NARROW_FONT_NAME } from '../../assets/font-keys.js';
import { DIRECTION } from '../../common/direction.js';
import { DATA_MANAGER_STORE_KEYS, dataManager } from '../../utils/data-manager.js';
import { exhaustiveGuard } from '../../utils/guard.js';
import { MENU_COLOR } from './menu-config.js';
import { UI_THEME, drawPanel, slideIn, createCursorPulse } from '../../utils/ui-theme.js';

/** @type {Phaser.Types.GameObjects.Text.TextStyle} */
const MENU_TEXT_STYLE = {
  fontFamily: KENNEY_FUTURE_NARROW_FONT_NAME,
  color: '#FFFFFF',
  fontSize: '32px',
};

export class Menu {
  /** @type {Phaser.Scene} */
  #scene;
  /** @type {number} */
  #padding;
  /** @type {number} */
  #width;
  /** @type {number} */
  #height;
  /** @type {Phaser.GameObjects.Graphics} */
  #graphics;
  /** @type {Phaser.GameObjects.Container} */
  #container;
  /** @type {boolean} */
  #isVisible;
  /** @type {string[]} */
  #availableMenuOptions;
  /** @type {Phaser.GameObjects.Text[]} */
  #menuOptionsTextGameObjects;
  /** @type {number} */
  #selectedMenuOptionIndex;
  /** @type {string} */
  #selectedMenuOption;
  /** @type {Phaser.GameObjects.Image} */
  #userInputCursor;
  /** @type {Phaser.Tweens.Tween | undefined} */
  #cursorPulseTween;

  /**
   * @param {Phaser.Scene} scene
   * @param {string[]} menuOptions
   */
  constructor(scene, menuOptions) {
    this.#scene = scene;
    this.#padding = 4;
    this.#width = 300;
    this.#availableMenuOptions = menuOptions;
    this.#menuOptionsTextGameObjects = [];
    this.#selectedMenuOptionIndex = 0;

    // calculate height based on currently available options
    this.#height = 10 + this.#padding * 2 + this.#availableMenuOptions.length * 50;

    this.#graphics = this.#createGraphics();
    this.#container = this.#scene.add.container(0, 0, [this.#graphics]);

    // update menu container with menu options
    for (let i = 0; i < this.#availableMenuOptions.length; i += 1) {
      const y = 10 + 50 * i + this.#padding;
      const textObj = this.#scene.add.text(40 + this.#padding, y, this.#availableMenuOptions[i], MENU_TEXT_STYLE);
      this.#menuOptionsTextGameObjects.push(textObj);
      this.#container.add(textObj);
    }

    // add player input cursor
    this.#userInputCursor = this.#scene.add.image(20 + this.#padding, 28 + this.#padding, UI_ASSET_KEYS.CURSOR_WHITE);
    this.#userInputCursor.setScale(2.5);
    this.#container.add(this.#userInputCursor);

    this.hide();
  }

  /** @type {boolean} */
  get isVisible() {
    return this.#isVisible;
  }

  /** @type {string} */
  get selectedMenuOption() {
    return this.#selectedMenuOption;
  }

  /**
   * @returns {void}
   */
  show() {
    const { right, top } = this.#scene.cameras.main.worldView;
    const toX = right - this.#padding * 2 - this.#width;
    const toY = top + this.#padding * 2;

    slideIn(this.#scene, this.#container, {
      fromX: toX + 30,
      fromY: toY - 20,
      toX,
      toY,
      duration: 180,
    });
    this.#isVisible = true;

    // cursor pulse
    if (this.#cursorPulseTween) {
      this.#cursorPulseTween.resume();
    } else {
      this.#cursorPulseTween = createCursorPulse(this.#scene, this.#userInputCursor);
    }
  }

  /**
   * @returns {void}
   */
  hide() {
    this.#container.setAlpha(0);
    this.#selectedMenuOptionIndex = 0;
    this.#moveMenuCursor(DIRECTION.NONE);
    this.#isVisible = false;
    if (this.#cursorPulseTween) {
      this.#cursorPulseTween.pause();
    }
  }

  /**
   * @param {import('../../common/direction.js').Direction|'OK'|'CANCEL'} input
   * @returns {void}
   */
  handlePlayerInput(input) {
    if (input === 'CANCEL') {
      this.hide();
      return;
    }

    if (input === 'OK') {
      this.#handleSelectedMenuOption();
      return;
    }

    // update selected menu option based on player input
    this.#moveMenuCursor(input);
  }

  /**
   * @returns {Phaser.GameObjects.Graphics}
   */
  #createGraphics() {
    const g = this.#scene.add.graphics();
    const theme = this.#getThemeColors();

    drawPanel(g, 0, 0, this.#width, this.#height, {
      fill: theme.main,
      border: theme.border,
      shadow: theme.shadow,
    });

    return g;
  }

  /**
   * @param {import('../../common/direction.js').Direction} direction
   * @returns {void}
   */
  #moveMenuCursor(direction) {
    switch (direction) {
      case DIRECTION.UP:
        this.#selectedMenuOptionIndex -= 1;
        if (this.#selectedMenuOptionIndex < 0) {
          this.#selectedMenuOptionIndex = this.#availableMenuOptions.length - 1;
        }
        break;
      case DIRECTION.DOWN:
        this.#selectedMenuOptionIndex += 1;
        if (this.#selectedMenuOptionIndex > this.#availableMenuOptions.length - 1) {
          this.#selectedMenuOptionIndex = 0;
        }
        break;
      case DIRECTION.LEFT:
      case DIRECTION.RIGHT:
        return;
      case DIRECTION.NONE:
        break;
      default:
        exhaustiveGuard(direction);
    }
    const x = 20 + this.#padding;
    const y = 28 + this.#padding + this.#selectedMenuOptionIndex * 50;

    this.#userInputCursor.setPosition(x, y);
  }

  /**
   * @returns {void}
   */
  #handleSelectedMenuOption() {
    this.#selectedMenuOption = this.#availableMenuOptions[this.#selectedMenuOptionIndex];
  }

  /**
   * @returns {{ main: number; border: number; shadow: number }}
   */
  #getThemeColors() {
    /** @type {import('../../common/options.js').MenuColorOptions} */
    const chosenMenuColor = dataManager.store.get(DATA_MANAGER_STORE_KEYS.OPTIONS_MENU_COLOR);
    if (chosenMenuColor === undefined) {
      return UI_THEME[1];
    }

    switch (chosenMenuColor) {
      case 0:
        return UI_THEME[1];
      case 1:
        return UI_THEME[2];
      case 2:
        return UI_THEME[3];
      default:
        exhaustiveGuard(chosenMenuColor);
    }
  }
}
