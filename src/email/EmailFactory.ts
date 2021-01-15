import type { EmailTemplates } from '../types/types'
import type { Transport } from 'nodemailer'
import { config } from '../config/config'
import { createTransport } from 'nodemailer'
import { log } from '../log/logger'
import mjml2html from 'mjml'
import { renderString } from 'nunjucks'

export class EmailFactory {
  protected transporter: Transport | null

  constructor(protected emailTemplates: EmailTemplates) {
    if (typeof config.email?.host === 'string') {
      this.transporter = (createTransport(config.email) as unknown) as Transport
    } else {
      this.transporter = null
    }
  }
  public send({
    to = config.email.defaults.to,
    cc = config.email.defaults.cc,
    bcc = config.email.defaults.bcc,
    from = config.email.defaults.from,
    topic = config.email.defaults.topic,
    template,
    payload = {},
    engine = config.email.engine,
  }: {
    to: string
    from?: string
    cc?: string
    bcc?: string
    topic: string
    template: string
    payload?: Record<string, unknown>
    engine?: string
  }): void {
    if (this.transporter === null) {
      log.warn(
        'Trying to send an E-Mail without proper email configuration. Please configure at least a email host',
      )

      return
    } else if (!this.emailTemplates.has(template)) {
      throw new Error(`Email template "${template}" not found!`)
    }

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
  }
}
