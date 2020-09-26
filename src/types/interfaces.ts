import type { Class, JsonObject, Promisable } from 'type-fest'
import type {
  ControllerMethodReturnType,
  ErrorResponseData,
  HTTPMethod,
  HeaderValue,
  LogLevel,
  SessionProviderOptionType,
  TemplateFileExtension,
  TemplateFiltersMap,
} from './types'
import type { REPOSITORY_TYPE, REQUEST_TYPE, SECURITY_ACTION } from './enums'

import type { ConnectionOptions } from 'typeorm'
import type { Context as ContextClass } from '../http/Context'
import type { ControllerFactory } from '../controller/ControllerFactory'
import type { RedisOptions } from 'ioredis'
import type { Request } from '../http/Request'
import type { RequestFactory } from '../http/RequestFactory'
import type { RouterFactory } from '../router/RouterFactory'
import type { ServiceFactory } from '../service/ServiceFactory'
import type { SessionProvider } from '../session/SessionProvider'

// ---- A
// ---- B
// ---- C

export interface Context<Params = any, Body = any, Query = any> extends ContextClass {
  query: QueryString & Query
  params: IncomingParams & Params
  body: ParsedBody['fields'] & Body
  req: Request & {
    query: QueryString & Query
    params: IncomingParams & Params
    body: ParsedBody['fields'] & Body
  }
  request: Request & {
    query: QueryString & Query
    params: IncomingParams & Params
    body: ParsedBody['fields'] & Body
  }
}

export interface CookieOptions {
  enable?: boolean
  strategy?: 'merge' | 'single'
  domain?: string
  encode?: (value: string) => string
  expires?: Date
  httpOnly?: boolean
  maxAge?: number
  path?: string
  sameSite?: true | false | 'lax' | 'strict' | 'none'
  secure?: boolean
}

export interface ConfigValidationResult {
  isValid: boolean
  errors: string[]
}

export interface ControllerDeclaration {
  module: Class
  routes: Route[]
}

export interface Route {
  method: HTTPMethod
  path: string
  controllerMethod?: string
}

export interface CommonJSZenModule<T> {
  [key: string]: Class<T>
}

export interface CosmicConfigResult {
  config: ZenConfig
  filepath: string
  isEmpty?: boolean
}

// ---- D
// ---- E

export interface ErrorResponsePayload {
  [key: string]: any
  statusCode: number
  error: string
  message: string
  data?: ErrorResponseData
}

// ---- F
// ---- G

export interface GenericControllerInstance {
  [key: string]: (context: Context, ...injected: unknown[]) => ControllerMethodReturnType
}

// ---- H

export interface HeaderValues {
  key: string
  value: HeaderValue
}

// ---- I

export interface IncomingParams {
  [key: string]: string
}

export interface InjectModuleInstance {
  [key: string]: any
}

export interface InjectorFunctionParameter {
  index: number
  value: any
}

// ---- J
// ---- K
// ---- L

export interface LoaderTemplateItem {
  src: string
  path: string
  noCache: boolean
}

export interface LoadModuleResult<T> {
  key: string
  module: Class<T>
}

// ---- M

export interface ModuleDependency {
  propertyKey: string
  dependency: Class
}

// ---- N
// ---- O
// ---- P

export interface ParsedBody {
  fields: JsonObject
  files: {
    [key: string]: {
      size: number
      path: string
      name: string
      type: string
      lastModifiedDate?: Date
      hash?: string
      // eslint-disable-next-line @typescript-eslint/ban-types
      toJSON(): Object
    }
  }
}

// ---- Q

export interface QueryString {
  [key: string]: undefined | string | string[] | QueryString | QueryString[]
}

export interface QueryStringParseOptions {
  comma?: boolean
  delimiter?: string | RegExp
  depth?: number | false
  arrayLimit?: number
  parseArrays?: boolean
  allowDots?: boolean
  plainObjects?: boolean
  allowPrototypes?: boolean
  parameterLimit?: number
  strictNullHandling?: boolean
  charset?: 'utf-8' | 'iso-8859-1'
  charsetSentinel?: boolean
  interpretNumericEntities?: boolean
}

// ---- R

export interface RepositoryReflectionMetadata {
  index: number
  propertyKey: string
  entity: Class
  repositoryType: REPOSITORY_TYPE
}

export interface RegistryFactories {
  router: RouterFactory
  controller: ControllerFactory
  request: RequestFactory
  service: ServiceFactory
}

export interface RequestConfigController {
  type: REQUEST_TYPE.CONTROLLER
  controllerKey: string
}
export interface RequestConfigSecurity {
  type: REQUEST_TYPE.SECURITY
  action: SECURITY_ACTION
  provider: SessionProvider
}

// ---- S

export interface SessionProviderOption {
  name?: string
  entity: string
  store?: string
  maxCookieSize?: number
  usernameField?: string
  passwordField?: string
  loginRoute?: string
  logoutRoute?: string
  successRedirect?: string
  failureRedirect?: string
  type?: SessionProviderOptionType
}

// ---- T

export interface TemplateEngineLoaderResult {
  files: string[]
  filters: TemplateFiltersMap
}

export interface TemplateFilter {
  run(...args: any[]): Promisable<any>
}

export interface TemplateFiltersMapItem {
  async: boolean
  module: Class<TemplateFilter>
}

export interface TemplateStaticFilterModule {
  async?: boolean
  filtername?: string
}

// ---- U
// ---- V
// ---- W
// ---- X
// ---- Y
// ---- Z

export interface ZenConfig {
  [key: string]: any
  paths?: {
    base?: {
      src?: string
      dist?: string
    }
    controller?: string
    view?: string
    template?: string
    service?: string
    entity?: string
    public?: string | boolean
  }
  web?: {
    host?: string
    port?: number
    publicPath?: string | boolean
    https?: {
      enable?: boolean
      key?: string
      cert?: string
      pfx?: string
      passphrase?: string
    }
    querystring?: QueryStringParseOptions
    bodyParser?: {
      encoding?: string
      uploadDir?: string
      keepExtensions?: boolean
      maxFields?: number
      maxFieldsSize?: number
      maxFileSize?: number
      hash?: boolean
      multiples?: boolean
    }
    router?: {
      ignoreTrailingSlash?: boolean
      allowUnsafeRegex?: boolean
      caseSensitive?: boolean
      maxParamLength?: number
    }
    cookie?: CookieOptions
  }
  session?: {
    enable?: boolean
    secretKey?: string
    providers?: SessionProviderOption[]
  }
  database?: Partial<ConnectionOptions> & {
    enable?: boolean
  }
  redis?: Partial<RedisOptions> & {
    enable?: boolean
    log?: boolean
  }
  template?: {
    autoescape?: boolean
    throwOnUndefined?: boolean
    trimBlocks?: boolean
    lstripBlocks?: boolean
    noCache?: boolean
    tags?: {
      blockStart?: string
      blockEnd?: string
      variableStart?: string
      variableEnd?: string
      commentStart?: string
      commentEnd?: string
    }
    extension?: TemplateFileExtension
    encoding?:
      | 'ascii'
      | 'utf8'
      | 'utf-8'
      | 'utf16le'
      | 'ucs2'
      | 'ucs-2'
      | 'base64'
      | 'latin1'
      | 'binary'
      | 'hex'
  }
  log?: {
    level?: LogLevel
    wrapConsole?: boolean
  }
}
