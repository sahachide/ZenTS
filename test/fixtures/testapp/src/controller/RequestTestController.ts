import { Context, Controller, get, post, put } from '../../../../../src'

import type { QueryString } from '../../../../../src/types/interfaces'

export default class extends Controller {
  @get('/request-test/:foo/:bar')
  public paramsTest({ req }: Context) {
    const foo = req.params.foo
    const bar = req.params.bar

    req.params = {
      paramsSetter: 'test',
    }

    return {
      foo,
      bar,
      paramsSetter: req.params.paramsSetter,
    }
  }

  @get('/request-test-queryparams')
  public querystringTest({ req }: Context) {
    const parsed: {
      [key: string]: string | QueryString | string[] | QueryString[]
    } = {
      foo: req.query.foo,
      bar: req.query.bar,
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
  public urlTest({ req }: Context) {
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

    console.log({
      request: requestData,
      setterTests,
    })

    return {
      request: requestData,
      setterTests,
    }
  }
}
