/* eslint-disable import/prefer-default-export */

// -----------------------------------------------------------------------------
// ACTION NAME CONSTANTS

export const INSTANCES_FETCH_PENDING = 'INSTANCES_FETCH_PENDING';
export const INSTANCES_FETCH_FULFILLED = 'INSTANCES_FETCH_FULFILLED';
export const INSTANCES_FETCH_REJECTED = 'INSTANCES_FETCH_REJECTED';

// -----------------------------------------------------------------------------
// ACTIONS

function fetching() {
  return { type: INSTANCES_FETCH_PENDING };
}

function fetched(data) {
  return { type: INSTANCES_FETCH_FULFILLED, payload: data };
}

function failed(error) {
  return { type: INSTANCES_FETCH_REJECTED, payload: error };
}

export function fetchAll() {
  return (dispatch, getState, { axios }) => {
    dispatch(fetching(id));

    return axios
      .get('/api/sampleInstances')
      .then(({ data }) => dispatch(fetched(data)))
      .catch(error => dispatch(failed(error)));
  };
}
