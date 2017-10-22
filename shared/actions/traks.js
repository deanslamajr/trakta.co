/* eslint-disable import/prefer-default-export */

// -----------------------------------------------------------------------------
// ACTION NAME CONSTANTS

export const TRAKS_FETCH_PENDING = 'TRAKS_FETCH_PENDING';
export const TRAKS_FETCH_FULFILLED = 'TRAKS_FETCH_FULFILLED';
export const TRAKS_FETCH_REJECTED = 'TRAKS_FETCH_REJECTED';

// -----------------------------------------------------------------------------
// ACTIONS

function fetching() {
  return { type: TRAKS_FETCH_PENDING };
}

function fetched(data) {
  return { type: TRAKS_FETCH_FULFILLED, payload: data };
}

function failed(error) {
  return { type: TRAKS_FETCH_REJECTED, payload: error };
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