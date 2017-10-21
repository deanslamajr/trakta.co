import Traks from '../models/Traks';

function getAll(req, res) {
  return Traks.findAll({})
    .then(traks => {
      res.json(traks)
    })
    .catch(error => {
      console.error(error)
      res.json(error)
    });
}

export {
  getAll
};