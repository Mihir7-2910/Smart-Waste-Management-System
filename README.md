# Smart Waste Management System — Backend

Backend service for the **Smart Waste Management System**, developed as part of **Smart India Hackathon (SIH) 2026**.

The backend provides the core services required by the project, including authentication, user and role management, waste-bin management, complaint management, and the integrated logistics/driver assignment workflow.

The Logistics module is implemented as an extension of the existing backend and uses the project's existing `User`, `Complaint`, `Assignment`, and `Notification` models rather than creating a separate backend.

---

## 1. Project Overview

The Smart Waste Management System is designed to support the reporting and management of waste-related complaints through a common backend used by the project's different components.

The backend currently handles:

* User authentication and authorization
* Citizen, Admin, and Worker roles
* Waste-bin management
* Citizen complaint creation and management
* Complaint location storage using latitude and longitude
* Driver/Worker assignment for complaints
* Nearest-driver suggestion using geographical distance
* Assignment records
* SLA deadline creation
* Driver notification records

The backend is designed so that the frontend, GIS, AI/image-processing, and logistics components can work with the same database and API layer.

---

## 2. SIH 2026 Context

This backend is part of the team's **Smart India Hackathon 2026** project.

The system follows a modular approach where different project components integrate with the same backend:

* **Frontend** — interacts with backend APIs and presents the system to users
* **GIS** — uses geographical information such as bin and complaint coordinates
* **AI/Image Processing** — uses complaint image information and verification fields
* **Logistics** — handles driver/worker suggestion and complaint assignment

The Logistics functionality documented in this README is integrated into the existing backend structure.

---

## 3. Key Features

### Authentication and Users

* JWT-based authentication
* Password hashing using `bcryptjs`
* Role-based access control
* Citizen, Admin, and Worker roles

### Waste Bin Management

* Store waste-bin information
* Store geographical coordinates
* Maintain bin status
* Admin-controlled bin creation and deletion
* Status updates by authorized users

### Complaint Management

* Citizens can submit waste complaints
* Complaints store location information
* Complaint status can be updated
* Complaint images are represented through stored URLs
* AI verification fields are supported by the existing complaint API

### Logistics / Driver Assignment

* Admin can request a nearest-driver suggestion for a complaint
* Driver/worker is represented by the existing `User` model with role `WORKER`
* Haversine distance is used for geographical distance calculation
* Admin confirms the final assignment
* Assignment is stored using the existing `Assignment` model
* Assigned complaints move to `ASSIGNED`
* A four-hour SLA deadline is created when an assignment is made
* A notification record is created for the assigned worker

> **Current limitation:** Driver live GPS locations are not stored in the database. The driver's coordinates are currently supplied to the nearest-driver suggestion endpoint.

---

## 4. System Architecture

The backend follows a standard layered Express.js structure:

```text
Client / Frontend
       |
       | HTTP Requests
       v
   Express Server
       |
       +----------------------+
       |                      |
       v                      v
 Authentication          Role Middleware
       |                      |
       +----------+-----------+
                  |
                  v
             Controllers
                  |
       +----------+-----------+
       |          |           |
       v          v           v
     Prisma    Utilities   Business Logic
       |
       v
 PostgreSQL / Neon
       |
       +------------------------------+
       |              |               |
       v              v               v
    Users        Complaints       Assignments
                                      |
                                      v
                                  Workers
```

For logistics, the flow is:

```text
Citizen reports complaint
            ↓
Complaint stored with latitude/longitude
            ↓
Admin views pending complaint
            ↓
System suggests nearest driver
            ↓
Admin confirms driver
            ↓
Assignment created
            ↓
Complaint becomes ASSIGNED
            ↓
4-hour SLA deadline created
            ↓
Driver notification record created
```

---

## 5. Technology Stack

