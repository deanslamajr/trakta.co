/* eslint-disable import/prefer-default-export */

// -----------------------------------------------------------------------------
// ACTION NAME CONSTANTS

export const START_LOADING_STATE = 'START_LOADING_STATE';
export const END_LOADING_STATE = 'END_LOADING_STATE';

// -----------------------------------------------------------------------------
// ACTIONS

export function startLoadingState() {
  return { type: START_LOADING_STATE };
}

export function endLoadingState() {
  return { type: END_LOADING_STATE };
}
