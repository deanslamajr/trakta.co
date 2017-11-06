import randomWords from 'random-words'

import { Players, Samples, SampleInstances, Traks } from '../models'

import { ANONYMOUS_PLAYER_ID } from '../models/Players'

import { sequelize } from '../adapters/db'
import { saveBlobToS3 } from '../adapters/s3'

function createSampleTrakSampleInstance(queryStrings = [], s3ResourceName) {
  return sequelize.transaction(transaction => {
    let player
    let sample

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

        let trakName = queryStrings.trakName;

        if (!trakName) {
          trakName = randomWords({ exactly: 3, join: '-' });

          // @todo ensure that trakName is not already in use!!!

          return player.createTrak({ name: trakName }, { transaction })
            .then(trak => {
              return sample.createSample_instance({
                start_time: queryStrings.startTime ? queryStrings.startTime : 0.0,
                volume: queryStrings.volume ? queryStrings.volume : -6.0,
                panning: queryStrings.panning ? queryStrings.panning : 0.0,
                player_id: ANONYMOUS_PLAYER_ID,
                trak_id: trak.id
              }, { transaction })
            })
            .then(() => trakName);
        }
        else {
          return Traks.findOne({ where: { name: trakName } })
            .then(trak => {
              return sample.createSample_instance({
                start_time: queryStrings.startTime ? queryStrings.startTime : 0.0,
                volume: queryStrings.volume ? queryStrings.volume : -6.0,
                panning: queryStrings.panning ? queryStrings.panning : 0.0,
                player_id: ANONYMOUS_PLAYER_ID,
                trak_id: trak.id
              }, { transaction })
            })
            .then(() => trakName);
        }
      })
  })
  
}

function create(req, res) {
  saveBlobToS3(req)
    .then(createSampleTrakSampleInstance.bind(this, req.query))
    .then(trakName => {
      res.json({ trakName })
    })
    .catch((err) => {
      // @todo log error
      console.error(err);
      res.sendStatus(500);
    });
}

export {
  create
};