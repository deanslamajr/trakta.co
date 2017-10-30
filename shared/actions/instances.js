/* eslint-disable import/prefer-default-export */

// -----------------------------------------------------------------------------
// ACTION NAME CONSTANTS

export const INSTANCES_FETCH_PENDING = 'INSTANCES_FETCH_PENDING';
export const INSTANCES_FETCH_FULFILLED = 'INSTANCES_FETCH_FULFILLED';
export const INSTANCES_FETCH_REJECTED = 'INSTANCES_FETCH_REJECTED';
export const INSTANCES_UPDATE_TRACK_DIMENSIONS_BY_ADDING_SAMPLE = 'INSTANCES_UPDATE_TRACK_DIMENSIONS_BY_ADDING_SAMPLE';
export const INSTANCES_SET_TRAKNAME = 'INSTANCES_SET_TRAKNAME';

// -----------------------------------------------------------------------------
// ACTIONS

function startFetch() {
  return { type: INSTANCES_FETCH_PENDING };
}

function fetched(data) {
  return { type: INSTANCES_FETCH_FULFILLED, payload: data };
}

function failed(error) {
  return { type: INSTANCES_FETCH_REJECTED, payload: error };
}

export function updateTrackDimensionsWithAdditionalSample(newSampleInstance) {
  return { type: INSTANCES_UPDATE_TRACK_DIMENSIONS_BY_ADDING_SAMPLE, payload: newSampleInstance }
}

export function setTrakName(trakName) { 
  return { type: INSTANCES_SET_TRAKNAME, payload: trakName };
}

export function fetchAll() {
  return (dispatch, getState, { axios }) => {
    startFetch();
    
    const { instances } = getState()
    const trakName = instances.trakName

    return axios
      .get(`/api/sample-instances/${trakName}`)
      .then(({ data }) => {
        dispatch(fetched(data));
      })
      .catch(error => dispatch(failed(error)));
  };
}
