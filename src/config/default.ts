import type { ZenConfig } from './../types/interfaces'
import { fs } from './../filesystem/FS'
import { join } from 'path'

const appDir = fs ? fs.appDir() : process.cwd()

/**
 * The default ZenTS config
 */
export const defaultConfig: ZenConfig = {
  paths: {
    base: {
      src: join(appDir, 'src'),
      dist: join(appDir, 'dist'),
    },
    controller: './controller/',
    view: './view/',
    template: './template/',
    service: './service/',
    entity: './entity/',
    email: './email/',
    public: join(appDir, 'public'),
  },
  web: {
    host: 'localhost',
    port: 3000,
    publicPath: '/public/',
    https: {
      enable: false,
    },
    cookie: {
      enable: true,
    },
    redirectBodyType: 'none',
  },
  database: {
    enable: false,
  },
  redis: {
    enable: false,
    log: true,
  },
  security: {
    enable: false,
  },
  template: {
    extension: 'njk',
    encoding: 'utf-8',
    autoescape: true,
    throwOnUndefined: false,
    trimBlocks: false,
    lstripBlocks: false,
  },
  email: {
    enable: false,
    engine: 'mjml',
    htmlToText: {
      enable: true,
    },
  },
  log: {
    level: 'info',
    wrapConsole: false,
  },
}
