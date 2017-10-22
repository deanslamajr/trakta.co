import {  Samples, SampleInstances, Traks } from '../models'

function getByTrakName(req, res) {
  const trakName = req.params.trakName;

  if (!trakName) {
    // @log this case where a trakName wasn't sent with the request
    return res.sendStatus(404);
  }

  return SampleInstances.findAll({
      include: [ 
        Samples,
        {
          model: Traks,
          where: { name: trakName }
        }
      ]
    })
    .then(sampleInstances => {
      res.json(sampleInstances)
    })
    .catch(error => {
      console.error(error)
      res.json(error)
    });
}

export {
  getByTrakName
};