/* eslint-disable import/prefer-default-export */

// -----------------------------------------------------------------------------
// ACTION NAME CONSTANTS

export const PLAYER_SET_TRAK_FILENAME = 'PLAYER_SET_TRAK_FILENAME'

// -----------------------------------------------------------------------------
// ACTIONS

export function setTrakFilename (filename) {
  return { type: PLAYER_SET_TRAK_FILENAME, payload: filename }
}
