import type { Class, JsonArray, JsonObject, JsonValue, Promisable } from 'type-fest'
import type { Connection, EntityManager, Repository } from 'typeorm'
import type {
  ControllerDeclaration,
  ControllerRoute,
  LoaderTemplateItem,
  TemplateFiltersMapItem,
} from './interfaces'
import type { IncomingMessage, ServerResponse } from 'http'

import type { Stream } from 'stream'
import type { TemplateResponse } from '../template/TemplateResponse'

// ---- A
// ---- B
// ---- C

export type ControllerMethodReturnType = Promisable<
  JsonArray | JsonObject | TemplateResponse | string | void
>

export type Controllers = Map<string, ControllerDeclaration>

// ---- D
// ---- E

export type ErrorResponseData = JsonObject | JsonArray

// ---- F
// ---- G
// ---- H

export type HeaderValue = string | string[] | number

export type HTTPMethod =
  | 'ACL'
  | 'BIND'
  | 'CHECKOUT'
  | 'CONNECT'
  | 'COPY'
  | 'DELETE'
  | 'GET'
  | 'HEAD'
  | 'LINK'
  | 'LOCK'
  | 'M-SEARCH'
  | 'MERGE'
  | 'MKACTIVITY'
  | 'MKCALENDAR'
  | 'MKCOL'
  | 'MOVE'
  | 'NOTIFY'
  | 'OPTIONS'
  | 'PATCH'
  | 'POST'
  | 'PROPFIND'
  | 'PROPPATCH'
  | 'PURGE'
  | 'PUT'
  | 'REBIND'
  | 'REPORT'
  | 'SEARCH'
  | 'SOURCE'
  | 'SUBSCRIBE'
  | 'TRACE'
  | 'UNBIND'
  | 'UNLINK'
  | 'UNLOCK'
  | 'UNSUBSCRIBE'

// ---- I

export type InjectedConnection = Connection

export type InjectedEntityManager = EntityManager

export type InjectedRepository<T> = Repository<T>

// ---- J
// ---- K
// ---- L

export type LoaderTemplates = Map<string, LoaderTemplateItem>

export type LogLevel = 'fatal' | 'error' | 'warn' | 'log' | 'info' | 'success' | 'debug' | 'trace'

// ---- M
// ---- N

export type NunjucksFilterCallback = (err: any, result: any) => void

// ---- O
// ---- P
// ---- Q
// ---- R

export type RequestHeadersValue = string | string[]
export type RequestHeaders = Map<string, RequestHeadersValue>

export type ResponseBody = Buffer | Stream | JsonValue | null

export type RouteHandler = (
  controllerKey: string,
  route: ControllerRoute,
  req: IncomingMessage,
  res: ServerResponse,
  params: {
    [key: string]: string
  },
) => void

// ---- S

export type Services = Map<string, Class>

export type StaticHandler = (req: IncomingMessage, res: ServerResponse, next: () => void) => void

// ---- T

export type TemplateFileExtension =
  | 'njk'
  | 'nunjucks'
  | 'nunjs'
  | 'nj'
  | 'html'
  | 'htm'
  | 'template'
  | 'tmpl'
  | 'tpl'

export type TemplateFiltersMap = Map<string, TemplateFiltersMapItem>

// ---- U
// ---- V
// ---- W
// ---- X
// ---- Y
// ---- Z
