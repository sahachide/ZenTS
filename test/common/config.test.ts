import { config, loadConfig } from '../../src/config/config'

import { defaultConfig } from '../../src/config/default'
import { getFixtureDir } from '../helper/getFixtureDir'

const testConfigDir = getFixtureDir('config')

describe('Config', () => {
  it('has the default config before calling loadConfig()', () => {
    expect(config).toEqual(defaultConfig)
  })

  it('loads configuration files correctly', async () => {
    await loadConfig(undefined, testConfigDir, true)

    expect(config.web?.port).toBe(8080)
    expect(config.web?.publicPath).toBe('/assets/')
    expect(config.database?.enable).toBe(true)
  })

  it('overwrites config options passed via argument', async () => {
    await loadConfig(
      {
        web: {
          port: 3333,
        },
      },
      testConfigDir,
      true,
    )

    expect(config.web?.port).toBe(3333)
    expect(config.web?.publicPath).toBe('/assets/')
    expect(config.database?.enable).toBe(true)
  })

  it("doesn't load configs twice", async () => {
    await loadConfig(
      {
        web: {
          port: 1234,
        },
      },
      testConfigDir,
      false,
    )

    expect(config.web?.port).toBe(3333)
  })

  it("loads development config when NODE_ENV isn't present", async () => {
    delete process.env.NODE_ENV

    await loadConfig(undefined, testConfigDir, true)
    expect(config.web?.port).toBe(5555)

    process.env.NODE_ENV = 'test'
  })
})
