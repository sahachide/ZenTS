---
title: Redis
lang: en-US
meta:
  - name: keywords
    content: ZenTS guide tutorial documentation redis framework mvc TypeScript
---

# {{ $frontmatter.title }}

<GuideHeader guide="redis">
  [[toc]]
</GuideHeader>

## Introduction

[Redis](https://redis.io) is a super fast key/value in-memory storage which is the de-facto industry standard when a application needs fast access to a huge amount of data. ZenTS supports Redis out-of-the-box and you can directly use Redis in your application. Furthermore if your application needs high availability and even better performance, you can use [Redis Sentinel](https://redis.io/topics/sentinel) directly in your ZenTS application. Head over to the Redis website and install the appropriate version of Redis for your operation system and continue reading to learn how to use Redis with ZenTS.

## Configuration

After you've installed Redis you need to configure the Redis client in your applications [configuration](./../../configuration.md). Redis support is disabled by default, so firstly set the `config.redis.enable` option to `true`. If you're running Redis locally with the default configuration and just want to try it out, you're already good to go. But in a real world scenario you usually have to set the `config.redis.host`, `config.redis.port` and `config.redis.password` too. The underlying Redis client has a wide range of configuration parameters, head over to the [configuration guide](./../../configuration.md) to learn more.

## Using Redis in a controller or service

ZenTS will create the redis client, which you can use to interact with the database, by itself. All you've to do to use it, is to inject the client into a controller or service. This is done using the `@redis` annotation:

```typescript{1,4,5,8}
import { Controller, redis, get, RedisClient } from 'zents'

export default class extends Controller {
  @redis
  private redis: RedisClient

  @get('/')
  public async index() {
    await this.redis.set('foo', 'bar')
  }
}
```

The above code can be described as following:

- _line 1_: Import the `@redis` annotation and the `RedisClient` TypeScript interface from `zents`.
- _line 4_: Use the `@redis` annotation to declare the following class member as redis client. ZenTS dependency injection mechanism will take care to supply your controller / service with the ready to use redis client.
- _line 5_: The dependency injector will assign the client to `this.redis`. You can use the `RedisClient` interface for easy type bindings.
- _line 8_: The client can be used in a controller action with `this.redis` (or which ever property you did assign). The client supports all [redis commands](https://redis.io/commands).

::: tip
You can learn more about dependency injection in ZenTS [here](./dependency_injection.md).
:::

## Transactions

Transactions allow you to execute a group of commands sequentially (read more about [Redis transactions](https://redis.io/topics/transactions)). To use transactions with the Redis client, use the `multi()` method:

```typescript
import { Controller, redis, get, RedisClient, log } from 'zents'

export default class extends Controller {
  @redis
  private redis: RedisClient

  @get('/')
  public async index() {
    const result = await this.redis.multi().set('foo').get('foo').exec()

    log.info(result)
  }
}
```

When using transaction you can chain multiple commands together and call `exec()` at the end of the chain.

## Batch execution

The redis client supports batch execution with the `pipeline()` method. This can be useful if you want to send a batch of commands, because they will be saved in memory and are send in batch to Redis (with a huge performance improvement).

```typescript
import { Controller, redis, get, RedisClient } from 'zents'

export default class extends Controller {
  @redis
  private redis: RedisClient

  @get('/')
  public async index() {
    await this.redis.pipeline().set('foo', 'bar').del('cc').exec()
  }
}
```

Batch executions and transactions can also be combined to a subset command transactions:

```typescript
import { Controller, redis, get, RedisClient } from 'zents'

export default class extends Controller {
  @redis
  private redis: RedisClient

  @get('/')
  public async index() {
    const result = await this.redis
      .pipeline()
      .get('foo')
      .multi()
      .set('foo', 'bar')
      .get('foo')
      .exec()
      .get('foo')
      .exec()
  }
}
```

## And more...

ZenTS uses _ioredis_ under the hood to manage Redis clients. This client has been chosen because it's fully featured with cluster, sentinel, streaming, pipelining and Lua scripting support. This guide only covers the basics of the _ioredis_, head over to the [official documentation](https://github.com/luin/ioredis) to learn more about _ioredis_.

## Next steps

Congratulation :tada:! You've just learned how to use to Redis in your web application. Now you should be familiar on using different databases with ZenTS. Head over to the [template guide](./templates.md) to learn how to render HTML code in your application or check out the [user and session management guide](./user_management.md) guide to learn how to secure routes and handle different user resources.
