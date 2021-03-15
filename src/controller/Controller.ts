import type { Environment } from '../template/Environment'
import { TemplateResponse } from '../template/TemplateResponse'

export abstract class Controller {
  constructor(protected templateEnvironment: Environment) {}

  protected async render(
    key: string,
    context?: Record<string, unknown>,
  ): Promise<TemplateResponse> {
    return new Promise((resolve, reject) => {
      this.templateEnvironment.render(key, context, (err, html): void => {
        if (err) {
          return reject(err)
        }

        const templateResponse = new TemplateResponse(html)

        return resolve(templateResponse)
      })
    })
  }
}
