import randomWords from 'random-words'

import { Players, Traks } from '../models'

import { ANONYMOUS_PLAYER_ID } from '../models/Players'

import { sequelize } from '../adapters/db'
import { saveBlobToS3 } from '../adapters/s3'

function createSampleTrakSampleInstance (queryStrings = [], s3ResourceName) {
  return sequelize.transaction(transaction => {
    let player
    let sample

    return Players.findById(ANONYMOUS_PLAYER_ID)
      .then(thePlayer => {
        player = thePlayer
        return player.createSample(
          {
            url: s3ResourceName,
            duration: queryStrings.duration ? queryStrings.duration : 0.0
          },
          { transaction }
        )
      })
      .then(newSample => {
        sample = newSample

        let trakName = queryStrings.trakName

        /**
         * trak doesn't exist: Create a new trak
         */
        if (!trakName) {
          trakName = randomWords({ exactly: 3, join: '-' })

          // @todo ensure that trakName is not already in use!!!

          return player.createTrak({
            name: trakName,
            start_time: 0,
            duration: queryStrings.duration
          }, { transaction })
            .then(trak => {
              return sample.createSample_instance({
                start_time: queryStrings.startTime ? queryStrings.startTime : 0.0,
                volume: queryStrings.volume ? queryStrings.volume : -6.0,
                panning: queryStrings.panning ? queryStrings.panning : 0.0,
                player_id: ANONYMOUS_PLAYER_ID,
                trak_id: trak.id
              }, { transaction })
            })
            .then(() => trakName)
        /**
         * trak exists: Do we need to update start_time AND/OR duration?
         */
        } else {
          return Traks.findOne({
            where: { name: trakName },
            transaction,
            lock: transaction.LOCK.UPDATE
          })
            .then(trak => {
              let updates = {
                contribution_count: trak.contribution_count + 1,
                last_contribution_date: sequelize.fn('NOW')
              }

              const currentDuration = Number.parseFloat(trak.duration)
              const sampleStartTime = Number.parseFloat(queryStrings.startTime)
              const sampleDuration = Number.parseFloat(queryStrings.duration)

              /**
               * update trak.start_time ??
               */
              if (sampleStartTime < trak.start_time) {
                updates = Object.assign({}, updates, {
                  start_time: sampleStartTime,
                  duration: currentDuration + (trak.start_time - sampleStartTime)
                })
              }
              /**
               * update trak.duration ??
               */
              if ((sampleStartTime + sampleDuration) > trak.start_time + currentDuration) {
                const currentDurationUpdate = updates.duration || currentDuration
                const endPointDiff = (sampleStartTime + sampleDuration) - (trak.start_time + currentDuration)
                const newDuration = currentDurationUpdate + endPointDiff
                updates = Object.assign({}, updates, { duration: newDuration })
              }

              return trak.update(updates, { transaction })
                .then(() => {
                  return sample.createSample_instance({
                    start_time: queryStrings.startTime ? queryStrings.startTime : 0.0,
                    volume: queryStrings.volume ? queryStrings.volume : -6.0,
                    panning: queryStrings.panning ? queryStrings.panning : 0.0,
                    player_id: ANONYMOUS_PLAYER_ID,
                    trak_id: trak.id
                  }, { transaction })
                })
            })
            .then(() => trakName)
        }
      })
  })
}

function create (req, res) {
  saveBlobToS3(req)
    .then(createSampleTrakSampleInstance.bind(this, req.query))
    .then(trakName => {
      res.json({ trakName })
    })
    .catch((err) => {
      // @todo log error
      console.error(err)
      res.sendStatus(500)
    })
}

export {
  create
}
