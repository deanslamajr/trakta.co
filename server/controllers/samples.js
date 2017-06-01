import { save as saveSample } from '../models/samples';

function add(req, res) {
  saveSample(req)
    .then((result) => {
      res.sendStatus(200);
    })
    .catch((err) => {
      // @todo log error
      res.sendStatus(500);
    });
}

export { add };
