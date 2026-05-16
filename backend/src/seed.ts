import mongoose from 'mongoose';
import { User } from './models/User';
import { Borrower } from './models/Borrower';
import dotenv from 'dotenv';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lms');
    console.log('MongoDB connected for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Borrower.deleteMany({});

    // Create demo users and borrowers
    const borrowerUser = new User({
      email: 'borrower@lms.com',
      password: 'password123',
      role: 'borrower',
    });
    await borrowerUser.save();

    const borrowerProfile = new Borrower({
      userId: borrowerUser._id,
      fullName: 'John Doe',
      pan: 'ABCDE1234F',
      dob: new Date('1995-05-15'),
      monthlySalary: 50000,
      employmentMode: 'Salaried',
    });
    await borrowerProfile.save();

    // Create executive users
    const roles = ['admin', 'sales', 'sanction', 'disbursement', 'collection'];
    for (const role of roles) {
      const user = new User({
        email: `${role}@lms.com`,
        password: 'password123',
        role,
      });
      await user.save();
      console.log(`Created ${role} user`);
    }

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
