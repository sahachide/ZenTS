---
title: Hello World Example
lang: en-US
meta:
  - name: keywords
    content: ZenTS guide tutorial documentation getting started framework mvc TypeScript
---

# {{ $frontmatter.title }}

<GuideHeader guide="helloworld">
  [[toc]]
</GuideHeader>

## Create a Page

Creating a simple page mostly involves two steps:

- Create a controller: A controller is a [ECMAScript class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) with at least one method that builds the page. These methods are called controller actions in ZenTS. The controller will receive a `Context`, which contains request information and other helpful things, like response helpers.

- Create a route: A route is the URL (e.g. http://mypage.com/products) which points to a controller.

We will create both of them in this guide by creating a good old **_Hello World_** example.

::: warning Setup
This guide assumes that you have already installed ZenTS and the CLI. If you didn't install ZenTS yet please follow [the installation guide](./installation.md).
:::

## Create a controller

Start by creating a controller which will serve as endpoint for the URL `/hello-world`. Thanks to ZenTS CLI, controllers can be created quite easily. Open a terminal and navigate to the project folder. Then type the following:

```shell
zen add:controller HelloWorld
```

This command will create a `HelloWorldController` controller inside `/src/controller/HelloWorldController.ts`. The generated controller will look like this:

```typescript
import { Controller, get } from 'zents'

export default class extends Controller {
  @get('/')
  public async index() {
    return await this.render('index')
  }
}
```

As you can see, the CLI created already a `index()` method. We call these methods **_controller actions_**. For our **_Hello World_** example, we can ignore the `index()` action, so you can delete it safety. Instead, add a new controller action and call it `helloWorld()`, which returns a simple "Hello World" message as JSON:

```typescript
export default class extends Controller {
  public helloWorld() {
    return {
      message: 'Hello World',
    }
  }
}
```

::: tip
A controller action can either directly returning a response value or use the `async` keyword (like the `index()` action). When using the `async` keyword, the controller action must return a `Promise`. Learn more about controllers and controller actions in the [controller guide](./../advancedguides/controllers.md).
:::

Our `helloWorld()` action returns an object, which will be automatically converted to a JSON response. But currently the controller action isn't reachable, because no route is bound to it.

## Binding a controller action to a route

The next step is to bind a URL for our `helloWorld()` action we just created. ZenTS use a relative new feature (for TypeScript) called annotations for creating routes.

To create a simple HTTP GET URL route we use the `@get()` decorator and add it on top of our `helloWorld()` action:

```typescript
import { Controller, get } from 'zents'

export class HelloWorldController extends Controller {
  @get('/hello-world')
  public helloWorld() {
    return {
      message: 'Hello World',
    }
  }
}
```

::: tip
Learn more about routing and routing decorators in [this guide](./../advancedguides/routing.md).
:::

That's it! We have just bound our controller action to the `/hello-world` URL. Try it out and open [http://localhost:8080/hello-world](http://localhost:8080/hello-world)
in your browser.

You should see this response now:

```json
{
  "message": "Hello World"
}
```

## Rendering templates

Returning a JSON response is nice for e.g. APIs or as response to a AJAX requests, but web applications usually render some kind of presentation in HTML. ZenTS ships with the fast and powerful [nunjucks template engine](https://mozilla.github.io/nunjucks/), which will help you to create beautiful webpages (of course, you're still can use frontend frameworks like [Vue.js](https://vuejs.org/), [Angular](https://angular.io/) or [React](https://reactjs.org/)).

For now, let us create a simple template which will render a "Hello World" string in the users browser. Add a `/src/view/helloworld.njk` template file with the following content to your project:

```twig
<html>
  <head>
    <title>Hello World</title>
  </head>
  <body>
    Hello World!
  </body>
</html>
```

Now we just need to change our `helloWorld()` action to use the `render()` method:

```typescript
export default class extends Controller {
  @get('/hello-world')
  public async helloWorld() {
    return await this.render('helloworld')
  }
}
```

If you go to [http://localhost:8080/hello-world](http://localhost:8080/hello-world), you will see a webpage with a "Hello World!" text. In addition, the controller action is now prefixed with the `async` keyword, because the `render()` method will return a `Promise`.

::: tip
You can learn more about `Promise` and the `async` / `await` keywords [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).
:::

## Route parameters and passing data to templates

Of course, web applications are all about interaction with the user. Route parameters are a common way to get data from a user. In this chapter, we will learn how we add route parameters and pass them into a template.

First we extend our `@get()` annotation with a `name` parameter:

```typescript
@get('/hello-world/:name')
```

Now we need to access the parameter in our controller. In ZenTS this is done by using dependency injection. We use the `@context` annotation to inject a `Context` object into our controller action, which holds all kind of useful request data. One of them are the URL parameters which we declared in our routes:

```typescript
import { Controller, context, Context, get, log } from 'zents'

export default class extends Controller {
  @get('/hello-world/:name')
  public async helloWorld(@context context: Context<{ name: string }>) {
    log.info(context.params.name)

    return await this.render('helloworld')
  }
}
```

::: tip
The router supports a variety of parameter declarations. Head over to the [routing guide](./../advancedguides/routing.md) to learn more.
:::

If you open [http://localhost:8080/hello-world/bob](http://localhost:8080/hello-world/bob) you will see that **_bob_** is logged in your terminal.

The next step is to pass the `name` parameter into our `helloworld.njk` template. For that purpose, the `render()` method has a second argument, which will act as the context for the template:

```typescript
export default class extends Controller {
  @get('/hello-world/:name')
  public async helloWorld(@context context: Context<{ name: string }>) {
    return await this.render('helloworld', {
      name: req.params.name,
    })
  }
}
```

The above example will create a `name` variable in the template context. To output a variable in a template, we use curly brackets. Go ahead and open `/src/view/helloworld.njk` and add our `name` variable:

```twig
<html>
  <head>
    <title>Hello World</title>
  </head>
  <body>
    Hello World, {{ name }}!
  </body>
</html>
```

When you reload your browser, you should see the message **"Hello World, Zen!"**.

## Next steps

Congratulations! You just finished the getting started guide for ZenTS. You're already familiar with the basic concepts of building fast and maintainable applications.

But wait! There is more to learn about ZenTS and mastering more in-depth look at topics like:

- [Controller guide](./../advancedguides/controllers.md)
- [Routing guide](./../advancedguides/routing.md)
- [Templates guide](./../advancedguides/templates.md)
- [Configuration guide](./../../configuration.md)

After that, learn more about topics like [dependency injection](./../advancedguides/dependency_injection.md), interacting with [databases](./../advancedguides/database.md) or [services](./../advancedguides/services.md).
