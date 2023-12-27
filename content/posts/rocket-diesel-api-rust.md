+++
title = "Building an API in Rust with Rocket.rs and Diesel.rs (Clean Architecture)"
date = 2022-11-23
draft = false
+++

In this guide I'm going to walk you through the process of building a simple CRUD API from scratch in Rust using Rocket.rs. I will show you how to create migrations and access a PostgreSQL database using Diesel.rs and connect everything up to a React + Typescript front-end. When building the project we will follow Clean Architecture, although I won't go into talking too much about what that is as it's not the focus of this guide.

This guide assumes:
- You already have a PostgreSQL database setup
- You have the latest version of Rust (this guide uses v1.65.0)
- You have a basic-to-decent understanding of Rust concepts and the language syntax

Now that that's sorted, let's begin!

---

## Building the project architecture
The first step is to setup the architecture of the application. Start by creating a overarching Rust project:

```bash
cargo new rust-blog
cd rust-blog
```

After this, delete the src folder as we won't be needing it. The next thing we're going to do is generate a new project for each layer in the Clean Architecture model. Our architecture will follow as such that the:
- API Layer will handle the API requests and act as our route handler.
- Application layer will handle the logic behind the API requests.
- Domain layer will hold our database models and schemas.
- Infrastructure layer will hold our migrations and database connections.
- Shared layer will hold any other models our project will need such as response structures.

```bash
cargo new api --lib
cargo new application --lib
cargo new domain --lib
cargo new infrastructure --lib
cargo new shared --lib
```

By the end of this, our project should be looking something like this:
```
.
├── Cargo.lock
├── Cargo.toml
├── api
│   ├── Cargo.toml
│   └── src
│       └── lib.rs
├── application
│   ├── Cargo.toml
│   └── src
│       └── lib.rs
├── domain
│   ├── Cargo.toml
│   └── src
│       └── lib.rs
├── infrastructure
│   ├── Cargo.toml
│   └── src
│       └── lib.rs
└── shared
    ├── Cargo.toml
    └── src
        └── lib.rs
```

We're now going to link all of these projects in the top-level Cargo.toml file. Delete everything inside the file and enter the following:

```toml
[workspace]
members = [
  "api",
  "domain",
  "infrastructure",
  "application",
  "shared",
]
```

Nice! That's the majority of our templating finished, now we can get into some actual fun.

---

## Migrations
Since we're using Diesel.rs as the database manager, we will need to install the CLI tool. Diesel CLI has a few dependencies that need to be installed beforehand depending on what database you're planning on using:
- libpq for PostgreSQL
- libmysqlclient for Mysql
- libsqlite3 for SQlite

For this project, we will be using PostgreSQL. This means we only need libpq as a dependency. _Please refer to the docs for each dependency required to find out how to install it on your operating system._

With libpq installed, we can now run the following command to install Diesel CLI:

```bash
cargo install diesel_cli --no-default-features --features postgres
```

With that installed, let's set up a connection string to our database. In the top-level project directory, run the following command with your connections details:

```bash
echo DATABASE_URL=postgres://username:password@localhost/blog > .env
```

Now, we can use the Diesel CLI to do the heavy lifting for us. Navigate into the infrastructure folder and run the following command:
diesel setup
- This will generate a few things:
- A migrations folder used to store all migrations
- An empty migration we can use to manage our database schema.

Using the Diesel CLI tool, we can create a new migration to handle the initial setup of our posts table.

```bash
diesel migration generate create_posts
```

Diesel CLI will generate a new migration consisting of a name similar to 2022–11–18–090125_create_posts. The first part is the date the migration was generated with a unique code followed by the migrations name. Inside this migration folder will be two files: up.sql, telling Diesel CLI what to apply in the migration, and down.sql, telling Diesel CLI how to revert a migration.

Now, let's go ahead and write some SQL for the migrations.

