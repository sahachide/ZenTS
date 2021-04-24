import {
  Context,
  Controller,
  get,
  params,
  post,
  query,
  request,
  Request,
  validate,
  validation,
  body,
} from '../../../../../src'

import type { QueryString } from '../../../../../src/types/interfaces'

export default class extends Controller {
  @get('/request-test/:foo/:bar')
  public paramsTest(@params params: { foo?: string; bar?: string; paramsSetter?: string }) {
    const foo = params.foo
    const bar = params.bar

    params = {
      paramsSetter: 'test',
    }

    return {
      foo,
      bar,
      paramsSetter: params.paramsSetter,
    }
  }

  @get('/request-test-queryparams')
  public querystringTest(
    @query
    query: {
      [key: string]: string
    },
    @request req: Request,
  ) {
    const parsed: {
      [key: string]: string | QueryString | string[] | QueryString[]
    } = {
      foo: query.foo,
      bar: query.bar,
      search: req.search,
      querystring: req.querystring,
      querystringSetter: null,
    }

    req.querystring = 'querystringSetter=foo'
    parsed.querystringSetter = req.query.querystringSetter
    req.querystring = ''
    parsed.resetQuerystringSearch = req.search

    return parsed
  }

  @get('/url-test')
  public urlTest(@request req: Request) {
    const requestData = {
      requestUrl: req.url,
      pathname: req.pathname,
      httpMethod: req.httpMethod,
      httpVersion: req.httpVersion,
      httpVersionMajor: req.httpVersionMajor,
      httpVersionMinor: req.httpVersionMinor,
    }

    req.url = '/rewrite'
    req.httpMethod = 'POST'
    req.pathname = ''

    const setterTests = {
      requestUrl: req.url,
      pathname: req.pathname,
      httpMethod: req.httpMethod,
    }

    return {
      request: requestData,
      setterTests,
    }
  }

  @post('/request-test-validate')
  @validation(
    validate.object({
      foo: validate.string().required().alphanum().min(3).max(30),
      bar: validate.string().required().alphanum().min(3).max(30),
    }),
  )
  public validationTest(
    @body
    { foo, bar }: { foo: string; bar: string },
  ) {
    return { foo, bar }
  }
}
