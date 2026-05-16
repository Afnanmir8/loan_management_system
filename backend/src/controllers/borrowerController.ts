import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { Borrower } from '../models/Borrower';
import { Loan } from '../models/Loan';
import { calculateAge, calculateSimpleInterest, calculateTotalRepayment } from '../utils/helpers';

export const updateBorrowerProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { fullName, monthlySalary, employmentMode } = req.body;

    const borrower = await Borrower.findOneAndUpdate(
      { userId: req.user.userId },
      { fullName, monthlySalary, employmentMode },
      { new: true }
    );

    if (!borrower) {
      return res.status(404).json({ error: 'Borrower profile not found' });
    }

    res.json({ borrower });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const checkEligibility = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const borrower = await Borrower.findOne({ userId: req.user.userId });
    if (!borrower) {
      return res.status(404).json({ error: 'Borrower profile not found' });
    }

    // BRE Rules
    const age = calculateAge(borrower.dob);
    const errors = [];

    if (age < 23 || age > 50) {
      errors.push('Age must be between 23 and 50');
    }

    if (borrower.monthlySalary < 25000) {
      errors.push('Monthly salary must be at least 25,000');
    }

    if (borrower.employmentMode === 'Unemployed') {
      errors.push('Cannot be unemployed to apply for a loan');
    }

    if (errors.length > 0) {
      return res.status(400).json({ eligible: false, errors });
    }

    res.json({ eligible: true, message: 'You are eligible for a loan' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getLoanApplications = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const borrower = await Borrower.findOne({ userId: req.user.userId });
    if (!borrower) {
      return res.status(404).json({ error: 'Borrower profile not found' });
    }

    const loans = await Loan.find({ borrowerId: borrower._id });
    res.json({ loans });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getLoanById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const loan = await Loan.findById(req.params.id);
    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    res.json({ loan });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
