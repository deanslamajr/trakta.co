import { RECORDER_STAGE_OBJECT_URL, RECORDER_SET_STAGED_SAMPLE } from '../actions/recorder';

const defaultState = { 
  objectUrl: '',
  duration: 0,
  stagedSample: {
    startTime: 0,
    volume: 0,
    panning: 0
  }
};

// -----------------------------------------------------------------------------
// REDUCER

function recorder (state = defaultState, action) {
  if (action.type === RECORDER_STAGE_OBJECT_URL) {
    return Object.assign({}, state, { objectUrl: action.objectUrl });
  }
  else if (action.type === RECORDER_SET_STAGED_SAMPLE) {
    console.log('reducer, state before')
    console.dir(state)
    console.log('after, state:')
    console.dir(Object.assign({}, state, { stagedSample: Object.assign({}, state.stagedSample, action.payload) }))

    return Object.assign({}, state, { stagedSample: Object.assign({}, state.stagedSample, action.payload) });
  }

  return state;
}

// -----------------------------------------------------------------------------
// EXPORTED SELECTORS

export function getStagedObjectUrl(state) {
  return state.objectUrl;
}

export function getStagedSample(state) {
  console.log('getStagedSample, state.stagedSample')
  console.dir(state.stagedSample)
  return state.stagedSample;
}

// -----------------------------------------------------------------------------
// REDUCER EXPORT

export default recorder;
