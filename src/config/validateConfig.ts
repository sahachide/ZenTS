import type { ConfigValidationResult, ZenConfig } from '../types/interfaces'

import { fs } from '../filesystem/FS'
import { join } from 'path'

async function validateSessionConfig(config: ZenConfig): Promise<string[] | true> {
  const errors = []

  if (typeof config.session?.secretKey !== 'string') {
    errors.push(
      'Property "secretKey" is missing in "config.session". Please create a strong secret key with at least 32 characters',
    )
  } else if (config.session.secretKey.length < 32) {
    errors.push('Property "secretKey" in "config.session" must be at least 32 characters long.')
  }

  if (Array.isArray(config.session?.providers)) {
    const providersLen = config.session.providers.length

    for (const provider of config.session.providers) {
      if (providersLen > 1 && typeof provider.name !== 'string') {
        errors.push(
          'Property "name" is missing in session config. You must provide a "name" for every provider when using more then one provider',
        )
      }
      if (typeof provider.store === 'string') {
        if (provider.store === 'cookie' && !config.web?.cookie?.enable) {
          errors.push(
            'Session provider property "store" is set to "cookie", but cookie support is disabled. Enable cookie support by setting "config.web.cookie.enable" to true.',
          )
        }
        if ((provider.store === 'redis' || provider.store === 'hybrid') && !config.redis?.enable) {
          errors.push(
            `Session provider property "store" is set to "${provider.store}", but redis is disabled. Enable redis by setting "config.redis.enable" to true`,
          )
        }
      }
      if (typeof provider.entity !== 'string') {
        errors.push('Session provider is missing "entity" property.')
      } else if (
        !(await fs.exists(
          join(fs.resolveZenPath('entity'), fs.resolveZenFileExtension(provider.entity)),
        ))
      ) {
        errors.push(`Session provider entity "${provider.entity}" not found.`)
      }
    }
  } else {
    errors.push(
      'Provider config is missing in "config.session". Please add at least one session provider..',
    )
  }

  return !errors.length ? true : errors
}

export async function validateConfig(config: ZenConfig): Promise<ConfigValidationResult> {
  let errors: string[] = []

  if (config.session?.enable) {
    const result = await validateSessionConfig(config)

    if (Array.isArray(result)) {
      errors = [...errors, ...result]
    }
  }

  return {
    isValid: !errors.length,
    errors,
  }
}
