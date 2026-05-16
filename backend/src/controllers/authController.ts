import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { User } from '../models/User';
import { Borrower } from '../models/Borrower';
import { generateToken } from '../utils/helpers';

export const signup = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      email,
      password,
      fullName,
      pan,
      dob,
      monthlySalary,
      employmentMode,
      role = 'borrower',
    } = req.body;

    const allowedRoles = ['borrower', 'admin', 'sales', 'sanction', 'disbursement', 'collection'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create user
    const user = new User({ email, password, role });
    await user.save();

    if (role === 'borrower') {
      // Create borrower profile only for borrower accounts
      const borrower = new Borrower({
        userId: user._id,
        fullName,
        pan,
        dob,
        monthlySalary,
        employmentMode,
      });
      await borrower.save();
    }

    const token = generateToken({ userId: user._id!.toString(), email, role });
    res.status(201).json({ token, user: { id: user._id, email, role: user.role } });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await (user as any).matchPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken({
      userId: user._id!.toString(),
      email: user.email,
      role: user.role,
    });
    res.json({ token, user: { id: user._id, email: user.email, role: user.role } });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const loginAdmin = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { email, password, role } = req.body;

    if (!['admin', 'sales', 'sanction', 'disbursement', 'collection'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const user = await User.findOne({ email, role });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials for this role' });
    }

    const isPasswordValid = await (user as any).matchPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken({
      userId: user._id!.toString(),
      email: user.email,
      role: user.role,
    });
    res.json({ token, user: { id: user._id, email: user.email, role: user.role } });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.role === 'borrower') {
      const borrower = await Borrower.findOne({ userId: req.user.userId });
      return res.json({ user: { ...user.toObject(), borrowerProfile: borrower } });
    }

    res.json({ user });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
