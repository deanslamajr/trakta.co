import { Samples, SampleInstances, Traks } from '../models'

async function getByTrakName (req, res, next) {
  try {
    const trakName = req.params.trakName

    const sampleInstances = await SampleInstances.findAll({
      include: [
        Samples,
        {
          model: Traks,
          where: { name: trakName }
        }
      ]
    })

    res.json(sampleInstances)
  } catch (error) {
    next(error)
  }
}

export {
  getByTrakName
}
