/* eslint-disable import/prefer-default-export */

// -----------------------------------------------------------------------------
// ACTION NAME CONSTANTS

export const RECORDER_STAGE_SAMPLE = 'RECORDER_STAGE_SAMPLE';

// -----------------------------------------------------------------------------
// ACTIONS

export function setStagedSample(payload) {
  return { type: RECORDER_STAGE_SAMPLE, payload };
}