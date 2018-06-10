import { setTrakFilename } from '../../../shared/actions/player'
import { fetched } from '../../../shared/actions/traklist'
import { Traks } from '../../models'
import { getTrakFilename } from '../../controllers/traks'

import logger from '../logger'

//
//      /p/trakName
//
function isPlayer (urlTokens) {
  return urlTokens[1].toLowerCase() === 'p'
}

//
//      /
//
function isMainList (urlTokens) {
  return urlTokens[1].toLowerCase() === ''
}

async function initializeMainList (store) {
  const traks = await Traks.findAll({})
  store.dispatch(fetched(traks))
}

async function initializePlayer (store, url) {
  const urlTokens = url.split('/')
  let trakFilename = await getTrakFilename(urlTokens[2])
  store.dispatch(setTrakFilename(trakFilename))
}

/**
 *
 * @public
 */
export default async function initializeReduxState (store, req, res) {
  const { url } = req

  try {
    const tokens = url.split('/')

    if (isPlayer(tokens)) {
      await initializePlayer(store, url)
    } else if (isMainList(tokens)) {
      await initializeMainList(store)
    }
  } catch (error) {
    logger.logError(error, req, res)
  }
}
