[![ZenTS Logo](./docs/.vuepress/public/zents_logo_small.png)](http://zents.dev)

![GitHub top language](https://img.shields.io/github/languages/top/sahachide/ZenTS?style=flat-square)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/sahachide/ZenTS?style=flat-square)
![GitHub issues](https://img.shields.io/github/issues-raw/sahachide/ZenTS?style=flat-square)
![GitHub pull requests](https://img.shields.io/github/issues-pr/sahachide/ZenTS?style=flat-square)
![npm](https://img.shields.io/npm/v/zents?label=latest%20release&style=flat-square)
![node-current](https://img.shields.io/node/v/zents?style=flat-square)
![Website](https://img.shields.io/website?style=flat-square&url=https%3A%2F%2Fzents.dev)
![NPM](https://img.shields.io/npm/l/zents?style=flat-square)

[Website](https://zents.dev) | [Documentation](https://zents.dev/guide/) | [Roadmap](https://zents.dev/roadmap) | [Changelog](https://github.com/sahachide/ZenTS/blob/master/CHANGELOG.md) | [Twitter](https://twitter.com/ZenTS_Framework) | [npm](https://www.npmjs.com/package/zents)

ZenTS is a fast and modern MVC framework for Node.js & TypeScript.

## Quick Start

ZenTS is a [Node.js](https://nodejs.org) framework and available through the
[npm registry](https://www.npmjs.com/).

Before you can start using ZenTS, you need to [download and install Node.js](https://nodejs.org/en/download/) for your operation system. After installing [Node.js](https://nodejs.org) you can create a fresh ZenTS project with the CLI:

```shell
npm i zents-cli -g
zen create myproject
cd myproject
zen dev
```

The above command will install the latest version of the CLI globally and creates a new ZenTS project in the `myproject` folder.

## Features

- Robust controller and service containers
- Super fast routing system
- Autoloading capabilities, never manage a list of project dependencies by yourself again
- Session and user management with redis, ORM or filesystem storage
- Ships with TypeORM out-of-the-box
- Includes a battle tested template engine (Nunjucks)
- Easy accessible request and response context
- Auto response workflows
- [Many, many more](https://zents.dev)

## Documentation

Head over to the [official website](https://zents.dev) and read the [documentation](https://zents.dev/guide/).

## Breaking changes in v0.3.0

Version 0.3.0 introduced all new context decorators like `@body`, `@params` and `@context`. Previously to v0.3.0 every controller action was passed a `context` argument, this is not the case anymore. The dependency injection system cares now about which context interfaces are necessary for a controller action. Thus, you've to use the new decorators for accessing things like the request body. The easiest way to upgrade to v0.3.0 is to use the `@context` decorator, which is the same, then the `context` argument used in v0.2.0.

Check out the [controller documentation](https://zents.dev/guide/advancedguides/controllers) for more information.

## License

MIT
