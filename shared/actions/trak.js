/* eslint-disable import/prefer-default-export */

import { getTrakName } from '../reducers'

import { beginInitialFetch, finishInitialFetchTask } from './samples'

// -----------------------------------------------------------------------------
// ACTION NAME CONSTANTS

export const TRAK_INSTANCES_FETCH_FULFILLED = 'TRAK_INSTANCES_FETCH_FULFILLED';
export const TRAK_INSTANCES_FETCH_REJECTED = 'TRAK_INSTANCES_FETCH_REJECTED';
export const TRAK_UPDATE_DIMENSIONS_BY_ADDING_SAMPLE = 'TRAK_UPDATE_DIMENSIONS_BY_ADDING_SAMPLE';
export const TRAK_SET_NAME = 'TRAK_SET_NAME';
export const TRAK_RESET = 'TRAK_RESET';

// -----------------------------------------------------------------------------
// ACTIONS

function fetched(data) {
  return { type: TRAK_INSTANCES_FETCH_FULFILLED, payload: data };
}

function failed(error) {
  return { type: TRAK_INSTANCES_FETCH_REJECTED, payload: error };
}

export function updateDimensionsWithAdditionalSample(newSampleInstance) {
  return { type: TRAK_UPDATE_DIMENSIONS_BY_ADDING_SAMPLE, payload: newSampleInstance }
}

export function setName(trakName) { 
  return { type: TRAK_SET_NAME, payload: trakName };
}

export function fetchInstances() {
  return (dispatch, getState, { axios }) => {
    dispatch(beginInitialFetch())
    
    const state = getState()
    const trakName = getTrakName(state)

    return axios
      .get(`/api/sample-instances/${trakName}`)
      .then(({ data }) => {
        dispatch(fetched(data));
        dispatch(finishInitialFetchTask(data.length));
      })
      .catch(error => dispatch(failed(error)));
  };
}

export function reset() {
  return { type: TRAK_RESET };
}
