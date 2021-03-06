import AWS from 'aws-sdk'
// import zlib from 'zlib'
import s3StreamFactory from 's3-upload-stream'

import config from '../../config'

const s3Config = {
  accessKeyId: config('AWS_ACCESS_KEY_ID'),
  secretAccessKey: config('AWS_SECRET_ACCESS_KEY'),
  region: 'us-west-2'
}

const s3Stream = s3StreamFactory(new AWS.S3(s3Config))

/**
 * Uploads the given file to S3
 * @param stream {Stream} stream of the file to upload
 * @returns Promise reolves to result of S3 save, rejects on/with error
 */
function saveBlobToS3 ({ bucketName, resourceName }, stream) {
  return new Promise((resolve, reject) => {
    const Key = `${resourceName}.mp3`
    // Create the streams
    // var compress = zlib.createGzip();
    const upload = s3Stream.upload({
      Bucket: `${bucketName}-${config('ENV')}`,
      Key
    })

    // Optional configuration
    upload.maxPartSize(20971520) // 20 MB
    upload.concurrentParts(5)

    upload.on('error', (error) => {
      // @todo metric
      reject(error)
    })

    /* Handle upload completion. Example details object:
      { Location: 'https://bucketName.s3.amazonaws.com/filename.ext',
        Bucket: 'bucketName',
        Key: 'filename.ext',
        ETag: '"bf2acbedf84207d696c8da7dbb205b9f-5"' }
    */
    upload.on('uploaded', (details) => {
      // @todo metric this event and log details
    })

    upload.on('finish', () => {
      resolve(Key)
    })

    // Pipe the incoming filestream through compression, and up to S3.
    // @todo implment the compression: .pipe(compress).pipe(upload);
    stream.pipe(upload)
  })
}

export { saveBlobToS3 }
