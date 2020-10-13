import type { Class, JsonObject, Promisable } from 'type-fest'
import type {
  ControllerMethodReturnType,
  ErrorResponseData,
  HTTPMethod,
  HeaderValue,
  LogLevel,
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
import type { SecurityProvider } from '../security/SecurityProvider'
import type { ServiceFactory } from '../service/ServiceFactory'
import type { Session as SessionClass } from '../security/Session'
import type { SessionFactory } from '../security'

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
  authProvider?: string
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

export interface IncomingRequestAuthenticateResult {
  isAuth: boolean
  securityProvider?: SecurityProvider
  user?: { [key: string]: string }
  sessionId?: string
}

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

export interface JWTOptions {
  [key: string]: string | string[]
}

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
  session: SessionFactory
}

export interface RequestConfigController {
  type: REQUEST_TYPE.CONTROLLER
  controllerKey: string
  controllerMethod: string
  authProvider?: string
  loadedUser?: RequestConfigControllerUser
}

export interface RequestConfigControllerUser {
  provider: string
  user: { [key: string]: string }
  sessionId: string
}

export interface RequestConfigSecurity {
  type: REQUEST_TYPE.SECURITY
  action: SECURITY_ACTION
  provider: SecurityProvider
}

// ---- S

export interface SecurityProviderAuthorizeResponse {
  isAuth: boolean
  user?: { [key: string]: string }
  sessionId?: string
}

export interface SecurityProviderOption {
  name?: string
  algorithm?: 'bcrypt' | 'argon2id'
  argon?: {
    memLimit?: number
    opsLimit?: number
  }
  bcrypt?: {
    saltRounds?: number
  }
  store?:
    | {
        type: 'redis'
        prefix?: string
        keepTTL?: boolean
      }
    | {
        type: 'database'
      }
    | {
        type: 'file'
      }
  entity?: string
  table?: {
    identifierColumn?: string
    passwordColumn?: string
  }
  fields?: {
    username?: string
    password?: string
  }
  url?: {
    login?: string
    logout?: string
  }
  redirect?: {
    login?: string
    logout?: string
    failed?: string
    forbidden?: string
  }
  expire?: number | string
  responseType?: 'json' | 'redirect'
}

export interface SecurityProviderReflectionMetadata {
  index: number
  propertyKey: string
  target: Class
  name: string
}

export interface SecurityStrategy {
  hasToken(context: Context): boolean
  getToken(context: Context): string | false
  setToken(context: Context, token: string): void
}

export interface Session<U = { [key: string]: string }> extends SessionClass {
  user: U
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

export interface TokenData {
  provider: string
  userId: string
  sessionId: string
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
    redirectBodyType?: 'html' | 'text' | 'none'
  }
  security?: {
    enable?: boolean
    strategy?: 'header' | 'cookie' | 'hybrid'
    cookieKey?: string
    secretKey?: string
    providers?: SecurityProviderOption[]
    token?: {
      algorithm?: 'HS256' | 'HS384' | 'HS512'
      audience?: string | string[]
      issuer?: string
      subject?: string
      jwtid?: string
      keyid?: string
    }
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
