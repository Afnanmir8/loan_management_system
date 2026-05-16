<!-- GitHub Copilot Instructions for LMS Project -->

# Loan Management System (LMS) - Project Guidelines

This is a full-stack loan management platform built with Next.js, Node.js/Express, TypeScript, MongoDB, and Tailwind CSS.

## Project Structure

```
lms/
├── backend/              # Node.js + Express API
│   ├── src/
│   │   ├── models/       # MongoDB schemas
│   │   ├── routes/       # API routes
│   │   ├── controllers/  # Business logic
│   │   ├── middleware/   # Auth, upload, errors
│   │   ├── utils/        # Helpers, validators
│   │   ├── config/       # Database config
│   │   ├── types/        # TypeScript interfaces
│   │   └── index.ts      # Express server
│   ├── uploads/          # Salary slip storage
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── frontend/             # Next.js 14 application
│   ├── src/
│   │   ├── app/          # Pages & layout
│   │   ├── components/   # React components
│   │   ├── context/      # Auth context
│   │   ├── lib/          # API client
│   │   ├── hooks/        # Custom hooks
│   │   └── globals.css   # Tailwind styles
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
└── README.md             # Main project documentation
```

## Tech Stack

- **Backend**: Node.js, Express, TypeScript, MongoDB, Mongoose, JWT, bcryptjs
- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS, Axios
- **Authentication**: JWT + bcryptjs
- **File Upload**: Multer
- **State Management**: React Context API

## Getting Started

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Configure MONGODB_URI and JWT_SECRET in .env
npm run dev
```

Backend: `http://localhost:5000`

### Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Frontend: `http://localhost:3000`

## Key Features

1. **Borrower Portal**
   - Multi-step loan application (4 steps)
   - Real-time eligibility check with BRE
   - Salary slip upload (PDF/JPG/PNG)
   - Loan configuration with live interest calculation
   - Application status tracking

2. **Operations Dashboard** (Role-based)
   - Sales Module: Pre-application tracking
   - Sanction Module: Approve/Reject applications
   - Disbursement Module: Process disbursements
   - Collection Module: Record payments
   - Admin Dashboard: System overview

3. **Security**
   - Password hashing with bcryptjs
   - JWT token authentication
   - Role-based access control (6 roles)
   - File upload validation
   - PAN & age validation

## API Structure

### Authentication
- `POST /api/auth/signup` - Borrower registration
- `POST /api/auth/login` - Borrower login
- `POST /api/auth/login-admin` - Executive login

### Borrower Operations
- `GET /api/borrower/check-eligibility` - BRE check
- `PUT /api/borrower/profile` - Update profile
- `GET /api/borrower/applications` - Get loans

### Loan Management
- `POST /api/loan/apply` - Submit application
- `GET /api/loan/sales/loans` - Sales module
- `POST /api/loan/sanction` - Approve/Reject
- `POST /api/loan/disburse` - Disbursement
- `POST /api/loan/collect/payment` - Record payment

## Database Collections

1. **Users**: Authentication & roles
2. **Borrowers**: Borrower profiles & details
3. **Loans**: Applications with all related data

## Important Business Rules

### Eligibility Check (BRE)
- Age: 23-50 years
- Salary: Min ₹25,000/month
- Employment: NOT Unemployed
- PAN: Valid format (ABCDE1234F)

### Loan Configuration
- Amount: ₹50,000 - ₹1,00,000
- Tenure: 30 - 365 days
- Interest: Fixed 12% p.a.
- Formula: SI = (P × R × T) / (365 × 100)

### Loan Status Flow
```
PENDING → APPROVED/SANCTIONED/REJECTED
SANCTIONED → DISBURSED
DISBURSED → CLOSED (on full payment)
```

## Development Guidelines

### Code Standards
- Use TypeScript for type safety
- Follow REST conventions for APIs
- Use meaningful variable names
- Add comments for complex logic
- Handle errors gracefully

### Middleware & Security
- All routes (except auth) require JWT authentication
- Role-based authorization on protected routes
- File uploads validated for type & size
- Error handling middleware catches all errors
- CORS enabled for frontend

### File Structure
- Controllers handle business logic
- Models define database schemas
- Routes map endpoints to controllers
- Middleware handles cross-cutting concerns
- Utils contain helper functions

## Demo Credentials

### Borrower
- Email: `borrower@lms.com`
- Password: `password123`

### Executives (All roles)
- `admin@lms.com` → Admin role
- `sales@lms.com` → Sales role
- `sanction@lms.com` → Sanction role
- `disbursement@lms.com` → Disbursement role
- `collection@lms.com` → Collection role
- Password: `password123` (all)

## Testing

1. **Eligibility Check**
   - Use age < 23 or > 50 to test failure
   - Use salary < 25000 to test failure
   - Select "Unemployed" to test failure

2. **Loan Calculation**
   - Test with different amounts and tenures
   - Verify formula: SI = (75000 × 12 × 180) / (365 × 100) ≈ ₹4,438

3. **Complete Flow**
   - Borrow → Apply → Sanction → Disburse → Collect → Close

## Common Tasks

### Adding a New Endpoint
1. Create route handler in controllers/
2. Add route in routes/
3. Mount route in index.ts
4. Add corresponding API function in frontend lib/api.ts

### Modifying Database Schema
1. Update model in models/
2. Create migration if needed
3. Update TypeScript types/interfaces

### Changing Validation Rules
1. Update BRE logic in controllers/borrowerController.ts
2. Update validation helpers in utils/helpers.ts
3. Update frontend validation if needed

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/lms
JWT_SECRET=your_secret_key
JWT_EXPIRY=7d
NODE_ENV=development
BCRYPT_ROUNDS=10
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Useful Commands

```bash
# Backend
npm run dev          # Start dev server with hot reload
npm run build        # Build TypeScript
npm start            # Run production build

# Frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run lint         # Run ESLint

# Database
npx ts-node src/seed.ts  # Seed demo data
```

## Documentation

- Main README: Comprehensive project overview
- Backend README: API documentation & setup
- Frontend README: Pages, components, auth flow
- Code comments: Complex logic explanation

## Support

For detailed information, refer to:
1. `/README.md` - Project overview
2. `/backend/README.md` - Backend API details
3. `/frontend/README.md` - Frontend structure
4. Code comments in source files
