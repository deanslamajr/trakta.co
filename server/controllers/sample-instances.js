import SampleInstances from '../models/Sample-Instances';
import Samples from '../models/Samples';

function getAll(req, res) {
  return SampleInstances.findAll({ include: [ Samples ] })
    .then(sampleInstances => {
      res.json(sampleInstances)
    })
    .catch(error => {
      console.error(error)
      res.json(error)
    });
}

export {
  getAll
};