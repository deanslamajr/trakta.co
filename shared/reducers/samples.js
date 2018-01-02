import {
  SAMPLES_BEGIN_INITIAL_FETCH_TASK,
  SAMPLES_FINISH_INITIAL_FETCH_TASK,
  SAMPLES_FINISH_LOAD_TASK,
  SAMPLES_END_FETCH,
  SAMPLES_RESET } from '../actions/samples'

const defaultState = {
  totalTasks: 0,
  finishedTasks: 0,
  isLoading: true
}

// -----------------------------------------------------------------------------
// REDUCER

function samples (state = defaultState, action) {
  if (action.type === SAMPLES_BEGIN_INITIAL_FETCH_TASK) {
    return Object.assign({}, state,
      { totalTasks: state.totalTasks + 1 }
    )
  } else if (action.type === SAMPLES_RESET) {
    return Object.assign({}, state,
      {
        isLoading: true,
        finishedTasks: 0,
        totalTasks: 0
      }
    )
  } else if (action.type === SAMPLES_END_FETCH) {
    return Object.assign({}, state,
      { isLoading: false }
    )
  } else if (action.type === SAMPLES_FINISH_INITIAL_FETCH_TASK) {
    return Object.assign({}, state,
      {
        finishedTasks: state.finishedTasks + 1,
        totalTasks: state.totalTasks + action.payload
      }
    )
  } else if (action.type === SAMPLES_FINISH_LOAD_TASK) {
    return Object.assign({}, state,
      { finishedTasks: state.finishedTasks + 1 }
    )
  }

  return state
}

// -----------------------------------------------------------------------------
// EXPORTED SELECTORS

export function isLoading (state) {
  return state.isLoading
}

export function getTotalTasks (state) {
  return state.totalTasks
}

export function getFinishedTasks (state) {
  return state.finishedTasks
}

// -----------------------------------------------------------------------------
// REDUCER EXPORT

export default samples
