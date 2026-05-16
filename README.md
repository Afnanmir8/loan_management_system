# Loan Management System (LMS)

A modern, full-stack loan management platform built with **Next.js**, **Node.js/Express**, **TypeScript**, **MongoDB**, **JWT Authentication**, and **Tailwind CSS**.

## 🎯 Features

### For Borrowers
- ✅ Multi-step loan application form
- ✅ Real-time eligibility check with Business Rule Engine (BRE)
- ✅ Salary slip upload (PDF/JPG/PNG)
- ✅ Flexible loan configuration (₹50K-₹1L, 30-365 days)
- ✅ Live interest calculation (Simple Interest at 12% p.a.)
- ✅ Application status tracking

### For Executives
- ✅ **Sales Module**: Pre-application lead tracking
- ✅ **Sanction Module**: Approve/Reject applications with reasons
- ✅ **Disbursement Module**: Process sanctioned loans
- ✅ **Collection Module**: Record payments with UTR tracking
- ✅ **Admin Dashboard**: Overview of all loan statuses
- ✅ Role-based access control

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT + bcryptjs
- **File Upload**: Multer

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **State Management**: React Context API

## 📋 Borrower Journey (4 Steps)

### Step 1: Authentication
- Email & password-based signup/login
- Passwords hashed with bcryptjs

### Step 2: Personal Details & Eligibility Check
Collects:
- Full Name
- PAN (validated)
- Date of Birth
- Monthly Salary (min ₹25,000)
- Employment Mode (Salaried/Self-Employed/Unemployed)

**BRE Rules (Auto-Check)**:
- Age: 23-50
- Salary: ≥ ₹25,000/month
- Employment: NOT Unemployed
- PAN: Valid format

### Step 3: Upload Salary Slip
- File types: PDF, JPG, PNG
- Max size: 5 MB
- Stored server-side with unique names

### Step 4: Loan Configuration & Apply
- Amount: ₹50,000 - ₹1,00,000
- Tenure: 30 - 365 days
- Interest Rate: 12% p.a. (fixed)

**Calculation**:
```
SI = (P × R × T) / (365 × 100)
Total Repayment = P + SI
```

## 🏦 Loan Lifecycle & Statuses

```
PENDING → APPROVED/SANCTIONED/REJECTED
         ↓
      SANCTIONED
         ↓
      DISBURSED
         ↓
      CLOSED (on full payment)
```

### Status Transitions
- **PENDING**: Initial state after application
- **APPROVED/SANCTIONED**: Sanction executive approves/rejects
- **DISBURSED**: Disbursement team marks as disbursed
- **CLOSED**: Auto-close when full repayment received
- **REJECTED**: If conditions not met

## 👥 Role-Based Access Control

| Role | Access |
|------|--------|
| **Admin** | All modules + system overview |
| **Sales** | Sales module only (lead tracking) |
| **Sanction** | Sanction module only (approve/reject) |
| **Disbursement** | Disbursement module (mark as disbursed) |
| **Collection** | Collection module (record payments) |
| **Borrower** | Portal only (apply for loans, track status) |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure MongoDB URI and JWT secret in .env
# Example:
# MONGODB_URI=mongodb://localhost:27017/lms
# JWT_SECRET=your_super_secret_key
# PORT=5000

# Start MongoDB
mongod

# Run development server
npm run dev

# Or build and run production
npm run build
npm start
```

**Backend will run on** `http://localhost:5000`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local

# Ensure API URL points to backend
# NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Run development server
npm run dev

# Or build and run production
npm run build
npm start
```

**Frontend will run on** `http://localhost:3000`

## 📱 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register as borrower
- `POST /api/auth/login` - Borrower login
- `POST /api/auth/login-admin` - Executive login
- `GET /api/auth/profile` - Get user profile

### Borrower
- `GET /api/borrower/check-eligibility` - Check BRE eligibility
- `PUT /api/borrower/profile` - Update profile
- `GET /api/borrower/applications` - Get my loans
- `GET /api/borrower/applications/:id` - Get loan details

### Loan Management
- `POST /api/loan/apply` - Submit loan application
- `GET /api/loan/sales/loans` - Get pending loans (Sales)
- `POST /api/loan/sanction` - Approve/Reject loan (Sanction)
- `POST /api/loan/disburse` - Disburse loan (Disbursement)
- `POST /api/loan/collect/payment` - Record payment (Collection)
- `GET /api/loan/dashboard` - Get dashboard data

## 🗄️ Database Schema

### Users
```javascript
{
  email: String (unique),
  password: String (hashed),
  role: String enum (admin, sales, sanction, disbursement, collection, borrower),
  createdAt, updatedAt
}
```

