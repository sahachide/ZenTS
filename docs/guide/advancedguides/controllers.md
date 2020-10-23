---
title: Controllers
lang: en-US
meta:
  - name: keywords
    content: ZenTS guide tutorial documentation controller framework mvc TypeScript
---

# {{ $frontmatter.title }}

<GuideHeader guide="controller">
  [[toc]]
</GuideHeader>

## Introduction

In a [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) framework, controllers play an important role in every ZenTS application. A controller is a [ECMAScript class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) with at least one method (a so-called action), that is responsible for processing requests and generating responses bound to a route. The response could be an HTML page, JSON, a file download or anything else. Practically, a controller will analyze a incoming request, create or update Entities / database records and render templates with injected data. And of course, as a [ECMAScript class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes), a controller can also implement all kind of `protected` or `private` methods.

## A example controller

A simple controller with just one action (a method / function), returning a random number between 1 and 100 as JSON, will look like this:

```typescript
import { Controller, get } from 'zents'

export default class extends Controller {
  @get('/random-number')
  public randomNumber() {
    const min = 1
    const max = 100
    const number = Math.floor(Math.random() * (max - min + 1) + min)

    return {
      result: number,
    }
  }
}
```

The action is the `randomNumber()` method living inside the class.

The important parts of a controller are pretty simple:

