/* eslint-disable import/prefer-default-export */

// -----------------------------------------------------------------------------
// ACTION NAME CONSTANTS

export const RECORDER_STAGE_OBJECT_URL = 'RECORDER_STAGE_SAMPLE';

// -----------------------------------------------------------------------------
// ACTIONS

export function setStagedObjectUrl(objectUrl) {
  return { type: RECORDER_STAGE_OBJECT_URL, objectUrl };
}