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

A complex (or simple) web-application interacts with the user frequently. When the user sends a contact form, makes a payment, downloads a file or even just opens a specific webpage, the server will receive the request and process in a controller action. As a developer, you need a simple and fast way to access the data (e.g. form data) send by the user. For this purpose, ZenTS exports request related annotations like `@request` or `@body`, which you can inject into a controller action.

## Injecting the request context

The request context can be injected into a controller action using the `@request` or `@req` annotation (and you might also want to use the `Request` interface exported by ZenTS):

```typescript
public async index(@request req: Request) {
  // req is the request context

  return await this.render("index");
}
```

The request context contains various useful datasets which are explained in the following chapters.

::: tip
The request context can also be accessed by using the `@context` annotation (e.g. `context.request`).
:::

## Route parameters

A common way to fetch IDs (e.g. a product ID) from a user is adding it aa a route parameter. These parameters are defined via route annotation and can be injected into a controller action using the `@request` or `@params` annotation:

```typescript
@get("/product/:productId")
public productDetail(@params params: { productId: string }) {
  log.info(params.productId);
}

// or

@get("/product/:productId")
public productDetail(@request req: Request) {
  log.info(req.params.productId);
}
```

The product ID is available in `req.params.productId` (or `params.productId`). If the user call this controller action with `/product/42`, the value will be `42`.

A route annotation can also hold more then just one parameter:

```typescript
@get("/compare/:productId1/:product2")
public compareProducts(@params params: { productId1: string, productId2: string }) {
  // suppose user calls this action with /compare/123/456
  log.info(params.productId1); // logs "123"
  log.info(params.productId2); // logs "456"
}
```

::: tip
Head over to the [routing guide](./routing.md) to learn more about defining URLs in your application.
:::

## URL querystring

