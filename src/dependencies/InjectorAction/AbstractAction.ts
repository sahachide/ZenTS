import type { Injector } from '../Injector'

export abstract class AbstractAction {
  constructor(protected injector: Injector) {}
}
