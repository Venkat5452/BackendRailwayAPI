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
    role NVARCHAR(20)
);

   
