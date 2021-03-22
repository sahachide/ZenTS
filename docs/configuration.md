# Configuration

<GuideHeader guide="configuration">
  [[toc]]
</GuideHeader>

## Introduction

ZenTS is a highly configurable framework while supplying default values for every config property. The config file can either be written in [JSON](https://www.json.org/json-en.html), [YAML](https://yaml.org/) or as [CommonJS module](https://nodejs.org/docs/latest/api/modules.html#modules_modules_commonjs_modules). This guide will cover the important parts of how ZenTS handles configuration files and gives a detailed explanation of every parameter.

## The base configuration file

ZenTS supports a wide range of configuration filetypes and filenames. It's up to you which one you'll choose, but it's important to remember that the configuration will only be loaded from **_one_** specific base file (and an environment file). This can be one of the following (searched in the listened order inside the applications root directory):

- `package.json`: npm's package.json containing with an `zen` object property (which contains the config of your application).
- `.zenrc`: a JSON or YAML extensionless "rc" file
- `.zenrc.js`: a CommonJS Module exporting a object with config properties
- `zen.json`: a JSON file
- `zen.yaml`: a YAML file
- `zen.yml`: a YAML file
- `zen.config.json`: a JSON file
- `zen.config.js`: a CommonJS module
- `zen.config.yaml`: a YAML file
- `zen.config.yml`: a YAML file

::: warning
ZenTS is a TypeScript framework, but the config files using the the CommonJS module syntax need the `.js` file extensions and don't support TypeScript syntax (but you can use `require()` instead of `import` etc.).
:::

::: tip
When you've created your project with the CLI, you'll find a `zen.json` in your root directory. Feel free to choose a different file format, but don't forget to delete the `zen.json` config file, otherwise it may be prioritized when loading the configuration for your application (which means your config file won't be loaded).
:::

## Loading environment based configuration

A ZenTS application supports environment based configuration. This allows you to create configuration files based on different environments, e.g. having a separate config file for _production_ and _development_ with different database options (different hostname, password, etc.). Similar to the _base_ configuration file, **one** of the following files will be loaded in the given order:

- `zen.ENV.json`: a JSON file
- `zen.ENV.yaml`: a YAML file
- `zen.ENV.yml`: a YAML file
- `zen.ENV.config.json`: a JSON file
- `zen.ENV.config.js`: a CommonJS module
- `zen.ENV.config.yaml` a YAML file
- `zen.ENV.config.yml` a YAML file

Where **ENV** stands for the value in `process.env.NODE_ENV`. For example if `NODE_ENV` is set to `production` the `zen.production.json` will be automatically loaded when the application starts.

### Setting environment variable

Node.js supports environment variables out of the box. The `NODE_ENV` variable can be defined by appending it to the start command of your application:

```shell
NODE_ENV=development ts-node src/app.ts
NODE_ENV=production node dist/app.js
```

### Using .env files

ZenTS doesn't support **.env** files by default, but you can add them easily by requiring the [dotenv package](https://www.npmjs.com/package/dotenv) from the npm registry:

```shell
cd myproject
npm install dotenv --save # or yarn add dotenv
```

After installing open your `src/app.ts` file and add the highlighted code:

```typescript{1,4}
import * as dotenv from 'dotenv'
import { zen } from 'zents'

dotenv.config()
;(async () => {
  await zen()
})()
```

Now create a `.env` file in your projects root directory (**not** in the `src` directory):

```
# Example .env file
NODE_ENV=development
```

::: danger
If you're using **_git_** or similar versioning tools, you shouldn't commit your .env files, as they usually contain sensitive information like database credentials or similar.
:::

