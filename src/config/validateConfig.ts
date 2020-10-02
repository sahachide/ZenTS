import type { ConfigValidationResult, ZenConfig } from '../types/interfaces'

function validateSecurityConfig(config: ZenConfig): string[] | true {
  const errors = []

  if (typeof config.security?.secretKey !== 'string') {
    errors.push(
      'Property "secretKey" is missing in "config.security". Please create a strong secret key with at least 32 characters',
    )
  } else if (config.security.secretKey.length < 32) {
    errors.push('Property "secretKey" in "config.security" must be at least 32 characters long.')
  }

  if (!Array.isArray(config.security?.providers) || !config.security.providers.length) {
    errors.push(
      'Security provider config is missing in "config.security". Please add at least one security provider...',
    )
  }

  return !errors.length ? true : errors
}

export function validateConfig(config: ZenConfig): ConfigValidationResult {
  let errors: string[] = []

  if (config.security?.enable) {
    const result = validateSecurityConfig(config)

    if (Array.isArray(result)) {
      errors = [...errors, ...result]
    }
  }

  return {
    isValid: !errors.length,
    errors,
  }
}
