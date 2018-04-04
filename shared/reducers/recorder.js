import {
  RECORDER_STAGE_OBJECT_URL,
  RECORDER_SET_STAGED_SAMPLE,
  RECORDER_SET_CLEANUP} from '../actions/recorder'

const defaultState = {
  objectUrl: '',
  stagedSample: {
    startTime: 0,
    volume: 0,
    panning: 0,
    duration: 0,
    loopPadding: 0,
    loopCount: 0
  },
  cleanup: {
    leftSliderValue: 0,
    rightSliderValue: 0,
    clipStart: 0,
    clipEnd: 0
  }
}

// -----------------------------------------------------------------------------
// REDUCER

function recorder (state = defaultState, action) {
  if (action.type === RECORDER_STAGE_OBJECT_URL) {
    return Object.assign({}, state, { objectUrl: action.payload })
  } else if (action.type === RECORDER_SET_STAGED_SAMPLE) {
    return Object.assign({}, state,
      { stagedSample: Object.assign({}, state.stagedSample, action.payload) }
    )
  } else if (action.type === RECORDER_SET_CLEANUP) {
    return Object.assign({}, state,
      { cleanup: Object.assign({}, state.cleanup, action.payload) }
    )
  }

  return state
}

// -----------------------------------------------------------------------------
// EXPORTED SELECTORS

export function getStagedObjectUrl (state) {
  return state.objectUrl
}

export function getStagedSample (state) {
  return state.stagedSample
}

export function getCleanup (state) {
  return state.cleanup
}

// -----------------------------------------------------------------------------
// REDUCER EXPORT

export default recorder
