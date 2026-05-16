import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { Loan } from '../models/Loan';
import { Borrower } from '../models/Borrower';
import { calculateSimpleInterest, calculateTotalRepayment } from '../utils/helpers';

export const createLoan = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const loanAmount = Number(req.body.loanAmount);
    const tenure = Number(req.body.tenure);
    const salarySlipPath = req.file?.path;

    if (!salarySlipPath) {
      return res.status(400).json({ error: 'Salary slip is required' });
    }

    if (Number.isNaN(loanAmount) || Number.isNaN(tenure)) {
      return res.status(400).json({ error: 'Loan amount and tenure must be valid numbers' });
    }

    const borrower = await Borrower.findOne({ userId: req.user.userId });
    if (!borrower) {
      return res.status(404).json({ error: 'Borrower profile not found' });
    }

    // Validate loan amount and tenure
    if (loanAmount < 50000 || loanAmount > 100000) {
      return res.status(400).json({ error: 'Loan amount must be between 50,000 and 1,00,000' });
    }

    if (tenure < 30 || tenure > 365) {
      return res.status(400).json({ error: 'Tenure must be between 30 and 365 days' });
    }

    // Calculate SI and Total Repayment
    const interestRate = 12; // 12% p.a.
    const simpleInterest = calculateSimpleInterest(loanAmount, interestRate, tenure);
    const totalRepayment = calculateTotalRepayment(loanAmount, simpleInterest);

    const loan = new Loan({
      borrowerId: borrower._id,
      loanAmount,
      tenure,
      interestRate,
      salarySlip: salarySlipPath,
      simpleInterest,
      totalRepayment,
      status: 'PENDING',
    });

    await loan.save();
    res.status(201).json({ loan });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getSalesLoans = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const loans = await Loan.find({ status: 'PENDING' }).populate('borrowerId');
    res.json({ loans });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getSanctionedLoans = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const loans = await Loan.find({ status: 'SANCTIONED' }).populate('borrowerId');
    res.json({ loans });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getDisbursedLoans = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const loans = await Loan.find({ status: 'DISBURSED' }).populate('borrowerId');
    res.json({ loans });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const sanctionLoan = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { loanId, approved, reason } = req.body;

    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    if (loan.status !== 'PENDING' && loan.status !== 'APPROVED') {
      return res.status(400).json({ error: 'Loan cannot be sanctioned in current status' });
    }

    const sanctionRecord = {
      _id: undefined,
      loanId,
      sanctionedBy: req.user.userId,
      sanctionedDate: new Date(),
      status: approved ? 'approved' : 'rejected',
      reason: reason || undefined,
      createdAt: new Date(),
    };

    if (!loan.sanctions) loan.sanctions = [];
    loan.sanctions.push(sanctionRecord as any);

    if (approved) {
      loan.status = 'SANCTIONED';
    } else {
      loan.status = 'REJECTED';
    }

    await loan.save();
    res.json({ loan });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const disburseLoan = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { loanId } = req.body;

    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    if (loan.status !== 'SANCTIONED') {
      return res.status(400).json({ error: 'Only sanctioned loans can be disbursed' });
    }

    const disbursement = {
      _id: undefined,
      loanId,
      disbursedBy: req.user.userId,
      disbursedDate: new Date(),
      amount: loan.loanAmount,
      createdAt: new Date(),
    };

    if (!loan.disbursements) loan.disbursements = [];
    loan.disbursements.push(disbursement as any);

    loan.status = 'DISBURSED';
    await loan.save();

    res.json({ loan });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const recordPayment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { loanId, utrNumber, amount, paymentDate } = req.body;

    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    if (loan.status !== 'DISBURSED') {
      return res.status(400).json({ error: 'Payments can only be recorded for disbursed loans' });
    }

    // Check for duplicate UTR globally across loans
    if (utrNumber) {
      const existing = await Loan.findOne({ 'collections.utrNumber': utrNumber });
      if (existing && existing._id.toString() !== loanId) {
        return res.status(400).json({ error: 'UTR number already exists' });
      }
      // Also check within the same loan (redundant but explicit)
      if (loan.collections?.some(c => c.utrNumber === utrNumber)) {
        return res.status(400).json({ error: 'UTR number already exists' });
      }
    }

    const collection = {
      _id: undefined,
      loanId,
      utrNumber,
      amount,
      paymentDate: new Date(paymentDate),
      recordedBy: req.user.userId,
      createdAt: new Date(),
    };

    if (!loan.collections) loan.collections = [];
    loan.collections.push(collection as any);

    // Calculate total paid
    const totalPaid = loan.collections.reduce((sum, c) => sum + c.amount, 0);

    // Auto-close if fully paid
    if (totalPaid >= loan.totalRepayment) {
      loan.status = 'CLOSED';
    }

    await loan.save();
    res.json({ loan, totalPaid, remainingBalance: Math.max(0, loan.totalRepayment - totalPaid) });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getDashboardData = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const role = req.user.role;

    let data: any = {};

    if (role === 'sales') {
      data = await Loan.find({ status: 'PENDING' })
        .populate('borrowerId')
        .countDocuments()
        .then(count => ({ pendingLoans: count }));
    } else if (role === 'sanction') {
      data = await Loan.find({ status: { $in: ['PENDING', 'APPROVED'] } })
        .populate('borrowerId')
        .then(loans => ({ applicationsToReview: loans.length }));
    } else if (role === 'disbursement') {
      data = await Loan.find({ status: 'SANCTIONED' })
        .populate('borrowerId')
        .then(loans => ({ loansToDisbursed: loans.length }));
    } else if (role === 'collection') {
      data = await Loan.find({ status: 'DISBURSED' })
        .populate('borrowerId')
        .then(loans => ({ activeLoans: loans.length }));
    } else if (role === 'admin') {
      const pending = await Loan.countDocuments({ status: 'PENDING' });
      const sanctioned = await Loan.countDocuments({ status: 'SANCTIONED' });
      const disbursed = await Loan.countDocuments({ status: 'DISBURSED' });
      const closed = await Loan.countDocuments({ status: 'CLOSED' });
      data = { pending, sanctioned, disbursed, closed };
    }

    res.json(data);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
