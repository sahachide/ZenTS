---
title: Views & Templates
lang: en-US
meta:
  - name: keywords
    content: ZenTS guide tutorial documentation template engine framework mvc TypeScript
---

# {{ $frontmatter.title }}

<GuideHeader guide="templates">
  [[toc]]
</GuideHeader>

## Introduction

_Views_ are part of the [MVC architecture](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) and responsible for displaying data to the user. They can also be described as the presentation layer of the MVC architecture. In ZenTS views are created using templates. A template is the best way to render and organize HTML code inside your application. It usually contains HTML code and some logic on how to render the HTML properly. Templates in ZenTS applications are written with [Nunjucks](https://mozilla.github.io/nunjucks/), a powerful, fast and extensible template engine for Node.js. Nunjucks is build into ZenTS, so you don't need to install it by yourself. Of course, you're still free to use frontend-frameworks like [Vue.js](https://vuejs.org/), [React](https://reactjs.org/) or [AngularJS](https://angularjs.org/). In fact, they are a perfect pair for a ZenTS application (which is then used as the "backend" part of an application). Continue reading this guide and learn the basics of Nunjucks and how to render templates in your application. This guide will cover the most important things on how to use and extend the template engine, but it's always a good idea to take a look at the [official documentation](https://mozilla.github.io/nunjucks/templating.html) to learn more about [supported tags](https://mozilla.github.io/nunjucks/templating.html#tags) and [build-in filters](https://mozilla.github.io/nunjucks/templating.html#builtin-filters).

## Template language

Nunjucks allows you to write easy to understand and maintainable templates. Lets take a look at the following example, if you used similar template engines (like [Twig](https://twig.symfony.com/) or [Jinja](https://jinja.palletsprojects.com/)) before, then you'll be already familiar with the Nunjucks syntax:

```twig
<!DOCTYPE html>
<html>
    <head>
        <title>Welcome to ZenTS!</title>
    </head>
    <body>
        <h1>{{ title }}</h1>
        Hello {{ username }}!
    </body>
</html>
```

The above template code is pretty straightforward. In Nunjucks, variables are displayed using the <code v-pre>{{ ... }}</code> syntax. On the other hand, <code v-pre>{% ... %}</code> is used to run some logic, such as conditions (_if-else_) or loops (_for_).

You can't run TypeScript / JavaScript (backend) code inside your template code, but its possible to run math expressions and comparisons inside a template.

Nunjucks also supplies a lot of builtin filters, which are essential function that modifies an input value somehow. Filters are applied using the pipe (`|` operator):

```twig
{{ [1,2,3,4,5,6,7,8,9]|random }}
```

The above filter will return a random number (between 1-9) every time when its rendered. In ZenTS, you can also extend the template engine easily and write your own filters.

## Configuration

Nunjucks supports a wide range of configuration options, for example the syntax on how to display variables (<code v-pre>{{ ... }}</code>) can be changed to something else you prefer. Read the [configuration guide](./../../configuration.md) to learn more about them.

## Template file extension

Templates are placed in the `src/view` folder of your application. A nunjucks template can, according to the official documentation, have any file extension. However, the community has adopted to use `.njk` as file extension. This is also the default file extension used in ZenTS applications. Furthermore ZenTS limits the file extension to one of the following: `.njk`, `.nunjucks`, `.nunjs`, `.nj`, `.html`, `.htm`, `.template`, `.tmpl` or `.tpl`.

If you want to use a different file extension then the default `.njk`, you've to configure this in your projects config file. Keep in mind, that only one extension is allowed and that they can't be mixed.

## Directory structure

When your application grows, it's often a good advice to put your template files in sub-folders, where each sub-folder marks a logical _module_ of the application. For example, if you're writing a e-commerce application you maybe have templates to display, edit and create products and categories. Then the directory structure might look like this:

```
|-- src
    |-- view
        |-- navigation
        |   |-- create.njk
        |   |-- edit.njk
        |   |-- view.njk
        |-- product
            |-- create.njk
            |-- edit.njk
            |-- view.njk
```

Of course, you're free to create a directory structure that fits your needs. Templates can be even further nested in sub-directories or just keep in the `src/view` root directory.

::: tip
Keep in mind, that the default template directory `src/view` can be changed in the [configuration](./../../configuration.md).
:::

## Rendering templates in a controller

In order to render a template in a controller, you've to use the `render()` method attached to each controller:

```typescript
import {  Controller, get } from 'zents'

export default extends Controller {
  @get('/')
  public async index() {
    return await this.render('index')
  }
}
```

The above code will render the template located at `src/view/index.njk`. The `render()` method returns a `Promise`, which will be resolved with a so-called `TemplateResponse`. This makes it a perfect fit to return it as a response value for a controller action. If you need to access the rendered HTML code, you can do so by using the `html` property of a `TemplateResponse`.

When we go back to our previous example...

```twig
<!DOCTYPE html>
<html>
    <head>
        <title>Welcome to ZenTS!</title>
    </head>
    <body>
        <h1>{{ title }}</h1>
        Hello {{ username }}!
    </body>
</html>
```

... we see that this template uses two variables (<code v-pre>{{ title }}</code> and <code v-pre>{{ username }}</code>). These are part of the template context and need to be passed in when rendering the template. This is done by supplying a second argument to the `render()` method:

```typescript
import {  Controller, get } from 'zents'

export default extends Controller {
  @get('/')
  public async index() {
    return await this.render('index', {
        title: 'My ZenTS web-application',
        username: 'John Doe',
    })
  }
}
```

This will result in the following HTML being rendered:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Welcome to ZenTS!</title>
  </head>
  <body>
    <h1>My ZenTS web-application</h1>
    Hello John Doe!
  </body>
</html>
```

As said before, templates can be placed in various sub-folders. To render them, you've to call `render()` with the corresponding sub-folder structure:

```typescript
this.render('path/to/template')
```

In all cases, the file extension (`.njk`) is always omitted.

## Assign variables

Using the `set` keyword you can assign and modify variables directly in your template:

```twig
{% set username = 'zen' %}
{{ username }}
```

It's also possible to overwrite variables this way, which have been previously passed in by the `render()` method.

Furthermore it's possible to capture the content of a so-called _block_ into a single variable, allowing for more complex assigning variables:

```twig
{% set mood %}
    {% if hungry %}
        I am hungry
    {% elseif tired %}
        I am tired
    {% else %}
        I am good!
    {% endif %}
{% endset %}

{{ mood }}
```

::: warning
While it's allowed to _set_ a variable this way, you should always make sure to pass in the complete data via `render()` method and use `{% set ... %}` sparsely.
:::

## Conditional statements (if-elseif-else)

A Conditional statement tests if a condition evaluates to `true` and displays the content defined in the condition body:

```twig
{% if variable %}
  It is true
{% endif %}
```

In the above example, if `variable` is defined and evaluates to `true`, **_It is true_** will be displayed. Alternative conditions can be specified using `elseif` and/or `else`:

```twig
{% if hungry %}
  I am hungry
{% elseif tired %}
  I am tired
{% else %}
  I am good!
{% endif %}
```

Multiple conditions can be specified with the `and` and `or` keywords:

```twig
{% if happy and hungry %}
  I am happy *and* hungry; both are true.
{% endif %}

{% if happy or hungry %}
  I am either happy *or* hungry; one or the other is true.
{% endif %}
```

## For loops

For loops allow you to iterate over arrays, objects, Maps and Sets (and basically everything that implements the _iterable_ protocol):

:::: tabs
::: tab Template

```twig
<h1>Products</h1>
{% for item in items %}
  <div>
    {{ item.name }}<br>
    {{ item.price }}
  </div>
{% endfor %}
```

:::
::: tab Controller

```typescript
import {  Controller, get } from 'zents'

export default extends Controller {
  @get('/products')
  public async products() {
    return await this.render('products', {
        items: [
            {
                name: 'My Product 1',
                price: 2999,
            },
            {
                name: 'My Product 2',
                price: 4999,
            },
        ]
    })
  }
}
```

:::
::::

### Loop over object

The syntax is quiet similar when you want to loop over a object:

:::: tabs
::: tab Template

```twig
{% for ingredient, amount in food %}
  Use {{ amount }} of {{ ingredient }}
{% endfor %}
```

:::
::: tab Controller

```typescript
import {  Controller, get } from 'zents'

export default extends Controller {
  @get('/products')
  public async products() {
    return await this.render('products', {
        food: {
            ketchup: '5 tbsp',
            mustard: '1 tbsp',
            pickle: '0 tbsp'
        }
    })
  }
}
```

:::
::::

### Loop over Map

The next example shows how to loop over a Map:

:::: tabs
::: tab Template

```twig
{% for fruit, color in fruits %}
  Did you know that {{ fruit }} is {{ color }}?
{% endfor %}
```

:::
::: tab Controller

```typescript
import {  Controller, get } from 'zents'

export default extends Controller {
  @get('/products')
  public async products() {
      const fruits =  new Map([
        ['banana', 'yellow'],
        ['apple', 'red'],
        ['peach', 'pink']
    ])

    return await this.render('products', { fruits })
  }
}
```

:::
::::

### Special variables

Inside a loop, you've access to the following variables:

- `loop.index`: the current iteration of the loop (1 indexed)
- `loop.index0`: the current iteration of the loop (0 indexed)
- `loop.revindex`: number of iterations until the end (1 indexed)
- `loop.revindex0`: number of iterations until the end (0 based)
- `loop.first`: boolean indicating the first iteration
- `loop.last`: boolean indicating the last iteration
- `loop.length`: total number of items

They are useful when you want to gain more fine control on how a template is rendered.

## Builtin filters

Nunjucks has a lot of useful filters builtin, which can be applied using the pipe (`|`) operator or a `filter` block:

:::: tabs
::: tab | operator

```twig
{{ [1,2,3,4,5,6,7,8,9]|random }}
```

:::
::: tab filter block

```twig
{% filter replace("force", "forth") %}
may the force be with you
{% endfilter %}
```

:::
::::

It's also possible to chain multiple filters:

```twig
{{ ['FOO', 'BAR', 'BAZ']|first|capitalize }}
```

::: tip
The following chapters list a few of the important builtin filters. The full list of builtin filters can be found in the [official documentation](https://mozilla.github.io/nunjucks/templating.html#builtin-filters).
:::

### capitalize

Converts the first character to uppercase and the rest to lowercase.

:::: tabs
::: tab Template

```twig
{{ 'Lorem Ipsum Dolor Sit'|capitalize }}
```

:::
::: tab HTML

```html
Lorem ipsum dolor sit
```

:::
::::

### dump

Useful for debugging complexer objects or arrays. Calls `JSON.stringify()` on the object / array and dumps the result into the rendered HTML code:

:::: tabs
::: tab Template

```twig
{% set items = ['foo', 'bar', 'baz'] %}
{{ items|dump }}
```

:::
::: tab HTML

```html
["foo", "bar", "baz"]
```

:::
::::

### escape

Converts the characters &, <, >, ', and " into their HTML representations.

:::: tabs
::: tab Template

```twig
{{ '<html>'|escape }}
```

:::
::: tab HTML

```html
&lt;html&gt;
```

:::
::::

### first

Returns the first element in an array or the first character of a string.

:::: tabs
::: tab Template

```twig
{% set items = [1, 2, 3] %}
{{ items|first }}
```

:::
::: tab HTML

```html
1
```

:::
::::

### float

Converts the value into a floating point number. If the conversation fails (e.g. a string like `abc` is used as value), 0.0 will be returned (this can be overwritten by providing a default value as first argument, e.g. `value|float(1.0)`).

:::: tabs
::: tab Template

```twig
{{ '42.5'|float }}
```

:::
::: tab HTML

```html
42.5
```

:::
::::

### int

Converts the value into a integer. If the conversation fails (e.g. a string like `abc` is used as value), 0 will be returned (this can be overwritten by providing a default value as first argument, e.g. `value|int(1)`).

:::: tabs
::: tab Template

```twig
{{ '42.5'|int }}
```

:::
::: tab HTML

```html
42
```

:::
::::

### join

`join` returns a new string by concatenating all of the elements in an array.

:::: tabs
::: tab Template

```twig
{% set items = [1, 2, 3] %}
{{ items|join(',') }}
```

:::
::: tab HTML

```html
1,2,3
```

:::
::::

### last

Returns the last element in an array or the last character of a string.

:::: tabs
::: tab Template

```twig
{% set items = [1, 2, 3] %}
{{ items|last }}
```

:::
::: tab HTML

```html
3
```

:::
::::

### length

Returns the length of an array, a string or the numbers of keys in an object.

:::: tabs
::: tab Template

```twig
{{ [1, 2, 3]|length }}
{{ 'lorem'|length }}
{{ {key: value}|length }}
```

:::
::: tab HTML

```html
3 5 1
```

:::
::::

### lower

Converts a string to lowercase.

:::: tabs
::: tab Template

```twig
{{ 'loREmIPsUm'|lower }}
```

:::
::: tab HTML

```html
loremipsum
```

:::
::::

### nl2br

Replaces new lines with `<br />` elements. This can be useful when displaying data that has been entered in a `<textarea>`.

:::: tabs
::: tab Template

```twig
{{ 'foo\nbar'|nl2br }}
```

:::
::: tab HTML

```html
foo<br />bar
```

:::
::::

### random

Returns a random value from an array.

:::: tabs
::: tab Template

```twig
{{ [1, 2, 3, 4, 5, 6, 7, 8, 9]|random }}
```

:::
::: tab HTML

A value between _1_ and _9_ (inclusive).

:::
::::

### replace

Replace a entry with a different entry. The first argument is the _search_ part, the second argument is the value which replaces _search_.

:::: tabs
::: tab Template

```twig
{% set foo = 'Hello World!' %}
{{ foo|replace('World', 'from ZenTS') }}
```

:::
::: tab HTML

```html
Hello from ZenTS!
```

:::
::::

### safe

Marks the value as safe, which means that this value won't be escaped. This can be dangerous when using with user input values.

:::: tabs
::: tab Template

```twig
{{ '<html></html>'|safe }}
```

:::
::: tab HTML

```html
<html></html>
```

:::
::::

### trim

Strips leading and trailing whitespace from a string.

:::: tabs
::: tab Template

```twig
{{ '  foo '|trim }}
```

:::
::: tab HTML

```html
foo
```

:::
::::

### upper

Converts a string to uppercase.

:::: tabs
::: tab Template

```twig
{{ 'foo'|upper }}
```

:::
::: tab HTML

```html
FOO
```

:::
::::

### and more...

Don't forget that nunjucks has many more builtin filters. Checkout the official documentation [here](https://mozilla.github.io/nunjucks/templating.html#builtin-filters).

## Custom filters

Nunjucks supports custom filters and ZenTS makes it super easy to create them. Custom filters are registered in the `src/template/filter` directory (the base directory `src/template/` can be changed in the projects configuration file, but the `filter` sub-folder is mandatory). Each `.ts` file created in this folder will be considered as a filter for the template engine and are auto-loaded when the application starts.

### Creating a custom filter

#### Registering custom filter

As said before, custom filters are auto-loaded by ZenTS and must follow the same naming conventions then a [controller](./controllers.md). A filter is a standard ECMAScript class with a public `run()` method.

In order for the _AutoLoader_ to register your custom filter probably, the class has to use either a `default` export or exporting a member with the same property then the filename.

:::: tabs
::: tab Using the default export (recommend)

```typescript
// src/template/filter/MyFilter.ts
export default class {
  // implementation...
}
```

:::
::: tab Using exported members

```typescript
// src/template/filter/MyFilter.ts
export class MyFilter {
  // implementation...
}
```

:::
::::

In both cases the filter will be registered as `myfilter` and is available as <code v-pre>{{ title|myfilter }}</code> in the template code.

Sometimes using the filename (convert to lowercase) as the key for a custom filter isn't sufficient, for example when you want to use _camelCase_ for your filters. In that case you can add a static member `filtername` to your exported class:

```typescript
// src/template/filter/MyFilter.ts
export default class {
  static filtername = 'customFilter'
  // implementation...
}
```

The filter is then registered as `customFilter` and can be used with <code v-pre>{{ title|customFilter }}</code> in templates.

#### A example filter

Lets create our first custom filter. It will format a number to a given currency format (default `en-US`) and optionally displays the correct currency sign:

```typescript
// src/template/filter/CurrencyFormat.ts
export default class {
  static filtername = 'currency'
  public run(val: number | string, locale: string = 'en-US', currency: string = null) {
    const opts =
      typeof currency === 'string'
        ? {
            style: 'currency',
            currency,
          }
        : undefined

    return new Intl.NumberFormat(locale, opts).format(val)
  }
}
```

This filter returns a string which is formatted using the [Intl.NumberFormat().format()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat) method and it takes two optional arguments, `locale` and `currency`.

Using this filter in templates is simple:

:::: tabs
::: tab Template

```twig
{{ 123456.78|currency }}
```

:::
::: tab Output

```html
123,456.78
```

:::
::::

Using a different locale:

:::: tabs
::: tab Template

```twig
{{ 123456.78|currency('de-DE') }}
```

:::
::: tab Output

```html
123.456,78
```

:::
::::

Displaying currency sign:

:::: tabs
::: tab Template

```twig
{{ 123456.78|currency('de-DE', 'EUR') }}
```

:::
::: tab Output

```html
123.456,78 €
```

:::
::::

### Async filter

It's possible to use `async` / `await` in a custom filter `run()` method. In order for the AutoLoader to understand that the filter is `async`, we need to attach a static `async` member to the filter class:

```typescript{3,5}
// src/template/filter/MyAsyncFilter.ts
export default class {
  static async = true

  public async run(val) {
    // implementation can use await now
  }
}
```

::: danger
You've to use the `asyncEach` tag when you want to use a custom `async` filter in loops. Using the `for` tag will fail to return the correct value from a filter, because its `Promise` won't be resolved until then. In general, it isn't a good idea to use `async` filters at all, because they produce a lot of overhead. Better construct the correct data in the [controller](./controllers.md) before passing it into the template.
:::

## Extending templates

Nunjucks has a powerful template inheritance system which allows the developer to organize and reuse templates efficient. This is done by defining so-called `blocks` that child templates can override or extend.

Lets start with a simple example. In a web application you might have a layout template, which is the skeleton of the website (e.g. with a header, navigation and a footer) and other templates extend the layout.

First we create our base layout template and save it to `src/view/layout/default.njk`:

```twig
<!doctype html>
<html>
<head>
  <title>{% block title %}My Web Application{% endblock %}</title>
</head>
<body>
  <nav>
    <ul>
      <li>Home</li>
      <li>Products</li>
      <li>About us</li>
    </ul>
  </nav>
  <div class="content">
    {% block content %}Default Content{% endblock %}
  </div>
</body>
</html>
```

This template is pretty straightforward. It has a `<title>` with a default text, which is shown in the browser title bar, a simple navigation and a _content_-block.

A template that extends our default layout has now the ability to change or extend the content of our two blocks (_title_ and _content_). The navigation (`<nav>`) on the other hand can't be changed in templates extending the default layout template, because it isn't defined as block.

So lets create a new template in `src/view/startpage.njk` that extends our base layout template:

```twig
{% extends 'layout/default' %}

{% block title %}{{ super() }} - Startpage{% endblock %}

{% block content %}
Welcome to my web application.
{% endblock %}
```

Rendering the `src/view/startpage.njk` will result in the following HTML output:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My Web Application - Startpage</title>
  </head>
  <body>
    <nav>
      <ul>
        <li>Home</li>
        <li>Products</li>
        <li>About us</li>
      </ul>
    </nav>
    <div class="content">
      Welcome to my web application.
    </div>
  </body>
</html>
```

What is happening in our `startpage.njk` template code?

- _line 1_: We extend `src/view/layout/default.njk` with our template code here. The meaning is, we take the HTML of the default template and inject it into our `startpage.njk` template. Please note that you have to supply the path to the template relative to the `src/view` directory and that the file extension (`.njk`) is omitted.
- _line 3_: Here we extend our title-block with a appended text. This is done by calling <code v-pre>{{ super() }}</code> first in the block declaration. This will keep the original text defined in our default layout template and appends the text / code we defined in our `startpage.njk` template.
- _line 5-7_: In this block, we define the text for the content block. This time we don't call <code v-pre>{{ super() }}</code>, thus the original text will be completely replaced by the block defined in the `startpage.njk` template.

Another great feature of Nunjucks is including a template. The _include_-tag pulls in other templates in place. That can be useful when you need to share smaller chunks of code across serval templates:

:::: tabs
::: tab src/view/snippets/item.njk

```twig
<div>
This is a item!
</div>
```

:::
::: tab src/view/startpage.njk

```twig
{% extends 'layout/default' %}

{% block title %}{{ super() }} - Startpage{% endblock %}

{% block content %}
Welcome to my web application.<br/>
{% include 'snippets/item' %}
{% endblock %}
```

:::
::: tab HTML Output

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My Web Application - Startpage</title>
  </head>
  <body>
    <nav>
      <ul>
        <li>Home</li>
        <li>Products</li>
        <li>About us</li>
      </ul>
    </nav>
    <div class="content">
      Welcome to my web application.<br />
      This is a item!
    </div>
  </body>
</html>
```

:::
::::

::: warning
If your included template has some async code (e.g. a async filter), you need to use `asyncEach` for looping and including a template inside the loop. Please take a look at the [nunjucks documentation](https://mozilla.github.io/nunjucks/templating.html#asynceach) for more information.  
:::

## Next steps

It's time to celebrate, when you've followed this guide until here, you've learned the most important parts of a MVC ([Model](./database)-[View](./templates)-[Controller](./controllers)) framework and are one your path to ZenTS mastery.

Now it's time to learn some more about how to [handle static files](./static_files.md) in a ZenTS application. Then you'll learn more about [dependency injection](./dependency_injection.md) in ZenTS and how to use [services](./services.md).
