import { 
  TRAKS_FETCH_PENDING, 
  TRAKS_FETCH_FULFILLED,
  TRAKS_FETCH_REJECTED
 } from '../actions/traks';

const defaultState = { 
  traks: [],
  isFetching: false
};

// -----------------------------------------------------------------------------
// REDUCER

function traks (state = defaultState, action) {
  if (action.type === TRAKS_FETCH_PENDING) {
    return Object.assign({}, state,
      { isFetching: true }
    );
  }
  else if (action.type === TRAKS_FETCH_FULFILLED) {
    const traks = action.payload;

    return Object.assign({}, state,
      { 
        isFetching: false,
        traks,
        error: null
      }
    );
  }
  else if (action.type === TRAKS_FETCH_REJECTED) {
    return Object.assign({}, state,
      { 
        isFetching: false,
        traks: [],
        error: action.payload
      }
    );
  }

  return state;
}

// -----------------------------------------------------------------------------
// EXPORTED SELECTORS

export function getTraks(state) {
  return state.traks;
}

// -----------------------------------------------------------------------------
// REDUCER EXPORT

export default traks;
