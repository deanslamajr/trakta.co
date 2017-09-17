import { combineReducers } from 'redux';
import ui, * as FromUi from './ui';
//import instances, * as FromInstances from './instances';

// -----------------------------------------------------------------------------
// REDUCER

const rootReducer = combineReducers({
  ui,
  //instances
});

// -----------------------------------------------------------------------------
// EXPORTED SELECTORS

export function isLoading(state) {
  return FromUi.isLoading(state.ui);
}

// -----------------------------------------------------------------------------
// REDUCER EXPORT

export default rootReducer;
