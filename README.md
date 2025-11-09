# 🎓 School Equipment Lending Platform

A comprehensive full-stack web application for managing school equipment lending operations with role-based access control, real-time availability tracking, and request approval workflows.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.2.0-blue.svg)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Screenshots](#screenshots)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### For All Users
- 🔐 **Secure Authentication** - Token-based login system with session management
- 📦 **Equipment Browsing** - View all available equipment with real-time availability
- 🔍 **Advanced Search** - Filter equipment by name, category, and availability
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices

### For Students
- ✍️ **Borrow Requests** - Submit equipment borrow requests with reasons
- 📊 **Request Tracking** - View status of all your borrow requests (pending/approved/rejected/returned)
- 📝 **Request History** - Complete history of past borrowing activity

### For Staff & Lab Assistants
- ✅ **Request Approval** - Approve or reject pending borrow requests
- 🔄 **Return Management** - Mark borrowed equipment as returned
- 👀 **Request Monitoring** - View all equipment requests across the organization
- 📈 **Equipment Oversight** - Monitor equipment usage and availability

### For Administrators
- ➕ **Equipment Management** - Add new equipment to the inventory
- ✏️ **Equipment Editing** - Update equipment details, quantities, and conditions
- 🎯 **Full Control** - Complete CRUD operations on equipment
- 📊 **Usage Analytics** - Track equipment utilization and request patterns
- 👥 **User Management** - Manage user roles and permissions

## 🛠 Tech Stack

### Backend
- **Runtime:** Node.js (v14+)
- **Framework:** Express.js
- **Database:** SQLite3
- **Authentication:** Token-based (JWT-compatible)
- **Architecture:** RESTful API

### Frontend
- **Framework:** React 18
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **State Management:** React Hooks (useState, useEffect)
- **HTTP Client:** Fetch API

### Development Tools
- **Version Control:** Git
- **Package Manager:** npm
- **Code Editor:** VS Code (recommended)

## 🏗 System Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│                 │         │                  │         │                 │
│  React Client   │◄───────►│  Express API     │◄───────►│  SQLite DB      │
│  (Frontend)     │  HTTP   │  (Backend)       │  SQL    │  (Database)     │
│                 │         │                  │         │                 │
└─────────────────┘         └──────────────────┘         └─────────────────┘
      │                              │
      │                              │
      ├─ Components                  ├─ Routes
      ├─ Services                    ├─ Middleware
      ├─ Utils                       ├─ Controllers
      └─ Assets                      └─ Models
```

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (v6.0.0 or higher) - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)

Verify installation:
```bash
node --version
npm --version
git --version
```

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/school-equipment-lending.git
cd school-equipment-lending
```

### 2. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

**Dependencies installed:**
- express
- sqlite3
- cors

### 3. Frontend Setup

Navigate to the frontend directory and install dependencies:

```bash
cd ../frontend
npm install
```

**Dependencies installed:**
- react
- react-dom
- lucide-react
- react-scripts

### 4. Database Initialization

The SQLite database will be automatically created on first run. Default data includes:

**Users:**
- Admin: `admin` / `admin123`
- Staff: `staff1` / `staff123`
- Student: `student1` / `student123`

**Equipment:**
- Microscope (Lab Equipment) - Qty: 5
- Calculator (Math Tools) - Qty: 20
- Projector (Electronics) - Qty: 3

## ⚙️ Configuration

### Backend Configuration

Edit `backend/app.js` if needed:

```javascript
const PORT = 3000; // Change port if needed
const db = new sqlite3.Database('./school_equipment.db'); // Database file path
```

### Frontend Configuration

Edit `frontend/src/services/api.js`:

```javascript
const API_URL = 'http://localhost:3000/api'; // Backend URL
```

### CORS Configuration

For production, update CORS settings in `backend/app.js`:

```javascript
app.use(cors({
  origin: 'https://your-frontend-domain.com',
  credentials: true
}));
```

## 🎮 Usage

### Starting the Application

#### 1. Start Backend Server

```bash
cd backend
node app.js
```

Server will start on `http://localhost:3000`

You should see:
```
Connected to SQLite database
School Equipment Lending API running on http://localhost:3000

Test credentials:
Admin: username=admin, password=admin123
Staff: username=staff1, password=staff123
Student: username=student1, password=student123
```

#### 2. Start Frontend Development Server

In a new terminal:

```bash
cd frontend
npm start
```

Frontend will start on `http://localhost:3001` and automatically open in your browser.

### First Time Login

1. Navigate to `http://localhost:3001`
2. Use one of the demo credentials:
   - **Admin:** `admin` / `admin123`
   - **Staff:** `staff1` / `staff123`
   - **Student:** `student1` / `student123`

### Basic Workflows

#### As a Student:
1. **Browse Equipment** → Equipment tab
2. **Search** → Use search bar to find specific items
3. **Request Equipment** → Click "Request Borrow" button
4. **Fill Form** → Enter quantity and reason
5. **Track Status** → View in "My Requests" tab

#### As Staff:
1. **View Requests** → Navigate to "All Requests" tab
2. **Review Details** → Check equipment, user, and reason
3. **Approve/Reject** → Click appropriate button
4. **Mark Returned** → When equipment is returned, click "Mark as Returned"

#### As Admin:
1. **Add Equipment** → Navigate to "Add Equipment" tab
2. **Fill Form** → Enter name, category, condition, quantity
3. **Edit Equipment** → Click edit icon on any equipment card
4. **Manage Requests** → Same as staff permissions

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "token_1699564800000_0.123456789",
  "user": {
    "id": 1,
    "username": "admin",
    "role": "admin",
    "name": "Admin User"
  }
}
```

### Equipment Endpoints

#### Get All Equipment
```http
GET /api/equipment?search=microscope&available=true
Authorization: Bearer <token>
```

#### Add Equipment (Admin)
```http
POST /api/equipment
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Laptop",
  "category": "Electronics",
  "condition": "Excellent",
  "quantity": 10
}
```

#### Update Equipment (Admin)
```http
PUT /api/equipment/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Digital Microscope",
  "quantity": 8
}
```

### Request Endpoints

#### Create Request
```http
POST /api/requests
Authorization: Bearer <token>
Content-Type: application/json