- _line 1_: Import the basic abstract `Controller` and the `@get()` annotation from `zents` package.
- _line 3_: Export the controller as a Node.js module, which extends the abstract `Controller` from the `zents` package.
- _line 4_: Register a new get route `/random-number`. The action will be accessible under [http://localhost:8080/random-number](http://localhost:8080/random-number).
- _line 5_: Declaration of the action. You can name it to what ever you wish.
- _line 10_: Return of a random number as an object. This will be automatically converted into a JSON response.

### Using route annotations

In our example controller we used the `@get()` annotation to map a controller action to a URL. Annotations are a quiet new feature to JavaScript/TypeScript. You can find more information about them in the [routing guide](./routing.md).

## Creating and loading a new controller

A typical web application contains a lot of controllers, especially when the application becomes more and more complex. Controller classes in ZenTS follow a specific name convention, which make them autoloadable. It's highly recommend to use the [CLI](./../../cli.md) to create a new controller:

```shell
cd myproject
zen add:controller Product
```

Executing the above command will create a new controller called `ProductController` inside the projects controller folder. The generated controller will contain some basic example, which you can delete safely.

### Autoloading & naming strategy

When your application grows, you'll write more and more controller classes. One of the biggest annoyances is having to write a long list of controllers inside a index file, which bootstraps your application. This problem is solved by ZenTS's autoloading capabilities. The `AutoLoader` will load all controller files from the `/src/controller/` directory (the directory is [configurable](./../../configuration.md#path-related-options)). The controller classes are also loaded from all sub-directories recursively inside the `/src/controller/` directory, makes it a perfect fit to structure your controller files more logical in complex applications.

When creating your controllers, you've to follow the following naming strategy, otherwise the `AutoLoader` can't load your controllers properly.

Suppose you want to create a **_Product Picture_** controller, the name convention can be constructed as follows:

- Turn the first letter in each word separated by hyphens into upper case.
- Append the suffix `Controller`

The controller name would be `ProductPictureController` and the corresponding file would be `/src/controller/ProductPictureController.ts`.

### Controller module export

Because TypeScript (or JavaScript) doesn't support autoloading out of the box (like [PHP](https://www.php.net/manual/en/language.oop5.autoload.php) for example). ZenTS makes a contract about how controller classes have to be exported as a Node.js module.

There are two ways how the Autoloader fetches the right exported class member, either by exporting the `class` as _default export_ or by exporting a property that is the same then the filename (e.g. export class as `MyController` in `MyController.ts`):

:::: tabs
::: tab Using the default export (recommend)

```typescript
import { Controller } from 'zents'

export default class extends Controller {
  // implementation...
}
```

:::
::: tab Using exported members

```typescript
import { Controller } from 'zents'

export class MyController extends Controller {
  // implementation...
}
```

:::
::::

It's up to you, which one you choose, they even can be mixed (in separated controller files). When using exported members, it's important to remark, that the filename must be the same as the exported property.

### The @controller annotation

As said earlier, the `AutoLoader` will load all controllers inside the `/src/controller/` directory and it's sub-directories. Internally the Autoloader will register every controller by a key, which defaults to the controller filename. This can be troublesome when two controllers in different sub-directories have the same filename. Imagine the following project folder structure:

```
// other folder / files have been stripped for readably

|-- src
    |-- controller
        |-- SomeController.ts
        |-- example1
        |   |-- MyExampleController.ts
        |   |-- OtherController.ts
        |-- example2
            |-- MyExampleController.ts
```

When the Autoloader scans this project directory structure, it will hit `example1/MyExampleController.ts` first and will register it with the key `MyExampleController` and then goes on to the next file and folders. But the `AutoLoader` will fail to register `example2/MyExampleController.ts`, because it has the same key as the one already registered (a `warning` will be logged in that case).

To overcome this problem, ZenTS provides a `@controller(key: string)` annotation. When defining our `example2/MyExampleController.ts` controller, we can use this annotation to define the key a controller is registered with:

```typescript
import { controller, Controller } from 'zents'

@controller('MyCustomExampleController')
export default extends Controller {
  // implementation...
}

```

::: warning Attention!
Please note the difference in casing between the `@controller()` annotation and ZenTSs abstract `Controller` class (which each controller class should extend). Annotations in ZenTS are always written in lower-case.
:::

Now the above controller will be registered with the key `MyCustomExampleController` and everything works like it should.

::: tip
You don't need to always use the `@controller()` annotation to register your controller inside the `AutoLoader`. This is totally optional.
:::

## Controller actions

Actions are the heart of every controller. They define the shape of an endpoint for a URL and are defined as so-called action methods, whose visibility must be `public`. The name of an action method is up to you, but to make it work as an URL endpoint, you have to use one of the http related annotations: `@get()`, `@post()`, `@put()`, `@del()` or `@option()`.

::: tip
You can read more about these annotations in the [route guide](./routing.md).
:::

The return value from a action method represents the response data that will be send to the end users. ZenTS will automatically convert the given return value to a response by using an best-effort approach. This could be a JSON response, when the controller actions returns a json serialize-able value (e.g. an object or array) or a rendered template (HTML).

### A example response

The following example implements a simple controller action which bind itself to a `/ping` endpoint:

```typescript
import {  Controller, get } from 'zents'

export default extends Controller {
  @get('/ping')
  public ping() {
    return {
      answer: 'pong'
    }
  }
}

```

That's a quiet simple controller action (and controller), when you open [http://localhost:8080/ping](http://localhost:8080/ping) you will see this JSON response body:

```json
{
  "answer": "pong"
}
```

That is because when a controller action returns a plain object (or array) it will be automatically converted to a JSON response. As a rule of thumb, when a controller returns a JSON serialize-able value, it will be converted to a JSON response. Of course, it's possible to manually overwrite this behavior, please refer to the [response guide](./response.md) for more information on how to do so.

### Using async / await in controller actions

One of Node.js biggest advantage is its ability to handle heavy i/o related operations. ZenTS supports this pattern by allowing the developer to write a controller action asynchronously by using the `async` / `await` syntax.

::: tip
If you're not familiar yet with `async` / `await` syntax in TypeScript/JavaScript, please read [this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) or/and [this](https://javascript.info/async-await) first. More information about `Promises` can be found [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).
:::

Take a look at this example, which extends the previous controller with an `index()` action method:

```typescript{4}
import {  Controller, get } from 'zents';

export default extends Controller {
  @get('/')
  public async index() {
    return await this.render('index');
  }

  @get('/ping')
  public ping() {
    return {
      answer: 'pong'
    }
  }
}

```

Note the special `async` keyword on _line 4_. This tells Node.js that the function body will use the `await` keyword and thus return a `Promise`. We also introduce a new method `this.render()`. This is a helper function which allows us to render a template (in that case the templated located under `src/view/index.njk`). The `render()` function will return a `Promise`, which will be resolved with a string (the rendered HTML representation of `index.njk`). Of course, the `async` / `await` syntax can be used for other things, like querying databases, read/write files onto disc or calling external APIs, too.

### A controller is just a ECMAScript class

Even if ZenTS adds some fancy abilities like route annotations to classes, a controller is still just a standard ECMAScript class. So feel free to add `public`, `protected`, `readonly` or `private` members to it. You can even extend the basic ZenTS abstract `Controller` if your custom controller share some common code (but consider using [service](./services.md) for that because they are more flexible).

## Action context

A common use case for a controller action is to get some data from a user (e.g. a product id), validate the input, querying the database for the specific record and return a rendered template which displays the data from the record.

For that use case, a developer needs access to data a user has passed over the wire, let it be over via a URL parameter, inside a request body or via query parameters. Usually this is done by accessing some kind of `request` object and modifying a `response` object.

The `request` and `response` object (and more!) in ZenTS are bundled inside an `Context` object, which can be injected using the `@context` annotation.

This example code shows how this works:

```typescript
import {  Controller, context, Context, get, log } from 'zents';

export default extends Controller {
  @get('/product/:productId')
  public async index(@context context: Context) {
    log.info(context.request)
    log.info(context.response)
    log.info(context.params) // logs { productId: 42 }
  }
}

```

ZenTS exports a wide range of annotations related to the `request` and `response`, for example `@body` or `@params`:

```typescript
import {  Controller, body, params, post, log } from 'zents';

export default extends Controller {
  @post('/product/:productId')
  public async updateProduct(
    @params params: {
      productId: string
    },
    @body body: {
      name: string
      price: number
    }
  ) {
    log.info(params.productId)
    log.info(body.name)
    log.info(body.price)
  }
}

```

Using annotations and dependency injection makes it super easy to define the correct type for a controller action and use only the data you really need instead of using a full blown context.

These and other annotations are described further in these guides:

- [Request guide](./request.md)
- [Response guide](.response.md)

## Dependency Injection

According to [Wikipedia](https://en.wikipedia.org/wiki/Dependency_injection), dependency injection is a technique in which an object receives other objects that it depends on. ZenTS allows you to inject other controllers and services into a controller. Because this is a relative new and complex feature in the TypeScript/JavaScript world, we cover this topic in a separated guide which can be viewed [here](./dependency_injection.md).

## Best practice

In a well designed web application controllers are usually not complex. Each controller action will only contain a few lines of code. If your controller action code grows expansionary, that often means that you should refactor it and move some code to services or other utility classes.

A Controller...

- ... may access the request and response context
- ... may call methods of entities
- ... may call methods of other controllers
- ... may call methods of services
- ... may render templates
- ... should not process bushiness logic, this should be done in the entity layer
- ... should not embed HTML, this should be done in templates or by using other frontend frameworks
- ... should not initialize other services or controllers

## Next steps

Congratulations! You just finished the controller guide. Now you should be familiar with one of the most important parts of a web application. Now it's time to read more about the `Request` and `Response` object to truly master controllers in ZenTS.

These guides will help you to learn more about controllers:

- [Request guide](./request.md)
- [Response guide](.response.md)
- [Template guide](./templates.md)
- [Database guide](./database.md)
- [Dependency injection guide](./dependency_injection.md)
