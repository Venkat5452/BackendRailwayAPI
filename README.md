# Railway Reservation Application

A backend API built with Node.js and SQL Server for managing a railway reservation system. This application includes user authentication, train management, and secure ticket booking functionality.

## Features

- **User Authentication**: Secure registration and login using JWT tokens.
- **Train Management**: Add trains, view train availability by source and destination.
- **Ticket Booking**: Book tickets and manage user-specific bookings.

---

## Prerequisites

- Node.js installed on your machine.
- SQL Server database setup and running.

---

## Setup

### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/railway-reservation-api.git
   cd railway-reservation-api
2. **Install dependencies**:
   ```bash
   npm install
3. **Configure the Database**:
   ***User Table***:
   ```bash
   CREATE TABLE users (
    id INT PRIMARY KEY IDENTITY(1,1),
    username NVARCHAR(50) NOT NULL,
    password NVARCHAR(255) NOT NULL,
    role NVARCHAR(20));
   ```
   ***Trains Table***:
   ```bash
   CREATE TABLE trains (
    train_id INT PRIMARY KEY IDENTITY(1,1),
    train_name NVARCHAR(100),
    source NVARCHAR(50),
    destination NVARCHAR(50),
    total_seats INT,
    available_seats INT);
   ```
   ***Bookings Table***:
   ```bash
   CREATE TABLE bookings (
    booking_id INT PRIMARY KEY IDENTITY(1,1),
    train_id INT,
    username NVARCHAR(50),
    FOREIGN KEY (train_id) REFERENCES trains(train_id));
5. **Update the dbConfig in server.js with your database details**:
   ```bash
   const dbConfig = {
    server: 'YOUR_SERVER_NAME',
    database: 'YOUR_DATABASE_NAME',
    options: {
        encrypt: false,
        enableArithAbort: true,
        trustedConnection: true
   }};
   ```
6. **Start The Server**:
   ```bash
   node server.js

### The server will run on http://localhost:4567

# Railway Reservation Application

This application provides a backend API for managing railway reservations, including user management, train management, and ticket booking.

---

## API Endpoints

### User Management

#### Register a User

**URL**: `/register`  
**Method**: `POST`  

**Request Body**:  
```json
{
    "username": "your_username",
    "password": "your_password",
    "role": "your_role"
}
```
#### Login

**URL**: `/login`  
**Method**: `POST`  

**Request Body**:  
```json
{
    "username": "your_username",
    "password": "your_password"
}
```
**Response**:
```json
{
    "token": "jwt_token"
}
```
### Add a Train

**URL**: `/trains`  
**Method**: `POST`  

**Headers**:  
```json
{
    "12eferhuihbyuijjgftr5t67u8ijbvcfdrt": "poiuytrewqasdfghjklkmnbvcxzaqwertgvcxsertyuikmnb"
}
```
**Request Body**:
```json
{
    "train_name": "Train Name",
    "source": "Source",
    "destination": "Destination",
    "total_seats": 100
}
```
# Check Train Availability

This endpoint allows users to check the availability of trains between specified source and destination locations.

---

## Endpoint Details

**URL**: `/trains/availability`  
**Method**: `GET`  

### Query Parameters:

- **`source`**: Train source location.  
- **`destination`**: Train destination location.  

---

## Example Request

```json
GET /trains/availability?source=Hyderabad&destination=Bangalore
```
# Booking Management

## Book a Seat

This endpoint allows users to book a seat on a specific train.

---

### Endpoint Details

**URL**: `/book`  
**Method**: `POST`

---

### Headers

```json
{
    "Authorization": "Bearer jwt_token"
}
```
### Response
```json
{
    "train_id": 1
}
```
# Fetch Bookings

## Fetch Bookings

This endpoint allows users to retrieve their booking information.

---

### Endpoint Details

**URL**: `/bookings`  
**Method**: `GET`

---

### Headers

```json
{
    "Authorization": "Bearer jwt_token"
}


   
