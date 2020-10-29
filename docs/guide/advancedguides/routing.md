---
title: Routing
lang: en-US
meta:
  - name: keywords
    content: ZenTS guide tutorial documentation routing router http get post put delete framework mvc TypeScript
---

# {{ $frontmatter.title }}

<GuideHeader guide="routing">
  [[toc]]
</GuideHeader>

## Introduction

When a user requests a specific website, one of the first step the server will make is to parse the requested URL into a route. In ZenTS, the route is bound to a corresponding controller action which handles the request and returns a response. This process is called routing. Routes in ZenTS are bound with annotations (e.g. `@get('/my-route')`). This guide describes how to declare these annotations on controller actions and how to define your routes.

## Defining routes

New routes are defined by adding a annotation to a controller action:

```typescript
import { Controller, get } from 'zents'

export default extends Controller {
  @get('/my-custom-route')
  public  myControllerAction() {
    // controller action implementation...
  }
}
```

This examples registers a new get route for the `/my-custom-route` path. You can visit it by opening [http://localhost:8080/my-custom-route](http://localhost:8080/my-custom-route) in your favorite browser.

### Defining route parameters

Route parameters can be defined by prefixing the key with a `:`:

```typescript
@get('/user/:userId')
public userDetail(@params params: { userId: string }) {
  log.info(params.userId)
}

@get('/user/compare/:userId1/:userId2')
public userCompare(@params params: {
  userId1: string
  userId2: string
}) {
  // controller action implementation
}
```

Route parameters can be accessed using the `@params` annotation. If you didn't read about it yet, go back and read the [request guide](./request.md).

Parameters can also be defined using wildcards: `@get('/user/*')`

It's possible to define more than one parameter within the same couple of slash. Take a look at this example:

```typescript
@get('/map/:lat-:long')
public worldMap(@params params) {
  log.info(params.lat)
  log.info(params.long)
}
```

In this case, use the dash (`-`) as sub-parameter separator. This way, both parameter will become available in `params`.

Last but not least, you can define the route parameters using a `RegEx`:

```typescript
@get('/example/:file(^\\d+).png')
public example(@params params) {
  // controller action implementation...
}
```

::: warning
Using `RegEx` in route definition is very expensive in terms of performance. Use them sparsely and with caution!
:::

### Routing match order

The routing algorithm matches one chunk at a time (a chunk is a string between two slashes), this means that it don't know if a route is static or dynamic until it finishes to match the URL.

The chunks are matched in the following order:

- static
- parametric
- wildcards
- parametric(regex)
- multi parametric(regex)

So if you declare the following routes:

- `/:userId/foo/bar`
- `/33/:a(^.*$)/:b`

and the URL of the incoming request is `/33/foo/bar`, the second route will be matched because the first chunk (33) matches the static chunk. If the URL would have been `/32/foo/bar`, the first route would have been matched.

## Annotations

As said earlier, routes are defined by using specific annotations on corresponding controller actions. These annotations are directly named after their HTTP method counterparts (beside _DELETE_) and can easily accessed from the `zents` package.

### GET routes

A GET request is the most frequent used requests method in web applications. They are used when you want to display a specific web page (or template), a REST API response for collections (e.g. a list of products) or single entities (e.g. one product).

GET routes are defined with the `@get(path: string)` annotation:

```typescript
import { Controller, get } from 'zents'

export default extends Controller {
  @get('/my-custom-route')
  public  myControllerAction() {
    // controller action implementation...
  }
}
```

### POST routes

A POST request is usually used to create a new resource, e.g. a new product. It's also often used when transmitting HTML forms (`action="post"`). A POST request can have a request body.

POST routes are defined with the `@post(path: string)` annotation:

```typescript
import { Controller, post } from 'zents'

export default extends Controller {
  @post('/product')
  public newProduct(@body body) {
    // controller action implementation...
  }
}
```

### PUT routes

PUT requests are often used to update a existing resource, e.g. a existing product record. A PUT request can have a request body.

PUT routes are defined with the `@put(path: string)` annotation:

```typescript
import { Controller, put } from 'zents'

export default extends Controller {
  @put('/product/:productId')
  public updateProduct(@params params, @body body) {
    // controller action implementation...
  }
}
```

### DELETE routes

A DELETE request is commonly used in REST APIs to delete a specific resource, e.g. deleting a product. A DELETE request can't have a request body, the ID of the resource is usually passed by routing parameters or querystring.

DELETE routes are defined with the `@del(path: string)` annotation:

```typescript
import { Controller, del } from 'zents'

export default extends Controller {
  @del('/product/:productId')
  public deleteProduct(@params params) {
    // controller action implementation...
  }
}
```

::: tip
The DELETE routes are defined with `@del()` (and **not** `@delete()`) because `delete` is a reserved word in _TypeScript / JavaScript_.
:::

### OPTIONS routes

OPTIONS routes are defined with the `@options(path: string)` annotation:

```typescript
import { Controller, options } from 'zents'

export default extends Controller {
  @options('/my-custom-route')
  public  myControllerAction() {
    // controller action implementation...
  }
}
```

## Configuration

ZenTS's router management supports various configuration parameters under the `web.router` property.

::: tip
If you didn't read about configuring your ZenTS application take a look at the [configuration guide](./../../configuration.md).
:::

- `ignoreTrailingSlash`: Ignores trailing slashes, for example `@get('/foo')` will map to **/foo/** and **/foo**.
- `allowUnsafeRegex`: Per default the router will throw an error if it detects a potentially catastrophic exponential-time regular expressions. You can disable this behavior by setting `allowUnsafeRegex` to `true` (_not recommend!_).
- `caseSensitive`: By default routes are matched case sensitive. You can turn of this behavior by setting this to `false`.
- `maxParamLength`: This is the maximum number of parameters a route can take (defaults to `100`). Don't set this value to high, otherwise you may leave your application open to attacks.

## And more...

ZenTS uses the super-fast and well tested [find-my-way package](https://www.npmjs.com/package/find-my-way) as its routing manager. You can read more about it [here](https://www.npmjs.com/package/find-my-way).

## Next steps

Congratulations! You've just learned how to use the routing manager and setting up entrypoints for your web application. Continue by reading the following guides:

- [Template guide](./templates.md)
- [Database guide](./database.md)
- [Configuration guide](./../../configuration.md)
