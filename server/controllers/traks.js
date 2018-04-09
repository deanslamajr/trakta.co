import { PlayCodes, Traks } from '../models'
import { sequelize } from '../adapters/db'

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
  getAll,
  recordPlay
}
