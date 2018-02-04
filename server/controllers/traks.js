import { PlayCodes, Traks } from '../models'
import { sequelize } from '../adapters/db'

function playsFromStartTime (startTime, trakName) {
  const millisecondsListened = Date.now() - startTime.getTime()

  return Traks.findAll({ where: { name: trakName } })
    .then(([ trak ]) => {
      if (!trak) {
        throw new Error(`trak:${trakName} does not exist!`)
      }

      return Math.floor(millisecondsListened / (trak.duration * 1000))
    })
}

function recordPlay (req, res) {
  const { code, trakName } = req.body

  return sequelize.transaction(transaction => {
    return PlayCodes.findOne({ where: { code, trak_name: trakName }, transaction })
      .then((playCode) => {
        /** PlayCode doesn't exist: create a new one i.e. user has started playback */
        if (!playCode) {
          return PlayCodes.create({ code, trak_name: trakName })
            .then(() => res.sendStatus(200))
        /** PlayCode exists: determine number of full playthroughs and update trak.playCount */
        } else {
          return playsFromStartTime(playCode.created_at, trakName)
            .then(numberOfPlays => {
              return Traks.findOne({ where: { name: trakName },
                transaction,
                lock: transaction.LOCK.UPDATE
              })
                .then(trak => {
                  const updatedPlayCount = trak.plays_count + numberOfPlays

                  return trak.update({ plays_count: updatedPlayCount }, { transaction })
                    .then(() => res.sendStatus(200))
                })
            })
        }
      })
  })
}

function getAll (req, res) {
  return Traks.findAll({})
    .then(traks => {
      res.json(traks)
    })
    .catch(error => {
      console.error(error)
      res.json(error)
    })
}

export {
  getAll,
  recordPlay
}
