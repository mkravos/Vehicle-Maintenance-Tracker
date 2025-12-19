# Garage - API Reference

## Overview

This reference provides documentation for the Garage backend API. The API is built with Go and provides RESTful endpoints for user authentication, vehicle management, and maintenance record tracking.

**Base URL:** `http://localhost:8080`

**Authentication:** JWT Bearer tokens

---

## Table of Contents

1. [Authentication](#authentication)
2. [User Management](#user-management)
3. [Vehicle Management](#vehicle-management)
4. [Maintenance Management](#maintenance-management)
5. [Response Format](#response-format)
6. [Error Handling](#error-handling)
7. [CORS Configuration](#cors-configuration)

---

## Authentication

### Overview

The API uses JWT (JSON Web Tokens) for authentication. Tokens are valid for 24 hours and must be included in the `Authorization` header as a Bearer token for all protected endpoints.

### Token Format

```
Authorization: Bearer <JWT_TOKEN>
```

### Protected Endpoints

All endpoints except `/api/user/login` and `/api/user/register` require a valid JWT token in the `Authorization` header.

---

## User Management

### Register User

Creates a new user account with the provided credentials.

**Endpoint:** `POST /api/user/register`

**Authentication:** Not required

**reCAPTCHA:** Required

**Request Body:**
```json
{
  "username": "string",
  "password": "string",
  "recaptchaToken": "string"
}
```

**Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `username` | string | Yes | The desired username for the new account |
| `password` | string | Yes | The desired password for the new account |
| `recaptchaToken` | string | Yes | Google reCAPTCHA response token for verification |

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "User account created successfully"
}
```

**Response (Error - 400/401/500):**
```json
{
  "success": false,
  "message": "Error message describing the issue"
}
```

**Possible Errors:**
- Invalid HTTP method (must be POST)
- Invalid JSON in request body
- reCAPTCHA verification failed
- User creation database error

---

### Login User

Authenticates a user and returns a JWT token for subsequent requests.

**Endpoint:** `POST /api/user/login`

**Authentication:** Not required

**reCAPTCHA:** Required

**Request Body:**
```json
{
  "username": "string",
  "password": "string",
  "recaptchaToken": "string"
}
```

**Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `username` | string | Yes | The user's username |
| `password` | string | Yes | The user's password |
| `recaptchaToken` | string | Yes | Google reCAPTCHA response token for verification |

**Response (Success - 200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (Error - 400/401/500):**
```json
{
  "success": false,
  "message": "Error message describing the issue"
}
```

**Possible Errors:**
- Invalid HTTP method (must be POST)
- Invalid JSON in request body
- Invalid username or password
- reCAPTCHA verification failed

---

### Verify User

Verifies if the provided JWT token is valid. Used to check if a user has access to protected sections.

**Endpoint:** `POST /api/user/verify`

**Authentication:** Required (JWT token)

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "LGTM"
}
```

**Response (Error - 401):**
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

---

### Get User ID

Retrieves the unique ID of a user by their username.

**Endpoint:** `GET /api/user/getId`

**Authentication:** Required (JWT token)

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `username` | string | Yes | The username to look up |

**URL Example:**
```
GET /api/user/getId?username=john_doe
```

**Response (Success - 200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response (Error - 400/404):**
```json
{
  "success": false,
  "message": "Error message describing the issue"
}
```

**Possible Errors:**
- Missing `username` parameter
- User not found
- Database error

---

### Update User

Updates user account settings. Supports changing username or password.

**Endpoint:** `PUT /api/user/update`

**Authentication:** Required (JWT token)

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `action` | string | Yes | Either `"changeUsername"` or `"changePassword"` |

**Request Body:**
```json
{
  "username": "string",
  "password": "string",
  "newUsername": "string",
  "newPassword": "string"
}
```

**Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `username` | string | Yes | The current username |
| `password` | string | Yes | The current password (for verification) |
| `newUsername` | string | Conditional | New username (required if action is `"changeUsername"`) |
| `newPassword` | string | Conditional | New password (required if action is `"changePassword"`) |

**URL Examples:**

Change Username:
```
PUT /api/user/update?action=changeUsername
```

Change Password:
```
PUT /api/user/update?action=changePassword
```

**Request Body Example (Change Username):**
```json
{
  "username": "john_doe",
  "password": "oldpass",
  "newUsername": "jane_doe"
}
```

**Request Body Example (Change Password):**
```json
{
  "username": "john_doe",
  "password": "oldpass",
  "newPassword": "newpass"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Username updated" // or "Password updated"
}
```

**Response (Error - 400/401/500):**
```json
{
  "success": false,
  "message": "Error message describing the issue"
}
```

**Possible Errors:**
- Missing required `action` query parameter
- Missing required fields in request body (username, password)
- Invalid action value
- Invalid username or password
- Database error

---

### Delete User Account

Permanently deletes a user account and all associated data.

**Endpoint:** `DELETE /api/user/delete`

**Authentication:** Required (JWT token)

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `username` | string | Yes | The username to delete |
| `password` | string | Yes | The password for verification |

**URL Example:**
```
DELETE /api/user/delete?username=john_doe&password=mypassword
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "User account deleted successfully"
}
```

**Response (Error - 400/401/500):**
```json
{
  "success": false,
  "message": "Error message describing the issue"
}
```

**Possible Errors:**
- Missing required parameters
- Invalid username or password
- Database error

---

## Vehicle Management

### Add Vehicle

Creates a new vehicle for a user.

**Endpoint:** `POST /api/vehicle/add`

**Authentication:** Required (JWT token)

**Request Body:**
```json
{
  "userId": "string",
  "id": "string",
  "vehicle_name": "string",
  "model_year": integer,
  "make": "string",
  "model": "string",
  "mileage": integer,
  "vin": "string"
}
```

**Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `userId` | string | Yes | The ID of the user adding the vehicle |
| `vehicle_name` | string | Yes | A friendly name for the vehicle |
| `model_year` | integer | Yes | The year the vehicle was manufactured |
| `make` | string | Yes | The vehicle manufacturer (e.g., "Toyota", "Ford") |
| `model` | string | Yes | The vehicle model name |
| `mileage` | integer | No | Current odometer reading in miles |
| `vin` | string | No | Vehicle Identification Number |

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Vehicle added successfully"
}
```

**Response (Error - 400/500):**
```json
{
  "success": false,
  "message": "Error message describing the issue"
}
```

**Possible Errors:**
- Invalid HTTP method (must be POST)
- Invalid JSON in request body
- Database error

---

### List Vehicles

Retrieves all vehicles associated with a user.

**Endpoint:** `GET /api/vehicle/list`

**Authentication:** Required (JWT token)

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | string | Yes | The ID of the user |

**URL Example:**
```
GET /api/vehicle/list?userId=550e8400-e29b-41d4-a716-446655440000
```

**Response (Success - 200):**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "vehicle_name": "My Toyota",
    "model_year": 2020,
    "make": "Toyota",
    "model": "Camry",
    "mileage": 45000,
    "vin": "4T1BF1AK5CU123456"
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "vehicle_name": "Family Car",
    "model_year": 2018,
    "make": "Honda",
    "model": "Odyssey",
    "mileage": 62000,
    "vin": "5FNYF6H73LB123456"
  }
]
```

**Response (Error - 400/500):**
```json
{
  "success": false,
  "message": "Error message describing the issue"
}
```

**Possible Errors:**
- Missing `userId` parameter
- Invalid HTTP method (must be GET)
- Database error

---

### Update Vehicle

Updates the details of an existing vehicle.

**Endpoint:** `PUT /api/vehicle/update`

**Authentication:** Required (JWT token)

**Request Body:**
```json
{
  "userId": "string",
  "id": "string",
  "vehicle_name": "string",
  "model_year": integer,
  "make": "string",
  "model": "string",
  "mileage": integer,
  "vin": "string"
}
```

**Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `userId` | string | Yes | The ID of the user who owns the vehicle |
| `id` | string | Yes | The ID of the vehicle to update |
| `vehicle_name` | string | Yes | Updated friendly name for the vehicle |
| `model_year` | integer | Yes | Updated model year |
| `make` | string | Yes | Updated manufacturer |
| `model` | string | Yes | Updated model name |
| `mileage` | integer | No | Updated odometer reading |
| `vin` | string | No | Updated VIN |

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Vehicle updated successfully"
}
```

**Response (Error - 400/500):**
```json
{
  "success": false,
  "message": "Error message describing the issue"
}
```

**Possible Errors:**
- Invalid HTTP method (must be PUT)
- Invalid JSON in request body
- Vehicle does not belong to user
- Database error

---

### Delete Vehicle

Removes a vehicle and all its associated service records from the system.

**Endpoint:** `DELETE /api/vehicle/delete`

**Authentication:** Required (JWT token)

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | string | Yes | The ID of the user who owns the vehicle |
| `vehicleId` | string | Yes | The ID of the vehicle to delete |

**URL Example:**
```
DELETE /api/vehicle/delete?userId=550e8400-e29b-41d4-a716-446655440000&vehicleId=550e8400-e29b-41d4-a716-446655440001
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Vehicle deleted successfully"
}
```

**Response (Error - 400/500):**
```json
{
  "success": false,
  "message": "Error message describing the issue"
}
```

**Possible Errors:**
- Missing required parameters
- Invalid HTTP method (must be DELETE)
- Database error

---

## Maintenance Management

### Add Service Item

Records a new maintenance service performed on a vehicle.

**Endpoint:** `POST /api/maintenance/add`

**Authentication:** Required (JWT token)

**Request Body:**
```json
{
  "id": "string",
  "vehicleId": "string",
  "itemName": "string",
  "serviceDate": "string",
  "mileage": integer,
  "intervalMiles": integer,
  "intervalTime": "string",
  "partNumber": "string",
  "cost": integer,
  "receiptImage": "string",
  "tracking": integer
}
```

**Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `vehicleId` | string | Yes | The ID of the vehicle receiving service |
| `itemName` | string | Yes | Name/description of the service performed |
| `serviceDate` | string | Yes | Date of service (format: YYYY-MM-DD) |
| `mileage` | integer | Yes | Vehicle mileage at time of service |
| `intervalMiles` | integer | No | Recommended miles until next service |
| `intervalTime` | string | No | Recommended time until next service (e.g., "6 months") |
| `partNumber` | string | No | Part number if applicable |
| `cost` | integer | No | Cost of service in cents |
| `receiptImage` | string | No | Base64 encoded image of receipt |
| `tracking` | integer | Yes | Tracking status (0 = not tracked, 1 = tracked) |

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Service item added successfully"
}
```

**Response (Error - 400/500):**
```json
{
  "success": false,
  "message": "Error message describing the issue"
}
```

**Possible Errors:**
- Invalid HTTP method (must be POST)
- Invalid JSON in request body
- Database error

---

### List Service Items

Retrieves all maintenance records for a specific vehicle.

**Endpoint:** `GET /api/maintenance/list`

**Authentication:** Required (JWT token)

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `vehicle_id` | string | Yes | The ID of the vehicle |

**URL Example:**
```
GET /api/maintenance/list?vehicle_id=550e8400-e29b-41d4-a716-446655440001
```

**Response (Success - 200):**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440010",
    "vehicleId": "550e8400-e29b-41d4-a716-446655440001",
    "itemName": "Oil Change",
    "serviceDate": "2024-01-15",
    "mileage": 45000,
    "intervalMiles": 5000,
    "intervalTime": "3 months",
    "partNumber": "OC-1234",
    "cost": 5000,
    "receiptImage": null,
    "tracking": 1
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440011",
    "vehicleId": "550e8400-e29b-41d4-a716-446655440001",
    "itemName": "Tire Rotation",
    "serviceDate": "2024-01-10",
    "mileage": 44500,
    "intervalMiles": 5000,
    "intervalTime": "6 months",
    "partNumber": null,
    "cost": 3000,
    "receiptImage": null,
    "tracking": 0
  }
]
```

**Response (Error - 400/500):**
```json
{
  "success": false,
  "message": "Error message describing the issue"
}
```

**Possible Errors:**
- Missing `vehicle_id` parameter
- Invalid HTTP method (must be GET)
- Database error

---

### Update Service Item

Updates the details of an existing maintenance record.

**Endpoint:** `PUT /api/maintenance/update`

**Authentication:** Required (JWT token)

**Request Body:**
```json
{
  "id": "string",
  "vehicleId": "string",
  "itemName": "string",
  "serviceDate": "string",
  "mileage": integer,
  "intervalMiles": integer,
  "intervalTime": "string",
  "partNumber": "string",
  "cost": integer,
  "receiptImage": "string",
  "tracking": integer
}
```

**Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | The ID of the service item to update |
| All other fields | Various | No | Fields to update |

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Service item updated successfully"
}
```

**Response (Error - 400/500):**
```json
{
  "success": false,
  "message": "Error message describing the issue"
}
```

**Possible Errors:**
- Invalid HTTP method (must be PUT)
- Invalid JSON in request body
- Database error

---

### Delete Service Item

Removes a maintenance record from the system.

**Endpoint:** `DELETE /api/maintenance/delete`

**Authentication:** Required (JWT token)

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | The ID of the service item to delete |

**URL Example:**
```
DELETE /api/maintenance/delete?id=550e8400-e29b-41d4-a716-446655440010
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Service item deleted successfully"
}
```

**Response (Error - 400/500):**
```json
{
  "success": false,
  "message": "Error message describing the issue"
}
```

**Possible Errors:**
- Missing `id` parameter
- Invalid HTTP method (must be DELETE)
- Database error

---

## Response Format

### Success Response

All successful API responses follow this format:

**For operations returning data:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "field1": "value1",
  "field2": "value2"
}
```

**For operations confirming an action:**
```json
{
  "success": true,
  "message": "Operation completed successfully"
}
```

### Error Response

All error responses follow this format:

```json
{
  "success": false,
  "message": "Descriptive error message"
}
```

---

## Error Handling

### HTTP Status Codes

| Code | Description |
|------|-------------|
| `200 OK` | Request successful, data returned |
| `201 Created` | Resource created successfully |
| `400 Bad Request` | Invalid request parameters or malformed JSON |
| `401 Unauthorized` | Authentication failed or token invalid |
| `405 Method Not Allowed` | Wrong HTTP method used for endpoint |
| `500 Internal Server Error` | Server error occurred |

### Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| `Must use POST request` | Wrong HTTP method | Use POST method |
| `Must use GET request` | Wrong HTTP method | Use GET method |
| `Must use PUT request` | Wrong HTTP method | Use PUT method |
| `Must use DELETE request` | Wrong HTTP method | Use DELETE method |
| `Could not decode user JSON` | Invalid JSON in request body | Verify JSON formatting |
| `Authorization token invalid or missing` | Missing or invalid token | Include valid Bearer token in Authorization header |
| `Invalid or expired token` | Token has expired or is malformed | Obtain new token via login |
| `Invalid credentials provided` | Wrong username or password | Verify username and password |
| `Invalid recaptcha response` | reCAPTCHA verification failed | Obtain new reCAPTCHA token |
| `Required URL parameter 'X' was not provided` | Missing query parameter | Add required parameter to URL |

---

## CORS Configuration

The API includes CORS (Cross-Origin Resource Sharing) middleware to allow requests from different origins.

### Allowed Methods
- GET
- POST
- PUT
- DELETE
- OPTIONS

### Allowed Headers
- Content-Type
- Authorization

### Allowed Origins
- All origins (`*`)

---

## Environment Variables

The server requires the following environment variables to be configured:

### Database Configuration
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=vehicle_tracker
DB_SSLMODE=disable
```

### JWT Configuration
```
JWT_SECRET=your_secret_key_here
```

### reCAPTCHA Configuration
```
RECAPTCHA_SECRET=your_recaptcha_secret_key
```