| Technology      | Purpose                               |
| --------------- | ------------------------------------- |
| Node.js         | Backend runtime                       |
| Express.js      | REST API framework                    |
| Prisma ORM      | Database access and schema management |
| PostgreSQL      | Relational database                   |
| Neon PostgreSQL | Cloud PostgreSQL deployment           |
| JWT             | Authentication                        |
| bcryptjs        | Password hashing                      |
| Render          | Backend deployment                    |

---

## 6. Project Folder Structure

```text
prisma/
└── schema.prisma

src/
├── config/
│   └── db.js
│
├── controllers/
│   ├── auth.controller.js
│   ├── bin.controller.js
│   ├── complaint.controller.js
│   ├── user.controller.js
│   └── logistics.controller.js
│
├── middleware/
│   ├── auth.middleware.js
│   └── role.middleware.js
│
├── routes/
│   ├── auth.routes.js
│   ├── bin.routes.js
│   ├── complaint.routes.js
│   ├── user.routes.js
│   └── logistics.routes.js
│
├── utils/
│   └── distance.js
│
└── server.js
```

### Main responsibilities

* `config/db.js` — Prisma/database configuration
* `controllers/` — request handling and backend business logic
* `middleware/` — authentication and role authorization
* `routes/` — API route definitions
* `utils/distance.js` — geographical distance calculation
* `prisma/schema.prisma` — database schema and relationships
* `server.js` — Express server entry point

---

## 7. Authentication and Role System

The backend uses **JWT authentication**.

After successful login, the client receives a token which is sent with protected requests using:

```http
Authorization: Bearer <token>
```

Passwords are hashed using `bcryptjs`.

### Roles

The existing `User` model is used for all users. The `role` field determines access.

| Role      | Purpose                                                             |
| --------- | ------------------------------------------------------------------- |
| `CITIZEN` | Reports complaints and accesses citizen functionality               |
| `ADMIN`   | Manages users, bins, complaints, and logistics assignments          |
| `WORKER`  | Represents the field worker/driver who receives assigned complaints |

The frontend may refer to the `WORKER` role as **Driver**, but the database role remains `WORKER`.

### Logistics authorization

Both logistics endpoints are restricted to users with the `ADMIN` role.

---

## 8. Database Overview

The project uses **PostgreSQL** with **Prisma ORM**. The cloud database can be hosted using **Neon PostgreSQL**.

The existing Prisma schema contains these main models:

* `User`
* `Bin`
* `Complaint`
* `Assignment`
* `Notification`

### Main relationships

```text
User
 ├── CITIZEN
 ├── ADMIN
 └── WORKER / Driver

Complaint
   |
   v
Assignment
   |
   v
User (WORKER / Driver)

Complaint
   |
   +── latitude
   +── longitude
   +── status
   └── slaDeadline

Notification
   |
   └── userId → User
```

### Complaint

A complaint contains location and workflow information including:

* `latitude`
* `longitude`
* `status`
* `slaDeadline`

It also contains the existing complaint-related fields used by the backend, including image URLs and AI verification information.

### Assignment

The `Assignment` model stores:

* `complaintId`
* `workerId`
* `assignedAt`
* `slaDeadline`
* `reassignedCount`
* `isActive`

This allows a complaint assignment to be associated with a specific Worker/Driver.

### Notification

The `Notification` model stores:

* `userId`
* `message`
* `isRead`
* `createdAt`

When a driver is assigned to a complaint, a notification record is created for that worker.

---

## 9. Complaint Workflow

The general complaint workflow is:

```text
Citizen
   |
   | POST /complaints
   v
Complaint Created
   |
   v
Status: PENDING
   |
   v
Admin Reviews Complaint
   |
   v
Logistics Assignment
   |
   v
Status: ASSIGNED
   |
   v
Worker / Driver Handles Complaint
```

A complaint includes geographical coordinates, allowing the logistics module to use the complaint location when suggesting a driver.

The existing complaint API also supports status updates and AI verification fields.

---

