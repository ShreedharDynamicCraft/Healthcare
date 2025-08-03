# Vercel Deployment Guide for NestJS Healthcare App

## Fixed Issues

✅ **Fixed `vercel.json` schema validation error**: Changed `includeFiles` from array to string pattern
✅ **Optimized build configuration**: Updated package.json scripts for better Vercel compatibility
✅ **Added deployment optimization files**: Created `.vercelignore` and `.env.example`

## Deployment Steps

### 1. Environment Variables Setup

In your Vercel dashboard, add these environment variables:

**Required:**
```
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
```

**Optional (for database):**
```
DATABASE_URL=postgresql://username:password@host:port/database
CORS_ORIGIN=https://your-frontend-domain.vercel.app
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### 2. Database Options

Your app is configured to work with:
- **PostgreSQL** (recommended for production) - provide `DATABASE_URL`
- **SQLite** (fallback) - no DATABASE_URL needed, but limited for serverless

For production, consider using:
- [Supabase](https://supabase.com) (free tier available)
- [Neon](https://neon.tech) (serverless PostgreSQL)
- [Railway](https://railway.app) (PostgreSQL hosting)
- [PlanetScale](https://planetscale.com) (MySQL alternative)

### 3. Deploy to Vercel

Option A: **Via Git Integration** (Recommended)
1. Push your code to GitHub/GitLab/Bitbucket
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

Option B: **Via Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from backend directory
cd backend
vercel

# Set environment variables
vercel env add JWT_SECRET
vercel env add NODE_ENV
# Add other variables as needed

# Deploy
vercel --prod
```

### 4. Frontend Configuration

Update your frontend's API URL to point to the deployed backend:

In `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=https://your-backend-domain.vercel.app
```

## Key Features of Your App

- 🔐 **JWT Authentication** with default admin user
- 👥 **User & Doctor Management**
- 📅 **Appointment Scheduling**
- 📋 **Queue Management System**
- 📊 **Swagger API Documentation** at `/api/docs`
- 🏥 **Health Check** endpoint at `/api/v1/health`

## Default Credentials

After deployment, you can use these default admin credentials:
- **Email:** admin@clinic.com
- **Password:** AdminPass123!

## API Documentation

Once deployed, your API documentation will be available at:
`https://your-domain.vercel.app/api/docs`

## Troubleshooting

### Build Fails
1. Check environment variables are set
2. Ensure all dependencies are in `package.json`
3. Check Vercel build logs for specific errors

### Database Connection Issues
1. Verify `DATABASE_URL` is correctly formatted
2. Ensure database allows connections from Vercel IPs
3. Check SSL settings if using PostgreSQL

### CORS Issues
1. Update `CORS_ORIGIN` environment variable
2. Ensure frontend domain is included in CORS settings

## Performance Optimization

The app is configured with:
- ⚡ **Function timeout**: 30 seconds
- 🗜️ **Optimized builds**: Only includes necessary files
- 🔄 **Background processes**: Optimized for serverless
- 📦 **Compression**: Enabled for responses

## Next Steps

1. Set up database (if using PostgreSQL)
2. Configure environment variables in Vercel
3. Deploy and test all endpoints
4. Update frontend to use deployed API
5. Test authentication and core features

Your NestJS application is now ready for Vercel deployment! 🚀
