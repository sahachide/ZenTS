---
title: Static files
lang: en-US
meta:
  - name: keywords
    content: ZenTS guide tutorial documentation static-file-server assets static files framework mvc TypeScript
---

# {{ $frontmatter.title }}

<GuideHeader guide="static_files">
  [[toc]]
</GuideHeader>

## Introduction

A web application normally contains more then just the backend- and frontend code. To style your website, you need to use [CSS](https://en.wikipedia.org/wiki/CSS) (or some kind of preprocessor like [Sass](https://sass-lang.com/)). There might be other files, like frontend JavaScript or images that the web application hosts. ZenTS provides a way to serve these files along with (controller) routes and that alike. Read this guide and get to know how to use this feature and how to reference assets in your [templates](./templates.md).

## Configuration

The static file hosting is enabled by default and can be setup in a projects [configuration file](./../../configuration.md). The `config.paths.public` config property tells ZenTS where to look for static files. By default this is set to `public/`, which is a folder relative to the projects root directory. `config.paths.public` can be set to any existing directory and have to be an absolute path, so the files could also be hosted from a different location then the project root directory. The second configuration property is `config.web.publicPath`. This is the URL path under which your files are listed. By default this is set to `/public/`, meaning your static files are accessible under this URL: http://localhost:3000/public/path/to/file.png

Both configuration properties have to be set to a string, otherwise the static files feature will be disabled and no files will be served. Both properties can also be set to `false` to disable static file hosting.

::: danger
Be aware that all files in the directory configured under `config.paths.public` are **public** accessible. Don't put any secret files in that directory.
:::

## Referencing static files in templates

Since static files are accessible under a public URL, referencing them in a template is super easy. Imagine a example project with the following file structure:

```
|-- public
|   |-- css
|   |   |-- app.css
|   |   |-- bootstrap.css
|   |   |-- custom.css
|   |-- img
|   |   |-- picture1.png
|   |   |-- picture2.png
|   |-- js
|       |-- app.js
|-- src
    |-- view
        |-- index.njk
```

The static files (_\*.css_, _\*.png_, _\*.js_, ...) are placed in the `public` directory (or any directory configured under `config.paths.public`).

A template can now reference the different files:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Welcome to ZenTS!</title>
    <link rel="stylesheet" href="/public/css/bootstrap.css" />
    <link rel="stylesheet" href="/public/css/app.css" />
    <link rel="stylesheet" href="/public/css/custom.css" />
  </head>
  <body>
    <h1>Photo album</h1>
    <img src="/public/img/picture1.png" /><br />
    <img src="/public/img/picture2.png" />
    <script src="/public/js/app.js"></script>
  </body>
</html>
```

As said, that it's really easy to reference to the static files. It's just important that the reference starts with a slash (`/`) and points to the URL path configured in `config.web.publicPath` (default `/public/`). The rest is just the folder structure given in the public directory.

## Next step

Congratulations! You've just learned how to use static files in your ZenTS application. Now you can use the template engine with ease and write awesome web applications! Now it's time to dig a bit deeper into [services](./services.md) and [dependency injection](dependency_injection). With them, you can write code that follows the [single-responsibility principle](https://en.wikipedia.org/wiki/Single-responsibility_principle) (_SOLID_) and supercharge your application.
