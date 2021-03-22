---
title: Sending emails
lang: en-US
meta:
  - name: keywords
    content: emails mjml responsive ZenTS guide tutorial documentation dependency injection framework mvc TypeScript
---

# {{ $frontmatter.title }}

<GuideHeader guide="email">
  [[toc]]
</GuideHeader>

## Introduction

ZenTSs email system, [Nunjucks](./templates.md) and [MJML](https://mjml.io/) are a powerful builtin system for your web application. With it, you can send responsive emails using complex templates, file attachments, automatic generation of text content and much more.

## Configuration

Before we can start sending emails into the world wide web, we have to activate and configure our SMTP connection. First of all, the email system is deactivated by default. Open your ZenTS configuration file and enable the system by setting the `email.enable` property to `true`. Now you've to configure a host by setting the `email.host` property. Optionally a default sender can be set by using the `email.mailOptions.from` property, otherwise a sender has to be defined for every email that is sent.

A example configuration looks like this:

```json
{
  "email": {
    "enable": true,
    "host": "127.0.0.1",
    "mailOptions": {
      "from": "info@example.com"
    }
  }
}
```

::: tip
ZenTS email system is highly configurable. Head over to the [configuration guide](./../../configuration.md) for more information.
:::

## What is MJML?

[MJML](https://mjml.io/) is a "responsive email framework" that make writing templates that are responsive in almost all clients (even Outlook) very easy. ZenTS ships with MJML out of the box, so you don't need to install everything extra when you want to send emails with MJML templates. MJML is written in tags, similar to HTML:

```html
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-image width="100px" src="/assets/img/logo-small.png"></mj-image>

        <mj-divider border-color="#F45E43"></mj-divider>

        <mj-text font-size="20px" color="#F45E43" font-family="helvetica">Hello World</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
```

The MJML engine will transpile the above code to HTML, that can be easily displayed by most email clients.

::: tip
Make sure to read the [Getting started](https://mjml.io/getting-started-onboard) guide and the [MJML documentation](https://documentation.mjml.io/) if you aren't familiar with MJML yet. You can try it also out online [here](https://mjml.io/try-it-live).
:::

### MJML isn't a programmic language

One disadvantages of MJML is that it isn't a programmic language. Similar to HTML, MJML can't loop through an array (or even knows the concept of an array) or assign values to variables. That's because MJML is just designed to be a markup language, but for a developer that means that a MJML template can't have any logic and thus, the logic has to be written somewhere else, for example in a controller action or other helper functions. This can become ugly pretty quick and hard to maintenance.

But here comes ZenTS into play, because it combines MJML with the [template engine](./templates.md) it already uses to deliver HTML code to the browser. That gives you the ability to use for example conditional expression inside of a MJML template.

For example take a look at this MJML template:

```twig
<mjml>
  <mj-body>
    <mj-section>
      {% for item in items %}
        <mj-column> {{ item }} </mj-column>
      {% endfor %}
    </mj-section>
  </mj-body>
</mjml>
```

Given this payload...

```javascript
{
  items: ['foo', 'bar']
}
```

... the email system will render two columns showing "foo" and "bar".

::: tip
Make sure to read the [template engine guide](./templates.md) to learn more about ZenTS template engine.
:::

## Choosing an engine & storing templates

The default engine is MJML, because it allows easy writing of responsive html emails. But if you don't need it or for whatever reason don't want to use MJML, you can switch to a different engine by setting the `email.engine` property in the ZenTS configuration file.

The available engines are:

- MJML
- nunjucks
- plain

When using the `nunjucks` engine you can write the email templates in nunjucks code the same way you can write [ZenTS templates](./templates.md) (but skipping the MJML transpiler part). When using the `plain` engine, you've to supply at least a `html` property for every email you send. This way you can bring your own rendering engine for emails.

When using the MJML or nunjucks engine template files are stored in the `/src/email/` (configurable) directory of your application. When using MJML, the template files need to have a `.mjml` extension.

## Sending messages

Sending emails is done in a controller action or a service method. To start sending emails, the framework exposes a `@email()` annotation, which has to be bound to a function argument:

```typescript
import {  Controller, get, Email, email } from 'zents'

export default extends Controller {
  @get('/send-mail')
  public async sendMail(@email email: Email) {
    // ...

    await email.send({
        template: 'order',
        to: 'foo@bar.com',
        payload: {
            id: 1,
            items: [/* ... */]
            /* ... */
        }
    })

    // ...
  }
}
```

Lets take a look what is happening here:

- _line 5_: Use the `@email()` annotation to send emails.
- _line 8_: Start sending a new email, this `send()` method returns a Promise, so we have to use `await` here to make sure the email has been send before continuing.
- _line 9_: The email will be rendered using the `order` template, which has to be located in `src/email/order.mjml` (when using MJML engine).
- _line 10_: The receiver of the email message.
- _line 11_: The payload that is available in the template (`src/email/order.mjml`). The variables can be used with nunjucks syntax (when using MJML or nunjucks engine).

## Attachments

Attachments can be send by using the `attachments` property when calling `send()`:

```typescript
import {  Controller, get, Email, email } from 'zents'

export default extends Controller {
  @get('/send-mail')
  public async sendMail(@email email: Email) {
    // ...

    await email.send({
        attachments: [
            {   // utf-8 string as an attachment
                filename: 'text1.txt',
                content: 'hello world!'
            },
            {   // binary buffer as an attachment
                filename: 'text2.txt',
                content: new Buffer('hello world!','utf-8')
            },
            {   // file on disk as an attachment
                filename: 'text3.txt',
                path: '/path/to/file.txt' // stream this file
            },
            {   // filename and content type is derived from path
                path: '/path/to/file.txt'
            },
            {   // stream as an attachment
                filename: 'text4.txt',
                content: fs.createReadStream('file.txt')
            },
            {   // define custom content type for the attachment
                filename: 'text.bin',
                content: 'hello world!',
                contentType: 'text/plain'
            },
            {   // use URL as an attachment
                filename: 'license.txt',
                path: 'https://raw.githubusercontent.com/sahachide/ZenTS/master/LICENSE'
            },
            {   // encoded string as an attachment
                filename: 'text1.txt',
                content: 'aGVsbG8gd29ybGQh',
                encoding: 'base64'
            },
            {   // data uri as an attachment
                path: 'data:text/plain;base64,aGVsbG8gd29ybGQ='
            },
            {
                // use pregenerated MIME node
                raw: 'Content-Type: text/plain\r\n' +
                    'Content-Disposition: attachment;\r\n' +
                    '\r\n' +
                    'Hello world!'
            }
        ]
    })

    // ...
  }
}
```

## HTML to Text generator

ZenTS will automatically convert the HTML content of an email to a plain text version, which can be read in older email clients or clients that doesn't support HTML messages.

To disable the HTML to Text generator, set the `email.htmlToText.enable` property to `false`. The generator can also be further configured. Please see the [configuration guide](./../../configuration.md) for more information.

## Next steps

Congrats :tada: :tada: :tada:

You've just learned how to send emails from your ZenTS web application. Now you should be familiar with all aspects on how to develop awesome applications with ZenTS. You can dig even deeper into it by reading the [API reference](./../../api/) or learn more about the [CLI](./../../cli.md).

Nevertheless, thank you for reading this guide and using ZenTS. And of course, happy coding :purple_heart:
