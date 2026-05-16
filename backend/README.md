# LMS Backend

Node.js + Express + TypeScript backend for the Loan Management System.

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env`:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/lms
   JWT_SECRET=your_super_secret_key_change_this
   JWT_EXPIRY=7d
   NODE_ENV=development
   BCRYPT_ROUNDS=10
   ```

3. **Start MongoDB**
   ```bash
   mongod
   ```

4. **Seed demo data** (optional)
   ```bash
   npx ts-node src/seed.ts
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

Server runs on `http://localhost:5000`

## API Documentation

### Authentication Endpoints

#### POST /api/auth/signup
Register a new borrower
```json
{
  "email": "borrower@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "pan": "ABCDE1234F",
  "dob": "1995-05-15",
  "monthlySalary": 50000,
  "employmentMode": "Salaried"
}
```

#### POST /api/auth/login
Login as borrower
```json
{
  "email": "borrower@example.com",
  "password": "password123"
}
```

#### POST /api/auth/login-admin
Login as executive
```json
{
  "email": "admin@lms.com",
  "password": "password123",
  "role": "admin"
}
```

### Borrower Endpoints

All require `Authorization: Bearer <token>` header

#### GET /api/borrower/check-eligibility
Check if borrower meets BRE requirements

#### PUT /api/borrower/profile
Update borrower profile
```json
{
  "fullName": "Jane Doe",
  "monthlySalary": 60000,
  "employmentMode": "Self-Employed"
}
```

#### GET /api/borrower/applications
Get all loan applications

#### GET /api/borrower/applications/:id
Get specific loan details

### Loan Endpoints

#### POST /api/loan/apply (multipart/form-data)
Apply for loan
```
loanAmount: 75000
tenure: 180
salarySlip: <file>
```

#### GET /api/loan/sales/loans
Get pending loans (Sales role)

#### POST /api/loan/sanction
Approve/Reject loan (Sanction role)
```json
{
  "loanId": "loan_id",
  "approved": true,
  "reason": "optional reason if rejecting"
}
```

#### POST /api/loan/disburse
Disburse sanctioned loan (Disbursement role)
```json
{
  "loanId": "loan_id"
}
```

#### POST /api/loan/collect/payment
Record payment (Collection role)
```json
{
  "loanId": "loan_id",
  "utrNumber": "UTR123456789",
  "amount": 50000,
  "paymentDate": "2024-01-15"
}
```

#### GET /api/loan/dashboard
Get role-specific dashboard data

## Validation Rules

### Personal Details
- **PAN**: Format `ABCDE1234F` (5 letters, 4 digits, 1 letter)
- **Age**: 23-50 years (calculated from DOB)
- **Salary**: Minimum ₹25,000/month
- **Employment**: Cannot be Unemployed

### Loan Configuration
- **Amount**: ₹50,000 - ₹1,00,000
- **Tenure**: 30 - 365 days
- **Interest Rate**: Fixed 12% p.a.
- **Salary Slip**: PDF/JPG/PNG, max 5MB

### Calculation Formula
```
Simple Interest = (P × R × T) / (365 × 100)
Where:
  P = Principal (loan amount)
  R = Rate (12%)
  T = Tenure (in days)
  
Total Repayment = P + SI
```

## Status Flow

```
Application submitted
       ↓
PENDING (awaiting sanction)
       ↓
APPROVED/SANCTIONED/REJECTED
       ↓
If SANCTIONED:
  DISBURSED (awaiting collection)
       ↓
CLOSED (after full payment)
```

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad request (validation failed) |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not found (resource doesn't exist) |
| 500 | Server error |

## Development

- **Language**: TypeScript
- **Linter**: ESLint (recommended)
- **Testing**: Jest (recommended)

## Production Deployment

1. Build TypeScript
   ```bash
   npm run build
   ```

2. Start production server
   ```bash
   npm start
   ```

Environment-specific `.env` must be set up with secure JWT_SECRET and database credentials.
