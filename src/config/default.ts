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
    worker: './worker/',
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
  mq: {
    enable: false,
    /*
    queues: [
      {
        name: 'string',
        defaultJobOptions: {
          // https://github.com/taskforcesh/bullmq/blob/master/docs/gitbook/api/bullmq.jobsoptions.md
        }, 
        scheduler: bool, // required if running stuff like delayed jobs, retries and rate limiting, needs an error when turned off and jobs requiring that, default should be true
        log: bool // give some logging done with events and our log framework

      }
    ],
    // these are the startup jobs, they should also be added automaticly
    jobs: [
      {
        queue: 'name',
        data: {...}, // optional? 
        options: {...}, // https://github.com/taskforcesh/bullmq/blob/master/docs/gitbook/api/bullmq.jobsoptions.md
        children: [
          // see https://docs.bullmq.io/guide/jobs/flows
        ]
      }
    ]
    */
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
