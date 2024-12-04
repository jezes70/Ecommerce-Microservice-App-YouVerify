# E-COMMERCE MICRO-SERVICE APPLICATION YOUVERIFY

## SERVICES

Customer Service: Responsible for managing customer data, including the creation, retrieval, and updates of customer information.

Product Service: Handles product-related operations such as creation, retrieval, and updates. This service is also tasked with sending order requests to the Order Service for further processing.

Order Service: Manages order processing and forwards order details to the Payment Service for payment validation and processing.

Payment Service: Responsible for processing orders received from the Order Service, validating payment transactions, and subsequently transferring successfully processed payments to the Worker service for further action.

Worker Service: A service that listens for payment confirmations from the Payment Service and stores the processed payment details in the database for record-keeping.

## How to Test the Application

1. Clone the repository to your local machine.
2. Ensure you have Docker installed and running on your system.
3. Confirm that your system is connected to the internet.
4. Navigate to the root directory of the project and run the following command:

```bash
  docker-compose up
```

- Nginx is running at:

  ```js
    http://localhost:3050
  ```

Nginx serves as a reverse proxy to handle incoming requests directed to the cluster. While each service runs in its own container, with its own unique address and database, Nginx has been configured to route traffic to the appropriate service based on the request.
. (Optional) If additional customer information is required, you can retrieve it using the customer's email or customer ID. For demonstration purposes, the email is stored as a string across the system, and no strict validation is applied to differentiate between customer IDs and emails.

```js
  GET http://localhost:3050/api/users/:email
```

- To place an order, you need to retrieve a list of products to choose from:

  ```js
    GET http://localhost:3050/api/products
  ```

- Now that you have all both a user and a product, we can place an order

  Option one: In this scenario,

  ```js
    POST http://localhost:3050/api/products/place-order

    Sample payload
    {
      "productId": "610320e2e076b1001e5bd091",
      "customerId": "admin@mail.com"
    }
  ```

  Option two:

  ```js
    POST http://localhost:3050/api/orders

    Sample payload
    {
      "customerId": "admin@mail.com",
      "product": {
        "id": "existing products id",
        "title": "products title",
        "description": "products description",
        "price": 1500
      }

    }
  ```

Monitor the application console to observe how various listeners and publishers emit and consume payloads in real time.
Additionally, inspect the containerized databases to verify data creation and track the application's state.