## 10. Logistics / Driver Assignment Workflow

The Logistics module extends the existing backend rather than creating a separate service.

### Step 1 — Complaint creation

A citizen submits a complaint containing the complaint description and location.

```text
Citizen
   ↓
Complaint
   ↓
latitude + longitude stored
```

### Step 2 — Admin reviews pending complaint

The complaint can be reviewed by an administrator before assignment.

### Step 3 — Nearest-driver suggestion

The administrator calls:

```http
POST /api/logistics/suggest-driver/:complaintId
```

The system uses the complaint location and the driver coordinates supplied to the endpoint to calculate geographical distance.

The endpoint suggests the nearest available Worker/Driver based on that calculation.

### Step 4 — Admin confirms assignment

The administrator calls:

```http
POST /api/logistics/assign/:complaintId
```

The final driver assignment is confirmed by the administrator.

The system does **not** automatically finalize the assignment solely from the nearest-driver suggestion.

### Step 5 — Assignment creation

After confirmation:

* An `Assignment` record is created
* The selected Worker/Driver is associated with the complaint
* Assignment information is stored in the existing database

### Step 6 — Complaint status update

The complaint status changes from:

```text
PENDING → ASSIGNED
```

### Step 7 — SLA deadline

A **four-hour SLA deadline** is created for the assignment.

The deadline is also stored in:

```text
Complaint.slaDeadline
```

and in the corresponding assignment information.

### Step 8 — Worker notification

A `Notification` record is created for the assigned Worker/Driver.

---

## 11. Haversine Distance Calculation

The Logistics module uses the **Haversine formula** to calculate the geographical distance between two points on the Earth's surface.

Each location is represented using:

```text
(latitude, longitude)
```

The calculation uses the latitude and longitude of two points to determine the approximate great-circle distance between them.

Conceptually:

```text
Driver Location
      +
Complaint Location
      |
      v
Haversine Distance
      |
      v
Distance in kilometres
```

This distance is used by the nearest-driver suggestion logic.

The implementation is located in:

```text
src/utils/distance.js
```

### Important implementation detail

The backend does **not** currently maintain live driver coordinates in the database.

Instead, the driver coordinates are supplied to the nearest-driver suggestion endpoint when the suggestion is requested.

Therefore, this module should currently be understood as **distance-based driver suggestion**, not real-time GPS tracking.

---

## 12. SLA Handling

When an Admin confirms a driver assignment, the backend creates a **four-hour SLA deadline**.

The assignment process therefore includes:

```text
Assignment Confirmed
        ↓
Current assignment time
        ↓
+ 4 hours
        ↓
SLA Deadline
```

The deadline is stored as part of the assignment workflow and the complaint's:

```text
slaDeadline
```

### Current scope

The current logistics implementation creates and stores the SLA deadline when the complaint is assigned.

It should **not** be interpreted as a complete automated SLA escalation or reminder engine unless additional functionality is added to the backend.

---

## 13. API Endpoint Overview

Base URL for local development:

```text
http://localhost:5000/api
```

### Authentication

| Method | Route          | Access          | Purpose                            |
| ------ | -------------- | --------------- | ---------------------------------- |
| POST   | `/auth/signup` | Public          | Create a citizen account           |
| POST   | `/auth/login`  | Public          | Authenticate user and receive JWT  |
| GET    | `/auth/me`     | Logged-in users | Get authenticated user information |

### Users

| Method | Route                | Access | Purpose                                  |
| ------ | -------------------- | ------ | ---------------------------------------- |
| GET    | `/users?role=WORKER` | Admin  | Get Worker/Driver users                  |
| POST   | `/users`             | Admin  | Create a user, including Worker accounts |
| DELETE | `/users/:id`         | Admin  | Delete a user                            |

Example Worker creation body from the existing backend:

```json
{
  "name": "Worker Name",
  "email": "worker@example.com",
  "password": "password",
  "role": "WORKER"
}
```

