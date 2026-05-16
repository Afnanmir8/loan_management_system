import { Schema, model } from 'mongoose';
import { IBorrower } from '../types';

const borrowerSchema = new Schema<IBorrower>(
  {
    userId: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    pan: { type: String, required: true, unique: true, match: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/ },
    dob: { type: Date, required: true },
    monthlySalary: { type: Number, required: true, min: 25000 },
    employmentMode: {
      type: String,
      enum: ['Salaried', 'Self-Employed', 'Unemployed'],
      required: true,
    },
  },
  { timestamps: true }
);

export const Borrower = model<IBorrower>('Borrower', borrowerSchema);
