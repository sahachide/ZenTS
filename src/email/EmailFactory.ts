import type { EmailTemplates, MailOptions } from '../types/types'

import type { MailResponse } from '../types/interfaces'
import type { Transporter } from 'nodemailer'
import { config } from '../config/config'
import { createTransport } from 'nodemailer'
import { htmlToText } from 'html-to-text'
import { log } from '../log/logger'
import mjml2html from 'mjml'
import { renderString } from 'nunjucks'

export class EmailFactory {
  protected transporter: Transporter

  constructor(protected emailTemplates: EmailTemplates) {
    if (config.email?.enable) {
      this.transporter = createTransport(config.email)
    } else {
      this.transporter = null
    }
  }

  public async send(options: MailOptions): Promise<MailResponse> {
    if (this.transporter === null) {
      throw new Error(
        'Trying to send an E-Mail without proper email configuration. Please enable email in your ZenTS configuration before sending emails',
      )
    } else if (!this.emailTemplates.has(options.template)) {
      throw new Error(`Email template "${options.template}" not found!`)
    }

    const engine = options.engine ?? config.email.engine
    const { template, payload } = options
    let content = this.emailTemplates.get(template)

    if (engine !== 'plain') {
      content = renderString(content, payload)
    }

    if (engine === 'mjml') {
      const result = mjml2html(content, config.email?.mjml)

      if (result.errors.length) {
        log.error(result.errors)

        throw new Error('Failed to render MJML! See error(s) above for more information.')
      }

      content = result.html
    }

    const data: MailOptions =
      typeof config.email.mailOptions === 'undefined'
        ? options
        : Object.assign({}, config.email.mailOptions, options)

    if (engine !== 'plain') {
      data.html = content

      if (config.email?.htmlToText?.enable) {
        data.text = htmlToText(content, config.email?.htmlToText)
      }
    } else if (!data.keepText) {
      data.text = content
    }

    return (await this.transporter.sendMail(data)) as MailResponse
  }
}
