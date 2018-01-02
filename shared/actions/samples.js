/* eslint-disable import/prefer-default-export */

// -----------------------------------------------------------------------------
// ACTION NAME CONSTANTS

export const SAMPLES_END_FETCH = 'SAMPLES_END_FETCH'
export const SAMPLES_BEGIN_INITIAL_FETCH_TASK = 'SAMPLES_BEGIN_INITIAL_FETCH_TASK'
export const SAMPLES_FINISH_INITIAL_FETCH_TASK = 'SAMPLES_FINISH_INITIAL_FETCH_TASK'
export const SAMPLES_FINISH_LOAD_TASK = 'SAMPLES_FINISH_LOAD_TASK'
export const SAMPLES_RESET = 'SAMPLES_RESET'

// -----------------------------------------------------------------------------
// ACTIONS

export function endFetchSample () {
  return { type: SAMPLES_END_FETCH }
}

export function beginInitialFetch () {
  return { type: SAMPLES_BEGIN_INITIAL_FETCH_TASK }
}

export function finishInitialFetchTask (newTasksCount) {
  return { type: SAMPLES_FINISH_INITIAL_FETCH_TASK, payload: newTasksCount }
}

export function finishLoadTask () {
  return { type: SAMPLES_FINISH_LOAD_TASK }
}

export function reset () {
  return { type: SAMPLES_RESET }
}
