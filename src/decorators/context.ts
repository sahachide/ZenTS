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

export function request(target: Class, propertyKey: string, parameterIndex: number): void {
  Reflect.defineMetadata(REFLECT_METADATA.CONTEXT_REQUEST, parameterIndex, target, propertyKey)
}

export const req = request

export function response(target: Class, propertyKey: string, parameterIndex: number): void {
  Reflect.defineMetadata(REFLECT_METADATA.CONTEXT_RESPONSE, parameterIndex, target, propertyKey)
}

export const res = response

export function error(target: Class, propertyKey: string, parameterIndex: number): void {
  Reflect.defineMetadata(REFLECT_METADATA.CONTEXT_ERROR, parameterIndex, target, propertyKey)
}

export function context(target: Class, propertyKey: string, parameterIndex: number): void {
  Reflect.defineMetadata(REFLECT_METADATA.CONTEXT_ALL, parameterIndex, target, propertyKey)
}
