import type { ConfigValidationResult, ZenConfig } from '../types/interfaces'

import { fs } from '../filesystem/FS'
import { join } from 'path'

async function validateSecurityConfig(config: ZenConfig): Promise<string[] | true> {
  const errors = []

  if (typeof config.security?.secretKey !== 'string') {
    errors.push(
      'Property "secretKey" is missing in "config.security". Please create a strong secret key with at least 32 characters',
    )
  } else if (config.security.secretKey.length < 32) {
    errors.push('Property "secretKey" in "config.security" must be at least 32 characters long.')
  }

  if (Array.isArray(config.security?.strategies) && !config.security.strategies.length) {
    errors.push(
      'Security Strategy config is missing in "config.security". Please add at least one security strategy..',
    )
  }

  return !errors.length ? true : errors
}

export async function validateConfig(config: ZenConfig): Promise<ConfigValidationResult> {
  let errors: string[] = []

  if (config.security?.enable) {
    const result = await validateSecurityConfig(config)

    if (Array.isArray(result)) {
      errors = [...errors, ...result]
    }
  }

  return {
    isValid: !errors.length,
    errors,
  }
}
