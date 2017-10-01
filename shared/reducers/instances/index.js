import { 
  INSTANCES_FETCH_PENDING, 
  INSTANCES_FETCH_FULFILLED,
  INSTANCES_FETCH_REJECTED,
  INSTANCES_SET_TRACK_DIMENSIONS
 } from '../../actions/instances';

import { calculateTrackDimensions } from './trackDimensions'

const defaultState = { 
  instances: [],
  isFetching: false,
  trackDimensions: {
    startTime: 0,
    length: 0
  },
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
    const instances = action.payload;
    const trackDimensions = calculateTrackDimensions(instances);

    return Object.assign({}, state,
      { 
        isFetching: false,
        instances,
        trackDimensions,
        error: null
      }
    );
  }
  else if (action.type === INSTANCES_FETCH_REJECTED) {
    return Object.assign({}, state,
      { 
        isFetching: false,
        instances: [],
        error: action.payload
      }
    );
  }
  else if (action.type === INSTANCES_SET_TRACK_DIMENSIONS) {
    return Object.assign({} , state, { trackDimensions: action.payload });
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

export function getTrackDimensions(state) {
  return state.trackDimensions;
}

// -----------------------------------------------------------------------------
// REDUCER EXPORT

export default instances;
