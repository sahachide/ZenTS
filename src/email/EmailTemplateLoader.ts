import type { EmailTemplates } from '../types/types'
import { config } from '../config/config'
import { fs } from '../filesystem/FS'
import { parse } from 'path'
import { promises } from 'fs'

export class EmailTemplateLoader {
  public async load(): Promise<EmailTemplates> {
    const emailTemplates = new Map() as EmailTemplates
    const emailFilesPath = fs.resolveZenPath('email')

    if (!((await fs.exists(emailFilesPath)) || config.email.engine === 'plain')) {
      return emailTemplates
    }

    const filePaths = await this.loadFiles(emailFilesPath)

    for (const filePath of filePaths) {
      const { name } = parse(filePath)
      const content = await promises.readFile(filePath, {
        encoding: 'utf-8',
      })

      emailTemplates.set(name, content)
    }

    return emailTemplates
  }
  protected async loadFiles(emailFilesPath: string): Promise<string[]> {
    const fileExtension = config.email.engine === 'mjml' ? '.mjml' : `.${config.template.extension}`

    return (await fs.readDir(emailFilesPath)).filter((filePath: string) =>
      filePath.endsWith(fileExtension),
    )
  }
}