More information and options can be found in the [dotenv package documentation](https://www.npmjs.com/package/dotenv).

## Default configuration

ZenTS has a default configuration, which gets merged with your _base_ and _environment_ specific configuration. The default values can be reviewed in the [API reference](./api/).

## Merging configuration files

With three possible configuration files (_default_ config, _base_ config and _environment_ specific config) in place you may wonder how these configuration options get merged:

- _Default_ config
- _Base_ config
- _Environment_ config

While the later one takes superior over properties defined in previous configurations.

Take a look at the following example, where each configuration file defines a `port` value:

:::: tabs
::: tab JSON

```json
// the default ZenTS config
{
  "web": {
    "port": 3000
  }
}
```

:::
::: tab CommonJS Module (.js)

```js
// the default ZenTS config
module.exports = {
  web: {
    port: 3000,
  },
}
```

:::
::: tab YAML

```yaml
# the default ZenTS config
web:
  - port: 3000
```

:::
::::

:::: tabs
::: tab JSON

```json
// the base config (e.g. zen.json)
{
  "web": {
    "port": 8080
  }
}
```

:::
::: tab CommonJS Module (.js)

```js
// the base config (e.g. .zenrc.js)
module.exports = {
  web: {
    port: 8080,
  },
}
```

:::
::: tab YAML

```yaml
#  the base config (e.g. zen.yaml)
web:
  - port: 8080
```

:::
::::

:::: tabs
::: tab JSON

```json
// the environment config (e.g. zen.production.json)
{
  "web": {
    "port": 80
  }
}
```

:::
::: tab CommonJS Module (.js)

```js
// the environment config (e.g. zen.production.config.js)
module.exports = {
  web: {
    port: 80,
  },
}
```

:::
::: tab YAML

```yaml
# the environment config (e.g. zen.production.yaml)
web:
  - port: 80
```

:::
::::

In this example, the _default_ **port** the webserver is listening at is set to `3000`. This value is overwritten by the _base_ config (`zen.json`) with `8080`. This would be the webserver port when starting the application with `zen dev` (or `npm start`). But in production your webserver probably want to listen to the default HTTP port (`80`), which is set in the _environment_ specific config file (`zen.production.json`).

## Time formatting

ZenTS supports time formatting to milliseconds when it accepts a configuration value to be in milliseconds. Take for example the `expire` for sessions, they can either be given in milliseconds or with a time string (e.g. `7 days`) which will automatically converted to milliseconds.

The following time strings can be used:

- Year (e.g. `7 years`, `3y`): `years`, `year`, `yrs`, `yr`, `y`
- Week (e.g. `7 weeks`, `3w`): `weeks`, `week`, `w`
- Day (e.g. `7days`, `3d`): `days`, `day`, `d`
- Hour (e.g. `7hours`, `3h`): `hours`, `hour`, `hrs`, `hr`, `h`
- Minute (e.g. `7 min`, `3m`): `minutes`, `minute`, `mins`, `min`, `m`
- Second (e.g. `7seconds`, `3s`): `seconds`, `second`, `secs`, `sec`, `s`
- Millisecond (e.g. `7ms`): `milliseconds`, `millisecond`, `msecs`, `msec`, `ms`

## Configuration options

The following chapter listen all possible configuration options. Most options are optional.

### Path related options

These options allows you to set the default paths where the _AutoLoader_ searches for an applications [controllers](./guide/advancedguides/controllers.md), [templates](./guide/advancedguides/templates.md), [entities](./guide/advancedguides/database.md), etc. They are all set under the `paths` option property.

- `paths.base` (object):
  Containing the base path of an application.

- `paths.base.src` (string, default: `APP_ROOT_DIR/src`):
  The directory containing the applications source code. This path must be absolute.

- `paths.base.dist` (string, default: `APP_ROOT_DIR/dist`):
  The dist directory where the TypeScript compiler puts the generated (JavaScript) source code. This should be set to the same directory as the `outDir` option in `tsconfig.json`. This path must be absolute.

- `paths.controller` (string, default: `./controller/`):
  The path to the application controller directory (relative to the `paths.base.src` or `paths.base.dist` directory). All controllers will be loaded from here recursively.

- `paths.view` (string, default `./view/`):
  The path where you store the application templates files (relative to the `paths.base.src` or `paths.base.dist` directory).

- `paths.template` (string, default: `./template/`):
  The path where template engine extensions (e.g. custom filters) are stored (relative to the `paths.base.src` or `paths.base.dist` directory).

- `paths.service` (string, default: `./service/`):
  The path to the application service directory (relative to the `paths.base.src` or `paths.base.dist` directory). All services will be loaded from here recursively.

- `paths.entity` (string, default: `./entity/`):
  The path where your application entities are stored (relative to the `paths.base.src` or `paths.base.dist` directory).

- `paths.entity` (string, default: `./entity/`):
  The path where your application entities are stored (relative to the `paths.base.src` or `paths.base.dist` directory).

- `paths.public` (string | boolean, default: `APP_ROOT_DIR/public`):
  The absolute path to the `public` directory. Files in the `public` directory will be served as static files (usually used for css, frontend JavaScript files, ...). You can set this value to `false` to disable static file support.

### Web related options

These options allow you to fine control the webserver of your application. You can configure things like HTTPS support or the request body parser.

- `web.host` (string, default: `localhost`):
  The hostname of the webserver.

- `web.port` (number, default: `3000`):
  The port of the webserver.

- `web.publicPath` (string | boolean, default: `/public/`):
  The URL under which static files are served (e.g. http://localhost:3000/public/). Set this value to `false` to disable static file support.

- `web.https` (object)
  Contains HTTPS related configuration options.

- `web.https.enable` (boolean, default: `false`):
  Enable HTTPS. You either need to supply `web.https.key` and `web.https.cert` or `web.https.pfx` and `web.https.passphrase` depending on your needs. Failing to set a config value for one of the given sets will throw an error when the applications boots.

- `web.https.key` (string, default: `undefined`):
  Private key(s) in PEM format.

- `web.https.cert` (string, default `undefined`):
  The content of a PEM cert file.

- `web.https.pfx` (string, default: `undefined`):
  PFX or PKCS12 encoded private key and certificate chain.

- `web.https.passphrase` (string, default `undefined`):
  Shared passphrase used for a single private key and/or a PFX.

- `web.querystring` (object)
  Contains configuration options related to the [querystring parser](https://www.npmjs.com/package/qs).

- `web.querystring.comma` (boolean, default: `false`):
  Use commas to construct an array query parameter (e.g. `foo=bar,baz` will be parsed as `{ foo: ['bar', 'baz]}`).

- `web.querystring.delimiter` (string/RegEx, default: `&`):
  The delimiter used to separate two or more querystring key-value pairs (e.g. set `delimiter` option to `;` in order to parse `foo=bar;baz=buz` correctly).

- `web.querystring.depth` (number, default: `5`):
  The maximum depth nested objects (e.g.`foo[bar][baz]=42`) will be parsed. It's recommend to keep this number reasonably small, otherwise the application might be vulnerable to attacks.

- `web.querystring.arrayLimit` (number, default: `20`):
  The limit when specifying indices in an array can be set to this value. Similar to the `depth` limit, this value should be reasonably small in order to protect your application from attacks.

- `web.querystring.parseArrays` (boolean, default: `true`):
  Parsing arrays can be disabled by setting the option to `false`.

- `web.querystring.allowDots` (boolean, default: `false`):
  Set this to `true` to allow dot notation to be parsed (`foo.bar=bar` is equal to `foo[bar]=bar`).

- `web.querystring.plainObjects` (boolean, default: `false`):
  When using the `plainObjects` option, the parsed value is returned as a null object, created via `Object.create(null)` and as such, you should be aware that prototype methods will not exist on it and a user may set those names to whatever value they like. It is generally a bad idea to enable this option, as it can cause problems when attempting to use the properties that have been overwritten. Always be careful with this option ([Source](https://www.npmjs.com/package/qs)).

- `web.querystring.allowPrototypes` (boolean, default: `false`):
  See `web.querystring.plainObjects`.

- `web.querystring.parameterLimit` (number, default: `1000`):
  The number of parameters that will be parsed. The default number `1000` is suitable for almost all web applications. You should only set this number higher if you really need it.

- `web.querystring.strictNullHandling` (boolean, default: `false`):
  Allow parsing of `null` values more strictly. When this option is set to `false` (default), `null` will be threaten like empty strings (e.g. `foo&bar=` is parsed as `{ foo: '', bar: '' }`). If you wish to distinguish between `null` and empty values set this option to `true`. The previous example then is parsed like this: `{ foo: null, bar: '' }`.

- `web.querystring.charset` (string, default: `utf-8`):
  Allows you to set the charset to _iso-8859-1_ for supporting legacy browsers.

- `web.querystring.charsetSentinel` (boolean, default: `false`):
  Allows to set the charset dynamically based on a specific `utf8` form value. Please read [this](https://www.npmjs.com/package/qs) about more information.

- `web.querystring.interpretNumericEntities` (boolean, default: `false`):
  Set this option to `true` if you want to decode the `&#...;` syntax to the actual characters. (e.g. `foo=%26%239786%3B'` when using charset `iso-8859-1` will become `{ foo: '☺' }`)

- `web.bodyParser` (object)
  Contains settings related to the [request body parser](https://www.npmjs.com/package/formidable).

- `web.bodyParser.encoding` (string, default: `utf-8`):
  The encoding used for body fields.

- `web.bodyParser.uploadDir` (string, default: `os.tmpdir()`):
  The absolute path to the directory where uploaded files will be placed.

- `web.bodyParser.keepExtensions` (boolean, default: `false`):
  Set this option to `true` if you want to keep the extensions of the uploaded files.

- `web.bodyParser.maxFileSize` (number, default: `200 * 1024 * 1024`):
  Max file size in bytes of uploaded files. Default is `200mb`.

- `web.bodyParser.maxFieldsSize` (number, default: `20 * 1024 * 1024`):
  Limit the amount of memory all fields together (except uploaded files) can allocate in bytes. Default is `20mb`.

- `web.bodyParser.maxFields` (number, default: `1000`):
  Limit the number of fields that will be parsed.

- `web.bodyParser.hash` (string | number, default: `false`):
  Include a checksum for uploaded files. Set this option to a hash algorithm (see [crypto.createHash()](https://nodejs.org/api/crypto.html#crypto_crypto_createhash_algorithm_options) for supported algorithm).

- `web.bodyParser.multiples` (boolean, default: `false`):
  Set this to `true` if you want to support submitting multiple files using the HTML `multiple` attribute.

- `web.router` (object)
  Contains configuration options to setup the routing feature of your application.

- `web.router.ignoreTrailingSlash` (boolean, default: `false`):
  Set this to `true` if you want to ignore trailing slashes in route definitions (e.g. `/foo/` and `/foo` becomes the same).

- `web.router.allowUnsafeRegex` (boolean, default: `false`):
  Set this to `true` if you want to disable RegEx checks for catastrophic exponential-time regular expressions (Docs: [safe-regex2](https://github.com/fastify/safe-regex2)). This is not recommend and should be set to `false` (default).

- `web.router.caseSensitive` (boolean, default: `true`):
  Set this option to `false` if you want your routes to be case insensitive. All paths will then be matched as lowercase, but route parameters or wildcards will contain their original letter casing.

- `web.router.maxParamLength` (number, default: `100`):
  Set the maximum number of parameters a route can take.

### Database related options

[TypeORM](https://typeorm.io) is highly configurable, but its configuration depends on which driver / database you're using. In general, the following config parameters have to be set for every driver:

- `database.enable` (boolean, default: `false`):
  Set this value to `true` to enable database support in your application.

- `database.type` (string, default: `undefined`):
  The type of database you're using. The value has to be one of `mysql`, `mariadb`, `postgres`, `cockroachdb`, `sqlite`, `mssql`, `sqljs` or `mongodb`.

- `database.host` (string, default: `undefined`):
  The database host.

- `database.port` (number, default: `undefined`):
  The database port.

- `database.username` (string, default: `undefined`):
  The username for the database.

- `database.password` (string, default: `undefined`):
  The password for the database user.

- `database.database` (string, default: `undefined`):
  The database to connect to.

Depending on the database you're using, TypeORM supports a wide range of extra options. Please refer to the official documentation for more information about specific driver configuration options.

- [MySQL / MariaDB specific options](https://typeorm.io/#/connection-options/mysql--mariadb-connection-options)
- [PostgreSQL / CockroachDB specific options](https://typeorm.io/#/connection-options/postgres--cockroachdb-connection-options)
- [SQLite specific options](https://typeorm.io/#/connection-options/sqlite-connection-options)
- [MSSQL specific options](https://typeorm.io/#/connection-options/mssql-connection-options)
- [SQL.js specific options](https://typeorm.io/#/connection-options/sqljs-connection-options)
- [MongoDB specific options](https://typeorm.io/#/connection-options/mongodb-connection-options)

::: warning
TypeORM's multiple connections are currently not supported by ZenTS. This feature will be added as soon as possible to ZenTS.
:::

### Security related options

These options let you setup different security providers and stores, so that specific URL resources can only be accessed by allowed users. Please take a look at the [user and session management guide](./guide/advancedguides/user_management.md) for a full tutorial.

- `security.enable` (boolean, default: `false`):
  Set this value to `true` to enable security and session support in your application.

- `security.strategy` (string, default: `cookie`):
  The place ZenTS will look for the JSON Web Token. Can either be `cookie`, `header` or `hybrid` ([guide](./guide/advancedguides/user_management.md#choosing-the-right-auth-strategy)).

- `security.cookieKey` (string, default: `zenapp_jwt`):
  The key of the cookie when using the `cookie` security strategy.

- `security.secretKey` (string, default: `undefined`):
  The secret key has to be at least 32 characters strong and shouldn't been shared public. You can use `zen security:secret-key` to generate a secret key for your application ([CLI](./cli.md) needs to be installed for that).

- `security.token` (object)
  Contains settings related to [JSON Web Token](https://jwt.io/).

- `security.token.algorithm` (string, default: `HS256`):
  The algorithm used to encrypt the JSON web token. Either `HS256`, `HS384` or `HS512`.

- `security.token.audience` (string | string[], default: `undefined`):
  Provide one or more audiences that are checked against the token.

- `security.token.issuer` (string, default: `undefined`):
  Provide one issuer that is checked against the token.

- `security.token.subject` (string, default: `undefined`):
  The subject of the JSON web token.

- `security.token.jwtid` (string, default: `undefined`):
  The JWT ID of the JSON web token.

- `security.token.keyid` (string, default: `undefined`):
  The Key ID of the JSON web token.

- `security.providers` (array)
  Contains so-called security providers activated for the application. Each element must be an object with the following properties.

- `security.providers[].name` (string, default: `default`):
  The name of the provider. It's mandatory to specify a name when using more then one security provider.

- `security.providers[].entity` (string, default: `undefined`):
  A valid entity identifier that holds user credentials.

- `security.providers[].table` (object)
  Options related to the entity.

- `security.providers[].table.identifierColumn` (string, default: `id`):
  The primary column (usually the ID) of the entity.

- `security.providers[].table.passwordColumn` (string, default: `password`):
  The column where the users password is stored.

- `security.providers[].algorithm` (string, default: `argon2id`):
  The algorithm used to encrypt/verify a users password field. Either `argon2id` or `bcrypt`.

- `security.providers[].argon` (object)
  Options related to the `argon2id` algorithm.

- `security.providers[].argon.memLimit` (number):
  See [here](https://github.com/emilbayes/secure-password#var-pwd--new-securepasswordopts).

- `security.providers[].argon.opsLimit` (number):
  See [here](https://github.com/emilbayes/secure-password#var-pwd--new-securepasswordopts).

- `security.providers[].bcrypt` (object)
  Options related to the `bcrypt` algorithm.

- `security.providers[].bcrypt.saltRounds` (number, default: `12`):
  The number of salt rounds used to encrypt the password. The higher the value the more secure the created hash will be and the longer it takes to generate one.

- `security.providers[].store` (object)
  Options related to the session store. It's mandatory to configure a store for a security provider.

- `security.providers[].type` (string):
  The store type, either `redis`, `database` or `file`.

- `security.providers[].prefix` (string, default: `zen_`) _redis and file only_:
  The prefix used for the keys in redis or filenames.

- `security.providers[].keepTTL` (boolean, default: `false`) _redis only_:
  Should the TTL be renewed when data is written to the store?

- `security.providers[].entity` (string) _database only_:
  The key of the entity which is used to store session related data.

- `security.providers[].folder` (string) _file only_:
  A absolute path to a folder where session data files are stored.

- `security.providers[].expire` (string | number, default: `7d`):
  The session expire time, either as number in milliseconds or as a time string (e.g. `7d`, `8h`, ...).

- `security.providers[].url` (object)
  Options related to the login and logout URL.

- `security.providers[].url.login` (string, default: `/login`):
  The login URL for this provider. If you use more then one security provider you've to configure this URL.

- `security.providers[].url.logout` (string, default: `/logout`):
  The logout URL for this provider. If you use more then one security provider you've to configure this URL.

- `security.providers[].fields` (object)
  Options related to body request fields when requesting the login URL.

- `security.providers[].fields.username` (string, default: `username`):
  The request body parameter that contains the username.

- `security.providers[].fields.password` (string, default: `password`):
  The request body parameter that contains the password.

- `security.providers[].responseType` (string, default: `redirect`):
  The response type from the security system when calling auto response URLs like `/login`, `/logout`, etc.

- `security.providers[].redirect` (object)
  Options related to the redirect response type

- `security.providers[].redirect.login` (string, default: `/`):
  The redirect URL after a successful login has happened.

- `security.providers[].redirect.logout` (string, default: `/`):
  The redirect URL after a successful logout has happened.

- `security.providers[].redirect.failed` (string, default: `/`):
  The redirect URL after a security request has failed.

- `security.providers[].redirect.forbidden` (string, default: `/`):
  The redirect URL after a user tries to access a forbidden resource.

### Template engine related options

The build in template engine, [Nunjucks](https://mozilla.github.io/nunjucks/), supports a wide range of configuration parameters which can be configured via ZenTS config file.

- `template.extension` (string, default: `njk`):
  The file extension to use for template files. Can be one of: `njk`, `nunjucks`, `nunjs`, `nj`, `html`, `htm`, `template`, `tmpl` or `tpl`.

- `template.autoescape` (boolean, default: `true`):
  If set to `true`, potential dangerous characters will be automatically escaped. You should only set this to `false` if you know what you're doing.

- `template.throwOnUndefined` (boolean, default: `false`):
  The template engine will throw an error when outputting `null` or `undefined` values when this config property is set to `true`. Otherwise these values are ignored in the output.

- `template.trimBlocks` (boolean, default: `false`):
  Removes trailing whitespace from a block-tag when enabled.

- `template.lstripBlocks` (boolean, default: `false`):
  Removes leading whitespace from a block-tag when enabled.

- `template.noCache` (boolean, default: `false`):
  Disables the internal template cache when set to `true`.

- `template.encoding` (string, default: `utf8`):
  The template file encoding. Can be one of: `ascii`, `utf8`, `utf-8`, `utf16le`, `ucs2`, `ucs-2`, `base64`, `latin1`, `binary` or `hex`.

- `template.tags` (object)
  Overwrites the syntax for template tags. See the [official documentation](https://mozilla.github.io/nunjucks/api.html#customizing-syntax) for more information.

### EMail related options

The email system uses various packages that can be configured inside your application. Please refer to the [nodemailer](https://nodemailer.com) documentation for all configuration parameter like `host` and `port`. Furthermore the following ZenTS related properties are supported.

- `email.enable` (boolean, default: `false`):
  Set this value to `true` to enable email support.

- `email.engine` (string, default: `mjml`):
  The engine to use when rendering email templates. Either `mjml`, `nunjucks` or `plain`.

- `email.mailOptions` (object):
  The default options that will be used when sending mails through [nodemailer](https://nodemailer.com/message/). Supports all SendMail options from [nodemailer](https://nodemailer.com/message/) and [html-to-text](https://github.com/html-to-text/node-html-to-text). Furthermore the following ZenTS related options are supported:

- `email.mailOptions.template` (string):
  The default template used when rendering emails (`mjml` or `nunjucks` engine only).

- `email.mailOptions.keepText` (boolean):
  Don't overwrite text content with html-to-text module.

- `email.htmlToText` (object):
  All options from [html-to-text](https://github.com/html-to-text/node-html-to-text) are supported.

- `email.htmlToText` (boolean, default: `true`):
  Enable or disable text content generator.

- `email.mjml` (object):
  Please see the [MJML](https://documentation.mjml.io/#inside-node-js) documentation for all supported config values.

### Log related options

- `log.level` (string, default: `info`):
  The default logging level, all logging under this level won't be send to stdout. Can be one of: `fatal`, `error`, `warn`, `log`, `info`, `success`, `debug` or `trace` (in the order of importance).

- `log.wrapConsole` (boolean, default: `false`):
  Enable this option to use the native `console.FN()` for logging. Otherwise you have to use the `log` wrapper exposes by the `zents` package.
