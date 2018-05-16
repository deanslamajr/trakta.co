import {
  PLAYER_SET_TRAK_FILENAME } from '../actions/player'

const defaultState = {
  filename: ''
}

// -----------------------------------------------------------------------------
// REDUCER

function player (state = defaultState, action) {
  if (action.type === PLAYER_SET_TRAK_FILENAME) {
    return Object.assign({}, state, { filename: action.payload })
  }

  return state
}

// -----------------------------------------------------------------------------
// EXPORTED SELECTORS

export function getTrakFilename (state) {
  return state.filename
}

// -----------------------------------------------------------------------------
// REDUCER EXPORT

export default player
