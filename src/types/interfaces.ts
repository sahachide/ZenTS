import type { Class, JsonObject, Promisable } from 'type-fest'
import type {
  ControllerMethodReturnType,
  ErrorResponseData,
  HTTPMethod,
  HeaderValue,
  LogLevel,
  MailOptions,
  TemplateFileExtension,
  TemplateFiltersMap,
  ValidationSchema,
} from './types'
import type { REPOSITORY_TYPE, REQUEST_TYPE, SECURITY_ACTION } from './enums'

import type { ConnectionOptions } from 'typeorm'
import type { Context as ContextClass } from '../http/Context'
import type { ControllerFactory } from '../controller/ControllerFactory'
import type { EmailFactory } from '../email/EmailFactory'
import type { HtmlToTextOptions } from 'html-to-text'
import type { RedisOptions } from 'ioredis'
import type { Request } from '../http/Request'
import type { RequestFactory } from '../http/RequestFactory'
import type { RouterFactory } from '../router/RouterFactory'
import type { SecurityProvider } from '../security/SecurityProvider'
import type { ServiceFactory } from '../service/ServiceFactory'
import type { Session as SessionClass } from '../security/Session'
import type { SessionFactory } from '../security'
import type { ConnectionOptions as TLSConnectionOptions } from 'tls'

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
  expire?: number | string
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
export interface CommonJSZenModule<T> {
  [key: string]: Class<T>
}

export interface CosmicConfigResult {
  config: ZenConfig
  filepath: string
  isEmpty?: boolean
}

// ---- D

export interface DatabaseSessionStoreAdapterEntity {
  id: string
  data: string
  created_at: Date
  expired_at: Date
}

// ---- E

export interface ErrorResponsePayload {
  [key: string]: any
  statusCode: number
  error: string
  message: string
  data?: ErrorResponseData
}

// ---- F

export interface File {
  size: number
  path: string
  name: string
  type: string
  lastModifiedDate?: Date
  hash?: string
  // eslint-disable-next-line @typescript-eslint/ban-types
  toJSON(): Object
}

export interface FileSessionStoreAdapterFileContent {
  sessionId: string
  createdAt: string
  expiredAt: string
  data: Record<string, unknown>
}

// ---- G

export interface GenericControllerInstance {
  [key: string]: (...injected: unknown[]) => ControllerMethodReturnType
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

export interface MailResponse {
  messageId?: string
  envelope: Record<string, unknown>
  accepted: string[]
  rejected: string[]
  pending: string[]
  response: string
}

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
    [key: string]: File | File[]
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
  email: EmailFactory
}

export interface RequestValidationError {
  message: string
  path: (string | number)[]
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

export interface Route {
  method: HTTPMethod
  path: string
  controllerMethod?: string
  authProvider?: string
  validationSchema?: ValidationSchema
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
        entity: string
      }
    | {
        type: 'file'
        prefix?: string
        folder: string
      }
  entity: string
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

export interface SecurityProviderOptionEntities {
  user: Class
  dbStore?: Class
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

export interface SessionStoreAdapter {
  create(sessionId: string): Promise<void>
  load(sessionId: string): Promise<Record<string, unknown>>
  persist(sessionId: string, data: Record<string, unknown>): Promise<void>
  remove(sessionId: string): Promise<void>
  has(sessionId: string): Promise<boolean>
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
    email?: string
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
  email?: {
    enable?: boolean
    engine?: 'mjml' | 'nunjucks' | 'plain'
    mailOptions?: Partial<MailOptions>
    htmlToText?: HtmlToTextOptions & {
      enable?: boolean
    }
    host?: string
    port?: number
    auth?: any
    secure?: boolean
    ignoreTLS?: boolean
    requireTLS?: boolean
    opportunisticTLS?: boolean
    name?: string
    localAddress?: string
    connectionTimeout?: number
    greetingTimeout?: number
    socketTimeout?: number
    transactionLog?: boolean
    debug?: boolean
    authMethod?: string
    tls?: TLSConnectionOptions
    url?: string
    service?: string
    pool?: boolean
    maxConnections?: number
    maxMessages?: number
    rateDelta?: number
    rateLimit?: number
    mjml?: {
      fonts?: {
        [key: string]: string
      }
      keepComments?: boolean
      minify?: boolean
      minifyOptions?: {
        collapseWhitespace?: boolean
        minifyCSS?: boolean
        removeEmptyAttributes?: boolean
      }
      validationLevel?: 'strict' | 'soft' | 'skip'
      filePath?: string
      mjmlConfigPath?: string
      useMjmlConfigOptions?: boolean
      juicePreserveTags?: { [index: string]: { start: string; end: string } }
      juiceOptions?: any
      preprocessors?: Array<(xml: string) => string>
    }
  }
  log?: {
    level?: LogLevel
    wrapConsole?: boolean
  }
}
