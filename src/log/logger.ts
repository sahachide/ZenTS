import consola, { Consola, LogLevel } from 'consola'

import { config } from '../config/config'

const getLogLevel = (): number => {
  let level = LogLevel.Info

  if (typeof config === 'undefined') {
    // When ZenTS is booting, config will be undefined. In that case, we just log errors.
    return LogLevel.Error
  }

  switch (config.log.level) {
    case 'debug':
      level = LogLevel.Debug
      break

    case 'fatal':
      level = LogLevel.Fatal
      break

    case 'error':
      level = LogLevel.Error
      break

    case 'warn':
      level = LogLevel.Warn
      break

    case 'log':
      level = LogLevel.Log
      break

    case 'info':
      level = LogLevel.Info
      break

    case 'success':
      level = LogLevel.Success
      break

    case 'trace':
      level = LogLevel.Trace
      break

    default:
      level = LogLevel.Info
  }

  return level
}

const createLoggerInternal = (): Consola => {
  return consola.create({
    level: getLogLevel(),
  })
}

export let log = createLoggerInternal()

export const createLogger = (): void => {
  log = createLoggerInternal()

  if (config.log.wrapConsole) {
    log.wrapConsole()
  }
}
