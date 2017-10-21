import { sequelize } from '../adapters/db'
import { saveBlobToS3 } from '../adapters/s3'

import { Players, Samples, SampleInstances, Traks } from '../models'

import { ANONYMOUS_PLAYER_ID } from '../models/Players'

function createSampleTrakSampleInstance(queryStrings = [], s3ResourceName) {
  return sequelize.transaction(transaction => {
    let player
    let sample
    //let trakName

    return Players.findById(ANONYMOUS_PLAYER_ID)
      .then(thePlayer => {
        player = thePlayer;
        return player.createSample(
          { 
            url: s3ResourceName,
            duration: queryStrings.duration ? queryStrings.duration : 0.0
          },
          { transaction }
        )
      })
      .then(newSample => {
        sample = newSample
        //@todo create name
        // @todo verify trakName is not already taken
        return player.createTrak({ /* add trakName here */ }, { transaction })
      })
      .then(trak => {
        return sample.createSample_instance({
          start_time: queryStrings.startTime ? queryStrings.startTime : 0.0,
          volume: queryStrings.volume ? queryStrings.volume : -6.0,
          panning: queryStrings.panning ? queryStrings.panning : 0.0,
          player_id: ANONYMOUS_PLAYER_ID,
          trak_id: trak.id
        }, { transaction })
      });
  });
  //.then(() => trakName);
}

function create(req, res) {
  saveBlobToS3(req)
    .then(createSampleTrakSampleInstance.bind(this, req.query))
    .then(trakName => {
      // @todo return trakName
      res.sendStatus(200)
    })
    .catch((err) => {
      // @todo log error
      console.error(err);
      res.sendStatus(500);
    });
}

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
  create,
  getAll
};