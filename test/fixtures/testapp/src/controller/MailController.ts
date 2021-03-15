import { Controller, get, Email, email } from '../../../../../src'

export default class extends Controller {
  @get('/send-mail')
  public async sendMail(@email email: Email) {
    await email.send({
      template: 'test',
      to: 'test-runner@zents.dev',
    })

    return {
      success: true,
    }
  }
}
