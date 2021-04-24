---
title: Response Context
lang: en-US
meta:
  - name: keywords
    content: ZenTS guide tutorial documentation http request framework mvc TypeScript
---

# {{ $frontmatter.title }}

<GuideHeader guide="response">
  [[toc]]
</GuideHeader>

::: warning
This guide assumes you already familiar with controllers and controller actions. If not, read the [controller guide](./controllers.md) first please.
:::

## Introduction

The response context represents the HTTP response that a controller action will send as a result of a HTTP request. The result response could be everything, from a rendered HTML template code, a JSON response or a file download. This guide will teach you how to handle responses in a ZenTS application.

## Injecting the response context

The response context can be injected into a controller action using the `@response` or `@res` annotation:

```typescript
public async index(@response res: Response) {
  // "res" is the response context

  return await this.render("index");
}
```

The response context contains various useful methods, which are explained in the following chapters.

## Controller action results

The return value of an action method is significant, because it will be used as response body. This means, that a controller action is intelligent enough to turn a return value into a response (e.g. by setting the correct response body, header values and / or status code).

### HTML / Template response

A common example is a controller action that returns a webpage (rendered HTML code), which is done by calling `this.render()` in a controller action:

```typescript
@get("/")
public async index() {
  return await this.render("index");
}
```

This will return the rendered `index.njk` template, set the response type to **_html_** and the status code to **_200_**.

::: tip
Head over to the [template guide](./templates.md) to learn more about rendering and creating templates.
:::

### JSON response

