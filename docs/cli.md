---
title: Command-line interface (CLI)
lang: en-US
meta:
  - name: keywords
    content: ZenTS guide tutorial documentation CLI framework mvc TypeScript
---

# {{ $frontmatter.title }}

<GuideHeader guide="cli">
  [[toc]]
</GuideHeader>

## Introduction

The ZenTS CLI is a command-line interface tool that helps you to initialize, develop, build and maintain your application. It comes with a development server and a ready to use TypeScript compiler. Furthermore it has serval generators, which helps you to scaffolding your ZenTS projects and assist you while you develop a application. This guide will introduce you to the useful commands ZenTS CLI offers. While totally optional, installing and working with the CLI is highly recommend when you use ZenTS.

## Installation

ZenTS CLI can be found in the npm registry and should be installed globally:

```shell
npm install zents-cli -g
```

The above command will install ZenTS CLI globally using _npm_. This guide will continue using _npm_ as package manager, but feel free to use other packaging managers and refer to their documentation on how to install packages globally.

::: tip
An alternative way to use ZenTS CLI is the `npx` command. Please take a look on the [documentation](https://github.com/npm/npx) on how to use the `npx` command, but in a nutshell, you just perpend `npx` to every command listen in this guide and you're good to go.
:::

After the installation we can check if everything is working correctly using the `zen` command:

```shell
zen --version
```

If correctly installed, this command will show the installed version of the CLI.

## Help command and --help

The CLI has a general `help` command, which shows you an overview of the installed commands, the current version and so on.

```shell
zen help
```

Furthermore every command has a `--help` flag, which shows a corresponding help text. For example:

```shell
zen create --help
```

Will display the help of the `create` command. Make use of the `--help` flag if you get stuck or want to figure out more about a specific command.

## List of commands

The following chapter contains all available CLI commands. Most of them have to be executed in a existing ZenTS project directory.

### create command

The `create` command is used to bootstrap a new ZenTS project with the recommend folder structure.

```shell
zen create myproject
```

The above command will create a new ZenTS project in a `myproject` folder relative to the directory you called the command.

```shell
$ zen create --help

create a new ZenTS project inside PROJECTNAME directory.

USAGE
  $ zen create PROJECTNAME

OPTIONS
  -c, --clean  clean install directory before running installation
  -h, --help   show CLI help

ALIASES
  $ zen create-project

EXAMPLE
  $ zen create myproject
```

### dev command

Start a development server with hot reloading and automatically build of TypeScript files. The command has to be executed inside a ZenTS project folder.

```shell
zen dev
```

```shell
$ zen dev --help

run a ZenTS project with a dev server, tsc-watch and browser-sync.

USAGE
  $ zen dev

OPTIONS
  -h, --help                   show CLI help
  --[no-]server                enable/Disable the web-server. Enabled by default, set --no-server flag to disable.
  --[no-]sync                  enable/Disable the browser-sync with the web-server. Enabled by default, set --no-sync flag to disable.
  --sync-port=sync-port        the port browser-sync will use (if none is provided will determine a open port between 8000 and 8999 automatically)
  --sync-ui-port=sync-ui-port  the port browser-sync ui will use (if none is provided will determine a open port between 9000 and 9999 automatically)
  --[no-]tsc                   enable/Disable the TypeScript watch compiler. Enabled by default, set --no-tsc flag to disable.

EXAMPLE
  $ zen dev
```

### build command

Builds a ZenTS project. Using the command has the advantage, that template files are copied over to the dist directory. The `tsconfig.json` (or similar) is respected by the `build` command. The command has to be executed inside a ZenTS project folder.

```shell
zen build
```

```shell
zen build --help

build a ZenTS application. This command will compile the TypeScript files and copy the projects templates to the dist folder.

USAGE
  $ zen build
```

### add:controller command

Creates a new boilerplate controller for a project. The command has to be executed inside a ZenTS project folder.

```shell
zen add:controller Foo
```

The above command will create a `src/controller/FooController.ts` file.

```shell
zen add:controller --help

create a new ZenTS controller class.

USAGE
  $ zen add:controller NAME

ARGUMENTS
  NAME  name of the controller, e.g. "Product". The "Controller" appendix should be omitted.

OPTIONS
  -f, --force  force creation, eventually overwriting existing file

EXAMPLES
  $ zen add:controller Product
  $ zen add:controller User
```

### add:service command

Creates a new boilerplate service for a project. The command has to be executed inside a ZenTS project folder.

```shell
zen add:service Foo
```

The above command will create a `src/service/FooService.ts` file.

```shell
zen add:service --help

create a new ZenTS service class.

USAGE
  $ zen add:service NAME

ARGUMENTS
  NAME  name of the service, e.g. "Util". The "Service" appendix should be omitted.

OPTIONS
  -f, --force  force creation, eventually overwriting existing file

EXAMPLE
  $ zen add:service Util
```

### add:entity command

Creates a new boilerplate entity for a project. The command has to be executed inside a ZenTS project folder.

```shell
zen add:entity Foo
```

The above command will create a `src/entity/Foo.ts` file.

```shell
zen add:entity --help

create a new ZenTS/TypeORM entity class.

USAGE
  $ zen add:entity NAME

ARGUMENTS
  NAME  name of the entity, e.g. "Product"

OPTIONS
  -f, --force  force creation, eventually overwriting existing file

EXAMPLES
  $ zen add:entity Product
  $ zen add:entity User
```

## Using the CLI programmatically

The CLI commands can be used programmatically calling their corresponding `run()` methods. For example if you want to use the `dev` command programmatically you have to import the zents-cli package, which exports a `Dev` command object:

```typescript
import { Dev } from 'zents-cli'

Dev.run(['--sync', false])
```

The _add_ generator commands are exported as **AddCOMMAND**, e.g. `AddController` or `AddService`. The `run()` method accepts one argument, an array of flags and/or positional arguments for the given command.

## Extending the CLI with plugins

ZenTS's CLI can be extended with plugins. A plugin can introduce one or multiple new commands for the CLI or even overwrite a given command (by exposing the same command name as the existing ones).

### Installing a plugin

New plugins can be installed using the following command:

```shell
zen plugins:install PLUGIN
```

```shell
zen plugins:install --help

installs a plugin into the CLI

USAGE
  $ zen plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  plugin to install

OPTIONS
  -f, --force    yarn install with force flag
  -h, --help     show CLI help
  -v, --verbose

DESCRIPTION
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command will override the core plugin implementation. This is useful if a user needs to update core plugin
  functionality in the CLI without the need to patch and update the whole CLI.

ALIASES
  $ zen plugins:add

EXAMPLES
  $ zen plugins:install myplugin
  $ zen plugins:install https://github.com/someuser/someplugin
  $ zen plugins:install someuser/someplugin
```

### Uninstall a plugin

To uninstall a plugin use the following command:

```shell
zen plugins:uninstall PLUGIN
```

```shell
zen plugins:uninstall --help

removes a plugin from the CLI

USAGE
  $ zen plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

OPTIONS
  -h, --help     show CLI help
  -v, --verbose

ALIASES
  $ zen plugins:unlink
  $ zen plugins:remove
```

### Update all plugins

All plugins can be updated using the `update` command:

```shell
zen plugins:update
```

```shell
zen plugins:update --help

update installed plugins

USAGE
  $ zen plugins:update

OPTIONS
  -h, --help     show CLI help
  -v, --verbose
```

### List all installed plugins

All installed plugins can be listed using the following command:

```shell
zen plugins
```

```shell
zen plugins --help

list installed plugins

USAGE
  $ zen plugins

OPTIONS
  --core  show core plugins

EXAMPLE
  $ zen plugins

COMMANDS
  plugins:install    installs a plugin into the CLI
  plugins:link       links a plugin into the CLI for development
  plugins:uninstall  removes a plugin from the CLI
  plugins:update     update installed plugins
```

### Link a plugin

Links a plugin into the CLI for development:

```shell
zen plugins:link PLUGIN
```

```shell
zen plugins:link --help

links a plugin into the CLI for development

USAGE
  $ zen plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

OPTIONS
  -h, --help     show CLI help
  -v, --verbose

DESCRIPTION
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello' command will override the user-installed or core plugin implementation. This is useful for development
  work.

EXAMPLE
  $ zen plugins:link myplugin
```

### Writing own plugins

A plugin is basically a set of commands or one single command which does something for the user. Commands for the CLI are written using the awesome _oclif_ CLI framework. Please take a look at the [official documentation](https://oclif.io/docs/commands) on how to write commands. After you've finished coding and published your command on _npm_ (or _git_) you can install it using the command listen above.
