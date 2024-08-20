---
.title = "JWT Authentication for API Routes using Rocket.rs and Rust",
.date = @date("2022-11-30T00:00:00"),
.author = "Brook Jeynes",
.layout = "post.shtml",
--- 

In this guide I'm going to explain to you what JWTs are, why they're important in API authentication, and how to add JWT authentication to API routes using Rocket.rs + Rust.

This guide assumes:
- You already have a series of Rocket.rs routes set-up already.
- You have the latest version of Rust (this guide uses v1.65.0).
- You have a basic-to-decent understanding of Rust concepts and the language syntax.

_Note: The code in this blog is just an example introduction into how to encode and decode JWTs in Rust. This code is not production ready._

Now that that's sorted, let's begin!

---

## What are JWTs?
JWTs - also know by JSON Web Tokens - are an open standard which allows a secure way to communicate information between two entities, typically consisting of some server and client. The information contained within JWTs can be considered "verified and trusted" - (Okta, n.d.) due to the token being digitally signed via a secret, encoded using a HMAC algorithm, or a public/private key pair using RSA or ECDSA.

In the following guide we will be using JWTs to verify the integrity of some users claim. When a user logs into their account, a JWT is created containing information related to that user, signed via some secret key only the server knows. The client can then use that token to verify themselves when attempting to do things such as deleting accounts or accessing confidential data.

For more information on JWTs, visit jwt.io.

---

## What is a Request Guard?
Request guards are a way of guarding an API route from incoming requests based on some validation policy. For example, say we have a route that returns information about a certain user. We only want the user in question to have access to their information. We can use a request guard to verify the integrity of the client making the request, ensuring that only the correct user can gain access.

Each route can have multiple request guards with them firing from left-to-right. If, at any point, a request guard fails, none of the remaining guards are attempted.

For more information on Request Guards, visit the official Rocket.rs docs.

---

## Required Dependencies
Here are a list of dependencies and their versions used within this blog.

```rust
[dependencies]
rocket = { version = "0.5.0-rc.2", features = ["json"] }
serde = { version = "1.0.147", features = ["derive"] }
serde_json = "1.0.88"
chrono = "0.4.23"
jsonwebtoken = "8.1.1"
dotenvy = "0.15"
```

## Building the data Models
The first step in this process is defining the types of responses the request guard can throw back at us. We can define a custom enum which derives Responder allowing us to write our own HTTP responses. Along with this, we'll define a struct and enum to handle our request responses.

```rust
use rocket::Responder;
use rocket::serde::Serialize;

#[derive(Responder, Debug)]
pub enum NetworkResponse {
    #[response(status = 201)]
    Created(String),
    #[response(status = 400)]
    BadRequest(String),
    #[response(status = 401)]
    Unauthorized(String),
    #[response(status = 404)]
    NotFound(String),
    #[response(status = 409)]
    Conflict(String),
}

#[derive(Serialize)]
pub enum ResponseBody {
    Message(String),
    AuthToken(String),
}

#[derive(Serialize)]
#[serde(crate = "rocket::serde")]
pub struct Response {
    pub body: ResponseBody,
}
```

We're also going to need to define a struct for the claims our JWTs will encode and a struct for the token itself. Here subject_id will correspond to the id of the user who created the token and exp will represent how long the token has to live.

```rust
use rocket::serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct Claims {
    pub subject_id: i32,
    exp: usize
}

#[derive(Debug)]
pub struct JWT {
    pub claims: Claims
}
```

Finally, a simple user struct will need to be created if you don't have one already.

```rust
pub struct User {
    pub id: i32,
    pub user_name: String,
    pub password: String,
}
```

---

## Encoding and Decoding JWTs
With the models defined, let's go ahead and write the functions for generating and decoding the tokens.

We want to provide a token back to the user whenever they verify who they are (e.g. on login). Let's create a function create_jwt() which takes in the users id and returns a result of either a JSON string containing the JWT or some jsonwebtoken Error.

```rust
use jsonwebtoken::errors::Error;

pub fn create_jwt(id: i32) -> Result<String, Error> {
    todo!()
}
```

After this, we need to define how long the JWT has before it expires. In a production application, JWTs are meant for long-term usage. However, because this is a local example project, our tokens will expire within 60 seconds. This will allow for easy testing as we won't have to wait long to check if it has expired.

Using the chrono library, we can create a variable holding the current time and then add an additional 60 seconds to that.

```rust
use chrono::Utc; // 👈 New! 
use jsonwebtoken::errors::ErrorKind;

pub fn create_jwt(id: i32) -> Result<String, Error> {
    // 👇 New!
    let expiration = Utc::now()
        .checked_add_signed(chrono::Duration::seconds(60))
        .expect("Invalid timestamp")
        .timestamp();
    
    todo!()
}
```

