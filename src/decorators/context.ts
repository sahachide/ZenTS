import type { Class } from 'type-fest'
import { REFLECT_METADATA } from '../types/enums'

export function body(target: Class, propertyKey: string, parameterIndex: number): void {
  Reflect.defineMetadata(REFLECT_METADATA.CONTEXT_BODY, parameterIndex, target, propertyKey)
}

export function query(target: Class, propertyKey: string, parameterIndex: number): void {
  Reflect.defineMetadata(REFLECT_METADATA.CONTEXT_QUERY, parameterIndex, target, propertyKey)
}

export function params(target: Class, propertyKey: string, parameterIndex: number): void {
  Reflect.defineMetadata(REFLECT_METADATA.CONTEXT_PARAMS, parameterIndex, target, propertyKey)
}

export function cookie(target: Class, propertyKey: string, parameterIndex: number): void {
  Reflect.defineMetadata(REFLECT_METADATA.CONTEXT_COOKIE, parameterIndex, target, propertyKey)
}
