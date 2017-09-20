import { 
  INSTANCES_FETCH_PENDING, 
  INSTANCES_FETCH_FULFILLED,
  INSTANCES_FETCH_REJECTED
 } from '../actions/instances';

const defaultState = { 
  instances: [],
  isFetching: false,
  error: null
};

// -----------------------------------------------------------------------------
// REDUCER

function instances (state = defaultState, action) {
  if (action.type === INSTANCES_FETCH_PENDING) {
    return Object.assign({}, state,
      { isFetching: true }
    );
  }
  else if (action.type === INSTANCES_FETCH_FULFILLED) {
    return Object.assign({}, state,
      { 
        isFetching: false,
        instances: action.payload,
        error: null
      }
    );
  }
  else if (action.type === INSTANCES_FETCH_FULFILLED) {
    return Object.assign({}, state,
      { 
        isFetching: false,
        instances: [],
        error: action.payload
      }
    );
  }

  return state;
}

// -----------------------------------------------------------------------------
// EXPORTED SELECTORS

export function getInstances(state) {
  return state.instances;
}

export function isFetching(state) {
  return state.isFetching;
}

// -----------------------------------------------------------------------------
// REDUCER EXPORT

export default instances;