```sql
-- up.sql

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  body TEXT NOT NULL,
  genre VARCHAR NOT NULL,
  published BOOLEAN NOT NULL DEFAULT false
)
```

```sql
-- down.sql

DROP TABLE posts
```

Using the Diesel CLI, we can apply the new migration we just created.

```bash
diesel migration run
```

_For more information on running migrations with Diesel.rs, visit the official getting started guide here._

---

## Creating a connection
With our first set of migrations finished and our project architecture laid out, let's finally write some Rust code to connect our application to the database.

```toml
# infrastructure/Cargo.toml

[package]
name = "infrastructure"
version = "0.1.0"
edition = "2021"

[dependencies]
diesel = { version = "2.0.0", features = ["postgres"] }
dotenvy = "0.15"
```

```rust
// infrastructure/src/lib.rs

use diesel::pg::PgConnection;
use diesel::prelude::*;
use dotenvy::dotenv;
use std::env;

pub fn establish_connection() -> PgConnection {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set.");

    PgConnection::establish(&database_url).unwrap_or_else(|_| panic!("Error connecting to {}", database_url))
}
```

With our connection made, we need to create some models for our database, namely Post and NewPost.

---

## Models and Schemas
Start by navigating into domain and adding the following modules to lib.rs.

```rust
// domain/src/lib.rs

pub mod models;
pub mod schema;
```

We'll use models to define the structs our database and code will use, while schema will be auto-generated by Diesel CLI. When we generated our migration, a schema.rs file was created in infrastructure. Simply move that to domain/src. If for some reason schema.rs wasn't generated, you can run diesel print-schema in the terminal to view the schema.

```toml
# domain/Cargo.toml

[package]
name = "domain"
version = "0.1.0"
edition = "2021"

[dependencies]
rocket = { version = "0.5.0-rc.2", features = ["json"] }
diesel = { version = "2.0.0", features = ["postgres"] }
serde = { version = "1.0.147", features = ["derive"] }
```

```rust
// domain/src/models.rs

use crate::schema::posts;
use diesel::prelude::*;
use rocket::serde::{Deserialize, Serialize};
use std::cmp::{Ord, Eq, PartialOrd, PartialEq};

// Queryable will generate the code needed to load the struct from an SQL statement
#[derive(Queryable, Serialize, Ord, Eq, PartialEq, PartialOrd)]
pub struct Post {
    pub id: i32,
    pub title: String,
    pub body: String,
    pub genre: String,
    pub published: bool,
}

#[derive(Insertable, Deserialize)]
#[serde(crate = "rocket::serde")]
#[diesel(table_name = posts)]
pub struct NewPost {
    pub title: String,
    pub body: String,
    pub genre: String,
}
```

```rust
// domain/src/schema.rs

// @generated automatically by Diesel CLI.

diesel::table! {
    posts (id) {
        id -> Int4,
        title -> Varchar,
        body -> Text,
        genre -> Varchar,
        published -> Bool,
    }
}
```

The code in schema.rs may vary slightly for you, but the concept still remains. This file will be updated whenever we run or revert a migration. It's important to note that the order of fields in our Post struct and the posts table must match.

As well as defining database models, let's create a model to structure how our API responses are going to be formatted. Navigate to shared/src and create a new file response_models.rs.

```toml
# shared/Cargo.toml

[package]
name = "shared"
version = "0.1.0"
edition = "2021"

[dependencies]
domain = { path = "../domain" }

rocket = { version = "0.5.0-rc.2", features = ["json"] }
serde = { version = "1.0.147", features = ["derive"] }
```

```rust
// shared/src/lib.rs

pub mod response_models;
```

```rust
// shared/src/response_models.rs

use domain::models::Post;
use rocket::serde::Serialize;

#[derive(Serialize)]
pub enum ResponseBody {
    Message(String),
    Post(Post),
    Posts(Vec<Post>)
}

#[derive(Serialize)]
#[serde(crate = "rocket::serde")]
pub struct Response {
    pub body: ResponseBody,
}
```

