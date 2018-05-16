import {
  TRAKLIST_FETCH_PENDING,
  TRAKLIST_FETCH_FULFILLED,
  TRAKLIST_FETCH_REJECTED
 } from '../actions/traklist'

const defaultState = {
  traks: [],
  isFetching: false,
  hasFetched: false
}

// -----------------------------------------------------------------------------
// REDUCER

function traklist (state = defaultState, action) {
  if (action.type === TRAKLIST_FETCH_PENDING) {
    return Object.assign({}, state,
      { isFetching: true }
    )
  } else if (action.type === TRAKLIST_FETCH_FULFILLED) {
    const traks = action.payload

    return Object.assign({}, state,
      {
        hasFetched: true,
        isFetching: false,
        traks,
        error: null
      }
    )
  } else if (action.type === TRAKLIST_FETCH_REJECTED) {
    return Object.assign({}, state,
      {
        isFetching: false,
        traks: [],
        error: action.payload
      }
    )
  }

  return state
}

// -----------------------------------------------------------------------------
// EXPORTED SELECTORS

export function getTraks (state) {
  return state.traks
}

export function hasFetched (state) {
  return state.hasFetched
}

// -----------------------------------------------------------------------------
// REDUCER EXPORT

export default traklist
