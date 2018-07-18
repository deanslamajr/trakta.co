import { combineReducers } from 'redux'
import traklist, * as FromTraklist from './traklist'
import player, * as FromPlayer from './player'

// -----------------------------------------------------------------------------
// REDUCER

const rootReducer = combineReducers({
  traklist,
  player
})

// -----------------------------------------------------------------------------
// EXPORTED SELECTORS

// PLAYER
export function getTrakFilename (state) {
  return FromPlayer.getTrakFilename(state.player)
}

// TRAKLIST
export function getTraks (state) {
  return FromTraklist.getTraks(state.traklist)
}

export function hasFetched (state) {
  return FromTraklist.hasFetched(state.traklist)
}

// -----------------------------------------------------------------------------
// REDUCER EXPORT

export default rootReducer