The ResponseBody enum will be used to define what types of data can be returned from our API and the Response struct will define how the response will be structured.

---

## Setting up Rocket.rs
Wow! That was a lot of setup just for our database, just so we're all up-to-date, here's what the project structure should look like currently:

```
.
├── Cargo.lock
├── Cargo.toml
├── api
│   └── ...
├── application
│   └── ...
├── domain
│   ├── Cargo.toml
│   └── src
│       ├── lib.rs
│       └── models.rs
├── infrastructure
│   ├── Cargo.toml
│   ├── migrations
│   │   └── 2022–11–18–090125_create_posts
│   │       ├── up.sql
│   │       └── down.sql
│   └── src
│     ├── lib.rs
│     └── schema.rs
└── shared
    ├── Cargo.toml
    └── src
        ├── lib.rs
        └── response_models.rs
```

With the bulk of our database setup done, let's begin the setup of the API portion for the project.

Navigate to api and import the following dependencies:

```toml
# api/Cargo.toml

[package]
name = "api"
version = "0.1.0"
edition = "2021"

[dependencies]
domain = { path = "../domain" }
application = { path = "../application" }
shared = { path = "../shared" }

rocket = { version = "0.5.0-rc.2", features = ["json"] }
serde_json = "1.0.88"
```

With our dependencies and references to other folders set, let's create a bin folder to hold main.rs.

```
.
└── api
    ├── Cargo.toml
    └── src
        ├── bin
        │   └── main.rs
        └── lib.rs
```

main.rs is going to be the entry point of our API, this is where we will define the routes we plan to use. We'll start by defining a single route at a time as we build the application up.

```rust
// api/src/lib.rs

pub mod post_handler;
```

```rust
// api/src/bin/main.rs

#[macro_use] extern crate rocket;
use api::post_handler;

#[launch]
fn rocket() -> _ {
    rocket::build()
        .mount("/api", routes![
            post_handler::list_posts_handler, 
            post_handler::list_post_handler,
        ])
}
```

We are going to use post_handler.rs to define the routes themselves. To avoid constant errors from our LSP, we'll use the todo!() macro to let Rust know that these functions/routes are incomplete.

Create a new file called post_handler.rs in src and write the following template code:

```
// api/src/post_handler.rs

use shared::response_models::{Response, ResponseBody};
use application::post::{read};
use domain::models::{Post};
use rocket::{get};
use rocket::response::status::{NotFound};
use rocket::serde::json::Json;

#[get("/")]
pub fn list_posts_handler() -> String {
    todo!()
}

#[get("/post/<post_id>")]
pub fn list_post_handler(post_id: i32) -> Result<String, NotFound<String>> {
    todo!()
}
```

Here we define two requests:

```
GET /api/ (used to list all posts)
GET /api/post/<post_id> (used to list a post by id)
```

---

## Handling API logic
With the request handlers templated, let's write the logic required for the routes. Inside of application, create a new folder called post. This folder will contain a file for each of our routes logic.

```toml
# application/Cargo.toml

[package]
name = "application"
version = "0.1.0"
edition = "2021"

[dependencies]
domain = { path = "../domain" }
infrastructure = { path = "../infrastructure" }
shared = { path = "../shared" }

diesel = { version = "2.0.0", features = ["postgres"] }
serde_json = "1.0.88"
rocket = { version = "0.5.0-rc.2", features = ["json"] }
```

```rust
// application/src/lib.rs

pub mod post;
```

```rust
// application/src/post/mod.rs

pub mod read;
```

