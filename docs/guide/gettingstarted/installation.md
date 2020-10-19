---
title: Installation & Setup
lang: en-US
meta:
  - name: keywords
    content: ZenTS guide tutorial documentation installation setup framework mvc TypeScript
---

# {{ $frontmatter.title }}

<GuideHeader guide="installation">
  [[toc]]
</GuideHeader>

## Prerequisite

Before creating your first ZenTS application you must install the following dependencies:

- [Node.js](https://nodejs.org) >= 12.x.x
- [npm](https://www.npmjs.com/) (usually shipped with Node.js)

It's highly recommend to install Node.js with a versions manager like [nvm](https://github.com/nvm-sh/nvm).

Furthermore, ZenTS has a dependency to `node-gyp`, which has a few dependencies that needs to be installed before installing ZenTS. Please check the [official documentation](https://github.com/nodejs/node-gyp) for more details.

## Installing & Using ZenTS-CLI

The ZenTS framework offers a CLI utility belt, which ease the pain of developing a TypeScript application. While completely optional, it's highly recommend to install ZenTS CLI. The rest of the documentation will use the CLI for its explanations.

To install the CLI, open a terminal and type:

```shell
npm i zents-cli -g
```

This will install the CLI as a global command. Try it out by running...

```shell
zen --version
```

...in your terminal. If the installation was successfully, this should show you the installed version of the CLI and you're ready to use it now.

## Creating your first ZenTS application

After the CLI is installed we can create our first ZenTS project. Open your terminal and run this command:

```shell
zen create myproject
cd myproject
```

This command will create a new ZenTS application called **myproject** inside a newly created `myproject` folder (relative) to the folder you executed the command.

::: tip
If the folder already exists, and you like to delete it before, you can call the `create` command with a `--clean` flag.
:::

## Directory structure

After the application has been created the directory structure looks like this:

```
|-- src
    |-- index.ts
    |-- controller // place your controller files here
    |   |-- MyController.ts
    |-- entity // your database entities are located here
    |   |-- MyEntity.ts
    |-- service // services are saved inside this folder
    |   |-- MyService.ts
    |-- view // place your template files here
        |-- index.njk
|-- package.json // npm's package.json
|-- tsconfig.json // TypeScript configuration file
|-- zen.json // ZenTS configuration file
```

Don't worry, we will cover all the listen directories detailed later in this guide.

## Running the application

Running the application is quiet easy with the CLI. Just open your terminal again and type:

```shell
cd /path/to/myproject
zen dev
```

::: danger
Don't use the `dev` command in production. In production mode, you should install a webserver like [nginx](https://nginx.org/en/) or [Apache](https://httpd.apache.org/) which serves as proxy in front of your ZenTS application.
:::

::: tip
Head over to the [CLI documentation](./../../cli.md) to learn more about the commands (like `dev`), options and flags the CLI provides.
:::

The `dev` command is a convenient way to lunch a development server. This will start the TypeScript compiler with the `--watch` flag attached, which will watch your source files for changes and recompile when your code changed. In addition, a web-server will be started with hot reloading enabled. Open your favorite browser and navigate to [http://localhost:8080](http://localhost:8080). You should see the default starting page of a ZenTS application.

## Start writing your ZenTS application

Congratulations! Everything has been setup and you're ready to write your custom application. Head over to the next section to figure out more and create your the iconical **_Hello World_** example.
