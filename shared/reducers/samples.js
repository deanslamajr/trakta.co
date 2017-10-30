import { SAMPLES_START_FETCH, SAMPLES_END_FETCH } from '../actions/samples';

const defaultState = { fetchCount: 0 };

// -----------------------------------------------------------------------------
// REDUCER

function samples (state = defaultState, action) {
  if (action.type === SAMPLES_START_FETCH) {
    return Object.assign({}, state,
      { fetchCount: state.fetchCount + 1 },
    );
  }
  else if (action.type === SAMPLES_END_FETCH) {
    return Object.assign({}, state,
      { fetchCount: state.fetchCount - 1 },
    );
  }

  return state;
}

// -----------------------------------------------------------------------------
// EXPORTED SELECTORS

export function isLoading(state) {
  return state.fetchCount > 0;
}

// -----------------------------------------------------------------------------
// REDUCER EXPORT

export default samples;
