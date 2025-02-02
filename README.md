## Authentication API

An authentication back end demo using JS + node and MongoDB. 

For API, see [documentation](https://github.com/NikoZBK/SimpleAuthenticationApp/blob/7b393c638f59b1ca9af06977cf60514b3807e2af/documentation.md).

## Features 

* Account registration
  * Passwords are hashed using `bcryptjs`
* User login/logout
  * Access and refresh token generation
* Protected routes
  * Tokens are validated 
* User information is stored using MongoDB

## Instructions

To install all the dependencies, run the following command:

```
npm install
```

To start the server, run the following command:

```
npm run dev
```
