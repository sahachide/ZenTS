---
title: Services
lang: en-US
meta:
  - name: keywords
    content: ZenTS guide tutorial documentation service framework mvc TypeScript
---

# {{ $frontmatter.title }}

<GuideHeader guide="services">
  [[toc]]
</GuideHeader>

## Introduction

Services are commonly used as a some kind utility containers. They usually contain all kind of useful methods, like sending e-mails, interact with the database, calculation, calling external APIs and much more. In general, they help you to organize the source code in domains and allows for a centralize way how objects are constructed. That makes your life easier and promotes the [single-responsibility principle](https://en.wikipedia.org/wiki/Single-responsibility_principle).

In this guide you will learn how services are created in ZenTS and how you can use them in [controllers](./controllers.md) (or other services).

## Creating a service

In ZenTS, a service is a simple ECMAScript class, similar to a [controller](./controllers.md). In our guide we will create a simple service, which will generate a random number for us. Keep in mind, that is just an example. A service can be literary everything, but for this guide we keep things simple. Similar to [controllers](./controllers.md), services are auto-loaded by ZenTS's _AutoLoader_.

When creating your services, you've to follow a naming strategy, otherwise the _AutoLoader_ may fail to load your service properly.

Suppose you want to create a "_Product Image_" service, , the name convention can be constructed as follows:

- Turn the first letter in each word separated by hyphens into upper case.
- Append the suffix `Service`

The service name would be `ProductImageService` and the corresponding file would be `/src/service/ProductImageService.ts`.

Furthermore, a service have to follow a specific convention on how it exports the ECMAScript class. In order for the _AutoLoader_ to register a service probably, the class has to use either a `default` export or exporting a member with the same property then the filename.

:::: tabs
::: tab Using the default export (recommend)

```typescript
// src/service/MyService.ts
export default class {
  // implementation...
}
```

:::
::: tab Using exported members

```typescript
// src/service/MyService.ts
export class MyService {
  // implementation...
}
```

:::
::::

::: tip
Service classes have to be places in the `src/service/` directory and its sub-directories. This can be configured. Please refer to the [configuration guide](./../../configuration.md) for more information.
:::

A service should at least export one method that can be called by a controller or other services. So lets implement our random number generator service:

```typescript
// src/service/RandomService.ts
export default class {
  public integer(min: number = 1, max: number = 9): number {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
}
```

Thats it, we can now use our service to generate a random integer between two numbers (default between 1 and 9) by using the public `integer()` method.

::: tip
A service can also be created using the CLI. Use the `zen add:service MyService` command to create a service. Read the [CLI guide](./../../cli.md) to learn more about this and other commands.
:::

## Using a service

After we created our service, it's time to use it. A typical example is to use a service in a [controller](./controllers.md), but they can also be used in other services. In ZenTS a service can be injected into a controller using dependency injection:

```typescript
import { Controller, get, inject } from 'zents'
import RandomService from '../service/RandomService'

export default class extends Controller {
  @inject
  private random: RandomService

  @get('/random-number')
  public randomNumber() {
    return {
      result: this.random.integer(1, 100),
    }
  }
}
```

A service is injected using the `@inject` annotation. Using it will make sure that a service has all dependencies (e.g. an _EntityManager_) resolved before it is attached to a [controller](./controllers.md). This is called dependency injection and is discussed in [this guide](./dependency_injection.md).

## Using EntityManager / connection in a service

Similar to a [controller](./controllers.md), a service can also make use of the connection or _EntityManager_ from the [database](./database.md):

```typescript
import { Controller, connection, entityManager } from 'zents'
import type { Connection, EntityManager } from 'typeorm'

export default class {
  @connection
  private con: Connection

  // or

  @entityManager
  private em: EntityManager
}
```

::: tip
Read more about interacting with the database in the [database guide](./database.md).
:::

## Next steps

Services can be really helpful structuring your code and keep your controller actions clean. To really master them, you should read the [dependency injection guide](./dependency_injection.md), because it contains a lot of information on how to use services properly and why it isn't a good idea to construct your services in a [controller](./controllers.md) by yourself instead of using [dependency injection](./dependency_injection.md).
