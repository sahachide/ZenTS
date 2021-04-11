---
title: User and Session Management
lang: en-US
meta:
  - name: keywords
    content: ZenTS guide tutorial documentation user users sessions session framework mvc TypeScript
---

# {{ $frontmatter.title }}

<GuideHeader guide="user_management">
  [[toc]]
</GuideHeader>

## Introduction

A modern web application need a way to identify users across multiple requests and ZenTS provides you with all the tools you need to do so. In this guide, you'll learn how to use cookies, sessions and so-called security providers to handle URL resources, which are only accessible for specific users. Since ZenTSs user management system makes (optional) use of redis or other databases, you should read the [redis guide](./redis.md) and the [database guide](./database.md) before continuing.

The user management is highly configurable to tailer it to your needs. The key features are:

- Multiple security providers, which allows different user (roles) to access locked resources (e.g. a "Admin" security provider and a "User" security provider).
- Multiple store adapters to save session related data either in redis, RDBMS or on the file system (for development/testing purpose).
- Strong password generators to store your users password securely using _bcrypt_ or _argon2id_ algorithm.
- Using [JSON Web Token](https://jwt.io/), which are developed against [draft-ietf-oauth-json-web-token-08](https://tools.ietf.org/html/draft-ietf-oauth-json-web-token-08) to save user related information on the client side.

## A basic example

Before we start with a basic example, please make sure that you've enabled and configured [redis](./redis.md). In addition, you need to setup a [database](./database.md) where your users are saved. In our example, we will force the user to send cookie to access a page behind a "firewall". First we need to make sure that we configure everything correctly. This is done by setting the `config.security` configuration properties.

Open your configuration file and add the following:

```json
{
  "security": {
    "enable": true,
    "secretKey": "DONTUSEME",
    "providers": [
      {
        "entity": "User",
        "store": {
          "type": "redis"
        }
      }
    ]
  },
  "redis": {
    "enable": true
  }
}
```

The above config is the basic config for the security system, since [most configuration properties](./../../configuration.md) have default values.

- _line 3_: Enable the security system.
- _line 4_: The security system needs a strong secret key, which is used to encrypt the JSON Web Token. **This key should never been exposed to the public**. You can use [ZenTS-CLI](./../../cli.md) to generate a secret key by calling `zen security:secret-key` in a terminal.
- _line 5_: Here we define our so-called security provider(s). A provider needs at least a entity, which is connected to a corresponding table containing user data. ZenTS supports multiple security providers. When using multiple security providers, you've to specify a `name` property for every provider.
- _line 6_: We enable a store (redis in that case) for our security provider. Session related data will be saved in that store (a store is always mandatory). ZenTS supports other store types (discussed later in this guide) then redis, but given its nature as key-value store, redis is generally considered the best choice to save sessions.

Before we can using our security provider, we need to create the `User` entity:

```typescript
// src/entity/User.ts

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  username: string

  @Column()
  password: string
}
```

This is a basic user class, with just an `id`, `username` and `password` column. The `username` and `password` fields are required in order for the provider to localize the correct user record. You can overwrite the column names with the `table.identifierColumn` (default: `username`) and `table.passwordColumn` (default: `password`) config properties.

When creating a new user account, make sure to save the password with the right encryption, which is either `argon2id` or `bcrypt` (can be configured by setting the `algorithm` property). The default encryption is `argon2id`. To illustrate this process, we create a new controller action which will create a new user account for us:

```typescript{22,24,26-27,29}
import type { EntityManager } from 'typeorm'
import { body, Controller, put, securityProvider, SecurityProvider, entityManager } from 'zents'

import { User } from '../entity/User'

export default class extends Controller {
  @entityManager
  private em: EntityManager

  @put('/user')
  public async createUser(
    @body
    body: {
      username: string
      password: string
    },
    @securityProvider()
    security: SecurityProvider,
  ) {
    let user = new User()

    user.username = body.username
    user.password = await security.generatePasswordHash(body.password)

    user = await this.em.save(user)

    return {
      id: user.id,
    }
  }
}
```

If you followed this guide closely, you already understand most of the above code. The important magic here comes from the `@securityProvider()` decorator, which exposes a `generatePasswordHash(plainText: string)` method, that we can use to generate a hashed password with the correct algorithm. In our example, the user input is transmitted via a [request body](./request.md#request-body), but it's actually up to your implementation how you create a user. Just make sure that you create the password hash via the security provider `generatePasswordHash()` method (or implement your own solution which generates compatible `argon2id` or `bcrypt` hashes).

:::tip
Both algorithm, `argon2id` and `bcrypt`, have some optional configuration properties. They are described in the [configuration guide](./../../configuration.md).
:::

After you've created a user, it's time to login. First we need to create a simple HTML login form.

```html
<form action="/login" method="post">
  <div>Username: <input type="text" name="username" /></div>
  <div>Password: <input type="password" name="password" /></div>
  <input type="submit" value="Login" />
</form>
```

This simple form sends the `username` and `password` to a `/login` page. If you submit this form (with valid credentials), a cookie will be send to the user, which is used for further requests to secured routes.

The login URL can be configured for each provider, in fact, when your application has more then one provider, it's mandatory to set URLs for each provider. If the application has only one provider, and a custom URL isn't provided, the `/login` URL will be created automatically. To set a custom URL, us the `url` property. Furthermore, if you want different form-field names then `username` and/or `password`, you have to configure them in the `fields` property.

```json
{
  "security": {
    // ...
    "providers": [
      {
        "url": {
          "login": "/custom-login",
          "logout": "/custom-logout"
        },
        "fields": {
          "username": "email",
          "password": "pin"
        }
      }
    ]
    // ...
  }
}
```

The last step of our example is to create a route that is actually locked behind a firewall, so that only user with a valid cookie can access it. In order to do so, we use the `@auth()` decorator provided by the ZenTS framework:

```typescript
@auth()
@get('/super-secret')
public async secretArea() {
  return {
    super: 'secret',
  }
}
```

The `/super-secret` URL is now secured and can only be viewed with a valid cookie.

## Choosing the right auth strategy

When a request is made to `@auth()` secured controller actions, ZenTS will take care that the user has access to the resource. The framework will look at two locations for a session token:

- _Header_: The token has to be send in a HTTP `Authorization` header token (`Authorization: Bearer TOKEN`).
- _Cookie_: The token has to be send in a cookie.
- _Hybrid_: The token has to be send either in a HTTP header or cookie.

The _header_ strategy is usually preferred when you want to write an API. Clients consuming the API have to send the authorization header for every request they make. If you're writing a more traditional web application, that has direct user interaction, you better choose the _cookie_ strategy. Requesting the login route will automatically create a cookie when a user is successfully authorized. The key of the cookie can be set using the (optional) `security.cookieKey` [configuration](./../../configuration.md) property. The hybrid strategy can be used if you wish to support both, http authorization header and cookies.

Example using cookie strategy [configuration](./../../configuration.md):

```json
{
  "security": {
    // ...
    "strategy": "cookie",
    "cookieKey": "app_"
    // ...
  }
}
```

`cookieKey` is optional and defaults to `zenapp_jwt`

Example using header strategy [configuration](./../../configuration.md):

```json
{
  "security": {
    // ...
    "strategy": "header"
    // ...
  }
}
```

::: warning
Don't use the "header" strategy if you intend to use auto redirect response, please use the auto json response type. Take a look at "[Auto redirect responses](#auto-redirect-responses)" section for more details.
:::

## Accessing a user session

A user can be injected into a controller action using the `@session()` decorator:

```typescript{9-14}
import type { EntityManager } from 'typeorm'
import type { Session } from 'zents'
import { auth, Controller, get, session, log } from 'zents'

import { User } from '../entity/User'

export default class extends Controller {
  @get('/example')
  public async example(@session() session: Session<User>) {
    if (session.isAuth()) {
      log.info(session.user)
      log.info(session.user.username)
    }
  }

  @auth()
  @get('/member-area')
  public async memberArea(@session() session: Session<User>) {
    log.info(session.user)
  }
}
```

Lets take a look at this example step-by-step:

- The `@session()` decorator injects a session into the controller action, which is bound to the `session` variable.
- The `Session` TypeScript interface has one generic type argument, which is set to our `User` entity. This allows TypeScript to resolve the `user` property type correctly and will show corresponding autocomplete results in your IDE.
- Since the `/example` route isn't behind a firewall (because we didn't use the `@auth()` decorator) every user can make a request to this URL. We use `session.isAuth()` here to make sure the user is authorized.

:::tip
When the URL is behind a firewall (`@auth()`), you can skip the call to `session.isAuth()`. ZenTS will make sure that only authorized users can access the resource.
:::

When your application has multiple security providers, you've to specify the name of the provider in the `@session()` and `@auth()` decorators:

```typescript
import type { EntityManager } from 'typeorm'
import type { Session } from 'zents'
import { auth, Controller, get, session } from 'zents'

import { Admin } from '../entity/Admin'
import { User } from '../entity/User'

export default class extends Controller {
  @get('/example')
  public async example(
    @session('admin') adminSession: Session<Admin>,
    @session('user') userSession: Session<User>,
  ) {
    if (userSession.isAuth()) {
      log.info(userSession.user)
      log.info(userSession.user.username)
    }
  }

  @auth('admin')
  @get('/admin')
  public async example(@session() adminSession: Session<Admin>) {
    log.info(adminSession.user)
  }
}
```

## Managing session related data

Usually a web application needs to save some additional user related data inside a session. For example, a e-commerce shop needs to remember which basket belongs to which customer. Of course, the application could just store this information inside the related database record, but this becomes fast unmaintainable and bloated. ZenTS has a concept of so-called **session stores**, which allows you to save extra data for every security provider. It's **mandatory** to configure a store for every security provider.

The builtin session stores are:

- **_redis_** (recommend): Stores session data in a [redis](./redis.md) key-value database. This is the preferred session store, because redis architecture scales very well under heavy load and is easy extendible.
- **_database_**: Stores session data in a database table using the [ORM](./database.md).
- **_file_**: Saves session data in multiple JSON files. The file session store should **only be used for development or testing purpose**, because it isn't build with performance in mind and doesn't scale well in applications under heavy load.

### Enable redis session store

To enable the redis session store, set `store.type` to `redis`:

```json{7}
{
  "security": {
    "providers": [
      {
        "entity": "User",
        "store": {
          "type": "redis",
          "prefix": "sessions_",
          "keepTTL": true
        }
      }
    ]
  }
}
```

- _line 7_: Set the store to `redis`.
- _line 8_: The prefix used when generating the key (optional, default: `zen_`).
- _line 9_: Set `keepTTL` to true, to retain the time to live for this session (optional, default: `false`).

Make sure to [configure](./../../configuration.md) [redis](./redis.md) correctly before enabling the redis session store.

### Enable database session store

To enable the database session store, set `store.type` to `database`:

```json{7-8}
{
  "security": {
    "providers": [
      {
        "entity": "User",
        "store": {
          "type": "database",
          "entity": "Session"
        }
      }
    ]
  }
}
```

The `entity` property is required and should point to an valid [entity](./database.md), that has at least the following implementation:

```typescript
// src/entity/Session.ts

import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity()
export class Session {
  @PrimaryColumn()
  id: string

  @Column()
  data: string

  @Column()
  created_at: Date

  @Column()
  expired_at: Date
}
```

### Enable file session store

::: danger
The file session store should only be used for development or testing purpose. You can configure your session stores differently for every environment. Please take a look at the [configuration guide](./../../configuration.md) for more information.
:::

To enable the file session store, set `store.type` to `file`:

```json{7-8}
{
  "security": {
    "providers": [
      {
        "entity": "User",
        "store": {
          "type": "file",
          "folder": "/absolute/path/to/folder",
          "prefix": "sessions_"
        }
      }
    ]
  }
}
```

The folder, where session files are stored, must be an absolute path pointing to an exiting directory on the host. Optionally you can define a filename prefix, which defaults to `zen_`. Session files are stored as JSON files inside the given directory.

### Using the session store

After you've configured a session store, you can begin to work with it in a [controller action](./controllers.md):

```typescript
@get('/example')
public async example(@session() session: Session<User>) {
  session.data.set('foo', 'bar') // set a new key-value property
  session.data.get<string>('foo') // get a value by key, with optional type casting
  session.data.remove('foo') // remove a value by key

  session.data.set('basket', {
    id: 42,
    items: [1, 2, 3]
  })

  // set, get and remove methods can lookup properties "paths", separated with a dot
  session.data.set('basket.id', 1)
  log.info(session.data.get<number>('basket.id')) // logs 1
}
```

The above example is pretty straightforward. The session store can accept any JSON serialize-able value, like objects, arrays or strings. The session store will automatically be updated at the end of the request lifecycle, but you can save it manually by calling `await session.data.save()`.

## Using multiple security providers

ZenTS supports multiple security providers, for example a web application might have "normal" users and administrators, which have different access rights to specific resources.

```json{5,10-13,16,21-24}
{
  "security": {
    "providers": [
      {
        "name": "user",
        "entity": "User",
        "store": {
          "type": "redis"
        },
        "url": {
          "login": "/user/login",
          "logout": /user/logout"
        }
      },
      {
        "name": "admin",
        "entity": "Admin",
        "store": {
          "type": "redis"
        },
        "url": {
          "login": "/admin/login",
          "logout": /admin/logout"
        }
      }
    ]
  }
}
```

When using multiple providers, it's required to set a `name` for every provider, otherwise you can't reference the right session in your controller action. Furthermore you've to setup a `login` and `logout` URL for every security provider. These URLs are then used to login/logout, e.g. via a HTML form or REST client. Normally ZenTS provides default values for the `name` (default: `default`), `login` (default: `/login`) and `logout` (default: `/logout`), but they can't be used when configuring multiple providers, because user need to identify them self with a unique resources.

Furthermore a user can authenticate them self with multiple providers, e.g. an admin that is also logged in with his own customer account. ZenTS will store session information on the client side only in one token, no matter how many logins the client has been authenticated to. When using the cookie strategy, a new cookie is issued and the old one is destroyed, but when you've chosen the header strategy, clients have to supply the newly issued token and drop the old one by them self.

After you've enabled multiple session providers, you've to specify the `name` of a provider as an argument to `@session(name: string)` when injecting the session into a controller action:

```typescript
public async example(
  @session('admin') session: Session<Admin>
) {
  // ...
}
```

Thanks to dependency injection, you can of course inject all providers you need into a action, just make sure to provide the correct `name` and `Session<ENTITY>` for each session.

The same thing counts also for the `@auth()` annotation, which accepts the `name` as the first argument:

```typescript
@auth('admin')
public async secretArea(
  @session('admin') session: Session<Admin>
) {
  // ...
}
```

::: tip
If you just use one provider you can omit the `name` argument (in config, `@auth()`, `@session()`), but it's recommend to always specify a name for a provider, because that makes life easier when adding more providers later.  
:::

## Expire sessions

Without configuration a session will expire after 7 days. You can change the expire time for every security provider with the `expire` property:

```json{6}
{
  "security": {
    "providers": [
      {
        // ...
        "expire": "30 days"
        // ...
      }
    ]
  }
}
```

The above example will set the expire time for session to 30 days. The `expire` property will except time strings or a number in milliseconds. Please take a look at the [configuration guide](./../../configuration.md) for more details about time strings.

::: danger
Sessions are automatically deleted from the redis store when they expire. That is done by setting the TTL for each key in the redis store. That isn't possible for the database and file stores. ZenTS will only make sure that the session hasn't been expired yet, when a request has been made, but it won't delete old sessions from the database (or filesystem). Currently you've to do this by hand, but sooner or later ZenTS will provide a CLI command to automatically clean expired sessions. The only exception from this behavior is, when the user calls `/logout`. The store data will then be deleted no matter which store the application is using.  
:::

## Manually destroy a session

A session can be manually destroyed before it expires by calling the `destroy()` method:

```typescript
@auth()
public async deleteMySelf(
  @session() session: Session<User>
) {
  await session.destroy()
}
```

This will destroy the session immediately and all members of the session variable will become `null` (e.g. `session.user` becomes `null`).

## Auto responses

ZenTS will send auto responses when specific actions happen, e.g. when a user calls `/login` with wrong credentials. These responses can be configured for every security provider, allowing you to fine tune the behavior of each action.

There are two auto response types available:

- _Redirect response_: Redirect the action to a different URL without returning a response body. This is usually sufficient when you're creating a simple web application without fancy frontend frameworks.
- _JSON response_: Will automatically send a JSON response body with data for each auto response action. If your application has some heavy JavaScript frontend code you probably want to choose this options, because it will give you more freedom on how you handle tokens and forbidden requests in the UI.

Both auto response types are discussed detailed in the following chapters.

### Auto redirect responses

To use auto redirect responses, set the `provider.responseType` config property to `redirect` (this is also the default when `responseType` isn't set).

```json{6}
{
  "security": {
    "providers": [
      {
        // ...
        "responseType": "redirect"
        // ...
      }
    ]
  }
}
```

Now you can configure the URLs for the 4 redirect action types:

```json{7-12}
{
  "security": {
    "providers": [
      {
        // ...
        "responseType": "redirect",
        "redirect": {
          "login": "/member-area",
          "logout": "/goodbye",
          "failed": "/login-form",
          "forbidden": "/forbidden"
        }
        // ...
      }
    ]
  }
}
```

- _login_: The redirect URL after successfully logged in.
- _logout_: The redirect URL after successfully logged out.
- _failed_: The redirect URL after failed to login or logout.
- _forbidden_: The redirect URL after try to access a secured route.

All of these URLs have a default value (`/`), it's recommend to set a value for every URL and create a corresponding controller action for each URL.

::: warning
The auto redirect responses doesn't play nicely together with the `header` authorization strategy, because the client will never receive the token when getting redirected after a login happens. You should use the `json` response type in that case.
:::

### Auto JSON responses

To enable auto JSON responses, set the `provider.responseType` config property to `json`. There aren't any more configuration parameters for the response type, it just works™ and will work with all three authorization strategies (`cookie`, `header` or `hybrid`).

These responses will be returned:

#### Login

```json
{
  "token": "TOKEN"
}
```

Will also return a cookie, when strategy is set to `cookie` or `hybrid`. Save the response token on the client somewhere when you're using the `header` strategy.

#### Logout

```json
{
  "logout": true
}
```

#### Failed

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Authorization missing"
}
```

#### Forbidden

```json
{
  "statusCode": 403,
  "error": "Forbidden",
  "message": "Forbidden"
}
```

## Configure session tokens

ZenTS security system uses encrypted [JSON Web Token](https://jwt.io/) which is either stored in a cookie or transmitted via HTTP header (depending on the chosen strategy). No matter how many security providers the application has, the framework will only issue one session token for a client and handle multiple logins to different providers internally.

The JSON Web Token can be configured with the `security.token` configuration property (all properties have a default value):

```json
{
  "security": {
    // ...
    "token": {
      "algorithm": "HS512",
      "audience": "foo:bar", // or ["foo:bar", "baz:boz"]
      "issuer": "company",
      "subject": "foo",
      "jwtid": "1234-5678",
      "keyid": "1234-5678"
    }
    // ...
  }
}
```

Currently ZenTS supports `HS256`, `HS384`, `HS512` as token encryption algorithm (others like `RS256` or `PS512` are currently unsupported, but will be added in a later release). The rest are standard JSON Web Token properties, please refer to the [official documentation](https://jwt.io/) for a detailed explanation.

## Next steps

Congratulation :tada: Now you should be familiar with the user and session management system ZenTS provides. It's fully flexible and can be used to secure controller actions from unwanted visitors. The next guide will cover [views and templates](./templates.md) and teaches you, how to use the builtin template engine efficiently.
