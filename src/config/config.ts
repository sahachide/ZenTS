import type { CosmicConfigResult, ZenConfig } from './../types/interfaces'

import { cosmiconfig } from 'cosmiconfig'
import { defaultConfig } from './default'
import merge from 'lodash.merge'

const moduleName = 'zen'

async function loadDefaultFile(): Promise<CosmicConfigResult> {
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

  return await explorer.search()
}

async function loadEnviormentFile(): Promise<CosmicConfigResult> {
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

  return await explorer.search()
}

/**
 * Allows easy access of the loaded ZenTS config. Before the config is loaded by {@link ZenApp} it will hold the
 * default config supplied by ZenTS
 */
export let config: ZenConfig = defaultConfig

export let isConfigLoaded: boolean = false

/**
 * Load the config file. This function should never be called by custom code.
 */
export async function loadConfig(): Promise<void> {
  if (isConfigLoaded) {
    return
  }

  const defaultFileConfig = await loadDefaultFile()
  const envFileConfig = await loadEnviormentFile()

  config = merge(
    {},
    defaultConfig,
    defaultFileConfig ? defaultFileConfig.config : {},
    envFileConfig ? envFileConfig.config : {},
  )
  isConfigLoaded = true
}