The querystring (also known as [search](https://developer.mozilla.org/en-US/docs/Web/API/URL/search) part of the URL) is, like the routing parameters, part of the URL (namely everything what comes after the `?` part of a URL). The framework parses the querystring for you and exposes the result as `request.query`.

The querystring is parsed as plain object, for example if the user opens http://localhost:8080/catalog/?foo=bar:

```typescript
@get("/catalog")
public catalog(@request req: Request) {
  log.info(req.query); // logs { foo: 'bar' }
  log.info(req.query.foo); // logs "bar"
}
```

Similar to `@params`, there is also a `@query` for direct access to the URL querystring:

```typescript
@get("/catalog")
public catalog(@query query: { foo: string }) {
  log.info(query.foo); // logs "bar"
}
```

### Parsing nested objects

Creating querystrings as nested objects is also possible by surrounding the name of the sub-keys with square brackets `[]`.

```typescript
@get("/catalog")
public catalog(@query query) {
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
public catalog(@query query) {
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
public catalog(@query query) {
  // open: http://localhost:8080/catalog/?foo.bar=baz

  log.info(query); // logs { foo: { bar: 'baz' } }
}
```

### Parsing arrays

Arrays can be constructed from the querystring in a similar way like nested objects, using the `[]` notation (but this time without key(s)):

```typescript
@get("/catalog")
public catalog(@query query) {
  // open: http://localhost:8080/catalog/?foo[]=bar&foo[]=baz

  log.info(query); // logs { foo: ['bar', 'baz'] }
  log.info(query.foo); // logs ['bar', 'baz']
}
```

Indexes can also be supplied:

```typescript
@get("/catalog")
public catalog(@query query) {
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
public catalog(@query query) {
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
public catalog(@query query) {
  // open: http://localhost:8080/catalog/?a=b;c=d,e=f

  log.info(query); // logs { a: 'b', c: 'd', e: 'f' }
}
```

### Accessing the raw search string

The raw URL search string can also be accessed as a child property of the `@request` context:

```typescript
@get("/catalog")
public catalog(@request req: Request) {
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
public addProduct(@request req: Request) {
  log.info(req.body);
}

// or

@post("/product")
public addProduct(@body body) {
  log.info(body);
}
```

The `body` will be automatically converted to an object, no matter if the client sends a multi-part form, a JSON or a urlencoded form.

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
public submitContactForm(@body body: {
  name: string
  email: string
  message: string
}) {
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
public createProduct(@body body: {
  name: string
  description: string
  price: number
}) {
  log.info(body) /* logs {
    name: 'MyProduct',
    description: 'Lorem ipsum',
    price: 2499
  }
  */
}
```

As you see, handling body data is pretty easy in ZenTS.

### Validating request body

Sometimes you want to make sure that the data that is passed to your controller is correct in form and types. For that purpose, ZenTS exposes a `@validation()` annotation. With it, you can write fine-grained validation schemas for the request body of a controller:

```typescript
@post("/product")
@validation(
  validate.object({
    name: validate.string().required().alphanum().min(5).max(50),
    description: validate.string().max(255),
    price: validate.number().integer().positive().required().limit(9999)
  }),
)
public createProduct(@body body: {
  name: string
  description: string
  price: number
}) {}
```

Let's take a look what is happening here:

- We added a `@validation()` annotation to our `@post` route. The validation is build with the help of the `validate` method. The `@validation()` and `validate` method are both exposed by the `zents` package.
- With the `validate` method, we got a lot of useful functions that can describe how the request body should look like. In the above example the request is only accepted when `name` is a string between 5-50 characters long and only contains alphanumeric characters. Furthermore if the `name` property is missing in the request, it will be aborted because it's marked as required. `description` on the other hand is optional and can be maximal 255 characters long. `price` is required and has to be a positive integer with a maximum of `9999`.

You don't have to worry about doing the validation by yourself in the controller. ZenTS will check the request body automatically and return a `422` http status code containing a detailed error information about which fields are wrong.

::: tip
For more information on how to structure the validation take a look at [joi](https://joi.dev/). All methods listen there can be used also with ZenTS `validate()` method, including changing the error messages and setting default values. Please make yourself familiar with [joi](https://joi.dev/), because it's a really powerful validation libary and with ZenTS, you can just use it out-of-the-box.
:::

### And more...

ZenTS use the great and fast [formidable package](https://www.npmjs.com/package/formidable) for parsing the request body. The package contains a lot of options and is well [documented](https://www.npmjs.com/package/formidable). All options are also supported by ZenTS (see [configuration guide](./../../configuration.md)).

## Working with the HTTP request header

Sometimes you may need to access the HTTP headers send from a client. The headers are exposed as `request.header` when using the `@request` or `@req` annotation.

### Get a header value

Accessing a specific header field by calling `request.header.get(key: string)`:

```typescript
public index(@request request) {
  log.info(request.header.get('accept')); // logs for example: 'text/html,application/xhtml+xml,application/xml'
}
```

In addition, the `get()` method has a type generic, which you can use to cast the correct type for the header value (either `string` or `string[]`)

```typescript
public index(@request request) {
  const example = request.header.get<string>('example')

  log.info(typeof example) // logs "string"
}
```

To return all request headers, you can call `request.header.all()`, which returns an iterable iterator:

```typescript
public index(@request request) {
  for(const [key, value] of request.header.all()) {
    log.info(`${key} = ${value}`)
  }
}
```

A way to check for the existing of a header key is the `has()` method:

```typescript
public index(@request request) {
  if(request.header.has('does_not_exist')) {
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
public index(@request request) {
  request.header.set('foo', 'bar')
}
```

### Remove a header value

Request header values can be removed by calling the `remove()` method on the `request.header` object:

```typescript
public index(@request request) {
  request.header.set('foo', 'bar')
  log.info(request.header.get('foo')) // logs "bar"
  request.header.remove('foo')
  log.info(request.header.get('foo')) // logs undefined"
}
```

## Accessing raw request object

The raw request object supplied by [Node.js http module](https://nodejs.org/api/http.html) is exposed under the `request.nodeReq` property. Working with the raw request object can be useful if you want to do something with it that is currently not supported by ZenTS. Be aware that when you modifying some parts of the raw request object, e.g. the header, these modifications are not automatically applied to the corresponding ZenTS controller action context. In generally you should avoid modifying the `request.nodeReq` object directly and use it ZenTS counterparts when ever possible.

## Next steps

Congrats! You just mastered the request context and its children. Now you should be able to handle incoming data easily, thanks to ZenTS request context.

Now it's time to learn more about returning a response and how to setup routes properly. The following guides will help you to archive these goals:

- [Request guide](./request.md)
- [Routing guide](./routing.md)
