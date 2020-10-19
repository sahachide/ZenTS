---
title: Request Context
lang: en-US
meta:
  - name: keywords
    content: ZenTS guide tutorial documentation http request framework mvc TypeScript
---

# {{ $frontmatter.title }}

<GuideHeader guide="request">
  [[toc]]
</GuideHeader>

::: warning
This guide assumes you already familiar with controllers and controller actions. If not, read the [controller guide](./controllers.md) first.
:::

## Introduction

A complex (or simple) web-application interacts with the user frequently. When the user sends a contact form, makes a payment, downloads a file or even just opens a specific webpage, the server will receive the request and process in a controller action. As a developer, you need a simple and fast way to access the data (e.g. form data) send by the user. For this purpose, ZenTS passes a so-called **action context** as first argument to every controller action. The request object is part of the **action context** and is described in this guide.

## Accessing the request context

The request context is part of the **action context**, which is passed as first argument to every controller action:

```typescript
public async index({ req }: Context) {
  // req is the request context

  return await this.render("index");
}
```

The request context contains various useful datasets which are explained in the following chapters.

## Route parameters

A common way to fetch IDs (e.g. a product ID) from a user is adding it aa a route parameter. These parameters are defined via route annotation:

```typescript
@get("/product/:productId")
public productDetail({ req }: Context) {
  log.info(req.params.productId);
}
```

You can access the defined route parameters in the `req.params.productId`. If the user call this controller action with `/product/42` the value will be `42`.

A route annotation can also hold more then just one parameter:

```typescript
@get("/compare/:productId1/:product2")
public compareProducts({ req }: Context) {
  // suppose user calls this action with /compare/123/456
  log.info(req.params.productId1); // logs "123"
  log.info(req.params.productId2); // logs "456"
}
```

::: tip
Head over to the [routing guide](./routing.md) to learn more about defining URLs in your application.
:::

Since routing parameters are accessed frequently, they are also first-class citizens of the **controller action context**. So instead of accessing parameters via `req.params`, you just can use `params` as deconstructed value from the context:

```typescript
@get("/product/:productId")
public async productDetail({ req, params }: Context) {
  log.info(params.productId === req.params.productId); // logs "true"
}
```

ZenTS won't cast your routing parameters to a specific type. It is up to the application code to decide if a passed routing parameter is considered valid or not. All values in the `params` object will be from type `string`. :

```typescript
export interface IncomingParams {
  [key: string]: string
}
```

## URL querystring

