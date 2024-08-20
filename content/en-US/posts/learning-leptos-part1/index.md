---
.title = "Learning Leptos: Building a Todo application - The basics",
.date = @date("2023-04-20T00:00:00"),
.author = "Brook Jeynes",
.layout = "post.shtml",
--- 

## Introduction
Hey all, in this 3 part series we're going to build a simple todo application in [Leptos](https://github.com/leptos-rs/leptos).
We'll start at the basics, building out the initial UI and learning the common Leptos
language. Then, we'll add a database and move server logic into an API layer with Actix
in the following parts.

Here's a sneak peak of what you will have by the end of this part.
![Website design preview](https://user-images.githubusercontent.com/25432120/232404896-cad3efd9-735a-4484-a6b7-50c16037ffec.png)

All the code from this blog post can be found here: https://github.com/BrookJeynes/todo-leptos

This guide assumes:
- You have a basic-to-decent understanding of Rust concepts and the language syntax.
- You have Rust and Cargo installed

_Note: The code in this tutorial is used for teaching purposes and does not necessarily 
represent production ready code._

Now that that’s sorted, let’s begin!

---

## Getting started
First we must enable nightly rust and add the ability for it to compile Rust to WebAssembly:
```bash
rustup toolchain install nightly
rustup default nightly
rustup target add wasm32-unknown-unknown
```

Next we need to install [Leptos](https://github.com/leptos-rs/leptos) and it's build tool [Cargo-Leptos](https://github.com/leptos-rs/cargo-leptos)
```bash
cargo install cargo-leptos
```

Now we need to create our project. In this tutorial we will use the Tailwind example
Leptos provides for us.

_Note: If you don't if you don't care about Tailwind integration, then all you have
to do is run the following command to pull down the starter template and skip to 
the next section:_
```bash
cargo leptos new --git https://github.com/leptos-rs/start
```

Currently, adding Tailwind is a little bit of a complicated process. Luckily for us,
the team has released a Tailwind template we can simply just copy.

```bash
# Clone the Leptos project
git clone https://github.com/leptos-rs/leptos
# Copy the tailwind example and call it todo-leptos
mv leptos/examples/tailwind ./todo-leptos
# Delete the Leptos project
rm -rf leptos
# Navigate into the project
cd todo-leptos
```

With our project created, let's add a few files, folders, and move some things around
so we have a more ideal structure for long term.

```bash
cd src

mkdir components
touch components.rs

mkdir pages
touch pages.rs
touch pages/home.rs
```

Now that we have our pages and components set up, we need to expose these files
to the rest of the project. Add the following code to the top of `lib.rs` and `main.rs`.

```rust
pub mod app;
pub mod components;
pub mod pages;
```

Let's also move the `Home` component from `app.rs` to `home.rs` and remove everything
inside it so we're left with a single `div` tag.

```rust
// todo-leptos/src/pages/home.rs
use leptos::*;

#[component]
fn Home(cx: Scope) -> impl IntoView {

    view! { cx,
        <div></div>
    }
}
```

We now need to expose `Home` by adding it into `pages.rs`

```rust
// todo-leptos/src/pages.rs
pub mod home;
```

Import `Home` back into `app.rs` by adding the following code to the 
top of the file.

```rust
use crate::pages::home::*;
```

Finally, update `Cargo.toml` to reflect the code below:

```toml
[package]
name = "todo-leptos"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib", "rlib"]

[dependencies]
actix-files = { version = "0.6", optional = true }
actix-web = { version = "4", optional = true, features = ["macros"] }
console_error_panic_hook = "0.1"
console_log = "1"
cfg-if = "1"
leptos = { version = "0.2", default-features = false, features = [
  "serde",
] }
leptos_meta = { version = "0.2", default-features = false }
leptos_actix = { version = "0.2", optional = true }
leptos_router = { version = "0.2", default-features = false }
log = "0.4"
simple_logger = "4"
wasm-bindgen = "0.2"

[features]
hydrate = ["leptos/hydrate", "leptos_meta/hydrate", "leptos_router/hydrate"]
ssr = [
  "dep:actix-files",
  "dep:actix-web",
  "dep:leptos_actix",
  "leptos/ssr",
  "leptos_meta/ssr",
  "leptos_router/ssr",
]

[profile.release]
codegen-units = 1
lto = true
opt-level = 'z'

[package.metadata.leptos]
# The name used by wasm-bindgen/cargo-leptos for the JS/WASM bundle. Defaults to the crate name   
output-name = "tailwind"
# The site root folder is where cargo-leptos generate all output. WARNING: all content of this folder will be erased on a rebuild. Use it in your server setup.
site-root = "target/site"
# The site-root relative folder where all compiled output (JS, WASM and CSS) is written
# Defaults to pkg	
site-pkg-dir = "pkg"
# [Optional] The source CSS file. If it ends with .sass or .scss then it will be compiled by dart-sass into CSS. The CSS is optimized by Lightning CSS before being written to <site-root>/<site-pkg>/app.css
style-file = "style/output.css"
# [Optional] Files in the asset-dir will be copied to the site-root directory
assets-dir = "public"
# The IP and port (ex: 127.0.0.1:3000) where the server serves the content. Use it in your server setup.
site-addr = "127.0.0.1:3000"
# The port to use for automatic reload monitoring
reload-port = 3001
# [Optional] Command to use when running end2end tests. It will run in the end2end dir.
end2end-cmd = "npx playwright test"
#  The browserlist query used for optimizing the CSS.
browserquery = "defaults"
# Set by cargo-leptos watch when building with tha tool. Controls whether autoreload JS will be included in the head
watch = false
# The environment Leptos will run in, usually either "DEV" or "PROD"
env = "DEV"
# The features to use when compiling the bin target
#
# Optional. Can be over-ridden with the command line parameter --bin-features
bin-features = ["ssr"]

# If the --no-default-features flag should be used when compiling the bin target
#
# Optional. Defaults to false.
bin-default-features = false

# The features to use when compiling the lib target
#
# Optional. Can be over-ridden with the command line parameter --lib-features
lib-features = ["hydrate"]

# If the --no-default-features flag should be used when compiling the lib target
#
# Optional. Defaults to false.
lib-default-features = false
```

And we're done! You should now have something that resembles the following.

_Note: Your structure may look a little different depending on whether you installed
Tailwind or not, the following structure includes Tailwind files._

```
.
├── Cargo.lock
├── Cargo.toml
├── end2end
│  ├── package-lock.json
│  ├── package.json
│  ├── playwright.config.ts
│  └── tests
│     └── example.spec.ts
├── input.css
├── LICENSE
├── Makefile.toml
├── public
│  └── favicon.ico
├── README.md
├── src
│  ├── app.rs
│  ├── components
│  ├── components.rs
│  ├── lib.rs
│  ├── main.rs
│  ├── pages
│  │  └── home.rs
│  └── pages.rs
├── style
│  └── output.css
└── tailwind.config.js
```

Let's give the project a test run to ensure everything is running correctly.

_Note: If you're using Tailwind, open up a terminal and run the following command
in the background. This will ensure that the tailwind styles are kept updated on save._

```bash
npx tailwindcss -i ./input.css -o ./style/output.css --watch
```

We can leverage the `cargo-leptos` tool to run the web app.
```bash
cargo leptos watch
```

Hopefully everything ran fine :)

With that sorted, let's create our first component!

## Components
So what are components? Components are the basic building blocks of web development
and that's no different here. We can build components in Leptos by writing normal
functions and adding the `#[component]` macro to it.

Let's jump straight in and build our first component, something to handle rendering
the individual todo items. 

We first need to create a file to house the component.
```bash
# todo-leptos/src/components/
touch todo_item.rs
```
and then register it within `components.rs`

```rust
// todo-leptos/src/components.rs
pub mod todo_item;
```

With all that out of the way, let's start building out the structure. As mention
previously, a Leptos component is a Rust function which has the `#[component]` macro
above it. As well as this, every component must take in a reactive `Scope` and return
`impl IntoView`.

```rust
// todo-leptos/src/components/todo_item.rs
use leptos::*;

#[component]
pub fn TodoItem(cx: Scope) -> impl IntoView {
    todo!()
}
```

So what is `Scope` and why are we returning `impl IntoView`?
As described by the Leptos handbook:

> This `Scope` is our entrypoint into the reactive system

To expand on this, it's what gives our components the ability to be reactive and
render new outputs on the DOM based on certain conditions.

`impl IntoView` on the other hand is almost a wrapper type that allows us to return
anything from a Leptos `view`. This is useful as the `view!{}` macro we'll use to write
the HTML, generates `view` types.

Speaking of the `view!{}` macro, let's use it to write some RSX, like JSX but using rust ;)
The `view!{}` macro starts by taking in our `cx` variable followed by a series of RSX statements.

```rust
// todo-leptos/src/components/todo_item.rs
use leptos::*;

#[component]
pub fn TodoItem(cx: Scope) -> impl IntoView {
    view! { 
        cx,
        <div class="flex justify-between items-center">
            <span>
                "todo task name"
            </span>
            <div class="flex justify-between w-fit sm:w-1/3">
                <button class="hover:cusor-pointer">"Complete"</button>
                <button class="hover:cusor-pointer ml-4 sm:ml-0">"Delete"</button>
            </div>
        </div>
    }
}
```

I mean, wow! That's pretty much straight HTML. All that's really changed is the 
need to quote text. The power or Rust macros allows us to write 
(pretty much) standard HTML within our components.

While we're inside of this file, let's setup a struct to represent what a TodoItem
will look like.

```rust
// todo-leptos/src/components/todo_item.rs
use leptos::*;

#[derive(Clone)]
pub struct TodoItem {
    pub id: u32,
    pub task: String,
    pub status: bool
}

#[component]
pub fn TodoItem(cx: Scope) -> impl IntoView {
    // ...
}
```

We need to ensure our structures can be cloned as Leptos relies on data to be 
cloned from time to time. We'll learn more about signals later on in the post 
but when signals are created, they must own the data. To access the data from 
the signal, the value is cloned so the signal can continue owning the underlying value.

With that all setup, let's add a `TodoItem` component to the Home page.

```rust
// todo-leptos/src/pages/home.rs
use leptos::*;
use crate::components::todo_item::*;

#[component]
pub fn Home(cx: Scope) -> impl IntoView {
    view! { 
        cx,
        <div class="h-screen">
            <div class="pt-20 mb-10 mx-auto px-5 w-full lg:px-0 lg:max-w-[90ch]">
                // 👇 New!
                <TodoItem />
            </div>
        </div>
    }
}
```

And with that we've made our first component in Leptos!

## Props
In the previous section we built a `TodoItem` component to render the individual
todo items. However, you may have noticed that all we did was mock some data inside
of the component. Wouldn't it be great if we could pass a `TodoItem` into the component?

Using props we can do exactly that! Props allow us to pass different data structures
into components. We define props just as we'd define a function parameter, let's go 
ahead and add a `TodoItem` prop to our `TodoItem` component.

While we're at it, lets also take the time to document our component. We can do
so using normal Rust doc strings.

```rust
// todo-leptos/src/components/todo_item.rs
use leptos::*;

// ...

/// A todo item component
#[component]
pub fn TodoItem(
    cx: Scope, 
    // 👇 New prop!
    /// The todo item the component will use to populate its internal data
    todo_item: TodoItem
) -> impl IntoView {
    view! { 
        // ...
    }
}
```

With a `TodoItem` now being passed in, let's display those values within the RSX.
Variables can be displayed within RSX by surrounding the expresion in curly brackets - `{}`.

```rust
// todo-leptos/src/components/todo_item.rs
use leptos::*;

#[derive(Clone)]
pub struct TodoItem {
    pub id: u32,
    pub task: String,
    pub status: bool
}

/// A todo item component
#[component]
pub fn TodoItem(
    cx: Scope, 
    /// The todo item the component will use to populate its internal data
    todo_item: TodoItem
) -> impl IntoView {
    view! { 
        cx,
        <div class="flex justify-between items-center">
            <span>
                {todo_item.task} // 👈 New! 
            </span>
            <div class="flex justify-between w-fit sm:w-1/3">
                <button class="hover:cusor-pointer">"Complete"</button>
                <button class="hover:cusor-pointer ml-4 sm:ml-0">"Delete"</button>
            </div>
        </div>
    }
}
```

With the `TodoItem` component now taking in a prop, we need to update our instance of
it within `home.rs`.

```rust
// todo-leptos/src/pages/home.rs
use leptos::*;
use crate::components::todo_item::*;

#[component]
pub fn Home(cx: Scope) -> impl IntoView {
    let task: TodoItem = TodoItem {
        id: 0,
        task: String::from("Take out the trash"),
        status: false,
    };

    view! { 
        cx,
        <div class="h-screen">
            <div class="pt-20 mb-10 mx-auto px-5 w-full lg:px-0 lg:max-w-[90ch]">
                      // 👇 New!
                <TodoItem todo_item={task} />
            </div>
        </div>
    }
}
```

_There are so many more things that can be done with props which you can read all 
about here: https://leptos-rs.github.io/leptos/view/03_components.html#components-and-props_

Let's curve away from the `TodoItem` component for a second and build a new component
that will teach us how to use `Children`. By having a component which takes in children,
we can define wrapper components that wrap around some sort of conent. To demonstrate
this, we'll build a `PageWrapper` component which takes in children and wraps it in
some styling.

We'll start by creating a new file, `page_wrapper.rs` and register our component 
within `components.rs`.

```bash
# todo-leptos/src/components/
touch page_wrapper.rs
```

```rust
// todo-leptos/src/components.rs
pub mod todo_item;
// 👇 New!
pub mod page_wrapper;
```

Let's now define our component and pass in the `Children` prop.

```rust
// todo-leptos/src/components/page_wrapper.rs
use leptos::*;

#[component]
pub fn PageWrapper(cx: Scope, children: Children) -> impl IntoView {
    view! {
        cx,
        <div class="h-screen">
            <div class="pt-20 mb-10 mx-auto px-5 w-full lg:px-0 lg:max-w-[90ch]">
                {children(cx)}
            </div>
        </div>
    }
}
```

Just as we've previously embedded code within RSX, we wrap our `children()` call
in curly brackets - `{}`. When using `children` we must also pass in the components
`Scope`, `cx` in our instance.

We can now use our `PageWrapper` component within `home.rs` and pass in our `TodoItem` component
as a child element.

```rust
// todo-leptos/src/pages/home.rs
use leptos::*;
use crate::components::todo_item::*;
// 👇 New!
use crate::components::page_wrapper::*;

#[component]
pub fn Home(cx: Scope) -> impl IntoView {
    let task: TodoItem = TodoItem {
        id: 0,
        task: String::from("Take out the trash"),
        status: false,
    };

    view! { 
        cx,
        // 👇 New!
        <PageWrapper>
            <div id="todo_items">
                <TodoItem todo_item={task} />
            </div>
        </PageWrapper>    
    }
}
```

Everything we place inside the `PageWrapper` tags will be rendered where we
specified `children(cx)`.

## Iteration
Displaying one todo item is cool and all but what if we wanted to store more?
Let's go ahead and create a list of `TodoItem`s and find out how we can iterate
through them and display them all on the page.

```rust
// todo-leptos/src/pages/home.rs
use leptos::*;
use crate::components::todo_item::*;
use crate::components::page_wrapper::*;

#[component]
pub fn Home(cx: Scope) -> impl IntoView {
    // 👇 New!
    let todo_items: Vec<TodoItem> = vec![
        TodoItem {
            id: 0,
            task: String::from("Take out the trash"),
            status: false,
        },
        TodoItem {
            id: 1,
            task: String::from("Make the bed"),
            status: false,
        },
        TodoItem {
            id: 2,
            task: String::from("Mow the lawn"),
            status: true,
        },
        TodoItem {
            id: 3,
            task: String::from("Wash the dishes"),
            status: false,
        },
    ];

    view! { 
        cx,
        <PageWrapper>
            <div id="todo_items">
                // Let's comment this out for the mean time to avoid errors
                // <TodoItem todo_item={task} />
            </div>
        </PageWrapper>    
    }
}
```

There are a few ways we can display a collection of items. One of those ways is
via the `<For />` component. The `<For />` component is a keyed dynamic list and
is particularly useful for our usecase as our list of todo items will be changing
often as the user creates and deletes items.

As per the leptos handbook:
> The <For/> component ... takes [in] three props:
      1. `each`: a function (such as a signal) that returns the items `T` to be iterated over
      2. `key`: a key function that takes `&T` and returns a stable, unique key or ID
      3. `view`: renders each `T` into a view

```rust
// todo-leptos/src/pages/home.rs
use leptos::*;
use crate::components::todo_item::*;
use crate::components::page_wrapper::*;

#[component]
pub fn Home(cx: Scope) -> impl IntoView {
    let todo_items: Vec<TodoItem> = vec![
        TodoItem {
            id: 0,
            task: String::from("Take out the trash"),
            status: false,
        },
        TodoItem {
            id: 1,
            task: String::from("Make the bed"),
            status: false,
        },
        TodoItem {
            id: 2,
            task: String::from("Mow the lawn"),
            status: true,
        },
        TodoItem {
            id: 3,
            task: String::from("Wash the dishes"),
            status: false,
        },
    ];

    view! { 
        cx,
        <PageWrapper>
            <div id="todo_items">
                // 👇 New!
                <For
                    each=move || { todo_items.clone() }
                    key=|task| task.id
                    view=move |cx, task: TodoItem| {
                        view! {
                            cx,
                            <TodoItem todo_item={task} />
                        }
                    }
                />
            </div>
        </PageWrapper>    
    }
}
```

And just like that we have a series of todo items being rendered. Don't worry too
much right now why we're using closures, we'll go over that in the next section.

_Read more about iteration here: https://leptos-rs.github.io/leptos/view/04_iteration.html_

## Reactive data
A `Signal` is "the basic unit of reactive change and state management" (Leptos handbook)
and is how we make things reactive in Leptos. Using `create_signal()` we can create
a new reactive signal which we can read and write.

`create_signal()` returns a `(getter, setter)` tuple. We can use `<getter>.get()`,
or `<getter>()` in nightly, to get the value, `<setter>.set()`, or `<setter>()`
in nightly, to set the value, and `<setter>.update()` to update the value.

Let's go ahead and turn our `todo_items` vector into a signal using `create_signal()`.
While we're at it, let's also update the `<For />` tag to take in our signal.

```rust
// todo-leptos/src/pages/home.rs
use leptos::*;
use crate::components::todo_item::*;
use crate::components::page_wrapper::*;

#[component]
pub fn Home(cx: Scope) -> impl IntoView {
    // 👇 New!
    // Signals
    let (todo_items, set_todo_items) = create_signal(
        cx,
        vec![
            TodoItem {
                id: 0,
                task: String::from("Take out the trash"),
                status: false,
            },
            TodoItem {
                id: 1,
                task: String::from("Make the bed"),
                status: false,
            },
            TodoItem {
                id: 2,
                task: String::from("Mow the lawn"),
                status: true,
            },
            TodoItem {
                id: 3,
                task: String::from("Wash the dishes"),
                status: false,
            },
        ],
    );

    view! { 
        cx,
        <PageWrapper>
            <div id="todo_items">
                // 👇 New!
                <For
                    // We no longer need to use a closure as `todo_items` is now a signal
                    each={todo_items}
                    key=|task| task.id
                    view=move |cx, task: TodoItem| {
                        view! {
                            cx,
                            <TodoItem todo_item={item} />
                        }
                    }
                />
            </div>
        </PageWrapper>    
    }
}
```

One thing you may have noticed is we moved from using a closure to just passing in
our signal, why is that? While I won't try compete with the [official handbook which
explains why in much more detail](https://leptos-rs.github.io/leptos/interlude_functions.html) 
the tldr of it all is that closures give Leptos the ability to re-run certain statements
allowing certain components to be updated when call to do so.

Now that we know how to make things reactive, lets get some more practice in and
make our `TodoItem` component responsive to change.

Let's start with something simple, changing the todo task from in-progress to done.
We'll start by creating a signal to handle the getter and setter methods.

```rust
// todo-leptos/src/components/todo_item.rs
use leptos::*;

// ...

/// A todo item component
#[component]
pub fn TodoItem(
    cx: Scope, 
    /// The todo item the component will use to populate its internal data
    todo_item: TodoItem
) -> impl IntoView {
    // 👇 New!
    // Signals
    let (status, set_status) = create_signal(cx, todo_item.status);

    view! { 
        // ...
    }
}
```

Now, we want `status` to update whenever we press the "complete" button. For this,
we'll need to add an `on:click` event handler to the button.

_Read more about handlers here: https://docs.rs/leptos/latest/leptos/ev/trait.EventDescriptor.html#associatedtype.EventType_

Let's create the logic for when our `on:click` handler fires. All we want to do is update
the `status` and we can do so with the `.update()` method on the setter `set_status`.

```rust
// todo-leptos/src/components/todo_item.rs
use leptos::*;

// ...

/// A todo item component
#[component]
pub fn TodoItem(
    cx: Scope, 
    /// The todo item the component will use to populate its internal data
    todo_item: TodoItem
) -> impl IntoView {
    // Signals
    let (status, set_status) = create_signal(cx, todo_item.status);

    // 👇 New!
    // Handlers
    // We must use a closure here to make the click function reactive.
    let on_click = move |_| {
        // Update gives us a `&T` so we must dereference the value to use it
        set_status.update(|status| *status = !*status)
    };

    view! { 
        // ...
    }
}
```

With the `on_click` handler defined, let's add it to our buttons callback.

```rust
// todo-leptos/src/components/todo_item.rs
use leptos::*;

// ...

/// A todo item component
#[component]
pub fn TodoItem(
    cx: Scope, 
    /// The todo item the component will use to populate its internal data
    todo_item: TodoItem
) -> impl IntoView {
    // Signals
    let (status, set_status) = create_signal(cx, todo_item.status);

    // Handlers
    let on_click = move |_| {
        set_status.update(|status| *status = !*status)
    };

    view! { 
        cx,
        <div class="flex justify-between items-center">
            <span>
                {todo_item.task} 
            </span>
            <div class="flex justify-between w-fit sm:w-1/3">
                // 👇 New!
                <button on:click={on_click} class="hover:cusor-pointer">"Complete"</button>
                <button class="hover:cusor-pointer ml-4 sm:ml-0">"Delete"</button>
            </div>
        </div>
    }
}
```

Using the same method as above, let's add some reactive text and button styling.

```rust
// todo-leptos/src/components/todo_item.rs
use leptos::*;

// ...

/// A todo item component
#[component]
pub fn TodoItem(
    cx: Scope, 
    /// The todo item the component will use to populate its internal data
    todo_item: TodoItem
) -> impl IntoView {
    // Signals
    let (status, set_status) = create_signal(cx, todo_item.status);

    // Handlers
    let on_click = move |_| {
        set_status.update(|status| *status = !*status)
    };

    // 👇 New!
    // Classes
    let task_title_style = move || format!("text-md {}", if status() { "line-through" } else { "" });
    let complete_button_style = move || {
        format!(
            "hover:cursor-pointer {}",
            if !status() {
                "opacity-100"
            } else {
                "opacity-50"
            }
        )
    };

    view! { 
        cx,
        <div class="flex justify-between items-center">
            // 👇 New!
            <span class={task_title_style}>
                {todo_item.task} 
            </span>
            <div class="flex justify-between w-fit sm:w-1/3">
                // 👇 New!
                <button 
                    on:click={on_click} 
                    class={complete_button_style}
                >
                    {move || if !status() { "Complete" } else { "Undo" }}
                </button>

                <button 
                    class="hover:cusor-pointer ml-4 sm:ml-0"
                >
                    "Delete"
                </button>
            </div>
        </div>
    }
}
```

Look at us go, Reactivity for the win!

There's one final thing we need to go over within this section before finishing
up with the `TodoItem` component. How would we go about removing
a task from our task list? We can't have the delete logic in the component but we
also want the user to click a button within the component. It would be great if
our component could call a function external to itself.

We can achieve this behaviour using callbacks. Callback functions are functions we
pass into components and have their internal logic decide when the function is called.

Let's jump back into `Home` and define the function we'll use to delete a task
from our task list.


```rust
// todo-leptos/src/pages/home.rs
use leptos::*;
use crate::components::todo_item::*;
use crate::components::page_wrapper::*;

#[component]
pub fn Home(cx: Scope) -> impl IntoView {
    // Signals
    let (todo_items, set_todo_items) = create_signal(
        cx,
        vec![
            // ...
        ],
    );

    // 👇 New!
    // Handlers
    let delete_todo_item = move |todo_id: u32| {
        // Here we use the `retain()` method to filter out all 
        // elements that don't match the predicate
        set_todo_items.update(move |todo_items| {
                todo_items.retain(|todo_item| {
                        todo_item.id != todo_id
                    }
                )
            }
        )
    };

    view! { 
        // ...
    }
}
```

Now we need to alter `TodoItem` to take in a callback function. We do so by defining
some generic, `F` in our instance, that maps out to the callbacks signature. Since
we're here, we'll also add an `on:click` method to the delete button using the
new callback.

```rust
// todo-leptos/src/components/todo_item.rs
use leptos::*;

// ...

/// A todo item component
#[component]
            // 👇 New!
pub fn TodoItem<F>(
    cx: Scope, 
    /// The todo item the component will use to populate its internal data
    todo_item: TodoItem
    // 👇 New!
    /// A callback to delete a TodoItem
    delete_callback: F
) -> impl IntoView
where
    // Remember our delete callback takes in a TodoItem ID
    F: Fn(u32) + 'static,
{
    // ...

    view! { 
        cx,
        <div class="flex justify-between items-center">
            <span class={task_title_style}>
                {todo_item.task} 
            </span>
            <div class="flex justify-between w-fit sm:w-1/3">
                <button 
                    on:click={on_click} 
                    class={complete_button_style}
                >
                    {move || if !status() { "Complete" } else { "Undo" }}
                </button>

                <button 
                    // 👇 New!
                    on:click={move |_| delete_callback(todo_item.id)} 
                    class="hover:cusor-pointer ml-4 sm:ml-0"
                >
                    "Delete"
                </button>
            </div>
        </div>
    }
}
```

To close off this section let's pass in the callback from `home.rs` and pat
ourselves on the back, we're nearly at the finish line for part 1.

```rust
// todo-leptos/src/pages/home.rs
use leptos::*;
use crate::components::todo_item::*;
use crate::components::page_wrapper::*;

#[component]
pub fn Home(cx: Scope) -> impl IntoView {
    // Signals
    let (todo_items, set_todo_items) = create_signal(
        cx,
        vec![
            // ...
        ],
    );

    // Handlers
    let delete_todo_item = move |todo_id: u32| {
        // Here we use the `retain()` method to filter out all 
        // elements that don't match the predicate
        set_todo_items.update(move |todo_items| {
                todo_items.retain(|todo_item| {
                        todo_item.id != todo_id
                    }
                )
            }
        )
    };

    view! { 
        cx,
        <PageWrapper>
            <div id="todo_items">
                <For
                    each={todo_items}
                    key=|task| task.id
                    view=move |cx, task: TodoItem| {
                        view! {
                            cx,
                                                    // 👇 New!
                            <TodoItem todo_item={item} delete_callback={delete_todo_item} />
                        }
                    }
                />
            </div>
        </PageWrapper>    
    }
}
```

_Read more about callbacks here: https://leptos-rs.github.io/leptos/view/08_parent_child.html#2-use-a-callback_

## Forms
With our todo items able to be complete and deleted, all we need to do now is create
a way of adding new tasks. To do this, we'll set up a `<form>` and learn how to reference
nodes and use the `on:submit` callback.

To start off, let's create the HTML for the form.

```rust
// todo-leptos/src/pages/home.rs
use leptos::*;
use crate::components::todo_item::*;
use crate::components::page_wrapper::*;

#[component]
pub fn Home(cx: Scope) -> impl IntoView {
    // ...

    view! { 
        cx,
        <PageWrapper>
            // 👇 New!
            <div id="add-task" class="flex flex-col rounded mb-20 text-black">
                <h2 class="text-2xl font-medium mb-4">"Add Task"</h2>
                <form class="w-full flex flex-col">
                    <div class="flex items-center justify-between">
                        <input
                            class="w-2/3 px-2 py-1 border-b-2 border-black focus:outline-none"
                            type="text"
                            placeholder="Add a new task"
                        />
                        <input class="hover:cursor-pointer" type="submit" value="Submit" />
                    </div>
                </form>
            </div>

            <div id="todo_items">
                // 👇 New!
                <h2 class="text-2xl font-medium mb-4">"Tasks"</h2>
                <For
                    each={todo_items}
                    key=|task| task.id
                    view=move |cx, task: TodoItem| {
                        view! {
                            cx,
                                                    // 👇 New!
                            <TodoItem todo_item={item} delete_callback={delete_todo_item} />
                        }
                    }
                />
            </div>
        </PageWrapper>    
    }
}
```

Inside our form we have an text input box and a submit button. To get the information
from inside the text input box on submit, we'll need to create a `NodeRef`. "[A] 
NodeRef to access the input once when we want to get its value." (Leptos handbook).

To create a `NodeRef`, the `create_node_ref()` function can be used. Let's also
create the function to handle the `on:submit` callback.

```rust
// todo-leptos/src/pages/home.rs
use leptos::*;
// 👇 New!
use leptos::html::Input;
use leptos::ev::SubmitEvent;

use crate::components::todo_item::*;
use crate::components::page_wrapper::*;

#[component]
pub fn Home(cx: Scope) -> impl IntoView {
    // Signals
    // 👇 New!
    let todo_task_input_ref: NodeRef<Input> = create_node_ref(cx);

    // 👇 New!
    // Helpers
    /// Helper function to grab the largest ID.
    /// Used to know what the next todo item ID should be
    let last_todo_id = move || todo_items().iter().map(|todo_item| todo_item.id).max();

    // Handlers
    // 👇 New!
    let on_submit = move |ev: SubmitEvent| {
        // Prevent the page from refreshing
        ev.prevent_default();

        // Clone the vector to mutate it
        let mut new_todo_items = todo_items();
        // Get the next node ID
        let todo_id = last_todo_id().unwrap_or_default() + 1;

        // Create a new TodoItem and push it to our new todo_items vector
        new_todo_items.push(TodoItem {
            id: todo_id,
            task: todo_task_input_ref().expect("<input> to exist").value(),
            status: false,
        });

        // Set our todo_items signal to have the new todo_items vector
        set_todo_items.set(new_todo_items);
    };

    // ...

    view! { 
        // ...
    }
}
```

Now all we need to do is add the `on_submit` handler to the submit input button
and add the `todo_task_input_ref` to the text input.


```rust
// todo-leptos/src/pages/home.rs
use leptos::*;
// 👇 New!
use leptos::html::Input;
use leptos::ev::SubmitEvent;

use crate::components::todo_item::*;
use crate::components::page_wrapper::*;

#[component]
pub fn Home(cx: Scope) -> impl IntoView {
    // ...

    view! { 
        cx,
        <PageWrapper>
            <div id="add-task" class="flex flex-col rounded mb-20 text-black">
                <h2 class="text-2xl font-medium mb-4">"Add Task"</h2>
                <form 
                    class="w-full flex flex-col"
                    // 👇 New!
                    on:submit={on_submit}
                >
                    <div class="flex items-center justify-between">
                        <input
                            class="w-2/3 px-2 py-1 border-b-2 border-black focus:outline-none"
                            type="text"
                            placeholder="Add a new task"
                            // 👇 New!
                            node_ref={todo_task_input_ref}
                        />
                        <input
                            class="hover:cursor-pointer" 
                            type="submit" 
                            value="Submit" 
                        />
                    </div>
                </form>
            </div>

            // ...

        </PageWrapper>    
    }
}
```

_Read more about forms here: https://leptos-rs.github.io/leptos/view/05_forms.html#uncontrolled-inputs_

And we're done! You can now add, update, and remove todo items.

## Conclusion
Today we covered:
- Creating a Leptos project
- Creating components
- Passing in props
- Passing in children
- Adding reactivity via signals
- Creating and passing callbacks
- Creating node references and dealing with forms
- And more...

We covered a lot of important concepts and going forward will be using them and
learning even more. To learn more about what we covered today, I've linked the
Leptos handbook in the "References / Resources" section below which I highly 
recommend reading along with this guide.

All the code from this blog post can be found here: https://github.com/BrookJeynes/todo-leptos
If you liked the post, please star the [GitHub repository](https://github.com/BrookJeynes/todo-leptos) and 
if you have any comments, feel free to leave them below, I always love hearing 
what you guys have to say.

Look out for part 2 and 3 where we create a database and API to interact with from
our front-end.

I'd like to end with saying a huge thank you to the team working at Leptos who not
only proof-read this blog post but who have also been working incredibly hard to bring such
an amazing framework to the community. Your work is appreciated

Thanks for reading,  
\- Brook ❤

## References / Resources
- [The Leptos Handbook](https://leptos-rs.github.io/leptos/)
