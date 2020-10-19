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

> **Warning**: ZenTS is still **_under heavy development_** and **_not_** ready for production use yet (breaking changes can be introduces at any time). Please report any issues on [GitHub](https://github.com/sahachide/ZenTS/issues).

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

- Autoloading of project files, never manage a list of project dependencies by yourself again
- Robust controller and service containers
- Super fast routing system
- Session and user management with redis, ORM or filesystem storage
- Ships with TypeORM out-of-the-box
- Includes a battle tested template engine (Nunjucks)
- Easy accessible request and response context
- Auto response workflows
- [Many, many more](https://zents.dev)

## Documentation

Head over to the [official website](https://zents.dev) and read the [documentation](https://zents.dev/guide/).

## Whats new in v0.2.0

- Session and user managment
- Redis support
- Improved docs and types

## License

MIT
