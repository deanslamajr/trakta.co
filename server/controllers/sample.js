import { sequelize } from '../adapters/db'
import { saveBlobToS3 } from '../adapters/s3'

import { Players, Samples, SampleInstances } from '../models'

import { ANONYMOUS_PLAYER_ID } from '../models/Players'

function doDBtasks(queryStrings = [], s3ResourceName) {
  return sequelize.transaction((transaction) => {
    return Players.findById(ANONYMOUS_PLAYER_ID)
      .then(player => player.createSample({ 
        url: s3ResourceName,
        duration: queryStrings.duration ? queryStrings.duration : 0.0
      }, { transaction }))
      .then(sample => sample.createSample_instance({
          start_time: queryStrings.startTime ? queryStrings.startTime : 0.0,
          volume: queryStrings.volume ? queryStrings.volume : -6.0,
          panning: queryStrings.panning ? queryStrings.panning : 0.0,
          player_id: ANONYMOUS_PLAYER_ID
        }, { transaction })
      );
  });
}

function create(req, res) {
  saveBlobToS3(req)
    .then(doDBtasks.bind(this, req.query))
    .then(() => res.sendStatus(200))
    .catch((err) => {
      // @todo log error
      console.error(err);
      res.sendStatus(500);
    });
}

export { create };
