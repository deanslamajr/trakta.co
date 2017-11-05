import { 
  TRAK_INSTANCES_FETCH_FULFILLED,
  TRAK_INSTANCES_FETCH_REJECTED,
  TRAK_UPDATE_DIMENSIONS_BY_ADDING_SAMPLE,
  TRAK_SET_NAME,
  TRAK_RESET
 } from '../../actions/trak';

import { calculateTrackDimensions } from './trackDimensions'

const defaultState = { 
  instances: [],
  dimensions: {
    startTime: 0,
    length: 0
  },
  name: undefined,
  error: null
};

// -----------------------------------------------------------------------------
// REDUCER

function trak (state = defaultState, action) {
  if (action.type === TRAK_SET_NAME) {
    return Object.assign({}, state,
      { name: action.payload }
    );
  }
  else if (action.type === TRAK_INSTANCES_FETCH_FULFILLED) {
    const newInstances = action.payload;
    const dimensions = calculateTrackDimensions(newInstances);

    const { instances, ...stateWithoutInstances } = state;

    return Object.assign({}, stateWithoutInstances,
      { 
        instances: newInstances,
        dimensions,
        error: null
      }
    );
  }
  else if (action.type === TRAK_INSTANCES_FETCH_REJECTED) {
    return Object.assign({}, state,
      { 
        instances: [],
        error: action.payload
      }
    );
  }
  else if (action.type === TRAK_UPDATE_DIMENSIONS_BY_ADDING_SAMPLE) {
    const newSampleInstance = action.payload;
    const instances = getInstances(state);

    const instancesAndStagedSample = instances.concat(newSampleInstance);

    const dimensions = calculateTrackDimensions(instancesAndStagedSample);

    return Object.assign({}, state, { dimensions });
  }
  else if (action.type === TRAK_RESET) {
    return Object.assign({}, state, { instances: [], name: undefined })
  }


  return state;
}

// -----------------------------------------------------------------------------
// EXPORTED SELECTORS

export function getInstances(state) {
  return state.instances;
}

export function getDimensions(state) {
  return state.dimensions;
}

export function getName(state) {
  return state.name;
}

// -----------------------------------------------------------------------------
// REDUCER EXPORT

export default trak;
