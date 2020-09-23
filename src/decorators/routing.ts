import type { Class } from 'type-fest'
import { REFLECT_METADATA } from '../types/enums'

export function get(path: string) {
  return (target: any, propertyKey: string): void => {
    Reflect.defineMetadata(REFLECT_METADATA.HTTP_METHOD, 'get', target, propertyKey)
    Reflect.defineMetadata(REFLECT_METADATA.URL_PATH, path, target, propertyKey)
  }
}

export function post(path: string) {
  return (target: any, propertyKey: string): void => {
    Reflect.defineMetadata(REFLECT_METADATA.HTTP_METHOD, 'post', target, propertyKey)
    Reflect.defineMetadata(REFLECT_METADATA.URL_PATH, path, target, propertyKey)
  }
}

export function put(path: string) {
  return (target: any, propertyKey: string): void => {
    Reflect.defineMetadata(REFLECT_METADATA.HTTP_METHOD, 'put', target, propertyKey)
    Reflect.defineMetadata(REFLECT_METADATA.URL_PATH, path, target, propertyKey)
  }
}

export function del(path: string) {
  return (target: any, propertyKey: string): void => {
    Reflect.defineMetadata(REFLECT_METADATA.HTTP_METHOD, 'delete', target, propertyKey)
    Reflect.defineMetadata(REFLECT_METADATA.URL_PATH, path, target, propertyKey)
  }
}

export function options(path: string) {
  return (target: any, propertyKey: string): void => {
    Reflect.defineMetadata(REFLECT_METADATA.HTTP_METHOD, 'options', target, propertyKey)
    Reflect.defineMetadata(REFLECT_METADATA.URL_PATH, path, target, propertyKey)
  }
}

export function prefix(path: string) {
  return (target: Class): void => {
    Reflect.defineMetadata(REFLECT_METADATA.URL_PREFIX, path, target)
  }
}
