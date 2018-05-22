import { setTrakFilename } from '../../../shared/actions/player'
import { fetched } from '../../../shared/actions/traklist'
import { Traks, Versions } from '../../models'
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
  let trakFilename
  const urlTokens = url.split('/')
  const versionNumberArray = urlTokens[2].match(/\d+/)
  const trakName = urlTokens[2].replace(versionNumberArray, '')

  const trak = await Traks.findOne({ where: { name: trakName } })

  if (versionNumberArray) {
    const versionNumber = versionNumberArray[0]

    const version = await Versions.findOne({
      where: {
        trak_id: trak.id,
        version_number: versionNumber,
        active: true
      }
    })

    if (version) {
      trakFilename = version.filename
    } else { // if version doesn't exist, get the filename associated with the highest version number
      const latestVersion = await Versions.getHighestVersionByTrakId(trak.id)
      trakFilename = latestVersion.filename
    }
  } else {
    const latestVersion = await Versions.getHighestVersionByTrakId(trak.id)
    trakFilename = latestVersion.filename
  }

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
