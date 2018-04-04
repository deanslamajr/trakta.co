import winston from 'winston'
// require('winston-daily-rotate-file')

import moment from 'moment'
import util from 'util'

const isProduction = process.env.NODE_ENV === 'production'

const format = isProduction
  ? winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    )
  : winston.format.combine(
      winston.format((info, opts) => {
        const prefix = util.format('[%s]', moment().format('YYYY-MM-DD hh:mm:ss').trim())
        if (info.splat) {
          info.message = util.format('%s %s', prefix, util.format(info.message, ...info.splat))
        } else {
          info.message = util.format('%s %s', prefix, info.message)
        }
        return info
      })(),
      winston.format.colorize({ all: true }),
      winston.format.simple()
    )

const winstonLogger = winston.createLogger({
  transports: [
    new winston.transports.Console()
    // new (winston.transports.DailyRotateFile)({
    //   filename: 'application-%DATE%.log',
    //   datePattern: 'YYYY-MM-DD-HH',
    //   maxSize: '20m',
    //   maxFiles: '14d',
    //   dirname: './logs'
    // })
  ],
  format
})

function log (level = 'error', message = '', data = {}) {
  if (typeof data !== 'object' || data === null) {
    data = {}
  }

  const datums = Object.assign({},
    {
      level,
      message
    },
    data
  )

  return winstonLogger.log(datums)
}

function scrapeRequestData (req, res) {
  const canUseHeaders = req.headers && typeof (req.headers) === 'object'
  // @todo add user and session details to returned object

  return {
    error: res.error ? res.error.message : undefined,
    method: req.method,
    path: req.path,
    query: req.query,
    body: req.body,
    host: canUseHeaders ? req.header('host') : undefined,
    referer: canUseHeaders ? req.header('referer') : undefined,
    stack: res.error ? res.error.stack : undefined,
    statusCode: res.statusCode
  }
}

function middleware (req, res, next) {
  function doLog () {
    res.removeListener('finish', doLog)
    res.removeListener('close', doLog)

    const data = scrapeRequestData(req, res)
    const status = data.statusCode
    if (status >= 500) {
      error(status, data)
    } else if (status >= 400) {
      warn(status, data)
    } else {
      info(status, data)
    }
  }
  res.on('finish', doLog)
  res.on('close', doLog)
  return next()
}

/**
 * @param {Error|string} errorMessage - the error or message to log
 * @param {Object} data - a plain object to log along with the data
 */
function error (message, data) {
  return log('error', message, data)
}
function warn (message, data) {
  return log('warn', message, data)
}
function info (message, data) {
  return log('info', message, data)
}

const logger = {
  middleware,
  error,
  info,
  warn
}

export default logger
