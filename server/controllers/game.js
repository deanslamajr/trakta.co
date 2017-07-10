import { sequelize } from '../adapters/db'
import { saveBlobToS3 } from '../adapters/s3'

import { Players, Samples, SampleInstances } from '../models'

function doInitialDBtasks(s3ResourceName) {
  let playerInstance;
  // @todo convert this to async/await pattern to avoid intermediate local vars
  return sequelize.transaction((transaction) => {
    return Players.create({}, { transaction })
      .then(player => {
        playerInstance = player;
        const queries = [];

        queries.push(player.createSample({ url: s3ResourceName }, { transaction }));
        queries.push(player.createTrak({ contributions_count: 1, is_vacant: false }, { transaction }));

        return Promise.all(queries);
      })
      .then(([ sample, trak ]) => {
        return trak.createSample_instance({
            start_time: 0,
            volume: 80,
            panning: 0,
            player_id: playerInstance.get().id,
            sample_id: sample.get().id
          }, { transaction });
      });
  });
}

function initialize(req, res) {
  // @todo check game state in cookie

  saveBlobToS3(req)
    .then(doInitialDBtasks)
    .then((result) => {
      res.sendStatus(200);
    })
    .catch((err) => {
      // @todo log error
      console.error(err);
      res.sendStatus(500);
    });
}

export { initialize };
