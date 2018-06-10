import { PlayCodes, Traks, Versions } from '../models'
import { sequelize } from '../adapters/db'

async function getTrakFilename (trakName) {
  const versionNumberArray = trakName.match(/\d+/)
  trakName = trakName.replace(versionNumberArray, '')

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
      return latestVersion.filename
    }
  } else {
    const latestVersion = await Versions.getHighestVersionByTrakId(trak.id)
    return latestVersion.filename
  }
}

async function get (req, res, next) {
  try {
    const trakName = req.params.trakName
    const trakFilename = await getTrakFilename(trakName)
    res.json({ trakFilename })
  }
  catch (error) {
    next(error)
  }
}

async function recordPlay (req, res, next) {
  const { code, trakName } = req.body

  try {
    return await sequelize.transaction(async transaction => {
      const playCode = await PlayCodes.findOne({ where: { code, trak_name: trakName }, transaction })

      /**
       * PlayCode doesn't exist
       * create a new one i.e. user has started playback
       * */
      if (!playCode) {
        await PlayCodes.create({ code, trak_name: trakName })
      /**
       * PlayCode exists
       * determine number of full playthroughs and update trak.playCount
       * */
      } else {
        const millisecondsListened = Date.now() - playCode.created_at.getTime()

        const trak = await Traks.findOne({ where: { name: trakName },
          transaction,
          lock: transaction.LOCK.UPDATE
        })

        if (!trak) {
          throw new Error(`trak:${trakName} does not exist!`)
        }

        const numberOfPlays = Math.floor(millisecondsListened / (trak.duration * 1000))
        const updatedPlayCount = trak.plays_count + numberOfPlays

        await trak.update({ plays_count: updatedPlayCount }, { transaction })
        // @todo playCode.update({ is_used: true })
      }
      res.sendStatus(200)
    })
  } catch (error) {
    next(error)
  }
}

async function getAll (req, res, next) {
  try {
    const traks = await Traks.findAll({})
    res.json(traks)
  } catch (error) {
    next(error)
  }
}

export {
  get,
  getAll,
  getTrakFilename,
  recordPlay
}
