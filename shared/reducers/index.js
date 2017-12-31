import { combineReducers } from 'redux';
import samples, * as FromSamples from './samples';
import trak, * as FromTrak from './trak';
import recorder, * as FromRecorder from './recorder';
import traklist, * as FromTraklist from './traklist';

// -----------------------------------------------------------------------------
// REDUCER

const rootReducer = combineReducers({
  samples,
  trak,
  recorder,
  traklist
});

// -----------------------------------------------------------------------------
// EXPORTED SELECTORS

// SAMPLES
export function isLoading(state) {
  return FromSamples.isLoading(state.samples);
}

export function getTotalTasks(state) {
  return FromSamples.getTotalTasks(state.samples);
}

export function getFinishedTasks(state) {
  return FromSamples.getFinishedTasks(state.samples);
}

// TRAKLIST
export function getTraks(state) {
  return FromTraklist.getTraks(state.traklist);
}

// TRAK
export function getInstances(state) {
  return FromTrak.getInstances(state.trak);
}

export function getTrackDimensions(state) {
  return FromTrak.getDimensions(state.trak);
}

export function getTrakName(state) {
  return FromTrak.getName(state.trak);
}

// RECORDER
export function getStagedObjectUrl(state) {
  return FromRecorder.getStagedObjectUrl(state.recorder);
}

export function getStagedSample(state) {
  return FromRecorder.getStagedSample(state.recorder);
}

export function getCleanup(state) {
  return FromRecorder.getCleanup(state.recorder);
}

// -----------------------------------------------------------------------------
// REDUCER EXPORT

export default rootReducer;