With the expiration variable defined and the user id passed in, we can now create our claims object. While we're at it we'll also create the JWTs header and encode it with HMAC using SHA-512.

```rust
use chrono::Utc;
use jsonwebtoken::{Algorithm, Header}; // 👈 New!
use jsonwebtoken::errors::Error;

pub fn create_jwt(id: i32) -> Result<String, Error> {
    let expiration = Utc::now()
        .checked_add_signed(chrono::Duration::seconds(60))
        .expect("Invalid timestamp")
        .timestamp();
    
    // 👇 New!
    let claims = Claims { 
    subject_id: id,
    exp: expiration as usize
    };

    // 👇 New!
    let header = Header::new(Algorithm::HS512);

    todo!()
}
```

With all that done, the final thing we need we need to do is use the encode() function provided to us from the jsonwebtoken crate. encode() takes in three arguments:

The JWT header.
- The claims object.
- The secret key to encode the token.

It's important that we keep the secret key private as if someone is able to access it, they can use it to forge a JWT. In this tutorial we will store the JWT secret in an .env file.

```rust
use chrono::Utc;
use jsonwebtoken::{encode, EncodingKey, Algorithm, Header}; // 👈 New!
use jsonwebtoken::errors::Error;
use std::env; // 👈 New!

pub fn create_jwt(id: i32) -> Result<String, Error> {
    let secret = env::var("JWT_SECRET").expect("JWT_SECRET must be set."); // 👈 New!

    let expiration = Utc::now()
        .checked_add_signed(chrono::Duration::seconds(60))
        .expect("Invalid timestamp")
        .timestamp();
    
    let claims = Claims {
        subject_id: id,
        exp: expiration as usize
    }; 

    let header = Header::new(Algorithm::HS512);

    // 👇 New!
    encode(&header, &claims, &EncodingKey::from_secret(secret.as_bytes()))
}
```

In order to access our .env file, we need to load it first. In your main function, add the following code:

```rust
use dotenvy::dotenv;

fn main() {
    dotenv().ok();
}
```

With our encoding functioned defined, we now need a way to decode and authenticate a token when provided one. For this, we will create a function called decode_jwt() which will take in a JWT and return a result of either a Claims object containing the items encoded or some jsonwebtoken ErrorKind.

```rust
use chrono::Utc;
use jsonwebtoken::{encode, EncodingKey, Algorithm, Header};
use jsonwebtoken::errors::{Error, ErrorKind}; // 👈 New!
use std::env;
use dotenvy::dotenv;

pub fn create_jwt(id: i32) -> Result<String, Error> { // … }

// 👇 New!
fn decode_jwt(token: String) -> Result<Claims, ErrorKind> {
    todo!()
}
```

When we pass in the token it will be in the format of "Bearer x", we need to first extract x, the token itself. We can do this using a variety of trimming methods first removing "Bearer" from the start, then trimming all white spaces at the start and end.

```rust
use chrono::Utc;
use jsonwebtoken::{encode, EncodingKey, Algorithm, Header};
use jsonwebtoken::errors::{Error, ErrorKind};
use std::env;
use dotenvy::dotenv;

pub fn create_jwt(id: i32) -> Result<String, Error> { // … }

fn decode_jwt(token: String) -> Result<Claims, ErrorKind> {
    // 👇 New!
    let token = token.trim_start_matches("Bearer").trim();

    todo!()
}
```

With the token in a valid format, we can simply decode it now using the decode() function provided to us from the jsonwebtoken crate. decode() takes in three arguments:
- A JWT.
- The secret key used to encode the token.
- The validation algorithm.

If successful, the decode() function will provide us the claims encoded within the token.

```rust
use chrono::Utc;
use jsonwebtoken::{encode, decode, EncodingKey, Algorithm, Header, Validation}; // 👈 New!
use jsonwebtoken::errors::{Error, ErrorKind};
use std::env;
use dotenvy::dotenv;

pub fn create_jwt(id: i32) -> Result<String, Error> { // … }

fn decode_jwt(token: String) -> Result<Claims, ErrorKind> {
    let secret = env::var("JWT_SECRET").expect("JWT_SECRET must be set.");
    let token = token.trim_start_matches("Bearer").trim();

    // 👇 New!
    match decode::<Claims>(
        &token,
        &DecodingKey::from_secret(secret.as_bytes()),
        &Validation::new(Algorithm::HS512),
    ) {
        Ok(token) => Ok(token.claims),
        Err(err) => Err(err.kind().to_owned())
    }
}
```

