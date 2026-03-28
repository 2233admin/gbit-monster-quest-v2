/**
 * @fileoverview Elemental type effectiveness system for GBIT Monster Quest.
 *
 * Type strings in this module match the `gbit_type` field values found in
 * gbit-attacks.json and gbit-monsters.json (all lowercase).
 */

/**
 * Canonical element type constants.
 * Values are the lowercase strings used in JSON data.
 *
 * @readonly
 * @enum {string}
 */
export const ELEMENT_TYPES = Object.freeze({
  NORMAL: 'normal',
  FIRE: 'fire',
  WATER: 'water',
  GRASS: 'grass',
  ELECTRIC: 'electric',
  ROCK: 'rock',
  BUG: 'bug',
  ICE: 'ice',
  FAIRY: 'fairy',
});

/**
 * Critical hit damage multiplier.
 * @type {number}
 */
export const CRIT_MULTIPLIER = 1.5;

/**
 * Type effectiveness chart.
 * Structure: attackType → defenderType → multiplier.
 * Only entries that deviate from 1x are stored; everything else defaults to 1.
 *
 * @type {Readonly<Record<string, Readonly<Record<string, number>>>>}
 */
const TYPE_CHART = Object.freeze({
  [ELEMENT_TYPES.FIRE]: Object.freeze({
    [ELEMENT_TYPES.GRASS]: 2,
    [ELEMENT_TYPES.BUG]: 2,
    [ELEMENT_TYPES.ICE]: 2,
    [ELEMENT_TYPES.WATER]: 0.5,
    [ELEMENT_TYPES.ROCK]: 0.5,
  }),
  [ELEMENT_TYPES.WATER]: Object.freeze({
    [ELEMENT_TYPES.FIRE]: 2,
    [ELEMENT_TYPES.ROCK]: 2,
    [ELEMENT_TYPES.GRASS]: 0.5,
    [ELEMENT_TYPES.ELECTRIC]: 0.5,
  }),
  [ELEMENT_TYPES.GRASS]: Object.freeze({
    [ELEMENT_TYPES.WATER]: 2,
    [ELEMENT_TYPES.ROCK]: 2,
    [ELEMENT_TYPES.FIRE]: 0.5,
    [ELEMENT_TYPES.BUG]: 0.5,
    [ELEMENT_TYPES.ICE]: 0.5,
  }),
  [ELEMENT_TYPES.ELECTRIC]: Object.freeze({
    [ELEMENT_TYPES.WATER]: 2,
    [ELEMENT_TYPES.ROCK]: 0.5,
  }),
  [ELEMENT_TYPES.ROCK]: Object.freeze({
    [ELEMENT_TYPES.FIRE]: 2,
    [ELEMENT_TYPES.BUG]: 2,
    [ELEMENT_TYPES.ICE]: 2,
    [ELEMENT_TYPES.WATER]: 0.5,
    [ELEMENT_TYPES.GRASS]: 0.5,
  }),
  [ELEMENT_TYPES.BUG]: Object.freeze({
    [ELEMENT_TYPES.GRASS]: 2,
    [ELEMENT_TYPES.FIRE]: 0.5,
    [ELEMENT_TYPES.ROCK]: 0.5,
  }),
  [ELEMENT_TYPES.ICE]: Object.freeze({
    [ELEMENT_TYPES.GRASS]: 2,
    [ELEMENT_TYPES.FIRE]: 0.5,
    [ELEMENT_TYPES.ROCK]: 0.5,
  }),
  [ELEMENT_TYPES.FAIRY]: Object.freeze({
    [ELEMENT_TYPES.BUG]: 2,
  }),
  // NORMAL has no modifiers — omitting it means all lookups return 1 (default)
});

/**
 * Returns the type effectiveness multiplier for an attack type against a defender type.
 *
 * - 2   = super effective
 * - 1   = neutral
 * - 0.5 = not very effective
 *
 * Unknown or missing types default to 1 (neutral).
 *
 * @param {string} attackType  - The `gbit_type` of the attack (e.g. 'fire')
 * @param {string} defenderType - The `gbit_type` of the defending monster (e.g. 'grass')
 * @returns {number} Effectiveness multiplier: 2, 1, or 0.5
 */
export function getEffectiveness(attackType, defenderType) {
  const atkLower = (attackType || ELEMENT_TYPES.NORMAL).toLowerCase();
  const defLower = (defenderType || ELEMENT_TYPES.NORMAL).toLowerCase();

  const attackRow = TYPE_CHART[atkLower];
  if (!attackRow) {
    return 1;
  }

  const multiplier = attackRow[defLower];
  return multiplier !== undefined ? multiplier : 1;
}

/**
 * Rolls for a critical hit.
 *
 * @param {number} [baseCritRate=0.1] - Probability of a critical hit (0–1). Defaults to 10%.
 * @returns {boolean} True if the hit is critical.
 */
export function rollCritical(baseCritRate = 0.1) {
  return Math.random() < baseCritRate;
}
