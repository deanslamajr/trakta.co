/* eslint-disable no-console */
/* eslint-disable no-unused-vars */

const isProduction = process.env.NODE_ENV === 'production'

const errorHandlersMiddleware = [
  /**
   * 404 errors middleware.
   *
   * NOTE: the react application middleware hands 404 paths, but it is good to
   * have this backup for paths not handled by the react middleware. For
   * example you may bind a /api path to express.
   */
  function notFoundMiddlware (req, res, next) {
    res.status(404).send('Sorry, that resource was not found.')
  },

  /**
   * 500 errors middleware.
   *
   * NOTE: You must provide specify all 4 parameters on this callback function
   * even if they aren't used, otherwise it won't be used.
   */
  function unexpectedErrorMiddleware (err, req, res, next) {
    if (err) {
      if (isProduction) {
        res.error = err
      } else {
        console.error(err)
      }
    }
    // @todo flesh this out
    res.status(500).send('Sorry, an unexpected error occurred.')
  }
]

export default errorHandlersMiddleware
