import { Router } from 'express';
import {
  createLoan,
  getSalesLoans,
  getSanctionedLoans,
  getDisbursedLoans,
  sanctionLoan,
  disburseLoan,
  recordPayment,
  getDashboardData,
} from '../controllers/loanController';
import { authenticateToken, authorizeRole } from '../middleware/auth';
import { uploadSalarySlip } from '../middleware/upload';

const router = Router();

// Borrower routes
router.post('/apply', authenticateToken, authorizeRole('borrower'), uploadSalarySlip.single('salarySlip'), createLoan);

// Sales + sanction modules (both need pending applications)
router.get('/sales/loans', authenticateToken, authorizeRole('sales', 'sanction'), getSalesLoans);

// Sanction module
router.post('/sanction', authenticateToken, authorizeRole('sanction'), sanctionLoan);

// Disbursement module
router.get('/sanctioned/loans', authenticateToken, authorizeRole('disbursement'), getSanctionedLoans);
router.post('/disburse', authenticateToken, authorizeRole('disbursement'), disburseLoan);

// Collection module
router.get('/disbursed/loans', authenticateToken, authorizeRole('collection'), getDisbursedLoans);
router.post('/collect/payment', authenticateToken, authorizeRole('collection'), recordPayment);

// Dashboard
router.get('/dashboard', authenticateToken, getDashboardData);

export default router;
