import { combineReducers } from 'redux';
import ui, * as FromUi from './ui';
import instances, * as FromInstances from './instances';

// -----------------------------------------------------------------------------
// REDUCER

const rootReducer = combineReducers({
  ui,
  instances
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

// -----------------------------------------------------------------------------
// REDUCER EXPORT

export default rootReducer;
