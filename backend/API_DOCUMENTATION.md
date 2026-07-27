# Backend API Documentation - ScholarMatch AI / GovtScheme-AI

Comprehensive REST API documentation for the backend system built with **Node.js, Express, MongoDB (Mongoose), and JWT Authentication**.

---

## 🚀 Base URL & Setup

- **Default Port**: `5000`
- **Base URL**: `http://localhost:5000`
- **Content-Type**: `application/json`

### Environment Variables (`backend/.env`)

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/scholarmatch
JWT_SECRET=your_super_secret_jwt_key
```

---

## 🔐 Authentication

All protected routes require a Bearer Token in the `Authorization` header:

```http
Authorization: Bearer <YOUR_JWT_TOKEN>
```

---

## 📚 API Endpoints Summary

| Category | Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/auth/register` | Public | Register a new student account |
| **Auth** | `POST` | `/api/auth/login` | Public | Login with email and password |
| **Auth** | `GET` | `/api/auth/me` | Protected | Get currently authenticated user details |
| **Student** | `GET` | `/api/student/profile` | Protected | Fetch student profile |
| **Student** | `POST` | `/api/student/profile` | Protected | Create / initialize student profile |
| **Student** | `PUT` | `/api/student/profile` | Protected | Update student profile details |
| **Scholarships**| `GET` | `/api/scholarships` | Public | List scholarships (supports pagination & filtering) |
| **Scholarships**| `GET` | `/api/scholarships/search` | Public | Search scholarships by text/keyword & filters |
| **Scholarships**| `GET` | `/api/scholarships/:id` | Public | Get single scholarship details |
| **Scholarships**| `POST` | `/api/scholarships` | Admin/Protected | Create a new scholarship |
| **Scholarships**| `PUT` | `/api/scholarships/:id` | Admin/Protected | Update a scholarship |
| **Scholarships**| `DELETE` | `/api/scholarships/:id` | Admin/Protected | Delete a scholarship |
| **Saved** | `GET` | `/api/saved` | Protected | List all saved scholarships for student |
| **Saved** | `POST` | `/api/saved/:id` | Protected | Save / bookmark a scholarship |
| **Saved** | `DELETE` | `/api/saved/:id` | Protected | Remove saved scholarship |
| **Applications**| `GET` | `/api/applications` | Protected | List all application tracker records |
| **Applications**| `GET` | `/api/applications/:id` | Protected | Get single application tracker detail |
| **Applications**| `POST` | `/api/applications` | Protected | Create / track an application |
| **Applications**| `PUT` | `/api/applications/:id` | Protected | Update application status or remarks |
| **Applications**| `DELETE` | `/api/applications/:id` | Protected | Delete an application tracker entry |

---

## 🛠 Endpoint Details

### 1. Authentication APIs (`/api/auth`)

#### `POST /api/auth/register`
- **Request Body**:
```json
{
  "fullName": "Rahul Sharma",
  "email": "rahul.sharma@example.com",
  "password": "password123"
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "message": "Registration successful.",
  "token": "eyJhbGciOiJIUzI1NiIsIn...",
  "student": {
    "id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "fullName": "Rahul Sharma",
    "email": "rahul.sharma@example.com"
  }
}
```

#### `POST /api/auth/login`
- **Request Body**:
```json
{
  "email": "rahul.sharma@example.com",
  "password": "password123"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Login successful.",
  "token": "eyJhbGciOiJIUzI1NiIsIn...",
  "student": {
    "id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "fullName": "Rahul Sharma",
    "email": "rahul.sharma@example.com"
  }
}
```

---

### 2. Student Profile APIs (`/api/student`)

#### `GET /api/student/profile` (Protected)
- **Response (200 OK)**:
```json
{
  "success": true,
  "student": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "fullName": "Rahul Sharma",
    "email": "rahul.sharma@example.com",
    "phone": "+919876543210",
    "gender": "Male",
    "course": "B.Tech Computer Science",
    "college": "IIT Delhi",
    "state": "Delhi",
    "cgpa": 8.5,
    "annualIncome": 250000,
    "category": "OBC",
    "disability": false,
    "minority": false,
    "savedScholarships": []
  }
}
```

