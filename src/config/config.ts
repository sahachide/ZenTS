import type { CosmicConfigResult, ZenConfig } from './../types/interfaces'

import { cosmiconfig } from 'cosmiconfig'
import { defaultConfig } from './default'
import { log } from '../log/logger'
import merge from 'lodash.merge'
import { validateConfig } from './validateConfig'

const moduleName = 'zen'

async function loadDefaultFile(searchFrom?: string): Promise<CosmicConfigResult> {
  const explorer = cosmiconfig(moduleName, {
    searchPlaces: [
      'package.json',
      '.zenrc',
      '.zenrc.js',
      'zen.json',
      'zen.yaml',
      'zen.yml',
      'zen.config.json',
      'zen.config.js',
      'zen.config.yaml',
      'zen.config.yml',
    ],
  })

  return await explorer.search(searchFrom)
}

async function loadEnviormentFile(searchFrom?: string): Promise<CosmicConfigResult> {
  const env = process.env.NODE_ENV ?? 'development'
  const explorer = cosmiconfig(moduleName, {
    searchPlaces: [
      `zen.${env}.json`,
      `zen.${env}.yaml`,
      `zen.${env}.yml`,
      `zen.${env}.config.json`,
      `zen.${env}.config.js`,
      `zen.${env}.config.yaml`,
      `zen.${env}.config.yml`,
    ],
  })

  return await explorer.search(searchFrom)
}

export let config: ZenConfig = defaultConfig
export let isConfigLoaded: boolean = false

export async function loadConfig(
  manualConfig?: ZenConfig,
  searchFrom?: string,
  forceLoading: boolean = false,
): Promise<void> {
  if (isConfigLoaded && !forceLoading) {
    return
  }

  isConfigLoaded = true

  const defaultFileConfig = await loadDefaultFile(searchFrom)
  const envFileConfig = await loadEnviormentFile(searchFrom)

  config = merge(
    {},
    defaultConfig,
    defaultFileConfig ? defaultFileConfig.config : {},
    envFileConfig ? envFileConfig.config : {},
    manualConfig ? manualConfig : {},
  )

  const { isValid, errors } = validateConfig(config)

  if (!isValid) {
    for (const error of errors) {
      log.error(error)

      throw new Error('Failed to boot! Config is invalid.')
    }
  }
}