### Borrowers
```javascript
{
  userId: String,
  fullName: String,
  pan: String (unique, validated),
  dob: Date,
  monthlySalary: Number,
  employmentMode: String enum,
  createdAt, updatedAt
}
```

### Loans
```javascript
{
  borrowerId: String,
  status: String enum,
  loanAmount: Number,
  tenure: Number (days),
  interestRate: Number (12),
  salarySlip: String (file path),
  simpleInterest: Number,
  totalRepayment: Number,
  sanctions: Array,
  disbursements: Array,
  collections: Array,
  createdAt, updatedAt
}
```

## 🔐 Security Features

- ✅ Passwords hashed with bcryptjs (10 rounds)
- ✅ JWT token-based authentication
- ✅ Role-based access control middleware
- ✅ File upload validation (type & size)
- ✅ PAN format validation
- ✅ Age verification (23-50)
- ✅ Error handling middleware

## 📊 Dashboard Modules

### Sales Module
- Pre-application stage tracking
- Lead conversion metrics

### Sanction Module
- Applications pending review
- Approve/Reject with reason
- Status auto-updates

### Disbursement Module
- Sanctioned loans ready for disbursement
- Mark as disbursed (activates collection)

### Collection Module
- Active disbursed loans
- Record payments with UTR
- Automatic loan closure on full payment

## 🎬 Demo Credentials

### Borrower
- Email: `borrower@lms.com`
- Password: `password123`

### Executives (Auto-create or use):
- **Admin**: `admin@lms.com` | password: `password123`
- **Sales**: `sales@lms.com` | password: `password123`
- **Sanction**: `sanction@lms.com` | password: `password123`
- **Disbursement**: `disbursement@lms.com` | password: `password123`
- **Collection**: `collection@lms.com` | password: `password123`

## 📝 Example Usage Flow

1. **Borrower visits** → Home page
2. **Sign up** → Fill personal details (Step 1-2)
3. **Eligibility check** → Auto-validated by BRE
4. **Upload salary slip** → Step 3
5. **Configure loan** → Amount & tenure (Step 4)
6. **Submit application** → Loan created with PENDING status
7. **Status is PENDING** → Visible to Sales team
8. **Sanction executive** → Reviews and approves → Status: SANCTIONED
9. **Disbursement team** → Marks as disbursed → Status: DISBURSED
10. **Collection team** → Records payments → UTR tracking
11. **Full repayment** → Loan auto-closes → Status: CLOSED

## 🧪 Testing the System

### Test Eligibility Failure
- Age: Select DOB outside 23-50 range
- Salary: Enter < ₹25,000
- Employment: Select "Unemployed"
- PAN: Enter invalid format

### Test Loan Calculation
- Amount: ₹75,000
- Tenure: 180 days
- Expected SI: (75000 × 12 × 180) / (365 × 100) = ₹4,438
- Expected Total: ₹79,438

## 📦 Project Structure

```
lms-backend/
├── src/
│   ├── models/       (MongoDB schemas)
│   ├── routes/       (API routes)
│   ├── controllers/  (Business logic)
│   ├── middleware/   (Auth, upload, error handling)
│   ├── utils/        (Helpers, validators)
│   ├── config/       (Database config)
│   ├── types/        (TypeScript interfaces)
│   └── index.ts      (Express app)
├── uploads/          (Salary slips storage)
└── package.json

lms-frontend/
├── src/
│   ├── app/          (Next.js pages & layout)
│   ├── components/   (React components)
│   ├── context/      (Auth context)
│   ├── lib/          (API client)
│   ├── hooks/        (Custom hooks)
│   └── globals.css   (Tailwind styles)
└── package.json
```

## 🚨 Error Handling

All API endpoints return structured error responses:
```json
{
  "error": "Descriptive error message"
}
```

Examples:
- 400: Bad request (validation failed)
- 401: Unauthorized (missing/invalid token)
- 403: Forbidden (insufficient permissions)
- 404: Not found (resource doesn't exist)
- 500: Server error

## 🔄 Future Enhancements

- [ ] Email notifications
- [ ] SMS updates
- [ ] Payment gateway integration
- [ ] Document storage (S3/Azure Blob)
- [ ] Real-time notifications
- [ ] Advanced reporting & analytics
- [ ] Audit logging
- [ ] Two-factor authentication

## 📄 License

MIT License - Feel free to use for personal/educational purposes

## 👨‍💻 Author

Built as a complete full-stack learning project demonstrating:
- Modern web development best practices
- Full authentication & authorization
- Real-world business logic (BRE, loan calculations)
- Role-based access control
- File upload handling
- Database modeling

---

**Happy Lending! 🏦**
