---
title: Dependency Injection
lang: en-US
meta:
  - name: keywords
    content: ZenTS guide tutorial documentation dependency injection framework mvc TypeScript decorators annotation SOLID
---

# {{ $frontmatter.title }}

<GuideHeader guide="dependency_injection">
  [[toc]]
</GuideHeader>

## Introduction

Wikipedia describes dependency injection like this:

> In software engineering, dependency injection is a technique whereby one object (or static method) supplies the dependencies of another object. A dependency is an object that can be used (a service).

This describes dependency injection pretty well, but it's still a bit hard to understand what this means practical. At its core, dependency injection is a programming technique that makes a class independent of its dependencies. It does that, by decoupling the usage of an object from its creation. This will help you to write easy maintainable code and follow the [single-responsibility principle](https://en.wikipedia.org/wiki/Single-responsibility_principle) (_SOLID_).

## The problem

Dependency injection by itself isn't a new programming technique, but quiet new to those who previously only worked with JavaScript. The question you might have is what problems it tries to solve and, of course, how ZenTS dependency injection mechanism can help you with that.

Lets start by taking a look at which problems dependency injection tries to solve. First we need to understand what dependency in programming in general means. Since you've chosen to use a Node.js framework, you've probably already used _npm_ as your dependency manager and have a brief understanding how dependencies work. For example, ZenTS has some dependencies by itself, like `nunjucks` or `typeorm`, and ZenTS is on the other side a dependency of your project. Installing these dependencies allows you to `import` or `require()` these packages and use them. _npm_ or _yarn_ will take care about installing dependencies of dependencies for you. Thats all fine and good, but when we talk about dependency injection in ZenTS, we mean to inject a object that is created by the framework for you.

Simple spoken, when class _A_ needs some functionality of class _B_, then its said that class _A_ has a dependency of class _B_.

In a "traditional" JavaScript application, this is done by constructing the dependency object by yourself. Lets say we have a service that is called _ReallyUsefulService_. This service might be used in multiple controllers. A controller has to create its own instance of _ReallyUsefulService_ by constructing it like this:

```javascript
// not a ZenTS example!
const ReallyUsefulService = require('./ReallyUsefulService')

class MyController {
  constructor() {
    this.usefulService = new ReallyUsefulService()
  }
}
```

There is nothing wrong with that code above, you've probably already seen that many times in many source codes. Things get funny when _ReallyUsefulService_ also has some global dependencies, like the connection to the database. The controller has to supply it somehow:

```javascript
const ReallyUsefulService = require('./ReallyUsefulService')

class MyController {
  constructor() {
    const connection = this.getConnection()

    this.usefulService = new ReallyUsefulService(connection)
  }
}
```

Since our service is really useful (...), a lot of controllers will have to create its own instance of _ReallyUsefulService_. Then the next day, you've to attach a new dependency to _ReallyUsefulService_ and you end up editing all the constructors by hand. That is not really fun and your colleges will hate you for that, because the same time they introduced another dependency, all constructors have to be edited again. Somebody might come up with using a factory to create all dependencies of a controller, and that might work in small applications, but in complex applications that becomes fast bloated, because every controller will get all dependencies, even if they don't need it. Furthermore, this kind of dependency management will cause a lot of headaches when it comes to unit testing.

Dependency injection solves this problem by transferring the task of creating the object to someone else. The responsibility of dependency injection is:

- Create the object
- Know which class has this object as dependency
- Provide this dependency to the corresponding class

## How to use dependency injection

After we learned what problem dependency injection solves it's time to get our hands dirty and use it to write awesome and maintainable applications. In fact, if you've followed ZenTS's guides closely, you've already used dependency injection for example in the [database](./database.md)- and [service](./services.md) guide (if not, you should definitely read these guides). While injecting e.g. the _EntityManager_ into a [controller](./controllers.md) is really nice and convenient, the true power of ZenTS comes from the `@inject` annotation, which allows you to inject controller and [services](./services.md) into other controller / services as a dependency. A typical example is a controller that has a service as a dependency:

First we create our service:

```typescript
import { entityManager } from 'zents'
import type { EntityManager } from 'typeorm'

import { User } from '../entity/User'

export default class {
  @entityManager
  private em: EntityManager

  public async auth(username: string, password: string): boolean {
    const user = await this.em.getRepository(User).findOne({ username })
    let isAuth = false

    // ...

    return isAuth
  }
}
```

This is a service (with pseudo-code) that checks if the user is authenticated or not. In order to do so, it needs to query the database using the _EntityManager_. The _EntityManager_ is provided by dependency injection (using the `@entityManager` annotation).

```typescript{2,5,6,10}
import { Controller, post, inject } from 'zents'
import UserService from '../service/UserService'

export default class extends Controller {
  @inject
  private userService: UserService

  @post('/login')
  public async login({ body }) {
    const isAuth = await this.userService.auth(body.username, body.password)

    // ...
  }
}
```

- _line 2_: We import our service like usually.
- _line 5_: We using the `@inject` decorator to tell the dependency injector to construct the `UserService` for us (and all the dependencies the `UserService` maybe has).
- _line 6_: Here we declare the private class member `userService` from type `UserService`. This way we overcome a disadvantage other dependency injection frameworks have, because we still have autocompletion and other tools supported in IDEs like Visual Studio Code (e.g. typing _this.userService._ will give you a _auth()_ autocompletion result).
- _line 10_: In the controller action we use the service like it's a first class citizen. You don't have to take care of initializing a `UserService` class by yourself.

Now the above controller and our `UserService` are totally independent of each other. The controller don't need to take care if the dependencies of the `UserService` has been changed and visa versa. And the good news is, that you still can have a `constructor` when using ZenTS's dependency injector:

```typescript{10,12-14,20}
import { entityManager, log } from 'zents'
import type { EntityManager } from 'typeorm'

import { User } from '../entity/User'

export default class {
  @entityManager
  private em: EntityManager

  protected foo: string

  constructor() {
    this.foo = 'bar'
  }

  public async auth(username: string, password: string): boolean {
    const user = await this.em.getRepository(User).findOne({ username })
    let isAuth = false

    log.info(this.foo) // logs "bar"

    // ...

    return isAuth
  }
}
```

**Hint**: The same counts also for controller constructors.

::: warning
Keep in mind, that a `constructor` will never be passed any arguments.
:::

## Handling circular dependencies

Of course, no technology comes without a flaw, so does dependency injection. Problems can arise when service _A_ depends on service _B_ and service _B_ depends on service _A_. This is called circular dependency and will cause your application to crash. You should better avoid these circular dependencies, but sometimes that isn't possible. In that case, you have to create a third service that acts as a facade and has both service _A_ and _B_ as a dependency, which allows them to communicate to each other over the facade service.

## Next steps

Congrats :tada: :tada: :tada:

You've just learned what is dependency injection and how to use it in a ZenTS web application. Want to dig deeper? Check out the [sending emails guide](./emails.md) and learn how to send responsive emails with ZenTS.
