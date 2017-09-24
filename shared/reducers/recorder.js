import { RECORDER_STAGE_SAMPLE } from '../actions/recorder';

const defaultState = { 
  objectUrl: '',
  duration: 0
};

// -----------------------------------------------------------------------------
// REDUCER

function recorder (state = defaultState, action) {
  if (action.type === RECORDER_STAGE_SAMPLE) {
    return Object.assign({}, state, action.payload);
  }

  return state;
}

// -----------------------------------------------------------------------------
// EXPORTED SELECTORS

export function getStagedSample(state) {
  return state;
}

// -----------------------------------------------------------------------------
// REDUCER EXPORT

export default recorder;
