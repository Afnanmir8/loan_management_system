# Loan Management System - Environment Configuration

## Backend Configuration (.env)
Example environment file for backend setup.

### Database
MONGODB_URI=mongodb://localhost:27017/lms
- Local: mongodb://localhost:27017/lms
- Atlas: mongodb+srv://user:password@cluster.mongodb.net/lms

### Authentication
JWT_SECRET=your_super_secret_key_change_this_in_production
JWT_EXPIRY=7d

### Server
PORT=5000
NODE_ENV=development

### Security
BCRYPT_ROUNDS=10

## Frontend Configuration (.env.local)
Example environment file for frontend setup.

### API
NEXT_PUBLIC_API_URL=http://localhost:5000/api
- Development: http://localhost:5000/api
- Production: https://api.yourdomain.com/api

## Docker Setup (Optional)
Start MongoDB using Docker Compose:

docker-compose up -d

This starts MongoDB on localhost:27017 automatically.

## Important Notes

1. **JWT_SECRET**: Change to a long random string in production
2. **MONGODB_URI**: Update for production database
3. **NODE_ENV**: Set to "production" for production builds
4. **NEXT_PUBLIC_API_URL**: Must point to actual backend URL
5. Keep .env and .env.local files PRIVATE (add to .gitignore)
