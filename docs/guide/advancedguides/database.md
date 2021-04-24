---
title: Database / ORM
lang: en-US
meta:
  - name: keywords
    content: ZenTS guide tutorial documentation database framework mvc TypeScript MySQL PostgreSQL SQLite MSSQL SQL.js MongoDB
---

# {{ $frontmatter.title }}

<GuideHeader guide="database">
  [[toc]]
</GuideHeader>

## Introduction

ZenTS provides you with all the tools you need to work with databases in your application. ZenTS uses [TypeORM](https://typeorm.io) for its Object-Relational Mapping, which is a ORM directly written for TypeScript projects. TypeORM supports a wide range of relational databases like [MySQL](https://www.mysql.com/) and [PostgreSQL](https://www.postgresql.org/), but also offers (experimental) support for [MongoDB](https://www.mongodb.com/). When working with database tables you'll work with entities (sometimes also called models), which are part of the MVC architecture. Databases are a broad topic, although this guide will cover the most features of TypeORM, you should also take a look at the [official documentation](https://typeorm.io).

## Installing a driver

Before you start connecting your application to a database, you need to install a database driver. Open up a console and head to the project application root folder. Then install **one** of the following drivers, depending on which database you like to us:

- [MySQL](https://www.mysql.com/) or [MariaDB](https://mariadb.org/): `npm install mysql --save` or `npm install mysql2 --save`
- [PostgreSQL](https://www.postgresql.org/) or [CockroachDB](https://github.com/cockroachdb/cockroach): `npm install pg --save`
- [SQLite](https://sqlite.org/index.html): `npm install sqlite3 --save`
- [MSSQL](https://www.microsoft.com/en-us/sql-server/sql-server-2019): `npm install mssql --save`
- [SQL.js](https://github.com/sql-js/sql.js): `npm install sql.js --save`
- [MongoDB](https://www.mongodb.com/): `npm install mongodb --save`

::: tip
TypeORM is installed by default when using ZenTS's CLI. If you manually installed ZenTS, you can install TypeORM by running `npm install typeorm --save` in your projects root folder.
:::

::: danger
Although TypeORM supports databases like Oracle and SAP Hana, they aren't supported by ZenTS. The same counts for NativeScript, react-native and Cordova drivers, because ZenTS is a backend framework and not suitable to run in these environments.  
:::

## Configuration

After you've installed the correct driver, it's time to configure your database. Open your config file and add a `database` property including an `enable` flag. Other properties depend on the driver you've installed, but most of them will force you to configure `type`, `host`, `password`, `database` and a `port`. Please see the [configuration guide](./../../configuration.md) for more information about different configuration scenarios depending on the installed database driver.

:::: tabs
::: tab JSON

```json
{
  "database": {
    "enable": true,
    "type": "postgres",
    "host": "localhost",
    "port": 5432,
    "username": "zen",
    "password": "secret",
    "database": "zen"
  }
}
```

:::
::: tab CommonJS Module (.js)

```js
module.exports = {
  database: {
    enable: true,
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'zen',
    password: 'secret',
    database: 'zen',
  },
}
```

:::
::: tab YAML

```yaml
database:
  - enable: true
  - type: postgres
  - host: localhost
  - port: 5432
  - username: zen
  - password: secret
  - database: zen
```

:::
::::

The `type` option depends on the database driver you've chosen:

- for [MySQL](https://www.mysql.com/): `mysql`
- for [MariaDB](https://mariadb.org/): `mariadb`
- for [PostgreSQL](https://www.postgresql.org/): `postgres`
- for [CockroachDB](https://github.com/cockroachdb/cockroach): `cockroachdb`
- for [SQLite](https://sqlite.org/index.html): `sqlite`
- for [MSSQL](https://www.microsoft.com/en-us/sql-server/sql-server-2019): `mssql`
- for [SQL.js](https://github.com/sql-js/sql.js): `sqljs`
- for [MongoDB](https://www.mongodb.com/): `mongodb`

It is also good to remember, that you can specify different connection options in environment specific configuration files. Head over to the [configuration guide](./../../configuration.md) to learn how to do that.

Database support can also be disabled if your application doesn't need it. Just set the `config.database.enable` configuration option to `false` (which is the default value). Database support is then disabled.

## Creating entities

Models in ZenTS are called **entities**. Entities are saved in the `src/entity` directory of your application (the folder is [configurable](./../../configuration.md)). You can name your entities like you wish, but since entities are ECMAScript classes you might want to name them like the class your are using, e.g. a `Product` entity is saved in `Product.ts`. An entity always represents a table in your database, so make sure to create a `product` table after you've created the following example entity:

```typescript
// src/entity/Product.ts

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    length: 100,
  })
  name: string

  @Column()
  price: number
}
```

::: tip
A entity can also be created using the CLI. Use the `zen add:entity Product` command to create a entity. Read the [CLI guide](./../../cli.md) to learn more about this and other commands.
:::

::: warning
Entities can't be put in a sub-folders.
:::

Similar to route definitions, entities are using annotations (e.g. `@Column()`) to tell the ORM how to map specific table columns to the corresponding class members. Every entity needs an `@Entity()` annotation above its class definition.

### Specifying column types

To specify a column, we use the `@Column()` annotation, which has a optional argument as first argument.

When you pass a string as first argument to the `@Column()` annotation, it will be used to define the type of the column. For example, if our `price` column is from type `decimal`, we need to change the declaration this way:

```typescript
@Column('decimal')
price: number
```

::: tip
Which types are supported depends on the database you're using. The supported types for each database can be found [here](https://github.com/typeorm/typeorm/blob/master/docs/entities.md#column-types).
:::

Column types can also be specified by using an object as first argument with a `type` property:

```typescript
@Column({
    type: 'decimal'
})
price: number
```

### Column options

Depending on its type and the used database, the `@Column()` decorator can take multiple entity column based option parameters.

The options are either defined by using an object as first argument:

```typescript
@Column({
    type: 'decimal',
    // ... more options
})
price: number
```

or by using an optional second argument while defining the type as string as first argument:

```typescript
@Column('decimal', {
    // ... column specific options
})
price: number
```

The available options are:

- `type` (string): The column type (see above).
- `name` (string): The name of the column in the table. By default the column name is generated from the name of the property (e.g. `price`). If you like to use a different property key, you have to set the correct table column name with this option.
- `length` (number): The length of a column (e.g. `varchar(150)`).
- `width` (number): Column type's display width (used only for [MySQL](https://www.mysql.com/) integer types).
- `onUpdate` (string): `ON UPDATE` trigger for [MySQL](https://www.mysql.com/).
- `nullable` (boolean, default: `false`): Indicates if a column is nullable (`NULL` or `NOT NULL`).
- `update` (boolean, default: `true`): Indicates if column value is updated by update operation. If you set this value to `false`, the column will only be set when a record is created.
- `insert` (boolean, default: `true`): Indicates that a column is set when a record is created. If you set this value to `false`, the column won't be set when the record is created.
- `select` (boolean, default: `true`): Indicates if this column is returned by default when making queries. Set this option to `false` and the column must be explicit specified in `SELECT` queries, otherwise the column will be omitted.
- `default` (any): The default value of the column.
- `primary` (boolean): Indicates that the column is a primary key.
- `unique` (boolean): Set the column as unique.
- `comment` (string): Database level column comment.
- `precision` (number): The precision for a decimal column type.
- `scale` (number): The scale for a decimal column type.
- `zerofill` (boolean): Puts `ZEROFILL` attribute on to a numeric column (only supported by [MySQL](https://www.mysql.com/)).
- `unsigned` (boolean): Marks the column as `UNSIGNED`.
- `charset` (string): Defines a column character set.
- `collation` (string): Defines a column collation.
- `enum` (string[]|Enums): Define a column's enum values. See below for more information on how to define enums.
- `asExpression` (string): Generated column expression (only supported by [MySQL](https://www.mysql.com/)).
- `generatedType` (string): Generated column type (only supported by [MySQL](https://www.mysql.com/)).

### Primary key column

A primary key column is declared with the `@PrimaryColumn()` annotation:

```typescript
import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity()
export class Product {
  @PrimaryColumn()
  id: number

  // ... other columns
}
```

::: danger
In TypeORM every entity **_needs_** at least **_one_** primary column. This is a requirement and can't be avoided. You can use either `@PrimaryColumn()` or `@PrimaryGeneratedColumn()` annotation to declare your primary key column.
:::

### Auto increment / serial column

Auto generated columns (also know as auto-increment / sequence / serial / generated identity column) are declared by using the `@PrimaryGeneratedColumn()` decorator:

```typescript
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number

  // ... other columns
}
```

This decorator / column type is usually used to for ID columns, which are integers that increment their number automatically when a new record is inserted (see [MySQL documentation](https://dev.mysql.com/doc/refman/8.0/en/example-auto-increment.html) or [PostgreSQL](https://www.tutorialspoint.com/postgresql/postgresql_using_autoincrement.htm), please see the documentation from the database of your choice for other examples).

### Declaring enum column type

::: warning
`enum` column types are only supported by [MySQL](https://www.mysql.com/) and [PostgreSQL](https://www.postgresql.org/)!
:::

`enum` types are declared by creating a corresponding [TypeScript enum](https://www.typescriptlang.org/docs/handbook/enums.html) or by using an array with predefined values:

:::: tabs
::: tab TypeScript enum

```typescript
import { Column, Entity } from 'typeorm'

enum TAGS {
  NEW = 'new',
  SALE = 'sale',
  RESELL = 'resell',
}

@Entity()
export class Product {
  @Column({
    type: 'enum',
    enum: TAGS,
    default: TAGS.NEW,
  })
  tag: TAGS

  // ... other columns
}
```

:::
::: tab Array values

```typescript
import { Column, Entity } from 'typeorm'

type tags = 'new' | 'sale' | 'resell'

@Entity()
export class Product {
  @Column({
    type: 'enum',
    enum: ['new', 'sale', 'resell'],
    default: 'new',
  })
  tag: tags

  // ... other columns
}
```

:::
::::

### Declaring set column types

::: warning
`set` column types are only supported by [MySQL](https://www.mysql.com/)!
:::

Declaring `set` column types is similar to declaring `enum` column types by either creating a corresponding [TypeScript enum](https://www.typescriptlang.org/docs/handbook/enums.html) or an array with predefined values:

:::: tabs
::: tab TypeScript enum

```typescript
import { Column, Entity } from 'typeorm'

enum TAGS {
  NEW = 'new',
  SALE = 'sale',
  RESELL = 'resell',
}

@Entity()
export class Product {
  @Column({
    type: 'set',
    enum: TAGS,
    default: [TAGS.NEW, TAGS.SALE],
  })
  tag: TAGS[]

  // ... other columns
}
```

:::
::: tab Array values

```typescript
import { Column, Entity } from 'typeorm'

type tags = 'new' | 'sale' | 'resell'

@Entity()
export class Product {
  @Column({
    type: 'set',
    enum: ['new', 'sale', 'resell'],
    default: ['new', 'sale'],
  })
  tag: tags[]

  // ... other columns
}
```

:::
::::

### Special column types (simple-array & simple-json)

TypeORM offers two special column types: **simple-array** and **simple-json**. Use them with caution, because they are computed by your application and not by the database server. When your database supports JSON-columns (like [PostgreSQL](https://www.postgresql.org/)) then you better use the build in types.

#### simple-array

Stores primitive arrays (e.g. `string[]`, `number[]`, ...) in a string column type. All values will be separated by commas, so you can't use commas in your values.

```typescript
@Column('simple-array')
names: string[]
```

#### simple-json

Stores a JSON into a string column type. The JSON must be serialize-able via `JSON.stringify()`. When the column is returned in a record the string will be deserialized by `JSON.parse()`.

```typescript
@Column('simple-json')
profile: { name: string, email: string }
```

### Auto generated values

TypeORM has some value generators build in, which you can attach to a column with the `@Generated` annotation.

#### UUID

Generates a UUID as value for a column automatically:

```typescript
import { Column, Entity, Generated } from 'typeorm'

@Entity()
export class Product {
  @Column()
  @Generated('uuid')
  uuid: string
}
```

#### Increment

Increment a number-like (e.g. `int`) column by one:

```typescript
import { Column, Entity, Generated } from 'typeorm'

@Entity()
export class Product {
  @Column()
  @Generated('increment')
  counter: number
}
```

::: warning
From the TypeORM documentation: "_There are some limitations on some database platforms with this type of generation (for example some databases can only have one increment column, or some of them require increment to be a primary key)._"

Please refer to your database documentation for more information.
:::

## Accessing ORM in a controller or service

Before we move on and learn how we work with entities, it's important to know how you can access the ORM related functions inside a controller or service. This is done with the help of dependency injection.

::: tip
Dependency injection in ZenTS are covered in [this guide](./dependency_injection.md).
:::

### Injecting the connection

TypeORM exposes a connection to the user with which records can be queried and saved. In a ZenTS application, the connection is automatically created for you. To inject the connection in a controller (or service) use the `@connection` annotation:

```typescript
import { Controller, connection } from 'zents'
import { Connection } from 'typeorm'

export default class extends Controller {
  @connection
  private con: Connection

  // ... controller implementation
}
```

The connection is now available under the `this.con` property:

```typescript
import { Controller, context, Context, connection, get } from 'zents'
import type { Connection } from 'typeorm'

export default class extends Controller {
  @connection
  private con: Connection

  @get('/')
  public async index(@context ctx: Context) {
    // do something with this.con
  }
}
```

::: tip
Note the difference in casing between the `Connection` interface exported by `typeorm` and the `@connection` annotation exported by `zents`. Annotations in ZenTS are always written in lower camel-case.
:::

### Injecting the Entity Manager

TypeORM's _EntityManager_ can be injected into a controller or service quiet similar, by using the `@entityManager` annotation. The _EntityManager_ allows quick access to methods like `save()` or `find()`, which can be used to interact with records from a database. Its the recommend way to use the _EntityManager_ instead of the more low-level connection.

An example of an injected _EntityManager_ looks like this:

```typescript
import { Controller, context, Context, entityManager, get } from 'zents'
import type { EntityManager } from 'typeorm'

export default class extends Controller {
  @entityManager
  private em: EntityManager

  @get('/')
  public async index(@context ctx: Context) {
    // do something with this.em
  }
}
```

## Persisting records to the database

Now that you're familiar with creating entities and injecting the EntityManager/connection from TypeORM into a controller, lets start by persisting a record to the database. First we need to import our `Product` entity we created earlier. Then we assign the values to the instance of our entity and last but not least, we will save it to the database by calling `save()` on the _EntityManager_ we injected earlier:

```typescript
import { Controller, entityManager, post, log } from 'zents'
import type { EntityManager } from 'typeorm'

import { Product } from '../entity/Product'

export default class extends Controller {
  @entityManager
  private em: EntityManager

  @post('/product')
  public async createProduct() {
    let product = new Product()

    product.name = 'My Product'
    product.price = 4200

    product = await this.em.save(product)
    log.success(`Product has been saved! Product id is ${product.id}`)
  }
}
```

This process is pretty straightforward:

- _line 4_: Import the `Product` entity we created earlier.
- _line 7-8_: Injecting the _EntityManager_ in our controller. The manager will be available under the `this.em` property.
- _line 10_: Declare a new `/product` POST route.
- _line 12_: Create a new instance of our `Product` entity.
- _line 14-15_: Set values for the `name` and `price` column. They could also be coming from a request body (e.g. `product.name = body.name`).
- _line 17_: Persist the `Product` instance to the database. The record is created automatically and the `product` instance will have a newly populated `id` property attached.

::: tip
If you're using the `connection` from TypeORM, the _EntityManager_ is accessible under the `connection.manager` property (e.g. `connection.manager.save()`).
:::

Since we are using `async / await` syntax here, errors from the database will crash the server (at worst). If you want to prevent that, you've to encapsule the `save()` call into a `try / catch` block:

```typescript
public async createProduct() {
  // ...

  try {
    product = await this.em.save(product)
  } catch(error) {
    // do something with error
  }

  // ...
}

```

## Fetching records from the database with repositories

Receiving records from the database is done by so-called repositories. A repository is similar to the _EntityManager_, e.g. it has a `save()` and `find()` method attached to it, but its operations are limited to one specific entity.

ZenTS offers you three ways to access a repository (or multiple repositories) in a [controller](./controllers.md) action or [service](./services):

#### Injecting the repository into a method (recommend)

Repositories can be injected into a controller / service method by using the `@repository()` annotation, which requires one argument (the entity). This is the recommended way to use a repository, because it allows your application to be written in the [SOLID principle](https://en.wikipedia.org/wiki/Single-responsibility_principle):

```typescript
import { Controller, entityManager, get, log, repository } from 'zents'
import { Repository } from 'typeorm'

import { Product } from '../entity/Product'

export default class extends Controller {
  @get('/product/:productId')
  public async detailProduct(@repository(Product) productRepo: Repository<Product>) {
    // use productRepo.find() etc. here
  }
}
```

#### Using the EntityManager / connection

You can also use the _EntityManager_ or connection to grab a repository:

```typescript
import { Controller, con, entityManager, post, log } from 'zents'
import type { Connection, EntityManager } from 'typeorm'

import { Product } from '../entity/Product'

export default class extends Controller {
  @entityManager
  private em: EntityManager

  @connection
  private con: Connection

  @get('/product/:productId')
  public async detailProduct() {
    const productRepo = this.em.getRepository(Product)
    // or
    // const productRepo = this.con.getRepository(Product)
  }
}
```

**Note**: it isn't a good idea to have both the _EntityManager_ and connection to the controller, as this is some kind of unnecessarily redundance. If you need both, just inject the connection and access the _EntityManager_ with `this.con.manager`.

Now you should know the basics of repositories, but there is more to them, which we'll talk about later in this guide. For now let us use the injected repository to fetch some records from the database:

### Find all records

To fetch all records in a table, call `find()` without an argument:

```typescript
public async example(@repository(Product) productRepo) {
  const products = await productRepo.find()
}
```

### Find specific records

To query for specific records (`WHERE ... AND ...`), you can supply an object as first argument to the `find()` method:

```typescript
public async example(@repository(Product) productRepo) {
  const products = await productRepo.find({
    price: 4900
  })
}
```

### Find one record

To limit the result to one record use the `findOne()` repository method:

```typescript
public async example(@repository(Product) productRepo) {
  const product = await productRepo.findOne({
    name: 'My Product'
  })
}
```

### Find record(s) by id

To fetch one or multiple record(s) from a table by ID use the `findByIds()` repository method:

```typescript
public async example(@repository(Product) productRepo) {
  const products = await productRepo.findByIds([1, 2, 8])
}
```

### Find and count

To receive a set of records and count the possible returned records (without pagination), use the `findAndCount()` repository method:

```typescript
public async example(@repository(Product) productRepo) {
  const [products, productsCount] = await productRepo.findAndCount(/* optional: {} */)
}
```

### Find methods options and conditions

All the above methods supports a wide range of option and conditions (e.g. `WHERE ... OR ...` queries). It's highly recommend to take a look at the [official documentation](https://github.com/typeorm/typeorm/blob/master/docs/find-options.md) to learn more about them, as they are one of the keys to master TypeORM.

## Updating a record

In order to update a record in a table, you first need to fetch it from the database using a repository. After that, you just modify the instance member values and save it back using the same repository:

```typescript
public async example(@repository(Product) productRepo) {
  const product = await productRepo.findOne({
    name: 'My Product'
  })

  product.name = 'My awesome updated Product'

  await productRepo.save(product)
}
```

## Deleting a record

Removing a record from a table is simple, just call the `remove()` method of a repository and the record will be deleted:

```typescript
public async example(@repository(Product) productRepo) {
  const product = await productRepo.findOne({
    name: 'My Product'
  })

  await productRepo.remove(product)

  const oldProduct = await productRepo.findOne({
    name: 'My Product'
  })

  log.info(oldProduct) // logs null
}
```

## Working with relationships

In [RDBMS](https://en.wikipedia.org/wiki/Relational_database) relationships (sometimes also called associations) play an important role in connecting one or more records with each other. TypeORM supports all important relationships, including `many-to-one`, `one-to-many`, `one-to-one` and `many-to-many`.

They can be divided into two different relationship types:

- `many-to-one` / `one-to-many` / `one-to-one`: This is probably the most used type of relationship, they map a column with a foreign key to a column of a different table (e.g. a `categoryId` column on a `Product` entity). Technically `many-to-one` and `one-to-many` are the same relationship, but seen from two different sides of the relation between two records. A `one-to-one` relationship is quiet similar, but they only allowing a exclusive one-to-one mapping. For example an `User` entity has exactly one relationship with ab `Profile` entity and that `Profile` can't have a relationship with a different `User` entity, while on a `many-to-one` (or `one-to-many`) relationship, a `Category` can be assigned to multiple `Products`.

- `many-to-many`: This is the less common but nevertheless not unimportant type of a relationship between records using a so-called join table. This relationship is necessary when both sides of the relationship can have many of the other side (e.g. a `ShoppingMall` and `Store` entity relationship, where each shopping mall can have many stores and each store can be in many different shopping malls). The relationship is then stored in a join table with a `shoppingmallId` and `storeId` foreign key columns, which connects both records with each other.

### many-to-one / one-to-many relationships

Lets start with the most common relationship `many-to-one` and its little brother `one-to-many`. Going back to our `Product` example from before, we want to relate a product record to a `Category`, in a way that a product belongs to exactly one category.

First we need to create a `Category` entity:

```typescript
// src/entity/Category.ts

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    length: 100,
  })
  name: string
}
```

For simplicity we just assign a `id` and `name` column to this table. In this example, each category can be connected with _many_ products. On the other side, each product can only be assigned to _one_ category. To summarize this, the `Product` entity has a `many-to-one` relationship with the `Category` entity. From the perspective of the `Category` entity it's a `one-to-many` relationship.

How we map this? Lets start by editing our `Product` entity created earlier in this guide and use the `@ManyToOne` annotation from TypeORM to start the mapping on the `Product` entity:

```typescript{14-15}
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Category } from './Category'

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    length: 100,
  })
  name: string

  @ManyToOne((type) => Category, (category) => category.products)
  category: Category
}
```

The above source code can be described like this:

- _line 2_: Import the `Category` entity we just created.
- _line 14-15_: Use the `@ManyToOne` annotation to create a relationship between many products and one category. The first argument have to return an entity (`Category`).

::: tip
By default TypeORM assumes the foreign key column is in the schema `entityId` (e.g the category value will be stored in a `categoryId` column). If you wish to use a different join column, TypeORM exposes a `@JoinColumn` annotation, with which you can define the column name (e.g. `@JoinColumn({ name: 'category_id' })`). Read more about the `@JoinColumn` annotation in the [official documentation](https://github.com/typeorm/typeorm/blob/master/docs/relations.md#joincolumn-options).
:::

The `many-to-one` mapping is required when using this kind of relationship type. On the other hand, the `one-to-many` mapping is totally optional and can be omitted when you only care about the `many-to-one` relationship.

Nevertheless a `one-to-many` relationship is created similar to `many-to-one`. We just need to add the `@OneToMany` annotation on the entity class member we wish to populate:

```typescript{14-15}
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Product } from './Product'

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    length: 100,
  })
  name: string

  @OneToMany((type) => Product, (product) => product.category)
  products: Product[]
}
```

This time we added the `products` property to our `Category` entity. Now all products associated with a given category can be easily queried (and saved).

#### Saving many-to-one / one-to-many relationships

Saving a relationship is as easy as assigning the relationship value to the right member of an entity:

```typescript
import { Controller, con, entityManager, post, log } from 'zents'
import type { EntityManager } from 'typeorm'

import { Product } from '../entity/Product'
import { Category } from '../entity/Category'

export default class extends Controller {
  @entityManager
  private em: EntityManager

  @post('/category')
  public async createCategory() {
    const category = new Category()
    category.name = 'My Category'
    await this.em.save(category)

    const product1 = new Product()
    product1.name = 'My Product 1'
    product1.category = category
    await this.em.save(product1)

    const product2 = new Product()
    product2.name = 'My Product 2'
    product2.category = category
    await this.em.save(product2)
  }
}
```

#### Loading many-to-one / one-to-many related records

To load related records (e.g. products) when you fetch a category, you've to specify the relationship via a `relations` property inside the `find()` options argument:

```typescript
public async example(@repository(Category) categoryRepo) {
  const category = await categoryRepo.find({ relations: ['products'] })

  log.info(category.products) // will log an array of products associated with the category
}

// or

public async example(@repository(Product) productRepo) {
  const product = await product.findOne({
    name: 'My Product 1'
  }, { relations: ['category'] })

  log.info(product.category) // will log the category associated with the product
}
```

If you wish to **always** load relationships automatically you can enable eager loading for a relationship:

```typescript{15}
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Category } from './Category'

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    length: 100,
  })
  name: string

  @ManyToOne((type) => Category, (category) => product.category, {
    eager: true,
  })
  category: Category
}
```

This way the `category` property will be always populated when fetching a `product` record from the database. Keep in mind that this can be really expensive, because all records have to be fetched from the database first. You should only use eager loading only when its reasonable for your scenario.

::: tip
There are even more options (like cascades, primary relationship columns, nullable, etc.) related to relationships. Please consider looking at the official documentation [here](https://github.com/typeorm/typeorm/blob/master/docs/relations.md) and/or [here](https://github.com/typeorm/typeorm/blob/master/docs/many-to-one-one-to-many-relations.md).
:::

#### Removing a many-to-one / one-to-many relationship

You can remove a existing relationship by setting its mapping value to `null` (if the column is nullable):

```typescript
public async example( @repository(Product) productRepo) {
  const product = await product.findOne({
    name: 'My Product 1'
  })

  product.category = null
  await this.em.save(product)
}
```

### many-to-many relationship

A `many-to-many` relationship is different from `many-to-one` / `one-to-many` relationships because they say, that many things of _A_ are related to many things of _B_ and many things of _B_ are related to many things of _B_. For example, lets change the requirements of our previous example and say the following:

_Many_ `Products` can be in _many_ `Categories`. This is called a `many-to-many` relationship. In relational databases this kind of association is created by using a so-called join table, which usually only holds the IDs of the related entities (e.g. `productId` and `categoryId`). This kind of relationship can be either uni-directional or bi-directional.

#### uni-directional many-to-many relationship

First we create a uni-directional `many-to-many` relationship between our `Product` and `Category` entities:

:::: tabs
::: tab Product entity

```typescript{15-17}
// src/entity/Product.ts
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinTable } from 'typeorm'
import { Category } from './Category'

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    length: 100,
  })
  name: string

  @ManyToMany((type) => Category)
  @JoinTable()
  categories: Category[]
}
```

:::
::: tab Category entity

```typescript
// src/entity/Category.ts

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    length: 100,
  })
  name: string
}
```

:::
::::

As you probably guessed, `many-to-many` relationships are mapped by using the `@ManyToMany` annotation from TypeORM. In addition the `@JoinTable()` annotation is required in `many-to-many` relationship mappings, because it tells TypeORM which of the side is the _owning side_ of the relation. But did you notice that there is basically no special mapping happen in the `Category` entity? That is because this `many-to-many` mapping is uni-directional, meaning the categories have no idea which products are associated with them (at least from a ORM point of view).

#### bi-directional many-to-many relationship

In our previous example we created a uni-directional mapping between _many_ products and _many_ categories. The problem with that is, that the ORM doesn't know which products are associated with a specific category (only by doing manual queries). The solution to this problem is to use a bi-directional `many-to-many` relationship. This way, both sides of the association knows about each other and how to fetch the related records:

:::: tabs
::: tab Product entity

```typescript
// src/entity/Product.ts
import { Column, Entity, ManyToMany, JoinTable, PrimaryGeneratedColumn } from 'typeorm'
import { Category } from './Category'

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    length: 100,
  })
  name: string

  @ManyToMany((type) => Category, (category) => category.products)
  @JoinTable()
  categories: Category[]
}
```

:::
::: tab Category entity

```typescript
// src/entity/Category.ts

import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm'
import { Product } from './Product'

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    length: 100,
  })
  name: string

  @ManyToMany((type) => Product, (product) => product.categories)
  products: Product[]
}
```

:::
::::

Now both side knows about the related records. Please note that the `@JoinTable` annotation isn't bind to the inverse relation side, because it must be only on one side.

#### Saving many-to-many relationship

In order to save such a `many-to-many` relationship, we just use the usual `save()` method and assign (multiple) record(s) to the mapped relation property:

```typescript
import { Controller, con, entityManager, post, log } from 'zents'
import type { EntityManager } from 'typeorm'

import { Product } from '../entity/Product'
import { Category } from '../entity/Category'

export default class extends Controller {
  @entityManager
  private em: EntityManager

  @post('/product')
  public async createProduct() {
    const category1 = new Category()
    category1.name = 'My Category 1'
    await this.em.save(category1)

    const category2 = new Category()
    category2.name = 'My Category 2'
    await this.em.save(category2)

    const product = new Product()
    product.name = 'My Product'
    product.categories = [category1, category2]
  }
}
```

#### Loading many-to-many relationship

Loading a `many-to-many` relationship is the same then loading other relationships:

```typescript
public async example(@repository(Product) productRepo) {
  const products = await product.find({ relations: ['categories'] })
}
```

With eager loading enabled on a relationship, you don't have to supply the `relation` option to `find()`, this is done automatically then. Please see "Loading many-to-one / one-to-many related records" chapter above for more information.

#### many-to-many relationship and custom properties

Sometimes you want your `many-to-many` relationship to save some additional data about the relationship. A common example is a `sorting` (or `order`) column, which tells the application how it should sort the related records. In order to create custom properties for a `many-to-many` relationship, you need to create a extra entity with two `many-to-one` relationships pointing in both directions of the original `many-to-many` relationship:

:::: tabs
::: tab ProductCategory entity

```typescript
// src/entity/ProductCategory.ts
// this entity will have the custom properties and the relationships to the other entities
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Product } from './Product'
import { Category } from './Category'

@Entity()
export class ProductCategory {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  productId: number

  @Column()
  categoryId: number

  @Column()
  sorting: number

  @ManyToOne((type) => Product, (product) => product.productCategories)
  product: Product

  @ManyToOne((type) => Category, (category) => category.productCategories)
  category: Category
}
```

:::
::: tab Product entity

```typescript
// src/entity/Product.ts
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { ProductCategory } from './ProductCategory'

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    length: 100,
  })
  name: string

  @OneToMany((type) => ProductCategory, (productCategory) => productCategory.product)
  productCategories: ProductCategory[]
}
```

:::
::: tab Category entity

```typescript
// src/entity/Category.ts

import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { ProductCategory } from './ProductCategory'

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    length: 100,
  })
  name: string

  @OneToMany((type) => ProductCategory, (productCategory) => productCategory.category)
  productCategories: ProductCategory[]
}
```

:::
::::

In the previous example we removed the `@ManyToMany` annotations from the `Product` and `Category` entities and replace it with a `one-to-many` relationship to the newly created `ProductCategory` entity, which has a `sorting` property. This way you can define more properties on a `many-to-many` relationship.

::: tip
The [official TypeORM documentation](https://github.com/typeorm/typeorm/blob/master/docs/many-to-many-relations.md) contains more information about `many-to-many` relationships.
:::

### one-to-one relationship

The last relationship we like to talk about in this guide is the `one-to-one` relationship. This relationship is where _A_ contains only one instance of _B_, and _B_ contains only one instance of _A_. None of them can have a relationship with other records (at least for that relationship). For example think about _one_ `User` which has _one_ `Profile`. To map this association we use the `@OneToOne` annotation on _one_ of the entities (the owning side, which contains the related foreign key column):

:::: tabs
::: tab User entity

```typescript
// src/entity/User.ts
import { Column, Entity, OneToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm'
import { Profile } from './Profile'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  username: string

  @OneToOne((type) => Profile)
  @JoinColumn()
  profile: Profile
}
```

:::
::: tab Profile entity

```typescript
// src/entity/Profile.ts
import { Column, Entity, PrimaryGeneratedColumn, OneToOne } from 'typeorm'

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  gender: string
}
```

:::
::::

We just created a mapping between the `User` and `Profile` entity. In this kind of relationship, the `@JoinColumn()` annotation is required, as it will deicide which table holds the foreign key column (in the above example the `user` table will have a `profileId`).

Saving and updating the `one-to-one` relationship is the same then doing with a `many-to-one` / `one-to-many` relationship. Go back to this chapter to figure out how.

The above example is a uni-directional association. To make it a bi-directional relationship, we need to add the `@OneToOne` annotation to the `Profile` entity too. This way a `Profile` instance can access its related `User` (changes are highlighted):

:::: tabs
::: tab User entity

```typescript{13}
// src/entity/User.ts
import { Column, Entity, OneToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm'
import { Profile } from './Profile'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  username: string

  @OneToOne((type) => Profile, (profile) => profile.user)
  @JoinColumn()
  profile: Profile
}
```

:::
::: tab Profile entity

```typescript{2-3,13-14}
// src/entity/Profile.ts
import { Column, Entity, PrimaryGeneratedColumn, OneToOne } from 'typeorm'
import { User } from './User'

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  gender: string

  @OneToOne((type) => User, (user) => user.profile)
  user: User
}
```

:::
::::

::: tip
Head over to the [official one-to-one documentation](https://github.com/typeorm/typeorm/blob/master/docs/one-to-one-relations.md) from TypeORM to get further information about this kind of relationship.
:::

## Next steps

Congratulation! You've just finished the database guide. Now you should be familiar with the basics and more advanced topics of ZenTS ORM TypeORM. Of course, there is much more to learn about the ORM then this guide covers. Don't forget to visit the [official documentation](https://github.com/typeorm/typeorm/tree/master/docs) to learn more about the various topics. You can also check out TypeORM's [CLI](https://github.com/typeorm/typeorm/blob/master/docs/using-cli.md) if you like.

The [next guide](./redis.md) will cover how to use [Redis](https://redis.io) in a ZenTS application. This feature is totally optional, so if you wish you can continue learning the three main concepts of a MVC application. The last part you're missing is the **View**, which will be covered in the [template guide](./templates.md).