{
  "equipmentId": 1,
  "quantity": 2,
  "reason": "Biology experiment"
}
```

#### Get My Requests
```http
GET /api/requests/my
Authorization: Bearer <token>
```

#### Get All Requests (Staff/Admin)
```http
GET /api/requests?status=pending
Authorization: Bearer <token>
```

#### Approve/Reject Request (Staff/Admin)
```http
PUT /api/requests/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "action": "approve"
}
```

#### Mark as Returned (Staff/Admin)
```http
PUT /api/requests/:id/return
Authorization: Bearer <token>
```

**Complete API documentation available in:** [`API_DOCUMENTATION.md`](./API_DOCUMENTATION.md)

## 📁 Project Structure

```
school-equipment-lending/
├── backend/
│   ├── app.js                      # Main Express application
│   ├── school_equipment.db         # SQLite database (auto-generated)
│   ├── package.json
│   └── node_modules/
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   └── LoginForm.jsx
│   │   │   ├── equipment/
│   │   │   │   ├── EquipmentCard.jsx
│   │   │   │   ├── EquipmentList.jsx
│   │   │   │   ├── AddEquipmentForm.jsx
│   │   │   │   └── EditEquipmentForm.jsx
│   │   │   ├── requests/
│   │   │   │   ├── RequestCard.jsx
│   │   │   │   ├── MyRequestsList.jsx
│   │   │   │   ├── AllRequestsList.jsx
│   │   │   │   └── BorrowRequestForm.jsx
│   │   │   └── common/
│   │   │       ├── Header.jsx
│   │   │       ├── Tabs.jsx
│   │   │       ├── Alert.jsx
│   │   │       └── SearchBar.jsx
│   │   ├── services/
│   │   │   └── api.js              # API service layer
│   │   ├── utils/
│   │   │   └── constants.js        # App constants
│   │   ├── App.jsx                 # Main application component
│   │   └── index.js                # React entry point
│   ├── package.json
│   └── node_modules/
├── docs/
│   ├── API_DOCUMENTATION.md
│   ├── SEQUENCE_DIAGRAMS.md
│   └── AI_WORKFLOW_REPORT.md
├── README.md
└── LICENSE
```

## 💾 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL,
  name TEXT NOT NULL
);
```

### Equipment Table
```sql
CREATE TABLE equipment (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  condition TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  available INTEGER NOT NULL
);
```