### Bins

| Method | Route       | Access          | Purpose            |
| ------ | ----------- | --------------- | ------------------ |
| GET    | `/bins`     | Logged-in users | Get bins           |
| GET    | `/bins/:id` | Logged-in users | Get a specific bin |
| POST   | `/bins`     | Admin           | Create a bin       |
| PUT    | `/bins/:id` | Admin/Worker    | Update bin status  |
| DELETE | `/bins/:id` | Admin           | Delete a bin       |

Example bin data:

```json
{
  "code": "BIN-001",
  "address": "Example Location",
  "latitude": 23.0000,
  "longitude": 72.0000,
  "capacityL": 1000
}
```

### Complaints

| Method | Route                    | Access          | Purpose                                    |
| ------ | ------------------------ | --------------- | ------------------------------------------ |
| POST   | `/complaints`            | Citizen         | Create a complaint                         |
| GET    | `/complaints`            | Logged-in users | Get complaints according to access rules   |
| GET    | `/complaints/:id`        | Logged-in users | Get a specific complaint                   |
| PUT    | `/complaints/:id/status` | Admin/Worker    | Update complaint status and related fields |
| DELETE | `/complaints/:id`        | Admin           | Delete a complaint                         |

Example complaint creation data:

```json
{
  "description": "Waste is overflowing near the road.",
  "beforeImageUrl": "IMAGE_URL",
  "latitude": 23.0000,
  "longitude": 72.0000,
  "binId": 1
}
```

### Logistics

The Logistics routes are restricted to **ADMIN** users.

| Method | Route                                    | Access | Purpose                                                |
| ------ | ---------------------------------------- | ------ | ------------------------------------------------------ |
| POST   | `/logistics/suggest-driver/:complaintId` | Admin  | Suggest the nearest driver using geographical distance |
| POST   | `/logistics/assign/:complaintId`         | Admin  | Confirm and create the driver assignment               |

The exact request data for driver coordinates should be taken from the current controller implementation rather than assumed from this documentation.

---

## 14. Image Handling

The backend does not directly store uploaded image files.

The existing complaint API expects image URLs through fields such as:

```text
beforeImageUrl
afterImageUrl
```

The actual image-storage mechanism is handled separately.

This allows the frontend or another storage service to upload an image first and then provide the resulting URL to the backend.

---

## 15. Environment Variables

Create a `.env` file in the backend project directory.

The backend requires the database connection string and JWT secret used by the existing project configuration:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="your-long-random-secret"
```

For a Neon PostgreSQL setup, copy the PostgreSQL connection string provided by the Neon dashboard.

Do not commit the real `.env` file or production secrets to GitHub.

---

## 16. Local Setup

### Prerequisites

Install:

* Node.js v18+
* PostgreSQL or a PostgreSQL cloud service such as Neon
* Postman or Thunder Client for API testing

### Clone the project

```bash
git clone <repository-url>
cd backend
```

Use the team's actual repository URL when cloning the project.

### Install dependencies

```bash
npm install
```

### Configure environment variables

Create `.env` and add:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="your-long-random-secret"
```

### Apply Prisma migrations

```bash
npx prisma migrate dev --name init
```

### Generate Prisma Client

```bash
npx prisma generate
```

---

## 17. Running the Backend

Start the development server using:

```bash
npm run dev
```

The existing project runs locally on:

```text
http://localhost:5000
```

When the server starts successfully, the terminal should indicate that the server is running.

---

## 18. Health Check

The backend exposes a health-check endpoint:

```http
GET /api/health
```

Local example:

```text
http://localhost:5000/api/health
```

Expected response:

```json
{
  "success": true,
  "message": "Backend is running"
}
```

This endpoint can be used to verify that the backend server is available.

---

## 19. Prisma Studio

Prisma Studio can be used to inspect the database during development.

Run:

```bash
npx prisma studio
```

