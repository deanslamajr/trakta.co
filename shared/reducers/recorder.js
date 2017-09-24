import { RECORDER_STAGE_OBJECT_URL } from '../actions/recorder';

const defaultState = { 
  objectUrl: '',
  duration: 0
};

// -----------------------------------------------------------------------------
// REDUCER

function recorder (state = defaultState, action) {
  if (action.type === RECORDER_STAGE_OBJECT_URL) {
    return Object.assign({}, state, { objectUrl: action.objectUrl });
  }

  return state;
}

// -----------------------------------------------------------------------------
// EXPORTED SELECTORS

export function getStagedObjectUrl(state) {
  return state.objectUrl;
}

// -----------------------------------------------------------------------------
// REDUCER EXPORT

export default recorder;
