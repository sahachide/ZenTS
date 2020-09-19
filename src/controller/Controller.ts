import type { Environment } from '../template/Environment'
import { TemplateResponse } from '../template/TemplateResponse'

/**
 * The basic ZenTS Controller class. Your custom Controller should extend this controller
 * in order to use the template engine.
 */
export abstract class Controller {
  constructor(protected templateEnvironment: Environment) {}

  /**
   * Renders a given template. The supplied key argument is either the filename or the path/to/file without the file extension.
   *
   * @param key The key of the template to render (path/to/file without extension)
   * @param context Optional context of the template. This object will be available inside the rendered template.
   */
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