```rust
// application/src/post/read.rs

use domain::models::Post;
use shared::response_models::{Response, ResponseBody};
use infrastructure::establish_connection;
use diesel::prelude::*;
use rocket::response::status::NotFound;

pub fn list_post(post_id: i32) -> Result<Post, NotFound<String>> {
    use domain::schema::posts;

    match posts::table.find(post_id).first::<Post>(&mut establish_connection()) {
        Ok(post) => Ok(post),
        Err(err) => match err {
            diesel::result::Error::NotFound => {
                let response = Response { body: ResponseBody::Message(format!("Error selecting post with id {} - {}", post_id, err))};
                return Err(NotFound(serde_json::to_string(&response).unwrap()));
            },
            _ => {
                panic!("Database error - {}", err);
            }        
        }
    }
}

pub fn list_posts() -> Vec<Post> {
    use domain::schema::posts;

    match posts::table.select(posts::all_columns).load::<Post>(&mut establish_connection()) {
        Ok(mut posts) => {
            posts.sort();
            posts
        },
        Err(err) => match err {
            _ => {
                panic!("Database error - {}", err);
            }
        }
    }
}
```

It's important to note that when using Rocket.rs, the panic!() macro will return a 500 InternalServerError and not crash your program.

With the logic for our route written, let's return back to our post handler to finish off our two GET routes.

```rust
// api/src/post_handler.rs

// ...

#[get("/")]
pub fn list_posts_handler() -> String {
    // 👇 New function body!
    let posts: Vec<Post> = read::list_posts();
    let response = Response { body: ResponseBody::Posts(posts) };

    serde_json::to_string(&response).unwrap()
}

#[get("/post/<post_id>")]
pub fn list_post_handler(post_id: i32) -> Result<String, NotFound<String>> {
    // 👇 New function body!
    let post = read::list_post(post_id)?;
    let response = Response { body: ResponseBody::Post(post) };

    Ok(serde_json::to_string(&response).unwrap())
}
```

Congratulations! You've just written your first two routes, hooked them up to a database, and have them both successfully reading content from it. Unfortunately, there isn't much to read yet as there are no blog posts in our table.

Let's change that.

---

## Creating Posts
Like before, we'll start by templating out the route handler. This will be a POST request that will accept JSON data.

```rust
// api/src/post_handler.rs

use shared::response_models::{Response, ResponseBody};
use application::post::{create, read}; // 👈 New!
use domain::models::{Post, NewPost}; // 👈 New! 
use rocket::{get, post}; // 👈 New! 
use rocket::response::status::{NotFound, Created}; // 👈 New! 
use rocket::serde::json::Json;

// ...

#[post("/new_post", format = "application/json", data = "<post>")]
pub fn create_post_handler(post: Json<NewPost>) -> Created<String> {
    create::create_post(post)
}
```

With that done, we can start the implementation of the create_post() function.

```rust
// application/src/post/mod.rs

pub mod read;
pub mod create; // 👈 New!
```

```rust
// application/src/post/create.rs

use domain::models::{Post, NewPost};
use shared::response_models::{Response, ResponseBody};
use infrastructure::establish_connection;
use diesel::prelude::*;
use rocket::response::status::Created;
use rocket::serde::json::Json;

pub fn create_post(post: Json<NewPost>) -> Created<String> {
    use domain::schema::posts;

    let post = post.into_inner();

    match diesel::insert_into(posts::table).values(&post).get_result::<Post>(&mut establish_connection()) {
        Ok(post) => {
            let response = Response { body: ResponseBody::Post(post) };
            Created::new("").tagged_body(serde_json::to_string(&response).unwrap())
        },
        Err(err) => match err {
            _ => {
                panic!("Database error - {}", err);
            }
        }
    }
}
```

The final thing we need to do is register the route so it can be used.

```rust
// api/src/bin/main.rs

#[macro_use] extern crate rocket;
use api::post_handler;

#[launch]
fn rocket() -> _ {
    rocket::build()
        .mount("/api", routes![
            post_handler::list_posts_handler, 
            post_handler::list_post_handler,
            post_handler::create_post_handler, // 👈 New!
        ])
}
```

Now that's done, lets finally test the API with some data!

---

## CR__ Testing
With two of our four letters implemented, let's give it a small test run. Navigate back to the root directory and run the application.

