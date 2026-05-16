# Loan Management System - Quick Start Guide

## Prerequisites
- Node.js 18+
- MongoDB (local: `mongod` or cloud: MongoDB Atlas)
- Git

## Quick Setup (5 minutes)

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
```
MONGODB_URI=mongodb://localhost:27017/lms
JWT_SECRET=super_secret_key_change_this
```

```bash
# Terminal 1: Start backend
npm run dev
```

### 2. Frontend Setup (new terminal)
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

### 3. Access Application
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Demo Flow

### As Borrower
1. Go to http://localhost:3000
2. Click "Sign Up"
3. Fill all details (use PAN: `ABCDE1234F`, Salary: `50000`)
4. Submit → Redirects to dashboard
5. Click "Apply for Loan"
6. Select amount (₹50K-₹1L) and tenure (30-365 days)
7. Upload any PDF/image as salary slip
8. Submit application

### As Executive
1. Go to http://localhost:3000 → Login
2. Select "Admin/Executive"
3. Choose role (Admin/Sales/Sanction/Disbursement/Collection)
4. Use: `admin@lms.com` password: `password123`
5. View dashboard based on role

## Seed Demo Data (Optional)
```bash
cd backend
npx ts-node src/seed.ts
```

Creates demo users:
- borrower@lms.com
- admin@lms.com
- sales@lms.com
- sanction@lms.com
- disbursement@lms.com
- collection@lms.com

All with password: `password123`

## Key URLs
- Home: http://localhost:3000
- Signup: http://localhost:3000/signup
- Login: http://localhost:3000/login
- Borrower Dashboard: http://localhost:3000/borrower
- Admin Dashboard: http://localhost:3000/admin
- Backend API: http://localhost:5000/api

## API Example
```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@lms.com",
    "password": "password123",
    "fullName": "Test User",
    "pan": "ABCDE1234F",
    "dob": "1995-05-15",
    "monthlySalary": 50000,
    "employmentMode": "Salaried"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@lms.com",
    "password": "password123"
  }'
```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check MONGODB_URI in `.env` (default: localhost:27017)

### CORS Error
- Ensure backend is running on port 5000
- Check NEXT_PUBLIC_API_URL in frontend `.env.local`

### Port Already in Use
- Backend (5000): `netstat -ano | findstr :5000` (Windows)
- Frontend (3000): Kill process or use different port

## Feature Testing

### Test BRE Eligibility Fail
- Age < 23 or > 50: Rejected
- Salary < 25,000: Rejected
- Employment = "Unemployed": Rejected

### Test Loan Calculation
- Amount: 75,000
- Tenure: 180 days
- SI = (75000 × 12 × 180) / (365 × 100) = 4,438
- Total = 79,438

## Project Structure
```
lms/
├── backend/          # Node.js API
│   ├── src/models    # DB schemas
│   ├── src/routes    # API routes
│   └── src/index.ts  # Server
├── frontend/         # Next.js App
│   ├── src/app       # Pages
│   └── src/context   # Auth
└── README.md         # Full docs
```

## Next Steps
1. Explore the codebase
2. Check README.md for complete documentation
3. Run seeder for demo data
4. Test complete borrower → admin flow
5. Check Backend/Frontend README for detailed API docs

## Need Help?
- Main Documentation: `README.md`
- Backend Docs: `backend/README.md`
- Frontend Docs: `frontend/README.md`
- Code Comments: Check source files

---

**Ready to build? Start with `npm run dev` in both directories!** 🚀
