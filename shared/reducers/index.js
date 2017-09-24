import { combineReducers } from 'redux';
import ui, * as FromUi from './ui';
import instances, * as FromInstances from './instances';
import recorder, * as FromRecorder from './recorder';

// -----------------------------------------------------------------------------
// REDUCER

const rootReducer = combineReducers({
  ui,
  instances,
  recorder
});

// -----------------------------------------------------------------------------
// EXPORTED SELECTORS

export function isLoading(state) {
  return FromUi.isLoading(state.ui);
}

export function getInstances(state) {
  return FromInstances.getInstances(state.instances);
}

export function isFetchingInstances(state) {
  return FromInstances.isFetching(state.instances);
}

export function getStagedObjectUrl(state) {
  return FromRecorder.getStagedObjectUrl(state.recorder);
}

// -----------------------------------------------------------------------------
// REDUCER EXPORT

export default rootReducer;