This provides a browser-based interface for viewing and working with the project's Prisma models and stored data.

It is useful for debugging users, complaints, assignments, notifications, and other database records during development.

---

## 20. Deployment

The backend is structured for deployment as a Node.js/Express application.

The project uses:

* **Neon PostgreSQL** for the cloud PostgreSQL database
* **Render** for backend deployment

For deployment, the production environment should provide the required database connection string and JWT secret through the platform's environment-variable configuration.

The exact production URL should be taken from the team's current Render deployment rather than hard-coded into the repository documentation.

---

## 21. Integration With Other Project Components

The backend acts as the common service layer for the team's other modules.

### Frontend

The frontend communicates with the REST APIs.

Protected requests must include:

```http
Authorization: Bearer <token>
```

### GIS

The GIS component can use:

* Bin latitude/longitude
* Complaint latitude/longitude

to represent project locations on a map.

### AI / Image Processing

The existing complaint workflow includes fields for:

```text
aiVerified
aiConfidence
```

These can be updated through the complaint status endpoint after the image-processing component performs its verification.

### Logistics

The Logistics module uses the existing database models and backend infrastructure:

```text
Complaint
   ↓
Nearest-driver suggestion
   ↓
Admin confirmation
   ↓
Assignment
   ↓
SLA deadline
   ↓
Notification
```

This keeps the logistics functionality integrated with the same backend instead of introducing another backend service.

---

## 22. Team Contribution

This backend is a **shared team project** developed for SIH 2026.

The original backend provides the core foundation including:

* Authentication
* User management
* Bin management
* Complaint management
* Prisma database schema
* Middleware and API structure

The **Logistics / Driver Assignment module** extends this existing backend by adding:

* `logistics.controller.js`
* `logistics.routes.js`
* Driver/Worker assignment logic
* Haversine-based nearest-driver suggestion
* Admin-confirmed assignment
* Assignment creation
* Four-hour SLA deadline handling
* Driver notification creation

The Logistics functionality is therefore a part of the same backend architecture and database rather than a separate backend implementation.

---

## 23. Current Limitations

The current implementation has several deliberate limitations that should be considered when extending the project:

* Driver live location is not stored in the database.
* Driver coordinates are currently supplied to the nearest-driver suggestion endpoint.
* The nearest-driver feature suggests a driver, but the Admin confirms the final assignment.
* Real-time GPS tracking is not implemented.
* Route optimization is not implemented.
* The current logistics module creates an SLA deadline, but does not by itself represent a complete automated SLA escalation/reminder system.
* Actual image-file storage is handled outside this backend through image URLs.

These limitations reflect the current implementation and should not be represented as completed features unless they are added later.

---

## 24. Future Scope

Possible future extensions, subject to the team's implementation, include:

* Persisting live Driver GPS locations
* Real-time driver tracking
* More advanced driver availability management
* Route optimization
* Automated SLA monitoring
* Automated escalation and reminder workflows
* Richer notification delivery mechanisms
* Additional logistics analytics and operational dashboards

These are future possibilities and are not part of the current implemented backend functionality unless explicitly added later.

---

## 25. Quick Reference

```text
Backend:
Node.js + Express.js

Database:
PostgreSQL + Prisma
Cloud: Neon PostgreSQL

Authentication:
JWT + bcryptjs

Deployment:
Render

Core Modules:
Auth
Users
Bins
Complaints
Logistics

Logistics Flow:
Complaint
   ↓
Location
   ↓
Nearest-driver suggestion
   ↓
Admin confirmation
   ↓
Assignment
   ↓
ASSIGNED
   ↓
4-hour SLA
   ↓
Worker notification
```

For the complete database definition, refer to:

```text
prisma/schema.prisma
```

For logistics-specific implementation, refer to:

```text
src/controllers/logistics.controller.js
src/routes/logistics.routes.js
src/utils/distance.js
```
