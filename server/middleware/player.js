import path from 'path'

import config from '../../config'

export default function trakPlayer (request, response) {
  const playerPath = path.join(config('publicAssetsPath'), './player.ejs')
  console.log('\nplayerPath')
  console.dir(playerPath)
  // response.sendFile(playerPath, { root: __dirname + '../../../' });
  response.render('player', {
    nonce: response.locals.nonce,
    s3TrakBucket: config('s3TrakBucket')
  })
}