#### `POST /api/student/profile` or `PUT /api/student/profile` (Protected)
- **Request Body**:
```json
{
  "phone": "+919876543210",
  "gender": "Male",
  "course": "B.Tech Computer Science",
  "college": "IIT Delhi",
  "state": "Delhi",
  "cgpa": 8.5,
  "annualIncome": 250000,
  "category": "OBC",
  "disability": false,
  "minority": false
}
```
- **Response (200 OK / 201 Created)**:
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "student": { ... }
}
```

---

### 3. Scholarship APIs (`/api/scholarships`)

#### `GET /api/scholarships`
- **Query Parameters**:
  - `category` (string, optional)
  - `state` (string, optional)
  - `provider` (string, optional)
  - `minAmount` (number, optional)
  - `maxAmount` (number, optional)
  - `page` (number, default: 1)
  - `limit` (number, default: 20)
- **Response (200 OK)**:
```json
{
  "success": true,
  "count": 1,
  "total": 1,
  "page": 1,
  "pages": 1,
  "scholarships": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
      "title": "National Merit Scholarship",
      "provider": "Ministry of Education",
      "description": "Scholarship for high achieving undergraduate students.",
      "eligibility": "Minimum 80% marks in 12th grade",
      "amount": 50000,
      "deadline": "2026-12-31T00:00:00.000Z",
      "category": "General",
      "state": "All India",
      "applyLink": "https://scholarships.gov.in",
      "isActive": true
    }
  ]
}
```

#### `GET /api/scholarships/search?q=merit&state=Delhi`
- **Query Parameters**: `q` (search text), `category`, `state`
- **Response (200 OK)**:
```json
{
  "success": true,
  "count": 1,
  "total": 1,
  "scholarships": [ ... ]
}
```

---

### 4. Saved Scholarship APIs (`/api/saved`)

#### `POST /api/saved/:id` (Protected)
- **Request Body** (optional):
```json
{
  "notes": "Interested in applying before December"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Scholarship saved successfully"
}
```

#### `DELETE /api/saved/:id` (Protected)
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Scholarship removed successfully"
}
```

#### `GET /api/saved` (Protected)
- **Response (200 OK)**:
```json
{
  "success": true,
  "count": 1,
  "savedScholarships": [ ... ]
}
```

---

### 5. Application Tracker CRUD APIs (`/api/applications`)

#### `POST /api/applications` (Protected)
- **Request Body**:
```json
{
  "scholarship": "64f1a2b3c4d5e6f7a8b9c0d2",
  "status": "Applied",
  "remarks": "Submitted documents on official portal"
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "message": "Application tracked successfully",
  "application": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d9",
    "student": "64f1a2b3c4d5e6f7a8b9c0d1",
    "scholarship": { ... },
    "status": "Applied",
    "applicationDate": "2026-07-27T20:00:00.000Z",
    "remarks": "Submitted documents on official portal"
  }
}
```

#### `GET /api/applications` (Protected)
- **Response (200 OK)**:
```json
{
  "success": true,
  "count": 1,
  "applications": [ ... ]
}
```

#### `PUT /api/applications/:id` (Protected)
- **Request Body**:
```json
{
  "status": "Under Review",
  "remarks": "Interview scheduled"
}
```

#### `DELETE /api/applications/:id` (Protected)
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Application tracker deleted successfully"
}
```

---

## 🗄 Database Models Summary

- **`Student`** (`models/Student.js`): Student account details, auth credentials, academic profile, demographic category, income level, and array of saved scholarship IDs.
- **`Scholarship`** (`models/Scholarship.js`): Scholarship scheme title, provider, criteria, award amount, deadline, state scope, category, and direct application link with text index.
- **`SavedScholarship`** (`models/SavedScholarship.js`): Saved scholarship records linking student to scholarship with notes and timestamps.
- **`Application`** (`models/Application.js`): Application tracker entity for tracking application statuses (`Applied`, `Under Review`, `Approved`, `Rejected`, `Draft`, `Pending`), application date, and custom remarks.
