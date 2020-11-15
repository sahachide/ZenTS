import { AbstractZenFileLoader } from '../../src/filesystem/AbstractZenFileLoader'
import DefaultController from '../fixtures/zenfiles/DefaultController'
import { NamedExportController } from '../fixtures/zenfiles/NamedExportController'
import { getFixtureDir } from '../helper/getFixtureDir'
import { join } from 'path'

const MockLoader = class extends AbstractZenFileLoader {
  public async mockModuleLoad<T>(filePath: string) {
    return await this.loadModule<T>(filePath)
  }
}
const loader = new MockLoader()
const filesDir = getFixtureDir('zenfiles')

describe('AbstractZenFileLoader', () => {
  it('loads controller with default export', async () => {
    const result = await loader.mockModuleLoad<DefaultController>(
      join(filesDir, 'DefaultController'),
    )

    expect(result).toHaveProperty('key')
    expect(result).toHaveProperty('module')
    expect(result.key).toBe('defaultcontroller')
    expect(result.module).toStrictEqual(DefaultController)
  })

  it('loads controller with a named export', async () => {
    const result = await loader.mockModuleLoad<NamedExportController>(
      join(filesDir, 'NamedExportController'),
    )

    expect(result).toHaveProperty('key')
    expect(result).toHaveProperty('module')
    expect(result.key).toBe('namedexportcontroller')
    expect(result.module).toStrictEqual(NamedExportController)
  })

  it("throws an error when export member isn't found", async () => {
    await expect(loader.mockModuleLoad(join(filesDir, 'FaultController'))).rejects.toThrow()
  })
})