That's it! We can now encode and decode JWTs. In some login route, we could now return the JWT to the user where the browser can store and retrieve it's value from some private cookie or session storage.
Below is an example implementation of a login route that returns the JWT. Note: This is a test application and it's because of this that user passwords are stored un-hashed. Always hash user passwords when storing them anywhere.

```rust
// Example implementation

pub fn login_user(user: Json<LoginRequest>) -> Result<String, NetworkResponse> {
    use domain::schema::users;

    let user = user.into_inner();

    let user: User = match users::table.select(users::all_columns)
        .filter(users::user_name.eq(&user.user_name))
        .filter(users::password.eq(&user.password))
        .first::<User>(&mut establish_connection()) {
            Ok(user) => user,
            Err(err) => match err {
                diesel::result::Error::NotFound => {
                    let response = Response { 
                        body: ResponseBody::Message(
                            format!("Error - Wrong username or password for user {}", &user.user_name)
                        )
                    };

                    return Err(NotFound(serde_json::to_string(&response).unwrap()));
                },
                _ => {
                    panic!("Database error - {}", err);
                } 
            }
        };

    match create_jwt(user.id) {
        Ok(token) => Ok(token),
        Err(err) => Err(NetworkResponse::BadRequest(err.to_string())),
    } 
}

#[post("/login", format = "application/json", data = "<user>")]
pub fn login_user_handler(user: Json<LoginRequest>) -> Result<String, NetworkResponse> {
    let token = login_user(user)?;

    let response = Response { body: ResponseBody::AuthToken(token) };

    Ok(serde_json::to_string(&response).unwrap())
}
```

Now all we need to do is implement the request guard which validates the token on all routes we want integrity/validation checks on.

---

## Implementing the Request Guard
Earlier when we created our models we defined a JWT struct, this is what we will use as our request guard type. To use this however, we first need to implement the FromRequest trait. Inside of this trait we'll define the Error type as our NetworkResponse as well as an async function from_request(), which will take in a request and return an Outcome of either Self (JWT) or NetworkResponse.

The from_request() function will handle the validation of the JWT and return the claims if successful or a NetworkResponse otherwise.

```rust
use rocket::serde::{Deserialize, Serialize};
use shared::response_models::NetworkResponse; // 👈 New!
use rocket::request::{Outcome, Request, FromRequest}; // 👈 New!
use rocket::http::Status; // 👈 New!

#[derive(Debug, Deserialize, Serialize)]
pub struct Claims {
    pub subject_id: i32,
    exp: usize
}

#[derive(Debug)]
pub struct JWT {
    pub claims: Claims
}

// 👇 New!
#[rocket::async_trait]
impl<'r> FromRequest<'r> for JWT {
    type Error = NetworkResponse;

    async fn from_request(req: &'r Request<'_>) -> Outcome<Self, NetworkResponse> {
        todo!()
    }
}
```

While we're at it, lets define a function to check if the token passed in is valid or not.

```rust
#[rocket::async_trait]
impl<'r> FromRequest<'r> for JWT {
    type Error = NetworkResponse;

    async fn from_request(req: &'r Request<'_>) -> Outcome<Self, NetworkResponse> {
        // 👇 New!
        fn is_valid(key: &str) -> Result<Claims, Error> {
            Ok(decode_jwt(String::from(key))?)
        }
    
        todo!()
    }
}
```

We now need some way of getting the token from the users request. Using the req variable passed in, we can get the headers from the request and search for the "Authorization" header using the get_one() method. This will return an Option we can then match against.

```rust
#[derive(Debug)]
pub struct JWT {
    pub claims: Claims
}

#[rocket::async_trait]
impl<'r> FromRequest<'r> for JWT {
    type Error = NetworkResponse;

    async fn from_request(req: &'r Request<'_>) -> Outcome<Self, NetworkResponse> {
        fn is_valid(key: &str) -> Result<Claims, Error> {
            Ok(decode_jwt(String::from(key))?)
        }

        // 👇 New!
        match req.headers().get_one("authorization") {
            None => {
                // …
            },
            Some(key) => match is_valid(key) {
                Ok(claims) => {
                    // …
                },
                Err(err) => match &err.kind() {
                    // …
                }
            },
        }
    }
}
```

In pseudo-code, our match statement will look something like this:

```
Check Authorization header:
  - None - 401 Unauthorized ("Error validating JWT - No token provided")
  - Some(key) - validate key using is_valid()
    - Ok(claims) - return Outcome::Success(JWT {claims})
    - Err(err) - match against the err.kind()
      - ErrorKind::ExpiredSignature - 401 Unauthorized ("Error validating JWT - Expired Token")
      - ErrorKind::InvalidToken - 401 Unauthorized ("Error validating JWT - Invalid Token")
      - Anything else - 401 Unauthorized ("Error validating JWT - {err}")
```