### Requests Table
```sql
CREATE TABLE requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  equipment_id INTEGER NOT NULL,
  equipment_name TEXT NOT NULL,
  user_id INTEGER NOT NULL,
  user_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  reason TEXT,
  status TEXT NOT NULL,
  request_date TEXT NOT NULL,
  approved_by TEXT,
  approved_date TEXT,
  return_date TEXT,
  FOREIGN KEY (equipment_id) REFERENCES equipment(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## 📸 Screenshots

### Login Page
![Login](./docs/screenshots/login.png)

### Equipment Dashboard
![Dashboard](./docs/screenshots/dashboard.png)

### Borrow Request Form
![Request Form](./docs/screenshots/request-form.png)

### Admin Panel
![Admin](./docs/screenshots/admin-panel.png)

## 🧪 Testing

### Manual Testing

#### Test Authentication
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

#### Test Equipment Retrieval
```bash
curl http://localhost:3000/api/equipment \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Test Adding Equipment
```bash
curl -X POST http://localhost:3000/api/equipment \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Equipment",
    "category": "Test",
    "condition": "Good",
    "quantity": 5
  }'
```

### Automated Testing (Future Enhancement)

```bash
# Install testing dependencies
npm install --save-dev jest supertest @testing-library/react

# Run tests
npm test
```

## 🚢 Deployment

### Backend Deployment (Heroku Example)

1. **Create Heroku App**
```bash
heroku create your-app-name
```

2. **Set Environment Variables**
```bash
heroku config:set NODE_ENV=production
```

3. **Deploy**
```bash
git push heroku main
```

### Frontend Deployment (Netlify Example)

1. **Build Production Version**
```bash
cd frontend
npm run build
```

2. **Deploy to Netlify**
```bash
netlify deploy --prod --dir=build
```

### Environment Variables for Production

**Backend (.env):**
```env
PORT=3000
NODE_ENV=production
DB_PATH=./school_equipment.db
FRONTEND_URL=https://your-frontend-domain.com
```

**Frontend (.env):**
```env
REACT_APP_API_URL=https://your-backend-domain.com/api
```

## 🔒 Security Considerations

### Current Implementation
- ✅ Token-based authentication
- ✅ Role-based authorization
- ✅ SQL injection prevention (parameterized queries)
- ✅ CORS configuration

### Production Recommendations
- 🔐 Use JWT tokens with expiration
- 🔐 Implement password hashing (bcrypt)
- 🔐 Add HTTPS/SSL certificates
- 🔐 Implement rate limiting
- 🔐 Add input validation and sanitization
- 🔐 Use environment variables for secrets
- 🔐 Implement CSRF protection
- 🔐 Add audit logging

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the Repository**
```bash
git fork https://github.com/yourusername/school-equipment-lending.git
```

2. **Create Feature Branch**
```bash
git checkout -b feature/YourFeatureName
```

3. **Commit Changes**
```bash
git commit -m "Add: Your feature description"
```

4. **Push to Branch**
```bash
git push origin feature/YourFeatureName
```

5. **Open Pull Request**

### Coding Standards
- Follow ESLint configuration
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation for new features
- Test before submitting PR

## 🐛 Known Issues

- Session tokens stored in memory (lost on server restart)
- No automated tests implemented yet
- Password stored in plain text (development only)
- No email notifications for request status
- Limited to single-server deployment

## 🗺 Roadmap

### Version 1.1 (Planned)
- [ ] Password hashing with bcrypt
- [ ] JWT token implementation
- [ ] Email notifications
- [ ] Export reports (PDF/CSV)
- [ ] Advanced search filters

### Version 2.0 (Future)
- [ ] Multi-tenant support
- [ ] Real-time notifications (WebSocket)
- [ ] Mobile app (React Native)
- [ ] Equipment reservation system
- [ ] Analytics dashboard
- [ ] Automated testing suite


## 🙏 Acknowledgments

- Express.js team for the excellent web framework
- React team for the powerful UI library
- SQLite for the lightweight database
- Tailwind CSS for the utility-first CSS framework
- Lucide for beautiful icons
- All contributors and testers

## 📞 Support

For support, email your-email@example.com or open an issue in the GitHub repository.

## 📊 Project Status

**Current Version:** 1.0.0  
**Status:** Active Development  
**Last Updated:** November 9, 2024

---