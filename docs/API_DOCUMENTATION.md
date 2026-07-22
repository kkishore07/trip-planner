# 📖 JourneyMate AI - REST API Documentation

Base URL: `http://localhost:8080/api`

---

## 1. Authentication Endpoints (`/api/auth`)

### `POST /api/auth/register`
Creates a new user account.
- **Request Body**:
  ```json
  {
    "username": "alex_m",
    "email": "alex@example.com",
    "password": "password123",
    "fullName": "Alex Morgan",
    "adminCode": "" 
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "type": "Bearer",
    "id": 1,
    "username": "alex_m",
    "email": "alex@example.com",
    "fullName": "Alex Morgan",
    "role": "ROLE_USER"
  }
  ```

### `POST /api/auth/login`
Authenticates user and returns JWT bearer token.
- **Request Body**:
  ```json
  {
    "usernameOrEmail": "alex_m",
    "password": "password123"
  }
  ```
- **Response (200 OK)**: Returns JWT auth response object.

---

## 2. Trip Management Endpoints (`/api/trips`)

### `GET /api/trips`
Returns all trips belonging to the authenticated user.
- **Headers**: `Authorization: Bearer <token>`
- **Response (200 OK)**: Array of `TripResponse` objects.

### `POST /api/trips/generate`
Generates an AI-driven day-wise itinerary.
- **Request Body**:
  ```json
  {
    "destination": "Rome, Italy",
    "durationDays": 4,
    "travelersCount": 2,
    "preferences": "History & Gastronomy",
    "budget": 1800.00
  }
  ```

### `GET /api/trips/{id}/export-pdf`
Generates and downloads a binary PDF itinerary file.

---

## 3. Expense Endpoints (`/api/expenses`)

### `POST /api/expenses`
Adds an expense log to a trip.
- **Request Body**:
  ```json
  {
    "tripId": 101,
    "category": "FOOD",
    "amount": 85.50,
    "currency": "INR",
    "description": "Dinner at Trattoria",
    "expenseDate": "2026-08-16"
  }
  ```

### `DELETE /api/expenses/{id}`
Deletes an expense item and updates the parent trip total balance.

---

## 4. Weather & Recommendation Endpoints

### `GET /api/weather?city={city}`
Returns current weather condition and 5-day forecast.

### `GET /api/recommendations?destination={city}&category={category}`
Returns curated attractions, restaurants, museums, and parks.

---

## 5. Admin Endpoints (`/api/admin`)

- `GET /api/admin/dashboard` - Returns system analytics (total users, total trips, total platform budget).
- `GET /api/admin/users` - Lists all registered users.
- `DELETE /api/admin/users/{id}` - Deletes a user profile.