```
cargo run

```
After the project has built, open up your favourite API testing tool and check the routes work as expected.

![GET / working as intended]()
Figure: GET / working as intended

![POST /new_post working as intended]()
Figure: POST /new_post working as intended

---

## The final two letters
The final two operations we need is updating and deleting. We'll implement updating via "publishing" a post and deleting by, well… deleting a post.

Like with the past two letters, let's create our handlers.

```rust
// api/src/post_handler.rs

use shared::response_models::{Response, ResponseBody};
use application::post::{create, read, publish, delete}; // 👈 New!
use domain::models::{Post, NewPost};
use rocket::{get, post};
use rocket::response::status::{NotFound, Created};
use rocket::serde::json::Json;

// ...

#[get("/publish/<post_id>")]
pub fn publish_post_handler(post_id: i32) -> Result<String, NotFound<String>> {
    let post = publish::publish_post(post_id)?; 
    let response = Response { body: ResponseBody::Post(post) };

    Ok(serde_json::to_string(&response).unwrap())
}

#[get("/delete/<post_id>")]
pub fn delete_post_handler(post_id: i32) -> Result<String, NotFound<String>> {
    let posts = delete::delete_post(post_id)?;
    let response = Response { body: ResponseBody::Posts(posts) };

    Ok(serde_json::to_string(&response).unwrap())
}
```

And implement the logic for them.

```rust
// application/src/post/mod.rs

pub mod create;
pub mod read;
pub mod publish; // 👈 New!
pub mod delete; // 👈 New!
```


```rust
// application/src/post/publish.rs

use domain::models::Post;
use shared::response_models::{Response, ResponseBody};
use infrastructure::establish_connection;
use rocket::response::status::NotFound;
use diesel::prelude::*;

pub fn publish_post(post_id: i32) -> Result<Post, NotFound<String>> {
    use domain::schema::posts::dsl::*;

    match diesel::update(posts.find(post_id)).set(published.eq(true)).get_result::<Post>(&mut establish_connection()) {
        Ok(post) => Ok(post),
        Err(err) => match err {
            diesel::result::Error::NotFound => {
                let response = Response { body: ResponseBody::Message(format!("Error publishing post with id {} - {}", post_id, err))};
                return Err(NotFound(serde_json::to_string(&response).unwrap()));
            },
            _ => {
                panic!("Database error - {}", err);
            }        
        }
    }
}
```

```rust
// application/src/post/delete.rs

use shared::response_models::{Response, ResponseBody};
use infrastructure::establish_connection;
use diesel::prelude::*;
use rocket::response::status::NotFound;
use domain::models::Post;

pub fn delete_post(post_id: i32) -> Result<Vec<Post>, NotFound<String>> {
    use domain::schema::posts::dsl::*;
    use domain::schema::posts;

    let response: Response;

    let num_deleted = match diesel::delete(posts.filter(id.eq(post_id))).execute(&mut establish_connection()) {
        Ok(count) => count,
        Err(err) => match err {
            diesel::result::Error::NotFound => {
                let response = Response { body: ResponseBody::Message(format!("Error deleting post with id {} - {}", post_id, err))};
                return Err(NotFound(serde_json::to_string(&response).unwrap()));
            },
            _ => {
                panic!("Database error - {}", err);
            }        
        }
    };

    if num_deleted > 0 {
        match posts::table.select(posts::all_columns).load::<Post>(&mut establish_connection()) {
            Ok(mut posts_) => {
                posts_.sort();
                Ok(posts_)
            },
            Err(err) => match err {
                _ => {
                    panic!("Database error - {}", err);
                }
            }
        }
    } else {
        response = Response { body: ResponseBody::Message(format!("Error - no post with id {}", post_id))};
        Err(NotFound(serde_json::to_string(&response).unwrap()))
    } 
}
```

And finally, register our new routes.

