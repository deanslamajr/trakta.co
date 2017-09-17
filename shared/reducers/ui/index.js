import { START_LOADING_STATE, END_LOADING_STATE } from '../../actions/ui';

const defaultState = { isLoading: true };

// -----------------------------------------------------------------------------
// REDUCER

function ui (state = defaultState, action) {
  if (action.type === START_LOADING_STATE) {
    return Object.assign({}, state,
      { isLoading: true },
    );
  }
  else if (action.type === END_LOADING_STATE) {
    return Object.assign({}, state,
      {  isLoading: false },
    );
  }

  return state;
}

// -----------------------------------------------------------------------------
// EXPORTED SELECTORS

export function isLoading(state) {
  return state.isLoading;
}

// -----------------------------------------------------------------------------
// REDUCER EXPORT

export default ui;
