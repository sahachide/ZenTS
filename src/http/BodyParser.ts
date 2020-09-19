import { IncomingForm } from 'formidable'
import type { IncomingMessage } from 'http'
import type { ParsedBody } from '../types/interfaces'
import { config } from '../config/config'
import { tmpdir } from 'os'

export class BodyParser extends IncomingForm {
  constructor() {
    super()

    this.encoding = config.web?.bodyParser?.encoding ?? 'utf-8'
    this.maxFields = config.web?.bodyParser?.maxFields ?? 1000
    this.maxFieldsSize = config.web?.bodyParser?.maxFieldsSize ?? 20 * 1024 * 1024
    this.maxFileSize = config.web?.bodyParser?.maxFileSize ?? 200 * 1024 * 1024
    this.keepExtensions = config.web?.bodyParser?.keepExtensions ?? false
    this.uploadDir = config.web?.bodyParser?.uploadDir ?? tmpdir()
    this.multiples = config.web?.bodyParser?.multiples ?? false
  }
  public async parse(req: IncomingMessage): Promise<ParsedBody> {
    return new Promise((resolve, reject) => {
      super.parse(req, (err, fields, files) => {
        if (err) {
          return reject(err)
        }

        return resolve({
          fields,
          files,
        })
      })
    })
  }
}
