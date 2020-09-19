import type { ErrorResponseData } from '../types/types'
import type { ErrorResponsePayload } from '../types/interfaces'
import type { Response } from './Response'

export class ResponseError {
  constructor(protected res: Response) {}
  public badRequest(message: string = 'Bad Request', data?: ErrorResponseData): void {
    this.response({
      statusCode: 400,
      error: 'Bad Request',
      message,
      data,
    })
  }
  public unauthorized(message: string = 'Unauthorized', data?: ErrorResponseData): void {
    this.response({
      statusCode: 401,
      error: 'Unauthorized',
      message,
      data,
    })
  }
  public paymentRequired(message: string = 'Payment Required', data?: ErrorResponseData): void {
    this.response({
      statusCode: 402,
      error: 'Payment Required',
      message,
      data,
    })
  }
  public forbidden(message: string = 'Forbidden', data?: ErrorResponseData): void {
    this.response({
      statusCode: 403,
      error: 'Forbidden',
      message,
      data,
    })
  }
  public notFound(message: string = 'Not Found', data?: ErrorResponseData): void {
    this.response({
      statusCode: 404,
      error: 'Not Found',
      message,
      data,
    })
  }
  public methodNotAllowed(
    message: string = 'Forbidden',
    allow?: string[],
    data?: ErrorResponseData,
  ): void {
    if (Array.isArray(allow)) {
      this.res.header.set('Allow', allow.map((a) => a.toUpperCase()).join(', '))
    }

    this.response({
      statusCode: 405,
      error: 'Method Not Allowed',
      message,
      data,
    })
  }
  public notAcceptable(message: string = 'Not Acceptable', data?: ErrorResponseData): void {
    this.response({
      statusCode: 406,
      error: 'Bad Request',
      message,
      data,
    })
  }
  public proxyAuthRequired(
    message: string = 'Proxy Authentication Required',
    data?: ErrorResponseData,
  ): void {
    this.response({
      statusCode: 407,
      error: 'Proxy Authentication Required',
      message,
      data,
    })
  }
  public requestTimeout(message: string = 'Request Timeout', data?: ErrorResponseData): void {
    this.response({
      statusCode: 408,
      error: 'Request Timeout',
      message,
      data,
    })
  }
  public conflict(message: string = 'Conflict', data?: ErrorResponseData): void {
    this.response({
      statusCode: 409,
      error: 'Conflict',
      message,
      data,
    })
  }
  public gone(message: string = 'Gone', data?: ErrorResponseData): void {
    this.response({
      statusCode: 410,
      error: 'Gone',
      message,
      data,
    })
  }
  public lengthRequired(message: string = 'Length Required', data?: ErrorResponseData): void {
    this.response({
      statusCode: 411,
      error: 'Length Required',
      message,
      data,
    })
  }
  public preconditionFailed(
    message: string = 'Precondition Failed',
    data?: ErrorResponseData,
  ): void {
    this.response({
      statusCode: 412,
      error: 'Precondition Failed',
      message,
      data,
    })
  }
  public payloadTooLarge(message: string = 'Payload Too Large', data?: ErrorResponseData): void {
    this.response({
      statusCode: 413,
      error: 'Payload Too Large',
      message,
      data,
    })
  }
  public uriTooLong(message: string = 'Request-URI Too Large', data?: ErrorResponseData): void {
    this.response({
      statusCode: 414,
      error: 'Request-URI Too Large',
      message,
      data,
    })
  }
  public unsupportedMediaType(
    message: string = 'Unsupported Media Type',
    data?: ErrorResponseData,
  ): void {
    this.response({
      statusCode: 415,
      error: 'Unsupported Media Type',
      message,
      data,
    })
  }
  public rangeNotSatisfiable(
    message: string = 'Requested Range Not Satisfiable',
    data?: ErrorResponseData,
  ): void {
    this.response({
      statusCode: 416,
      error: 'Requested Range Not Satisfiable',
      message,
      data,
    })
  }
  public expectationFailed(message: string = 'Expectation Failed', data?: ErrorResponseData): void {
    this.response({
      statusCode: 417,
      error: 'Expectation Failed',
      message,
      data,
    })
  }
  public teapot(message: string = "I'm a Teapot", data?: ErrorResponseData): void {
    this.response({
      statusCode: 418,
      error: "I'm a Teapot",
      message,
      data,
    })
  }
  public misdirected(message: string = 'Misdirected', data?: ErrorResponseData): void {
    this.response({
      statusCode: 421,
      error: 'Misdirected',
      message,
      data,
    })
  }
  public badData(message: string = 'Bad Data', data?: ErrorResponseData): void {
    this.response({
      statusCode: 422,
      error: 'Bad Request',
      message,
      data,
    })
  }
  public locked(message: string = 'Locked', data?: ErrorResponseData): void {
    this.response({
      statusCode: 423,
      error: 'Locked',
      message,
      data,
    })
  }
  public failedDependency(message: string = 'Failed Dependency', data?: ErrorResponseData): void {
    this.response({
      statusCode: 424,
      error: 'Failed Dependency',
      message,
      data,
    })
  }
  public tooEarly(message: string = 'Too Early', data?: ErrorResponseData): void {
    this.response({
      statusCode: 425,
      error: 'Too Early',
      message,
      data,
    })
  }
  public preconditionRequired(
    message: string = 'Precondition Required',
    data?: ErrorResponseData,
  ): void {
    this.response({
      statusCode: 428,
      error: 'Precondition Required',
      message,
      data,
    })
  }
  public tooManyRequests(message: string = 'Too Many Requests', data?: ErrorResponseData): void {
    this.response({
      statusCode: 429,
      error: 'Too Many Requests',
      message,
      data,
    })
  }
  public illegal(
    message: string = 'Unavailable For Legal Reasons',
    data?: ErrorResponseData,
  ): void {
    this.response({
      statusCode: 451,
      error: 'Unavailable For Legal Reasons',
      message,
      data,
    })
  }
  public internal(message: string = 'Internal Server Error', data?: ErrorResponseData): void {
    this.response({
      statusCode: 500,
      error: 'Internal Server Error',
      message,
      data,
    })
  }
  public notImplemented(message: string = 'Not Implemented', data?: ErrorResponseData): void {
    this.response({
      statusCode: 501,
      error: 'Not Implemented',
      message,
      data,
    })
  }
  public badGateway(message: string = 'Bad Gateway', data?: ErrorResponseData): void {
    this.response({
      statusCode: 502,
      error: 'Bad Gateway',
      message,
      data,
    })
  }
  public serviceUnavailable(
    message: string = 'Service Unavailable',
    data?: ErrorResponseData,
  ): void {
    this.response({
      statusCode: 503,
      error: 'Service Unavailable',
      message,
      data,
    })
  }
  public gatewayTimeout(message: string = 'Gateway Time-out', data?: ErrorResponseData): void {
    this.response({
      statusCode: 504,
      error: 'Gateway Time-out',
      message,
      data,
    })
  }
  protected response(payload: ErrorResponsePayload): void {
    this.res.setStatusCode(payload.statusCode).json<ErrorResponsePayload>(payload).send()
  }
}
