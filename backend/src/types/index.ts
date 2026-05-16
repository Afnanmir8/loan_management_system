export type UserRole = 'admin' | 'sales' | 'sanction' | 'disbursement' | 'collection' | 'borrower';

export type LoanStatus = 'PENDING' | 'APPROVED' | 'SANCTIONED' | 'DISBURSED' | 'CLOSED' | 'REJECTED';

export type EmploymentMode = 'Salaried' | 'Self-Employed' | 'Unemployed';

export interface IUser {
  _id?: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBorrower {
  _id?: string;
  userId: string;
  fullName: string;
  pan: string;
  dob: Date;
  monthlySalary: number;
  employmentMode: EmploymentMode;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ILoan {
  _id?: string;
  borrowerId: string;
  status: LoanStatus;
  loanAmount: number;
  tenure: number; // in days
  interestRate: number; // percentage
  salarySlip: string; // file path
  simpleInterest: number;
  totalRepayment: number;
  createdAt?: Date;
  updatedAt?: Date;
  sanctions?: ISanction[];
  disbursements?: IDisbursement[];
  collections?: ICollection[];
}

export interface ISanction {
  _id?: string;
  loanId: string;
  sanctionedBy: string;
  sanctionedDate: Date;
  status: 'approved' | 'rejected';
  reason?: string;
  createdAt?: Date;
}

export interface IDisbursement {
  _id?: string;
  loanId: string;
  disbursedBy: string;
  disbursedDate: Date;
  amount: number;
  createdAt?: Date;
}

export interface ICollection {
  _id?: string;
  loanId: string;
  utrNumber: string;
  amount: number;
  paymentDate: Date;
  recordedBy: string;
  createdAt?: Date;
}

export interface JwtPayload {
  userId: string;
  role: UserRole;
  email: string;
}

export interface AuthenticatedRequest extends Express.Request {
  user?: JwtPayload;
}
