/* eslint-disable import/prefer-default-export */

// -----------------------------------------------------------------------------
// ACTION NAME CONSTANTS

export const UI_START_LOADING_STATE = 'UI_START_LOADING_STATE';
export const UI_END_LOADING_STATE = 'UI_END_LOADING_STATE';

// -----------------------------------------------------------------------------
// ACTIONS

export function startLoadingState() {
  return { type: UI_START_LOADING_STATE };
}

export function endLoadingState() {
  return { type: UI_END_LOADING_STATE };
}
