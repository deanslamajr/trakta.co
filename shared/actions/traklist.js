/* eslint-disable import/prefer-default-export */

// -----------------------------------------------------------------------------
// ACTION NAME CONSTANTS

export const TRAKLIST_FETCH_PENDING = 'TRAKLIST_FETCH_PENDING';
export const TRAKLIST_FETCH_FULFILLED = 'TRAKLIST_FETCH_FULFILLED';
export const TRAKLIST_FETCH_REJECTED = 'TRAKLIST_FETCH_REJECTED';

// -----------------------------------------------------------------------------
// ACTIONS

function fetching() {
  return { type: TRAKLIST_FETCH_PENDING };
}

function fetched(data) {
  return { type: TRAKLIST_FETCH_FULFILLED, payload: data };
}

function failed(error) {
  return { type: TRAKLIST_FETCH_REJECTED, payload: error };
}

export function fetchAll() {
  return (dispatch, getState, { axios }) => {
    dispatch(fetching());

    return axios
      .get('/api/traks/')
      .then(({ data }) => dispatch(fetched(data)))
      .catch(error => dispatch(failed(error)));
  };
}