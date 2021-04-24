import type { ArraySchema, BooleanSchema, ObjectSchema } from 'joi'
import type { Class, JsonArray, JsonObject, JsonValue, Promisable } from 'type-fest'
import type { Connection, EntityManager, Repository } from 'typeorm'
import type {
  Context,
  ControllerDeclaration,
  DatabaseSessionStoreAdapterEntity,
  IncomingParams,
  LoaderTemplateItem,
  RequestConfigController,
  RequestConfigSecurity,
  Route,
  TemplateFiltersMapItem,
} from './interfaces'
import type { IncomingMessage, ServerResponse } from 'http'

import type { DB_TYPE } from './enums'
import type { EmailFactory } from '../email/EmailFactory'
import type { HtmlToTextOptions } from 'html-to-text'
import type { Redis } from 'ioredis'
import type { SecurityProvider } from '../security/SecurityProvider'
import type { SendMailOptions } from 'nodemailer'
import type { Stream } from 'stream'
import type { TemplateResponse } from '../template/TemplateResponse'
import type findMyWay from 'find-my-way'

// ---- A
// ---- B
// ---- C

export type ControllerMethodReturnType = Promisable<
  JsonArray | JsonObject | TemplateResponse | string | void
>

export type Controllers = Map<string, ControllerDeclaration>

// ---- D

export type DatabaseSessionStoreAdapterEntityClass = Class<DatabaseSessionStoreAdapterEntity>

export type DatabaseObjectType<T> = T extends DB_TYPE.ORM ? Connection : Redis

// ---- E

export type Entities = Map<string, Class>

export type Email = EmailFactory

export type EmailTemplates = Map<string, string>

export type ErrorResponseData = Record<string, unknown> | JsonArray

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

export type MailOptions = Partial<SendMailOptions> &
  Partial<HtmlToTextOptions> & {
    template: string
    payload?: Record<string, unknown>
    engine?: string
    keepText?: boolean
  }

// ---- N

export type NunjucksFilterCallback = (err: any, result: any) => void

// ---- O
// ---- P
// ---- Q
// ---- R

export type RedisClient = Redis

export type RequestConfig = RequestConfigController | RequestConfigSecurity

export type RequestHeadersValue = string | string[]

export type RequestHeaders = Map<string, RequestHeadersValue>

export type ResponseBody = Buffer | Stream | JsonValue | null

export type Router = findMyWay.Instance<findMyWay.HTTPVersion.V1>

export type RouteHandler = (
  config: RequestConfig,
  route: Route,
  req: IncomingMessage,
  res: ServerResponse,
  params: IncomingParams,
) => void

// ---- S

export type SecurityRequestContext = Context<any, { username: string; password: string }>

export type SecurityProviders = Map<string, SecurityProvider>

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

export type ValidationSchema = ObjectSchema | ArraySchema | BooleanSchema

// ---- W
// ---- X
// ---- Y
// ---- Z