```rust
// api/src/bin/main.rs

#[macro_use] extern crate rocket;
use api::post_handler;

#[launch]
fn rocket() -> _ {
    rocket::build()
        .mount("/api", routes![
            post_handler::list_posts_handler, 
            post_handler::list_post_handler,
            post_handler::create_post_handler,
            post_handler::publish_post_handler, // 👈 New!
            post_handler::delete_post_handler, // 👈 New!
        ])
}
```

And that's it! You now have a fully functioning API written in Rocket.rs, which connects to a PostgreSQL database via Diesel.rs. Not only that, but the application is structured following Clean Architecture.

Your project should now look close to the following:

```
.
├── Cargo.lock
├── Cargo.toml
├── api
│   ├── Cargo.toml
│   └── src
│       ├── bin
│       │   └── main.rs
│       ├── lib.rs
│       └── post_handler.rs
├── application
│   ├── Cargo.toml
│   └── src
│       ├── lib.rs
│       └── post
│           ├── create.rs
│           ├── delete.rs
│           ├── mod.rs
│           ├── publish.rs
│           └── read.rs
├── domain
│   ├── Cargo.toml
│   └── src
│       ├── lib.rs
│       ├── models.rs
│       └── schema.rs
├── infrastructure
│   ├── Cargo.toml
│   ├── migrations
│   │   └── 2022–11–18–090125_create_posts
│   │       ├── up.sql
│   │       └── down.sql
│   └── src
│       └── lib.rs
└── shared
    ├── Cargo.toml
    └── src
        ├── lib.rs
        └── response_models.rs
```

---

## Further Improvements
There are a few things that could be improved when looking at the application as a whole.

Firstly, whenever we want to use the database we open up a new connection. This can become costly and resource intensive when on a larger scale. One way this could be fixed is by using a connection pool, Rocket.rs includes built in support for R2D2, a connection pool handler for Rust.

Secondly, Diesel.rs is not asynchronous - this isn't too much of an issue on this scale. However, it can become a bigger problem for larger applications. There is, at the time writing, no asynchronous implementation from the official team behind Diesel.rs. As an alternative, an external crate is available to provide this functionality.

Finally, a front-end UI could be created alongside the Rust API. Inside the root directory you would create a new project called web_ui using your front-end language of choice. All you'd then need to do is run both projects separately, calling the Rust API from your front-end client. Here's my implementation of a front-end for some inspiration:

![My implementation of the front-end UI]()
Figure: My implementation of the front-end UI

---

## Conclusion
Phew! What a journey. Not only have we learnt how to use Rocket.rs and Diesel.rs but we've learnt how to use them together to create a blogging API in Rust. Along with that, we've built a front-end for it and packaged it all together in a single project file following Clean Architecture.

All code along with my implementation of the front-end can be found here: [https://github.com/BrookJeynes/blog-rust](https://github.com/BrookJeynes/blog-rust)

I hope you guys learnt a lot today, and give the process a go yourself and create something new! Make sure to star the [Github](https://github.com/BrookJeynes/blog-rust) repository and let me know what I should cover next or any feedback you have.

Thanks for reading,   
\- Brook ❤

---

## References

### Crates:
- [Diesel.rs](https://github.com/diesel-rs/diesel)
- [Rocket.rs](https://github.com/SergioBenitez/Rocket/tree/v0.5-rc)
- [Serde-rs/serde](https://github.com/serde-rs/serde)
- [Serde-rs/json](https://github.com/serde-rs/json)

### Other guides/docs followed:
- [Diesel.rs - Getting started](https://github.com/diesel-rs/diesel)
- [Rocket.rs - Getting started](https://rocket.rs/v0.5-rc/guide/)
- [A Simple Crud on Rust (With Rocket.rs and Diesel.rs)](https://medium.com/swlh/a-simple-crud-on-rust-with-rocket-rs-and-diesel-rs-e885672cb23d) (Uses deprecated packages for current rust version (v1.65.0) 🙁)
- Too many Stackoverflow posts to mention

