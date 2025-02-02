Last updated: 2025-02-02

# Libraries

- [nodemailer](https://nodemailer.com/about/)
  - For sending password reset emails
- [express](https://expressjs.com/)
  - For creating the server
- [mongoose](https://mongoosejs.com/)
  - For interacting with MongoDB
- [dotenv](https://www.npmjs.com/package/dotenv)
  - For loading environment variables
- [bcrypt](https://www.npmjs.com/package/bcrypt)
  - For hashing passwords
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
  - For creating and verifying JWTs

# API Endpoints

## `POST /logout`

### Description

This endpoint is used to log out a user. It clears the refresh token cookie and returns a success message.

### URL

`/logout`

### Method

`POST`

### Parameters

None

### Request Body

None

### Success Response

Code: `200 OK`

```json
{
  "message": "Logged out successfully!",
  "type": "success"
}
```

---

## `POST /signin`

### Description

This endpoint is used to sign in a user. It checks if the user exists and if the provided password matches the stored password. If successful, it returns access and refresh tokens.

### URL

`/signin`

### Method

`POST`

### Parameters

| Name     | Type   | In   | Description          | Required |
| -------- | ------ | ---- | -------------------- | -------- |
| email    | string | body | User's email address | Yes      |
| password | string | body | User's password      | Yes      |

### Request Body

```json
{
  "email": "user@example.com",
  "password": "userpassword"
}
```

### Success Response

Code: `200 OK`

```json
{
  "accessToken": "access_token_value",
  "refreshToken": "refresh_token_value"
}
```

---

## `GET /protected`

### Description

This endpoint is used to check if a user is logged in. It verifies the user's JWT token and returns the user's information if the token is valid.

### URL

`/protected`

### Method

`GET`

### Parameters

None

### Request Body

None

### Success Response

Code: `200 OK`

```json
{
  "message": "You are logged in.",
  "type": "success",
  "user": {
    "id": "user_id",
    "email": "user@example.com"
    // other user details
  }
}
```

---

## `POST /refresh_token`

### Description

This endpoint is used to refresh the user's access token using a valid refresh token. It verifies the refresh token and returns new access and refresh tokens if the refresh token is valid.

### URL

`/refresh_token`

### Method

`POST`

### Parameters

None

### Request Body

None

### Success Response

Code: `200 OK`

```json
{
  "message": "Refreshed successfully!",
  "status": "success",
  "accessToken": "new_access_token_value"
}
```

---

## `POST /send-password-reset-email`

### Description

This endpoint is used to send a password reset email to the user. It checks if the user exists and sends a password reset link to the user's email if the user is found.

### URL

`/send-password-reset-email`

### Method

`POST`

### Parameters

| Name  | Type   | In   | Description          | Required |
| ----- | ------ | ---- | -------------------- | -------- |
| email | string | body | User's email address | Yes      |

### Request Body

```json
{
  "email": "user@example.com"
}
```

### Success Response

Code: `200 OK`

```json
{
  "message": "Password reset link has been sent to your email!",
  "type": "success"
}
```

---

## `POST /signin`

### Description

This endpoint is used to sign in a user. It checks if the user exists and if the provided password matches the stored password. If successful, it returns access and refresh tokens.

### URL

`/signin`

### Method

`POST`

### Parameters

| Name     | Type   | In   | Description          | Required |
| -------- | ------ | ---- | -------------------- | -------- |
| email    | string | body | User's email address | Yes      |
| password | string | body | User's password      | Yes      |

### Request Body

```json
{
  "email": "user@example.com",
  "password": "userpassword"
}
```

### Success Response

Code: `200 OK`

```json
{
  "accessToken": "access_token_value",
  "refreshToken": "refresh_token_value"
}
```

---

## `POST /signup`

### Description

This endpoint is used to register a new user. It checks if the user already exists and if not, creates a new user with the provided email and password.

### URL

`/signup`

### Method

`POST`

### Parameters

| Name     | Type   | In   | Description          | Required |
| -------- | ------ | ---- | -------------------- | -------- |
| email    | string | body | User's email address | Yes      |
| password | string | body | User's password      | Yes      |

### Request Body

```json
{
  "email": "user@example.com",
  "password": "userpassword"
}
```

### Success Response

Code: `200 OK`

```json
{
  "message": "User created successfully!",
  "type": "success"
}
```
