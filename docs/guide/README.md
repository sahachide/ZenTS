---
title: Welcome to the ZenTS documentation
lang: en-US
meta:
  - name: keywords
    content: ZenTS guide tutorial documentation framework mvc TypeScript
---

# {{ $frontmatter.title }}

ZenTS is a modern Node.js & TypeScript MVC framework for building rich web-applications. The documentation covers all important parts of ZenTS.

::: danger
ZenTS is still **_under heavy development_** and **_not_** ready for production use yet (breaking changes can be introduces at any time). Please report any issues on [GitHub](https://github.com/sahachide/ZenTS/issues).
:::

## Getting started

In the getting started guides you'll install ZenTS and create a new ZenTS application with the CLI. Furthermore you'll create your first _Hello World_ example application and get in touch with the base building blocks of a ZenTS application.

Read the Getting started guide [here](./gettingstarted/installation.md).

## Controller & Routing

Controllers are a key component of every MVC application. In the controller guide, you'll learn how to create and use them in a ZenTS application. On the other hand, routes will connect controllers to the outside world by binding them to an URL.

Read the controller guide [here](./advancedguides/controllers.md), the routing guide can be found [here](./advancedguides/routing.md).

## Request & response context

When dealing with web requests, a strong partner is needed to handle user input and create appropriate responses.

Read the [request guide](./advancedguides/request.md) and the response guide [here](./advancedguides/response.md) to learn how to handle requests and responses in a ZenTS application.

## Databases interactions

Data is the new gold and even smaller web applications have some kind of database attached to it. ZenTS ships with a powerful and battle-tested ORM, which has builtin support for a lot of different databases. Furthermore ZenTS comes with a (optional) Redis client out-of-the-box, so you can directly make use of the super fast key/value storage.

Check out the database guide [here](./advancedguides/database.md). The Redis guide can be found [here](./advancedguides/redis.md).

## Template engine

Having a fast and solid template engine at your hand can be very useful to create beautiful and interactive websites. ZenTS ships with a rich template engine that you can use to generate server-side HTML code.

Read the template engine guide [here](./advancedguides/templates.md).

## And more

There is much more to learn about ZenTS. ZenTS is a highly [configurable](./configuration.md) framework, has [service containers](./advancedguides/services.md) support and allows you to write applications after the single-responsibility principle using [dependency injection](./advancedguides/dependency_injection.md). Also make sure to read about the awesome [CLI](./cli.md), which supercharge your application with a couple of helpful CLI commands.
