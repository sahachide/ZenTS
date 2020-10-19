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
  } else {
    const providersLen = config.security.providers.length

    for (const providerConfig of config.security.providers) {
      if (providersLen > 1) {
        if (typeof providerConfig.name !== 'string') {
          errors.push('A provider needs a name property when using multiple providers.')
        }

        if (typeof providerConfig.url?.login !== 'string') {
          errors.push('A provider needs a url.login property when using multiple providers.')
        }

        if (typeof providerConfig.url?.logout !== 'string') {
          errors.push('A provider needs a url.logout property when using multiple providers.')
        }
      }

      if (typeof providerConfig.entity !== 'string') {
        errors.push('Missing entity property in security provider config.')
      }

      if (providerConfig.store) {
        if (providerConfig.store.type === 'database') {
          if (typeof providerConfig.store.entity !== 'string') {
            errors.push('Missing entity property in security provider store.')
          }
          if (!config.database?.enable) {
            errors.push('Security provider needs database access. Please enable database support.')
          }
        } else if (
          providerConfig.store.type === 'file' &&
          typeof providerConfig.store.folder !== 'string'
        ) {
          errors.push(
            'Missing folder property in security provider store. Please provide a absolute path',
          )
        } else if (providerConfig.store.type === 'redis' && !config.redis.enable) {
          errors.push('Security provider needs database access. Please enable database support.')
        }
      }
    }
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
