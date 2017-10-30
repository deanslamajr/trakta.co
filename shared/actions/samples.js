/* eslint-disable import/prefer-default-export */

// -----------------------------------------------------------------------------
// ACTION NAME CONSTANTS

export const SAMPLES_START_FETCH = 'SAMPLES_START_FETCH';
export const SAMPLES_END_FETCH = 'SAMPLES_END_FETCH';

// -----------------------------------------------------------------------------
// ACTIONS

export function startFetchSample() {
  return { type: SAMPLES_START_FETCH };
}

export function endFetchSample() {
  return { type: SAMPLES_END_FETCH };
}