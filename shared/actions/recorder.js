/* eslint-disable import/prefer-default-export */

// -----------------------------------------------------------------------------
// ACTION NAME CONSTANTS

export const RECORDER_STAGE_OBJECT_URL = 'RECORDER_STAGE_OBJECT_URL';
export const RECORDER_SET_STAGED_SAMPLE = 'RECORDER_SET_STAGED_SAMPLE';

// -----------------------------------------------------------------------------
// ACTIONS

export function setStagedObjectUrl(objectUrl) {
  return { type: RECORDER_STAGE_OBJECT_URL, payload: objectUrl };
}

export function setStagedSample(stagedSample) {
  return { type: RECORDER_SET_STAGED_SAMPLE, payload: stagedSample };
}