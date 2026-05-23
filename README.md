# Reimbursement System - FSAD Project

A full-stack Reimbursement Management System built with **Spring Boot** (backend) and **React.js** (frontend).

---

## Project Structure

```
FSAD/
├── backend/                    # Spring Boot REST API
│   ├── src/main/java/com/reimbursement/backend/
│   │   ├── config/             # Security, Data Initializer
│   │   ├── controller/         # REST Controllers
│   │   ├── dto/                # Data Transfer Objects
│   │   ├── entity/             # JPA Entities
│   │   ├── enums/              # Role, BillStatus, BillType
│   │   ├── exception/          # Global Exception Handler
│   │   ├── repository/         # Spring Data JPA Repositories
│   │   ├── security/           # JWT Filter, UserDetailsService
│   │   └── service/            # Business Logic
│   └── src/main/resources/
│       └── application.properties
│
└── frontend/                   # React.js Frontend
    └── src/
        ├── components/         # Reusable components (Sidebar, Layout)
        ├── context/            # Auth Context
        ├── pages/              # All page components
        │   ├── auth/           # Login
        │   ├── employee/       # Dashboard, CreateBill, BillDetail
        │   ├── manager/        # ManagerDashboard, ManagerBillDetail
        │   ├── finance/        # FinanceDashboard, FinanceBillDetail
        │   └── admin/          # AdminDashboard, CreateUser, EditUser
        ├── services/           # Axios API service calls
        └── utils/              # Constants, helpers
```

---

## Prerequisites

- Java 17+
- Maven 3.8+
- MySQL 8.0+
- Node.js 18+
- npm 9+

---

## Setup & Run

### 1. Database Setup

Create a MySQL database (the app will create it automatically if the user has permissions):
```sql
CREATE DATABASE reimbursement_db;
```

### 2. Backend Setup

```bash
cd FSAD/backend

# Configure DB credentials in:
# src/main/resources/application.properties
# Change: spring.datasource.username and spring.datasource.password

# Run the application
mvn spring-boot:run
```

Backend starts at: **http://localhost:8080**

### 3. Frontend Setup

```bash
cd FSAD/frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend starts at: **http://localhost:3000**

---

## Default Accounts

| Role           | Username  | Password     |
|---------------|-----------|--------------|
| Admin         | admin     | admin123     |
| Manager       | manager   | manager123   |
| Finance Mgr   | finance   | finance123   |
| Employee      | employee  | employee123  |

---

## Modules & Workflow

```
Employee creates bill → Submits bill → Email to Manager
         ↓
Manager reviews → Approves → Email to Finance Manager / Employee
                → Rejects  → Email to Employee
         ↓
Finance Manager → Approve → Credit & Close → Email to Employee
               → Reject   → Email to Employee
```

### Roles:
- **EMPLOYEE**: Create & submit bills, view own bill status
- **MANAGER**: View & approve/reject submitted bills
- **FINANCE_MANAGER**: Process approved bills, credit & close
- **ADMIN**: Full access - manage users, assign managers, view all bills

---

## REST API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | Login |
| GET | /api/bills/my/open | My open requests |
| POST | /api/bills | Create bill |
| POST | /api/bills/{id}/submit | Submit bill |
| GET | /api/bills/manager/pending | Manager's pending bills |
| POST | /api/bills/{id}/approve/manager | Manager approve |
| POST | /api/bills/{id}/reject/manager | Manager reject |
| GET | /api/bills/finance/pending | Finance queue |
| POST | /api/bills/{id}/approve/finance | Finance approve |
| POST | /api/bills/{id}/close | Close & credit bill |
| GET | /api/admin/users | Admin - list users |
| POST | /api/admin/users | Admin - create user |

---

## Email Configuration

Update `application.properties` with your Gmail credentials:
```properties
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
```

> Note: Use a Gmail App Password (not your actual Gmail password).
> Enable 2FA → Google Account → Security → App Passwords

---

## Technologies Used

| Layer | Technology |
|-------|-----------|
| Backend | Spring Boot 3.2, Spring Security, Spring Data JPA |
| ORM | Hibernate |
| Database | MySQL 8.0 |
| Authentication | JWT (jjwt 0.11.5) |
| Email | Spring Mail (JavaMailSender) |
| Frontend | React 18, React Router v6 |
| HTTP Client | Axios |
| UI | Custom CSS with Font Awesome |
