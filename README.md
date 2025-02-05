## Authentication Demo

An authentication back end demo using JS + node and MongoDB. 

For API, see [documentation](https://github.com/NikoZBK/SimpleAuthenticationApp/blob/7b393c638f59b1ca9af06977cf60514b3807e2af/documentation.md).

## Features 

* Account registration
  * Passwords are hashed using `bcryptjs`
* User login/logout
  * Access and refresh token generation
* Password Resets
   * Emails are sent with a verification link
* User information stored with MongoDB

## TODO

* Form validation
* User interface

## Instructions

To install all the dependencies, run the following command:

```
npm install
```

To start the server, run the following command:

```
npm run dev
```
