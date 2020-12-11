---
title: Roadmap
lang: en-US
meta:
  - name: keywords
    content: ZenTS guide tutorial documentation roadmap framework mvc TypeScript
---

# {{ $frontmatter.title }}

<GuideHeader guide="roadmap">
  [[toc]]
</GuideHeader>

## Introduction

ZenTS is still under heavy development and not ready for production use yet (breaking changes can be introduces at any time). The Roadmap describes the missing modules, features and tools need to be finished before a stable release (v1.0.0) is going to happen.

## REST API support

With the current controller implementation you can already create REST APIs quite easily. But that isn't enough yet, ZenTS will feature a 1st level support for building REST JSON APIs super fast, with automatic bindings to entities and protected endpoints.

## Plugins and middleware

Lets be honest, no good Node.js framework without some plugin or/and middleware support. Currently that feature is completely missing in ZenTS, but it's planned to add a flexible plugin system to ZenTS, allowing to extend applications easily. This is a huge topic and will be started after ZenTS is more feature complete.

## More documentation

A good documentation is the key to a successful framework. It doesn't help if a framework is full of great features, but if nobody knows how to use them they become useless (or unused). ZenTS's documentation isn't complete yet, even it contains already a lot of guides. But there is more to come: more guides, improve existing guides, a cheat sheet, a better search, a contribution guide, the API reference and so on.

## More tests

The ZenTS repository contains already a couple of tests, but they doesn't cover all parts of the framework yet. They will be added over time, of course, new features also will need tests to be written.

## CI builds

Currently the repository doesn't have any CI integration. Releasing a new version is a manual process which can lead to release mistakes. The plan is to add GitHub actions for the repository, which lints, tests and releases ZenTS automatically.
