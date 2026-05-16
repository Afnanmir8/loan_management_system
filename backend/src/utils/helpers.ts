import jwt, { SignOptions } from 'jsonwebtoken';
import { JwtPayload } from '../types';

export const generateToken = (payload: JwtPayload): string => {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRY || '7d') as SignOptions['expiresIn'],
  };

  return jwt.sign(payload, process.env.JWT_SECRET || 'secret', {
    ...options,
  });
};

export const calculateSimpleInterest = (
  principal: number,
  rate: number,
  tenure: number
): number => {
  return (principal * rate * tenure) / (365 * 100);
};

export const calculateTotalRepayment = (principal: number, interest: number): number => {
  return principal + interest;
};

export const validatePAN = (pan: string): boolean => {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan);
};

export const calculateAge = (dob: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
};
