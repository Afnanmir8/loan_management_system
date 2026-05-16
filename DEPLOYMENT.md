# Loan Management System - Deployment Guide

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] MongoDB connection tested
- [ ] Backend build successful
- [ ] Frontend build successful
- [ ] All tests passing
- [ ] Security review completed
- [ ] API endpoints verified

## Deployment Options

### Option 1: Self-Hosted (VPS/Dedicated Server)

#### Backend Deployment
```bash
# SSH into server
ssh user@your-server.com

# Clone repository
git clone <your-repo-url>
cd lms/backend

# Install dependencies
npm install

# Create .env file with production values
nano .env

# Example production .env:
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/lms
JWT_SECRET=your-very-long-random-secret-key
JWT_EXPIRY=7d
NODE_ENV=production
BCRYPT_ROUNDS=10

# Build and start with PM2
npm install -g pm2
npm run build
pm2 start dist/index.js --name "lms-backend"
pm2 startup
pm2 save
```

#### Frontend Deployment
```bash
# In frontend directory
npm install
npm run build

# Deploy dist/out folder to web server or use Vercel
```

### Option 2: Docker Deployment

#### Create Docker Image (Backend)
```dockerfile
# Dockerfile in backend/
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
```

#### Build and Run
```bash
docker build -t lms-backend .
docker run -p 5000:5000 --env-file .env lms-backend
```

### Option 3: Cloud Platforms

#### Vercel (Frontend - Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel

# Follow prompts and configure environment variables
```

#### Heroku (Backend)
```bash
# Install Heroku CLI
npm install -g heroku

# Login and create app
heroku login
heroku create your-lms-api

# Set environment variables
heroku config:set MONGODB_URI=mongodb+srv://...
heroku config:set JWT_SECRET=your-secret

# Deploy
git push heroku main
```

#### AWS / Azure / DigitalOcean
- Use Docker for containerization
- Deploy to App Service, Lambda, or Compute Engine
- Configure MongoDB Atlas for database
- Use CloudFront / CDN for frontend

## Environment Configuration

### Production .env (Backend)
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lms
JWT_SECRET=a_very_long_random_string_at_least_32_chars
JWT_EXPIRY=7d
NODE_ENV=production
BCRYPT_ROUNDS=10
CORS_ORIGIN=https://yourdomain.com
```

### Production .env.local (Frontend)
```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

## Database Setup

### MongoDB Atlas Setup
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create cluster
3. Create database user
4. Get connection string
5. Update MONGODB_URI in backend .env

## SSL/TLS Configuration

### Using Let's Encrypt with Nginx
```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --nginx -d yourdomain.com

# Auto-renewal
sudo systemctl enable certbot.timer
```

## Performance Optimization

### Backend
- Enable compression middleware
- Implement caching
- Use connection pooling
- Add rate limiting

### Frontend
- Build with `npm run build`
- Use Next.js Image optimization
- Enable static generation where possible
- Configure CDN

## Monitoring & Logging

### Backend Logging
Add logging middleware:
```typescript
import morgan from 'morgan';
app.use(morgan('combined'));
```

### PM2 Monitoring
```bash
pm2 logs lms-backend
pm2 monit
```

### Database Monitoring
- MongoDB Atlas provides built-in monitoring
- Set up alerts for high CPU/memory

## Security Hardening

### Backend Security
```typescript
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);
```

### SSL Certificate
- Always use HTTPS in production
- Use strong cipher suites
- Enable HSTS

### API Security
- Validate all inputs
- Sanitize outputs
- Use parameterized queries
- Implement CSRF protection

## Backup & Recovery

### Database Backup
```bash
# Backup MongoDB Atlas collection
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/lms"

# Restore backup
mongorestore --uri="mongodb+srv://user:pass@cluster.mongodb.net/lms" dump/
```

### File Backup
- Backup salary slips regularly
- Use cloud storage (S3, Azure Blob)
- Implement retention policy

## Scaling Considerations

### Horizontal Scaling
- Use load balancer (Nginx, HAProxy)
- Run multiple backend instances
- Use container orchestration (Kubernetes)

### Database Scaling
- Use MongoDB sharding for large datasets
- Implement read replicas
- Optimize indexes

### Caching Layer
- Add Redis for session storage
- Cache frequently accessed data
- Implement cache invalidation

## CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm test
      - name: Deploy
        run: npm run deploy
```

## Rollback Procedure

1. Keep previous version built
2. Use PM2 for quick restart
3. Database migration support (keep schema versions)
4. Git tags for releases

## Post-Deployment Testing

- [ ] API health check
- [ ] Database connectivity
- [ ] Authentication flow
- [ ] File upload functionality
- [ ] Role-based access
- [ ] Loan calculation accuracy
- [ ] Payment recording
- [ ] Email notifications (if enabled)

## Maintenance Schedule

- Weekly: Check logs and errors
- Monthly: Database optimization
- Quarterly: Security audit
- Annually: Performance review

## Support Contacts

- Backend Error Logs: PM2 logs or CloudWatch
- Database: MongoDB Atlas support
- Frontend: Browser console / Vercel logs

---

**For production deployment, consult with DevOps team and security experts.**
