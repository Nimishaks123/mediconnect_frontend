# MediConnect

MediConnect is a full-stack healthcare appointment booking platform built to streamline the interaction between patients, doctors, and administrators. The application provides secure appointment scheduling, online consultations, digital prescriptions, wallet management, and role-based dashboards within a scalable Clean Architecture.

## Overview

The platform enables:

- Patients to discover verified doctors, book appointments, make secure payments, attend video consultations, and access digital prescriptions.
- Doctors to manage their professional profile, availability, appointments, consultations, and prescriptions.
- Administrators to verify doctors, manage users, monitor appointments, oversee platform transactions, and access operational analytics.

## Key Features

### Patient
- Secure authentication with email OTP and Google OAuth
- Search and filter verified doctors
- Appointment booking and cancellation
- Stripe payment integration
- Wallet management and refunds
- Real-time chat
- Video consultation using WebRTC
- Digital prescription access
- Appointment history and notifications

### Doctor
- Professional onboarding and document verification
- Profile and availability management
- Appointment management
- Video consultation
- Prescription management
- Dashboard and earnings overview

### Administrator
- Doctor verification workflow
- User and appointment management
- Platform wallet management
- Transaction monitoring
- Dashboard and analytics

## Technology Stack

### Frontend

- React
- TypeScript
- Vite
- Redux Toolkit
- React Router
- Tailwind CSS
- Axios
- Socket.IO Client

### Backend

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose

### Third-Party Services

- JWT Authentication
- Google OAuth
- Stripe
- Cloudinary
- Socket.IO
- WebRTC
- Node Cron

## Architecture

The backend follows **Clean Architecture** to ensure maintainability, scalability, and separation of concerns.

```
Domain
Application
Infrastructure
Presentation
```

The project follows Dependency Injection and Repository patterns to keep business logic independent from frameworks and external services.

## Getting Started

### Backend

```bash
npm install
npm run dev
```

### Frontend

```bash
npm install
npm run dev
```

## Production Build

### Frontend

```bash
npm run build
```

### Backend

```bash
npm run build
```

## Environment Variables

Create the required `.env` files for both the frontend and backend before running the application.

## Project Status

The project is actively maintained and follows a production-oriented architecture with a focus on scalability, modularity, and maintainability.

## Author

**Nimisha K S**

MERN Stack Developer