// ============================================================
//  gardenUtils — pure helper functions for garden logic
// ============================================================
import { GARDEN_CONFIG, FLOWER_SPRITES, SWAY_VARIANTS } from './constants.js'

/**
 * Checks if a proposed (x, y) position is too close to any existing flower.
 * @param {number} x
 * @param {number} y
 * @param {Array}  flowers - current garden.flowers array
 * @returns {boolean}
 */
export function isTooClose(x, y, flowers) {
  return flowers.some((f) => {
    const dx = f.x - x
    const dy = f.y - y
    return Math.sqrt(dx * dx + dy * dy) < GARDEN_CONFIG.minDistance
  })
}

/**
 * Clamps a planting position to a safe screen region.
 * @param {number} x
 * @param {number} y
 * @returns {{ x: number, y: number }}
 */
export function clampPosition(x, y) {
  const margin = 24
  return {
    x: Math.max(margin, Math.min(window.innerWidth - margin, x)),
    y: Math.max(95, Math.min(window.innerHeight - 60, y)),
  }
}

/**
 * Picks a random flower sprite config.
 * @returns {{ file: string, name: string }}
 */
export function randomSprite() {
  return FLOWER_SPRITES[Math.floor(Math.random() * FLOWER_SPRITES.length)]
}

/**
 * Generates a random flower size within configured bounds.
 * @returns {number} size in pixels
 */
export function randomSize() {
  return (
    GARDEN_CONFIG.sizeMin +
    Math.random() * (GARDEN_CONFIG.sizeMax - GARDEN_CONFIG.sizeMin)
  )
}

/**
 * Picks a random CSS sway animation name.
 * @returns {string}
 */
export function randomSway() {
  return SWAY_VARIANTS[Math.floor(Math.random() * SWAY_VARIANTS.length)]
}

/**
 * Generates a random sway duration string (seconds).
 * @returns {string}
 */
export function randomSwayDuration() {
  return `${(2.5 + Math.random() * 2).toFixed(2)}s`
}

/**
 * Creates a unique ID for a flower.
 * @returns {string}
 */
export function makeFlowerId() {
  return `flower-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}