This can be implemented like so:

```rust
use rocket::serde::{Deserialize, Serialize};
use shared::response_models::{Response, ResponseBody, NetworkResponse}; // 👈 New!
use rocket::request::{Outcome, Request, FromRequest}; // 👈 New!
use rocket::http::Status;

#[derive(Debug)]
pub struct JWT {
    pub claims: Claims
}

#[rocket::async_trait]
impl<'r> FromRequest<'r> for JWT {
    type Error = NetworkResponse;

    async fn from_request(req: &'r Request<'_>) -> Outcome<Self, NetworkResponse> {
        fn is_valid(key: &str) -> Result<Claims, Error> {
            Ok(decode_jwt(String::from(key))?)
        }

        match req.headers().get_one("authorization") {
            None => {
                let response = Response { 
                    body: ResponseBody::Message(
                        String::from("Error validating JWT token - No token provided")
                    )
                };

                Outcome::Failure((
                    Status::Unauthorized, 
                    NetworkResponse::Unauthorized(serde_json::to_string(&response).unwrap())
                )) 
            },
            Some(key) => match is_valid(key) {
                Ok(claims) => Outcome::Success(JWT {claims}),
                Err(err) => match &err.kind() {
                    jsonwebtoken::errors::ErrorKind::ExpiredSignature => {
                        let response = Response { 
                            body: ResponseBody::Message(
                                format!("Error validating JWT token - Expired Token")
                            )
                        };

                        Outcome::Failure((
                            Status::Unauthorized,
                            NetworkResponse::Unauthorized(serde_json::to_string(&response).unwrap())
                        )) 
                    },
                    jsonwebtoken::errors::ErrorKind::InvalidToken => {
                        let response = Response {
                            body: ResponseBody::Message(
                                format!("Error validating JWT token - Invalid Token")
                            )
                        };

                        Outcome::Failure((
                            Status::Unauthorized,
                            NetworkResponse::Unauthorized(serde_json::to_string(&response).unwrap())
                        )) 
                    },
                    _ => {
                        let response = Response { 
                            body: ResponseBody::Message(
                                format!("Error validating JWT token - {}", err)
                            )
                        };

                        Outcome::Failure((
                            Status::Unauthorized, 
                            NetworkResponse::Unauthorized(serde_json::to_string(&response).unwrap())
                        )) 
                    }
                }
            },
        }
    }
}
```

With all of this implemented, it's now as simple as putting our request guard into the request handler. Here we have a route to publish a blog post. We pass the request guard in as a result and match against the key, giving us the encoded claims if successful or the corresponding NetworkResponse otherwise.

```rust
#[get("/publish/<post_id>")]
                                          // 👇 New!
pub fn publish_post_handler(post_id: i32, key: Result<JWT, NetworkResponse>) -> Result<String, NetworkResponse> {
    // 👇 New! 
    let key = key?;

    let post = publish::publish_post(post_id, key)?; 

    let response = Response { body: ResponseBody::Post(post) };

    Ok(serde_json::to_string(&response).unwrap())
}
```

With your requests integrity verified, you can now use the items encoded in the token, such as the users id, to verify their access to certain actions.

And that's it! You've now implemented JWT authentication for your API routes.

---

## Further Improvements
There are a few things that could be improved when looking at this projects implementation of JWTs.
Firstly, the JWT secret used to encode the token is currently static. It doesn't change throughout the lifetime of the project. In a production application, the secret should be rotated regularly ensuring previous tokens are never reused.

---

Conclusion
Today we covered what JWTs, how to encode and decode them, and how to implement JWT authentication onto API routes using Request Guards in Rocket.rs.

All code along with my implementation of the front-end can be found here: https://github.com/BrookJeynes/blog-rust

Thanks for reading,  
\- Brook ❤

---

## References

### Crates:
- [Rocket.rs](https://github.com/SergioBenitez/Rocket/tree/v0.5-rc)
- Serde-rs/serde
- Serde-rs/json
- jsonwebtoken
- Chrono

### Other guides/docs followed:
- [Rocket.rs - Getting started](https://rocket.rs/v0.5-rc/guide/)
- Fallas, A. U. (2020, October 29). JWT authentication in Rust. LogRocket Blog. Retrieved November 27, 2022, from https://blog.logrocket.com/jwt-authentication-in-rust/
- SuperTokens Team. (2022, March 24). What is a JWT? Understanding JSON Web Tokens. SuperTokens. Retrieved November 27, 2022, from https://supertokens.com/blog/what-is-jwt
- Okta. (n.d.). JSON Web Token Introduction - jwt.io. JWT.io. Retrieved November 27, 2022, from https://jwt.io/introduction/
