import { saveBlobToS3 } from '../adapters/s3'
import { Versions, Traks } from '../models'
import { sequelize } from '../adapters/db'

export async function saveVersion (req, res, next) {
  try {
    await sequelize.transaction(async transaction => {
      const versionId = req.params.versionId

      // fetch the version by id
      const version = await Versions.findOne({
        where: { id: versionId },
        include: [ Traks ],
        transaction
      })

      if (!version) {
        // @todo can this be reached?
        // @todo should this return a 200 to prevent hax?
        throw new Error(`versionId:${versionId} does not exist`)
      }

      const versionedTrakName = `${version.trak.name}${version.version}`

      const s3Config = {
        bucketName: 'traks',
        resourceName: versionedTrakName
      }
      const s3ResourceName = await saveBlobToS3(s3Config, req) // eslint-disable-line

      return version.update({
        active: true,
        filename: s3ResourceName
      }, { transaction })
    })

    res.sendStatus(200)
  } catch (error) {
    next(error)
  }
}
