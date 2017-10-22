import { combineReducers } from 'redux';
import ui, * as FromUi from './ui';
import instances, * as FromInstances from './instances';
import recorder, * as FromRecorder from './recorder';
import traks, * as FromTraks from './traks';

// -----------------------------------------------------------------------------
// REDUCER

const rootReducer = combineReducers({
  ui,
  instances,
  recorder,
  traks
});

// -----------------------------------------------------------------------------
// EXPORTED SELECTORS

// UI
export function isLoading(state) {
  return FromUi.isLoading(state.ui);
}

// TRAKS
export function getTraks(state) {
  return FromTraks.getTraks(state.traks);
}

// INSTANCES
export function getInstances(state) {
  return FromInstances.getInstances(state.instances);
}

export function getTrackDimensions(state) {
  return FromInstances.getTrackDimensions(state.instances);
}

export function isFetchingInstances(state) {
  return FromInstances.isFetching(state.instances);
}

export function getTrakName(state) {
  return FromInstances.getTrakName(state.instances);
}

// RECORDER
export function getStagedObjectUrl(state) {
  return FromRecorder.getStagedObjectUrl(state.recorder);
}

export function getStagedSample(state) {
  return FromRecorder.getStagedSample(state.recorder);
}

// -----------------------------------------------------------------------------
// REDUCER EXPORT

export default rootReducer;
