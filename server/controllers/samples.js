import randomWords from 'random-words'
import uuidV4 from 'uuid/v4'

import { Players, Traks, Versions } from '../models'

import { ANONYMOUS_PLAYER_ID } from '../models/Players'

import { sequelize } from '../adapters/db'
import { saveBlobToS3 } from '../adapters/s3'

async function createSampleTrakSampleInstance (queryStrings = {}, s3ResourceName) {
  const duration = queryStrings.duration || 0.0
  const start_time = queryStrings.startTime || 0.0 // eslint-disable-line 
  const volume = queryStrings.volume || -6.0
  const panning = queryStrings.panning || 0.0
  const loop_count = queryStrings.loopCount || 0 // eslint-disable-line 
  const loop_padding = queryStrings.loopPadding || 0.0 // eslint-disable-line 
  let trakName = queryStrings.trakName
  let trak
  let version

  return sequelize.transaction(async transaction => {
    const player = await Players.findById(ANONYMOUS_PLAYER_ID)
    const sample = await player.createSample(
      {
        url: s3ResourceName,
        duration
      },
      { transaction }
    )

    trak = await Traks.findOne({
      where: { name: trakName },
      lock: transaction.LOCK.UPDATE,
      transaction
    })

    /**
     * trak doesn't exist: Create a new trak
     */
    if (!trak) {
      trakName = randomWords({ exactly: 3, join: '-' })

      // @todo ensure that trakName is not already in use!!!

      trak = await player.createTrak({
        name: trakName,
        start_time: 0,
        duration
      }, { transaction })

      version = await trak.createVersion({ active: false }, { transaction })
    /**
     * trak exists: Do we need to update start_time AND/OR duration?
     */
    } else {
      // get latest version of trak
      const latestVersion = await Versions.getHighestVersionByTrakId(trak.id)

      // bump version number
      version = await trak.createVersion({
        version_number: latestVersion ? latestVersion.version_number + 1 : 1, // if trak was created before versions were implemented
        active: false
      }, { transaction })

      let updates = {
        contribution_count: trak.contribution_count + 1,
        last_contribution_date: sequelize.fn('NOW')
      }

      const currentDuration = Number.parseFloat(trak.duration)
      const sampleStartTime = Number.parseFloat(start_time)
      const sampleDuration = Number.parseFloat(duration)

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

      await trak.update(updates, { transaction })
    }

    await sample.createSample_instance({
      start_time,
      volume,
      panning,
      player_id: ANONYMOUS_PLAYER_ID,
      trak_id: trak.id,
      loop_count,
      loop_padding,
      version_id: version.id
    }, { transaction })

    return {
      trakName,
      versionId: version.id
    }
  })
}

async function create (req, res, next) {
  try {
    const uuid = uuidV4()
    const s3Config = {
      bucketName: 'samples',
      resourceName: uuid
    }
    const s3ResourceName = await saveBlobToS3(s3Config, req)

    const trakNameAndVersionId = await createSampleTrakSampleInstance(req.query, s3ResourceName)

    res.json(trakNameAndVersionId)
  } catch (error) {
    next(error)
  }
}

export {
  create
}
