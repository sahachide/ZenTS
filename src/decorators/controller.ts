import { REFLECT_METADATA } from '../types/enums'

export function controller(key: string) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (target: Function): void => {
    Reflect.defineMetadata(REFLECT_METADATA.CONTROLLER_KEY, key, target)
  }
}
