import randomWords from 'random-words'
import uuidV4 from 'uuid/v4'

import { Players, Traks, Versions } from '../models'

import { ANONYMOUS_PLAYER_ID } from '../models/Players'

import { sequelize } from '../adapters/db'
import { saveBlobToS3 } from '../adapters/s3'

async function createSampleTrakSampleInstance (queryStrings = {}, s3ResourceName) {
  const duration = Number.parseFloat(queryStrings.sampleDuration) || 0.0
  const trakDuration = Number.parseFloat(queryStrings.trakDuration) || 0.0
  const sequencerCsv = queryStrings.sequencerCsv || '1'

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
        duration: trakDuration
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

      /**
       * update trak.start_time ??
       */
      if (trak.duration < trakDuration) {
        updates.duration = trakDuration
      }

      await trak.update(updates, { transaction })
    }

    await sample.createSample_instance({
      sequencer_csv: sequencerCsv,
      player_id: player.id,
      trak_id: trak.id,
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