The querystring (also known as [search](https://developer.mozilla.org/en-US/docs/Web/API/URL/search) part of the URL) is, like the routing parameters, part of the URL namely everything what comes after the `?` part of a URL. The framework parses the querystring for you and exposes the result as `req.query` under the **controller action context**.

The querystring is parsed as plain object, for example if the user opens http://localhost:8080/catalog/?foo=bar:

```typescript
@get("/catalog")
public catalog({ req }: Context) {
  log.info(req.query); // logs { foo: 'bar' }
  log.info(req.query.foo); // logs "bar"
}
```

Similar to the routing parameters the query object is also a first-class citizen of the action context, so you can access it directly like this:

```typescript
@get("/catalog")
public catalog({ query }: Context) {
  log.info(query.foo); // logs "bar"
}
```

### Parsing nested objects

Creating querystrings as nested objects is also possible by surrounding the name of the sub-keys with square brackets `[]`.

```typescript
@get("/catalog")
public catalog({ query }: Context) {
  // open: http://localhost:8080/catalog/?foo[bar]=baz

  log.info(query); // logs { foo: { bar: 'baz' } }
  log.info(query.foo); // logs { bar: 'baz' }
  log.info(query.foo.bar); // logs "baz"
}
```

::: tip
Make sure to check if a variable exists (like `req.query.foo.bar`) before accessing it. Querystrings can be easily omitted by user or clients. It's a good advice to have some default values for them in case a querystring (or part of it) is missing.
:::

Objects can even be nested further:

```typescript
@get("/catalog")
public catalog({ query }: Context) {
  // open: http://localhost:8080/catalog/?foo[bar][baz]=nested

  log.info(query); // logs { foo: { bar: { baz: 'nested' } } }
  log.info(query.foo.bar.baz); // logs "nested"
}
```

::: danger
The default limit of nested objects is _5_. This limit can be overwritten in the config, but keep in mind that the number should be reasonably small, otherwise your application might be vulnerable to attacks. You can read more about configuration in [this guide](./../../configuration.md).
:::

It's also possible to use the dot notation for constructing nested objects. You must enable this feature in the projects configuration file:

```json
{
  "web": {
    "querystring": {
      "allowDots": true
    }
  }
}
```

```typescript
@get("/catalog")
public catalog({ query }: Context) {
  // open: http://localhost:8080/catalog/?foo.bar=baz

  log.info(query); // logs { foo: { bar: 'baz' } }
}
```

### Parsing arrays

Arrays can be constructed from the querystring in a similar way like nested objects, using the `[]` notation (but this time without key(s)):

```typescript
@get("/catalog")
public catalog({ query }: Context) {
  // open: http://localhost:8080/catalog/?foo[]=bar&foo[]=baz

  log.info(query); // logs { foo: ['bar', 'baz'] }
  log.info(query.foo); // logs ['bar', 'baz']
}
```

Indexes can also be supplied:

```typescript
@get("/catalog")
public catalog({ query }: Context) {
  // open: http://localhost:8080/catalog/?foo[1]=bar&foo[0]=baz

  log.info(query); // logs { foo: ['baz', 'bar'] }
}
```

Keep in mind that specifying indices in an array is limited to a maximum of `20`. Any array members with an index of greater than 20 will instead be converted to an object with the index as the key.

### Using a different delimiter

The default delimiter (`&`) can be changed by setting the `web.querystring.delimiter` option:

```json
{
  "web": {
    "querystring": {
      "delimiter": ";"
    }
  }
}
```

```typescript
@get("/catalog")
public catalog({ query }: Context) {
  // open: http://localhost:8080/catalog/?a=b;c=d

  log.info(query); // logs { a: 'b', c: 'd' }
}
```

Multiple delimiters are also supported by supplying a `RegEx`:

```typescript
module.exports = {
  // ...
  web: {
    querystring: {
      delimiter: /[;,]/,
    },
  },
}
```

::: warning
This is only supported when using a .js config file. Please refer to the [configuration guide](./../../configuration.md) for more information.
:::

```typescript
@get("/catalog")
public catalog({ query }: Context) {
  // open: http://localhost:8080/catalog/?a=b;c=d,e=f

  log.info(query); // logs { a: 'b', c: 'd', e: 'f' }
}
```

### Accessing the raw search string

The raw URL search string can also be accessed as a child property of the `request` context:

```typescript
@get("/catalog")
public catalog({ req }: Context) {
  // open http://localhost:8080/catalog/?foo=bar
  log.info(req.search); // logs ?foo=bar
}
```

### And more...

ZenTS use the awesome [qs package](https://www.npmjs.com/package/qs) for parsing the querystring. The package contains a lot of options and is well [documented](https://www.npmjs.com/package/qs). All options are also supported by ZenTS (see [configuration guide](./../../configuration.md)).

## Request body

Some controller actions need more data that can be delivered reasonable by modifying the URL (with querystrings or route parameters). For example, when a user sends a contact form on a webpage or a client calling an API endpoint with a JSON payload, this data is usually transmitted inside the request body. Not all http methods have a body, `GET`, `HEAD` or `DELETE` requests normally don't contain a request body. In contrast to the `POST` or `PUT` http methods, which are likely to contain some body data.

The body can be accessed in two ways:

```typescript
@post("/product")
public addProduct({ req, body }: Context) {
  log.info(req.body);

  // using the body shortcut from the Context. This is a reference to req.body.
  log.info(body);
}
```

The `body` will be automatically converted to an object, no matter if the sends a multi-part form, a JSON or a urlencoded form.

### Receiving form data

A classic example where request body data is send over the wire is a good old contact form:

```html
<form action="/contact-form" method="post">
  <div>Name: <input type="text" name="name" /></div>
  <div>E-Mail: <input type="text" name="email" /></div>
  <div>Message: <input type="text" name="message" /></div>
  <input type="submit" value="Send" />
</form>
```

This is a pretty straight forward HTML form with some standard text-fields. The controller action implementation could look like this:

```typescript
@post("/contact-form")
public submitContactForm({ body }: Context) {
  log.info(body) /* logs {
    name: 'John Doe',
    email: 'john@example.com',
    message: 'Lorem ipsum'
  } */
}
```

### Receiving JSON

Receiving a JSON body is similar to standard form data:

```shell
curl --request POST \
  --url http://localhost:8000/product \
  --header 'content-type: application/json' \
  --data '{
	  "name": "MyProduct",
	  "description": "Lorem ipsum",
	  "price": 2499
  }'
```

The controller action look like this:

```typescript
@post("/product")
public createProduct({ body }: Context) {
  log.info(body) /* logs {
    name: 'MyProduct',
    description: 'Lorem ipsum',
    price: 2499
  }
  */
}
```

As you see, handling body data is pretty easy in ZenTS.

### And more...

ZenTS use the great and fast [formidable package](https://www.npmjs.com/package/formidable) for parsing the request body. The package contains a lot of options and is well [documented](https://www.npmjs.com/package/formidable). All options are also supported by ZenTS (see [configuration guide](./../../configuration.md)).

## Working with the HTTP request header

Sometimes you may need to access the HTTP headers send from a client. The headers are exposed as `req.header` inside the action context.

### Get a header value

Accessing a specific header field by calling `req.header.get(key: string)`:

```typescript
public index({ req }: Context) {
  log.info(req.header.get('accept')); // logs for example: 'text/html,application/xhtml+xml,application/xml'
}
```

In addition, the `get()` method has a type generic, which you can use to cast the correct type for the header value (either `string` or `string[]`)

```typescript
public index({ req }: Context) {
  const example = req.header.get<string>('example')

  log.info(typeof example) // logs "string"
}
```

To return all request headers, you can call `req.header.all()`, which returns an iterable iterator:

```typescript
public index({ req }: Context) {
  for(const [key, value] of req.header.all()) {
    log.info(`${key} = ${value}`)
  }
}
```

A way to check for the existing of a header key is the `has()` method:

```typescript
public index({ req }: Context) {
  if(req.header.has('does_not_exist')) {
    log.info("Header exists")
  } else {
    log.info("Header doesn't exists")
  }

  // logs "Header doesn't exists"
}
```

### Set a header value

It's also possible to set new header key / value pairs. This can be useful when you writing plugins or modifying the request header in a middleware:

```typescript
public index({ req }: Context) {
  req.header.set('foo', 'bar')
}
```

There is even more to request headers, e.g. some shortcut methods like `getHost()`. You can read more about them in the [API reference](./../api/).

### Remove a header value

Request header values can be removed by calling the `remove()` method on the `req.header` object:

```typescript
public index({ req }: Context) {
  req.header.set('foo', 'bar')
  log.info(req.header.get('foo')) // logs "bar"
  req.header.remove('foo')
  log.info(req.header.get('foo')) // logs undefined"
}
```

## Accessing raw request object

The raw request object supplied by [Node.js http module](https://nodejs.org/api/http.html) is exposed under the `req.nodeReq` property. Working with the raw request object can be useful if you want to do something with it that is currently not supported by ZenTS. Be aware that when you modifying some parts of the raw request object, e.g. the header, these modifications are not automatically applied to the corresponding ZenTS controller action context. In generally you should avoid modifying the `req.nodeReq` object directly and use it ZenTS counterparts when ever possible.

## Next steps

Congrats! You just mastered the request context of a controller action. Now you should be able to handle incoming data easily thanks to ZenTS request context. Always keep in mind that you can take a look at the API reference [documentation](./../api/) if you don't know how to access specific data.

Now it's time to learn more about returning a response and how to setup routes properly. The following guides will help you to archive these goals:

- [Request guide](./request.md)
- [Routing guide](./routing.md)
