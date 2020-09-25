import { Context } from '../Context'
import { SessionProvider } from '../../session/SessionProvider'

export class SecurityRequestHandler {
  private didRun: boolean = false
  constructor(protected context: Context, protected provider: SessionProvider) {}
  public run(): void {
    if (this.didRun) {
      return
    }

    this.didRun = true
  }
}