Another common examples are REST APIs or sequential AJAX calls from a SPA which returns a JSON response as response body. ZenTS supports JSON responses out-of-the-box when a controller action is returning a JSON serialize-able value (an _object_ or _array_, strings or booleans aren't converted to a JSON response):

:::: tabs
::: tab JSON object

```typescript
public index() {
  return {
    foo: 'bar'
  }
}
```

:::
::: tab JSON array

```typescript
public index() {
  return ['foo', 'bar', 'baz']
}
```

:::
::::

Both examples will send a JSON response as body, set the response type to `json` and status code to `200`.

## Sending manual responses

Sometimes the automatically action result handling isn't suite your needs. ZenTS exposes a `@response` annotation, that can be used to send manual responses:

```typescript
public index(@response res: Response) {
  res
    .html('<html><body>Hello World</body></html>')
    .setStatusCode(201)
    .send()
}
```

The `setStatusCode()` sets a custom response status code. There is also a `getStatusCode()`, that returns the current status code. It's also possible to set the status code of a controller action result (as described above). Just call `setStatusCode()` before returning a value from the controller action to overwrite the automatically set status code.

The `@response` annotation exposes five different methods for returning various data of different types:

- `res.html(html: string)`: Send a HTML response body.
- `res.json(data: JsonValue)`: Send a JSON response body.
- `res.text(text: string)`: Send a plain text response body.
- `res.buffer(buffer: Buffer)`: Send a Node.js [Buffer](https://nodejs.org/api/buffer.html) response.
- `res.stream(stream: Stream)`: Send a Node.js [Stream](https://nodejs.org/api/stream.html) response.

Most methods of the response context are also chain-able:

```typescript
public index(@response res: Response) {
  const myResponse = res
    .setStatusCode(201)
    .setStatusMessage('Created')
    .json({
      foo: 'bar'
    })

  // some more code...

  myResponse.send()
}
```

::: danger
Be aware, that when you call various body response methods (e.g. first `res.html()` and then `res.json()`) only the last one will be returned to the client.
:::

## Working with response header

Working with the response header is similar to the request header, only that the response header is exposed under the `res.header` object.

### Set a header value

In order to set a header value you call `res.header.set()`:

```typescript
public index(@response res: Response) {
  res.header.set('foo', 'bar')
}
```

ZenTS also supports setting multiple headers in one call using the `multiple()` method by supplying an array of key-value objects as first argument:

```typescript
public index(@response res: Response) {
  res.header.multiple([
    {
      key: 'foo',
      value: 'bar,
    },
    {
      key: 'baz',
      value: 'biz,
    },
  ])
}
```

### Get a header value

To receive a header value that has already been set, use the `get()` method:

```typescript
public index(@response res: Response) {
  res.header.set('foo', 'bar')

  log.info(res.header.get('foo')) // logs "bar"
}
```

All headers can be received by calling `all()` of the `res.header` object:

```typescript
public index(@response res: Response) {
  const headers = res.header.all()

  // do something with headers...
}
```

### Remove a header value

Response header values can be removed by calling the `remove()` method of the `res.header` object:

```typescript
public index(@response res: Response) {
  res.header.set('foo', 'bar')
  log.info(res.header.get('foo')) // logs "bar"
  res.header.remove('foo')
  log.info(res.header.get('foo')) // logs undefined"
}
```

### Set content type header

ZenTS offers a shortcut method to set the _content-type_ header of a response based on a filename, extension or just a specific key (like **_markdown_**):

```typescript
public index(@response res: Response) {
  res.header.setContentType('file.json') // application/json; charset=utf-8'
  res.header.setContentType('markdown') // text/x-markdown; charset=utf-8
  res.header.setContentType('text/html') // text/html; charset=utf-8'
}
```

## URL Redirects

Redirects are commonly used to send the visitor of a webpage to a different URL, for example when a link has changed or is removed over time. A controller action can answer with a redirect response using the `res.redirect()` method:

```typescript
public index(@response res: Response) {
  return res.redirect('/new-location', 302)
}
```

The first argument is the URL, to which the browser will redirect the user. The second one is the status code, which defaults to `302`. Please take a look at [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Redirections) about redirects for more information about the status codes.

:::warning
After a controller action has called `res.redirect()`, the response is send to the client. Therefore you should make sure, that no other response is send anymore (e.g. by returning a different value in the controller action or by calling `res.send()` manually), otherwise an error will be thrown, because Node.js isn't able to send the response again. While not mandatory, it's a good idea to return the value of `res.redirect()` in a controller action (like shown in the example above).
:::

## Handling response errors

In complex web-application things go wrong. For example, in a REST-API your controller action might expect some body parameters the client didn't pass in or in another scenario a given entity ID isn't found in the database (thus resulting in a _404_ error). For these kind of errors, the [HTTP protocol](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) has a wide range of error status codes. You can easily make use of them with the `@error` annotation, which exposes serval methods that directly maps to the HTTP codes in the 4xx-5xx range.

An example is always more helpful then thousand words, so lets take a look at the following code of a controller action that returns a product as _JSON_.

```typescript
import {  Controller, get, error, ResponseError, log } from 'zents';

const products = [
  {
    id: 1,
    name: 'My Product',
  },
  {
    id: 2,
    name: 'My other Product',
  }
]

export default extends Controller {
  @get('/product/:productId')
  public async product(@params params: { id: string }, @error error: ResponseError) {
    const product = products.find((product) => product.id === params.id)

    if(!product) {
      error.notFound('Product not found!')
      return
    }

    return product
  }
}

```

If the user opens http://localhost:3000/product/42 (and there is product with the ID _42_) the controller action will set the status code to _404_ and return this _JSON_ response as body:

```json
{
  "statusCode": 404,
  "error": "Not Found",
  "message": "Product not found!"
}
```

### List of error method

All the listen methods accepts (at least) two optional arguments: `(message?: string, data?: Object | Array) => void`. Some methods, like `methodNotAllowed()`, accept more arguments (e.g. the allowed HTTP verbs in `methodNotAllowed()`). Please take a look at the [API reference](./../../api/) of the individual methods.

This chapter describes the error methods supported by ZenTS. The descriptions of the individual HTTP error codes have been taken directly from Wikipedia ([Source](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes)).

#### List of 4xx errors

- `error.badRequest(message?: string, data?: Object | Array)`:
  The server cannot or will not process the request due to an apparent client error (e.g., malformed request syntax, size too large, invalid request message framing, or deceptive request routing).

- `error.unauthorized(message?: string, data?: Object | Array)`:
  Similar to 403 Forbidden, but specifically for use when authentication is required and has failed or has not yet been provided. The response must include a WWW-Authenticate header field containing a challenge applicable to the requested resource.

- `error.paymentRequired(message?: string, data?: Object | Array)`:
  Reserved for future use. The original intention was that this code might be used as part of some form of digital cash or micro-payment scheme, as proposed, for example, by GNU Taler but that has not yet happened, and this code is not widely used.

- `error.forbidden(message?: string, data?: Object | Array)`:
  The request contained valid data and was understood by the server, but the server is refusing action. This may be due to the user not having the necessary permissions for a resource or needing an account of some sort, or attempting a prohibited action (e.g. creating a duplicate record where only one is allowed). This code is also typically used if the request provided authentication by answering the WWW-Authenticate header field challenge, but the server did not accept that authentication. The request should not be repeated.

- `error.notFound(message?: string, data?: Object | Array)`:
  The requested resource could not be found but may be available in the future. Subsequent requests by the client are permissible.

- `error.methodNotAllowed(message?: string, allowed?: string[], data?: Object | Array)`:
  A request method is not supported for the requested resource; for example, a GET request on a form that requires data to be presented via POST, or a PUT request on a read-only resource.

- `error.notAcceptable(message?: string, data?: Object | Array)`:
  The requested resource is capable of generating only content not acceptable according to the Accept headers sent in the request

- `error.proxyAuthRequired(message?: string, data?: Object | Array)`:
  The client must first authenticate itself with the proxy.

- `error.requestTimeout(message?: string, data?: Object | Array)`:
  The server timed out waiting for the request. According to HTTP specifications: "The client did not produce a request within the time that the server was prepared to wait. The client MAY repeat the request without modifications at any later time.

- `error.conflict(message?: string, data?: Object | Array)`:
  Indicates that the request could not be processed because of conflict in the current state of the resource, such as an edit conflict between multiple simultaneous updates

- `error.gone(message?: string, data?: Object | Array)`:
  Indicates that the resource requested is no longer available and will not be available again. This should be used when a resource has been intentionally removed and the resource should be purged. Upon receiving a 410 status code, the client should not request the resource in the future. Clients such as search engines should remove the resource from their indices. Most use cases do not require clients and search engines to purge the resource, and a "404 Not Found" may be used instead.

- `error.lengthRequired(message?: string, data?: Object | Array)`:
  The request did not specify the length of its content, which is required by the requested resource.

- `error.preconditionFailed(message?: string, data?: Object | Array)`:
  The server does not meet one of the preconditions that the requester put on the request header fields.

- `error.payloadTooLarge(message?: string, data?: Object | Array)`:
  The request is larger than the server is willing or able to process.

- `error.uriTooLong(message?: string, data?: Object | Array)`:
  The URI provided was too long for the server to process. Often the result of too much data being encoded as a query-string of a GET request, in which case it should be converted to a POST request.

- `error.unsupportedMediaType(message?: string, data?: Object | Array)`:
  The request entity has a media type which the server or resource does not support. For example, the client uploads an image as image/svg+xml, but the server requires that images use a different format

- `error.rangeNotSatisfiable(message?: string, data?: Object | Array)`:
  The client has asked for a portion of the file (byte serving), but the server cannot supply that portion. For example, if the client asked for a part of the file that lies beyond the end of the file

- `error.expectationFailed(message?: string, data?: Object | Array)`:
  The server cannot meet the requirements of the Expect request-header field.

- `error.teapot(message?: string, data?: Object | Array)`:
  No :coffee: or :beer: allowed here, only :tea:.

- `error.misdirected(message?: string, data?: Object | Array)`:
  The request was directed at a server that is not able to produce a response.

- `error.badData(message?: string, data?: Object | Array)`:
  The request was well-formed but was unable to be followed due to semantic errors.

- `error.locked(message?: string, data?: Object | Array)`:
  The resource that is being accessed is locked.

- `error.failedDependency(message?: string, data?: Object | Array)`:
  The request failed because it depended on another request and that request failed.

- `error.tooEarly(message?: string, data?: Object | Array)`:
  Indicates that the server is unwilling to risk processing a request that might be replayed.

- `error.preconditionRequired(message?: string, data?: Object | Array)`:
  The origin server requires the request to be conditional. Intended to prevent the 'lost update' problem, where a client GETs a resource's state, modifies it, and PUTs it back to the server, when meanwhile a third party has modified the state on the server, leading to a conflict.

- `error.tooManyRequests(message?: string, data?: Object | Array)`:
  The user has sent too many requests in a given amount of time. Intended for use with rate-limiting schemes.

- `error.illegal(message?: string, data?: Object | Array)`:
  A server operator has received a legal demand to deny access to a resource or to a set of resources that includes the requested resource.

#### List of 5xx errors

- `error.internal(message?: string, data?: Object | Array)`:
  A generic error message, given when an unexpected condition was encountered and no more specific message is suitable

- `error.notImplemented(message?: string, data?: Object | Array)`:
  The server either does not recognize the request method, or it lacks the ability to fulfil the request. Usually this implies future availability (e.g., a new feature of a web-service API).

- `error.badGateway(message?: string, data?: Object | Array)`:
  The server was acting as a gateway or proxy and received an invalid response from the upstream server.

- `error.serviceUnavailable(message?: string, data?: Object | Array)`:
  The server cannot handle the request (because it is overloaded or down for maintenance). Generally, this is a temporary state.

- `error.gatewayTimeout(message?: string, data?: Object | Array)`:  
  The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.

## Accessing raw response object

The raw response object supplied by [Node.js http module](https://nodejs.org/api/http.html) is exposed under the `res.nodeRes` property. Working with the raw response object can be useful, if you want to do something with it that is currently not supported by ZenTS. Be aware, that when you modifying some parts of the raw response object, e.g. the header, these modifications aren't automatically applied to the corresponding ZenTS controller action context. In generally, you should avoid modifying the `res.nodeRes` object directly and use their ZenTS counterparts when ever possible.

## Next steps

Congratulations! You just learned how to handle responses in ZenTS. You should now be familiar with the most important parts of the controller functionalities.

Continue by reading the [routing guide](./routing) to master setting up endpoints in ZenTS. After that, you should consider learning more about [templates](./templates.md) and [database management](./database.md).

- [Routing guide](./routing.md)
- [Template guide](./templates.md)
- [Database guide](./database.md)
