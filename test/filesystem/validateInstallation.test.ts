import { validateInstallation } from '../../src/filesystem/validateInstallation'
import { loadFixtureTestAppConfig } from '../helper/loadFixtureTestAppConfig'

describe('validateInstallation', () => {
  it("throw an error if installation isn't valid", async () => {
    await expect(validateInstallation()).rejects.toThrow()
  })
  it('validates a valid installation correctly', async () => {
    await loadFixtureTestAppConfig()
    process.env.NODE_ENV = 'development'
    await expect(validateInstallation()).resolves.toBeUndefined()
    process.env.NODE_ENV = 'test'
  })
})
