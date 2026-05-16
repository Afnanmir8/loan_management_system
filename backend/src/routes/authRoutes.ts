import { Router } from 'express';
import { signup, login, loginAdmin, getProfile } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/login-admin', loginAdmin);
router.get('/profile', authenticateToken, getProfile);

export default router;
