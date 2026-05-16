# LMS Frontend

Next.js 14 + TypeScript + Tailwind CSS frontend for the Loan Management System.

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

Frontend runs on `http://localhost:3000`

## Pages & Routes

### Public Pages
- `/` - Home page with overview
- `/signup` - Borrower registration
- `/login` - Login for borrowers and executives

### Borrower Portal
- `/borrower` - Dashboard with applications and apply form
  - View loan applications
  - Check eligibility
  - Apply for new loan with calculation preview

### Admin Dashboard
- `/admin` - Executive dashboard (role-based)
  - **Admin**: System overview with all metrics
  - **Sales**: Lead tracking module
  - **Sanction**: Application review & approval
  - **Disbursement**: Process disbursements
  - **Collection**: Payment recording

## Components

### Navbar
- Responsive navigation
- User authentication status
- Role-based menu items

### Auth Context
- Centralized authentication state
- Token management
- User profile storage
- Auto-logout on token expiry

## Features

### Borrower Portal
1. **Step 1**: Sign up with email/password
2. **Step 2**: Personal details (PAN, DOB, Salary)
3. **Step 3**: Upload salary slip
4. **Step 4**: Configure & apply for loan
   - Live SI calculation
   - Amount slider (₹50K-₹1L)
   - Tenure slider (30-365 days)

### Dashboard Modules
- Sales: Pre-application tracking
- Sanction: Approve/Reject with reasons
- Disbursement: Process sanctioned loans
- Collection: Record payments with UTR
- Admin: Overview of all statuses

## Styling

- **Framework**: Tailwind CSS
- **Components**: Custom React components
- **Colors**: Blue primary (#3B82F6), Green secondary (#10B981)
- **Responsive**: Mobile-first design

## API Integration

### Authentication
```typescript
// Login
const { token, user } = await authAPI.login({ email, password });

// Signup
const { token, user } = await authAPI.signup(formData);

// Auto-login for executives
const { token, user } = await authAPI.loginAdmin({ 
  email, 
  password, 
  role 
});
```

### Borrower Operations
```typescript
// Check eligibility
await borrowerAPI.checkEligibility();

// Get applications
const { loans } = await borrowerAPI.getLoanApplications();

// Apply for loan
const formData = new FormData();
formData.append('loanAmount', amount);
formData.append('tenure', days);
formData.append('salarySlip', file);
await loanAPI.createLoan(formData);
```

### Executive Operations
```typescript
// Get pending loans (sales)
await loanAPI.getSalesLoans();

// Sanction loan
await loanAPI.sanctionLoan({ 
  loanId, 
  approved: true, 
  reason: "" 
});

// Disburse loan
await loanAPI.disburseLoan({ loanId });

// Record payment
await loanAPI.recordPayment({ 
  loanId, 
  utrNumber, 
  amount, 
  paymentDate 
});
```

## Authentication Flow

1. **Signup**
   - Enter credentials + personal details
   - Account created in DB
   - JWT token issued
   - Redirects to borrower dashboard

2. **Login**
   - Select user type (Borrower/Executive)
   - Enter credentials
   - JWT token stored in localStorage
   - Redirects to appropriate dashboard

3. **Protected Routes**
   - All API calls include `Authorization: Bearer <token>`
   - Invalid/expired tokens return 401
   - Middleware redirects to login

4. **Logout**
   - Token cleared from localStorage
   - Context state reset
   - Redirects to home page

## State Management

**AuthContext** manages:
- Current user (id, email, role)
- JWT token
- Loading state
- Auth functions (login, signup, logout)

Usage:
```typescript
const { user, token, login, logout } = useAuth();
```

## Build & Deployment

### Development Build
```bash
npm run build
npm start
```

### Production Considerations
- Update `NEXT_PUBLIC_API_URL` to production backend
- Enable CORS on backend for frontend domain
- Use environment-specific `.env` files
- Implement secure cookie storage for tokens

## Demo Credentials

### Borrower
- Email: `borrower@lms.com`
- Password: `password123`

### Executives
- Admin: `admin@lms.com`
- Sales: `sales@lms.com`
- Sanction: `sanction@lms.com`
- Disbursement: `disbursement@lms.com`
- Collection: `collection@lms.com`
- Password: `password123` (all)

## Troubleshooting

### CORS Errors
- Ensure backend CORS is configured correctly
- Check `NEXT_PUBLIC_API_URL` matches backend origin
- Verify backend is running on correct port

### Token Expiry
- Default: 7 days
- Check JWT_EXPIRY in backend `.env`
- Handle token refresh if needed

### File Upload Issues
- Only PDF, JPG, PNG allowed
- Max 5MB file size
- Ensure uploads directory exists on server
