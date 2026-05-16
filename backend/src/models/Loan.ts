import { Schema, model } from 'mongoose';
import { ILoan } from '../types';

const loanSchema = new Schema<ILoan>(
  {
    borrowerId: { type: Schema.Types.ObjectId, ref: 'Borrower', required: true },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'SANCTIONED', 'DISBURSED', 'CLOSED', 'REJECTED'],
      default: 'PENDING',
    },
    loanAmount: { type: Number, required: true, min: 50000, max: 100000 },
    tenure: { type: Number, required: true, min: 30, max: 365 },
    interestRate: { type: Number, default: 12 }, // 12% p.a.
    salarySlip: { type: String, required: true },
    simpleInterest: { type: Number, required: true },
    totalRepayment: { type: Number, required: true },
    sanctions: [
      {
        _id: Schema.Types.ObjectId,
        loanId: String,
        sanctionedBy: String,
        sanctionedDate: Date,
        status: { type: String, enum: ['approved', 'rejected'] },
        reason: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    disbursements: [
      {
        _id: Schema.Types.ObjectId,
        loanId: String,
        disbursedBy: String,
        disbursedDate: Date,
        amount: Number,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    collections: [
      {
        _id: Schema.Types.ObjectId,
        loanId: String,
        utrNumber: { type: String },
        amount: Number,
        paymentDate: Date,
        recordedBy: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const Loan = model<ILoan>('Loan', loanSchema);
