import { Router } from 'express';
import {
  updateBorrowerProfile,
  checkEligibility,
  getLoanApplications,
  getLoanById,
} from '../controllers/borrowerController';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);
router.use(authorizeRole('borrower'));

router.put('/profile', updateBorrowerProfile);
router.get('/check-eligibility', checkEligibility);
router.get('/applications', getLoanApplications);
router.get('/applications/:id', getLoanById);

export default router;
