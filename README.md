# CozyNest

## Database Schema Design

Design will be placed here

## USER AUTHENTICATION/AUTHORIZATION

## Login User

Log in a user

- request

  - Method: POST
  - URL: "/auth/login"
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "email": "user@example.com",
      "password": "password"
    }
    ```

  - Successful Response

        - Status Code: 200
        - Headers:
          - Content-Type: application/json
        - Body

        ```json
        {
          "user": {
            "id": 1,
            "firstName": "John",
            "lastName": "Doe",
            "email": "user@example.com"
          }
        }
        ```

  - Error Response: Invalid email or password

    - Status Code: 401
    - Headers:

      - Content-Type: application/json

    - Body

      ```json
      {
        "message": "Invalid email or password"
      }
      ```

Log out a User

- request

  - Method: POST
  - URL: "/auth/logout"
  - Headers:
    - Authorization: Bearer jwt-access-token
    - Content-Type: application/json
  - Body: None

  - Successful Response

        - Status Code: 204
