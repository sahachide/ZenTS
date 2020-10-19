import { fs } from '../../src/filesystem/FS'
import { getFixtureDir } from '../helper/getFixtureDir'
import { join } from 'path'

describe('FS', () => {
  it("checks that a file exists or doesn't extist", async () => {
    const exists = await fs.exists(join(getFixtureDir('config'), 'zen.json'))
    expect(exists).toBe(true)

    const doesntExists = await fs.exists('./filedoesntexists')
    expect(doesntExists).toBe(false)
  })

  it('read the directory content recursively', async () => {
    const testDir = getFixtureDir('testapp')
    const content = await fs.readDir(testDir)
    const normalizedContent = content.map((filePath) => filePath.replace(testDir, ''))

    expect(normalizedContent).toContain('/src/controller/ResponseController.ts')
    expect(normalizedContent).toContain('/src/service/DepdendencyInjectionService.ts')
    expect(normalizedContent).toContain('/zen.json')
  })

  it('resolves file extension depending on the environment', () => {
    process.env.NODE_ENV = 'production'
    const notDevWithoutFilename = fs.resolveZenFileExtension()
    expect(notDevWithoutFilename).toBe('.js')

    const notDevWithFilename = fs.resolveZenFileExtension('filename')
    expect(notDevWithFilename).toBe('filename.js')

    process.env.NODE_ENV = 'development'
    const devWithoutFilename = fs.resolveZenFileExtension()
    expect(devWithoutFilename).toBe('.ts')

    const devWithFilename = fs.resolveZenFileExtension('filename')
    expect(devWithFilename).toBe('filename.ts')
  })
})
