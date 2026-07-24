# Student Attendance Management System - Backend API

This is the backend repository for the **Student Attendance Management System**, built using Flask. It is designed as a modular, scalable REST API conforming to clean architecture standards.

---

## 🛠️ Technology Stack
- **Python** (version 3.8+)
- **Flask** (Micro web framework)
- **Flask-JWT-Extended** (Stateless authentication & claims security)
- **Marshmallow** (Request validation and serialization)
- **python-dotenv** (Environment variables configuration management)
- **openpyxl** (Excel spreadsheet generation)
- **reportlab** (PDF document generation)
- **Pillow** (Profile picture uploading verification)

---

## 📁 Folder Structure
```text
student-attendance-backend/
│
├── app/
│   ├── __init__.py           # Flask App Factory Pattern setup
│   ├── main.py               # Exposes app instance and runs debug server
│   │
│   ├── config/
│   │   ├── config.py         # Loads and maps environments configurations
│   │   └── settings.py       # Global app constants (HTTP status codes, defaults)
│   │
│   ├── routes/               # API blueprinted routing (Controller layer)
│   │   ├── auth.py
│   │   ├── dashboard.py
│   │   ├── students.py
│   │   ├── attendance.py
│   │   ├── reports.py
│   │   ├── profile.py
│   │   └── notifications.py
│   │
│   ├── services/             # Core business rules logic (Service layer)
│   │   ├── auth_service.py
│   │   ├── dashboard_service.py
│   │   ├── student_service.py
│   │   ├── attendance_service.py
│   │   ├── report_service.py
│   │   ├── profile_service.py
│   │   └── notification_service.py
│   │
│   ├── schemas/              # Input parameters validation (Marshmallow schemas)
│   │   ├── auth_schema.py
│   │   ├── student_schema.py
│   │   ├── attendance_schema.py
│   │   ├── profile_schema.py
│   │   └── notification_schema.py
│   │
│   ├── middleware/           # Role guarding and generic error interceptors
│   │   ├── auth_middleware.py
│   │   └── error_handler.py
│   │
│   ├── utils/                # Project utility modules
│   │   ├── jwt_helper.py
│   │   ├── validators.py
│   │   ├── logger.py
│   │   └── helpers.py
│   │
│   └── uploads/              # Local storage directory for profile images
│
├── requirements.txt          # Python external libraries manifest
├── README.md                 # Project architecture documentation
├── .env.example              # Configuration variables blueprint template
└── run.py                    # Root entry script
```

---

## 🚀 Getting Started

### 1. Setup Environment
Clone the repository and copy the environment variables template:
```bash
cp .env.example .env
```

### 2. Create Virtual Environment
Create and activate your virtual environment:
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS / Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Run the API
```bash
python run.py
```
The server will start at `http://localhost:5000/`.

---

## 🔒 Authentication Protection
All protected endpoints require checking the `Authorization` header containing the JWT token:
```text
Authorization: Bearer <your_jwt_token>
```
Endpoints guarded by `@admin_required()` verify that the caller is logged in and possesses `admin` role privileges.

---

## 📋 API Endpoints List

### Authentication (`/api/auth`)
- `POST /api/auth/signup` - Register a new Admin profile
- `POST /api/auth/login` - Authenticate Admin and retrieve JWT
- `POST /api/auth/forgot-password` - Generate reset token
- `POST /api/auth/reset-password` - Reset password with token
- `POST /api/auth/logout` - Invalidate active session

### Dashboard (`/api/dashboard`) *(Admin-Only)*
- `GET /api/dashboard/summary` - General dashboard numbers
- `GET /api/dashboard/statistics` - Status distribution and class averages
- `GET /api/dashboard/activities` - Recent system audit logs feed

### Students (`/api/students`) *(Admin-Only)*
- `GET /api/students` - Retrieve all students (Supports paging, class filter, query search)
- `GET /api/students/count` - Count registered students
- `GET /api/students/search?q=<query>` - Search matching names/emails/roll numbers
- `GET /api/students/<student_id>` - Retrieve detailed student card
- `POST /api/students` - Add a new student
- `PUT /api/students/<student_id>` - Update student records
- `DELETE /api/students/<student_id>` - Remove student from register

### Attendance (`/api/attendance`) *(Admin-Only)*
- `POST /api/attendance` - Log attendance (Supports single or bulk payload structures)
- `GET /api/attendance` - Fetch all attendance records
- `GET /api/attendance/date/<date_str>` - Fetch logs on date (YYYY-MM-DD)
- `GET /api/attendance/student/<student_id>` - Fetch logs for student
- `PUT /api/attendance/<attendance_id>` - Edit attendance log status/remarks
- `DELETE /api/attendance/<attendance_id>` - Remove attendance log
- `GET /api/attendance/percentage/<student_id>` - Retrieve overall attendance rate

### Reports (`/api/reports`) *(Admin-Only)*
- `GET /api/reports/daily?date=<YYYY-MM-DD>` - Fetch JSON daily overview
- `GET /api/reports/weekly?start_date=<YYYY-MM-DD>` - Fetch JSON weekly overview
- `GET /api/reports/monthly?year=<YYYY>&month=<MM>` - Fetch JSON monthly averages
- `GET /api/reports/student/<student_id>` - JSON attendance history for student
- `GET /api/reports/overall` - JSON aggregated overall report
- `GET /api/reports/download/pdf` - Export overall statistics in PDF format
- `GET /api/reports/download/excel` - Export overall statistics in Excel sheet format

### Profile (`/api/profile`) *(Admin-Only)*
- `GET /api/profile` - View profile details
- `PUT /api/profile` - Edit name / email details
- `POST /api/profile/change-password` - Rotate credentials password
- `POST /api/profile/upload-image` - Upload profile image file (under key `image`)

### Notifications (`/api/notifications`) *(Admin-Only)*
- `GET /api/notifications` - Retrieve list of system alerts
- `PUT /api/notifications/<notification_id>/read` - Mark alert as read
