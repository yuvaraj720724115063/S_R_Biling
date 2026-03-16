# S.R. Cycle & Auto Spares - Complete Setup Guide

## Quick Start (5 Minutes)

### Step 1: Prerequisites Check
Ensure you have:
- ✅ Node.js 18 or higher (`node -v`)
- ✅ PostgreSQL installed and running
- ✅ A database created (e.g., `srcycle`)

### Step 2: Database Setup

#### Option A: Using PostgreSQL locally

1. Create database:
\`\`\`bash
createdb srcycle
# OR using psql:
psql -U postgres
CREATE DATABASE srcycle;
\q
\`\`\`

2. Update `.env.local`:
\`\`\`env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/srcycle?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="run: openssl rand -base64 32"
\`\`\`

#### Option B: Using Docker PostgreSQL

\`\`\`bash
docker run --name srcycle-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=srcycle \
  -p 5432:5432 \
  -d postgres:15

# Then use this DATABASE_URL:
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/srcycle?schema=public"
\`\`\`

### Step 3: Install and Setup

Run the automated setup script:

\`\`\`bash
cd Projects/s_r_cycle
chmod +x setup.sh
./setup.sh
\`\`\`

OR manually:

\`\`\`bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database
npx prisma db seed
\`\`\`

### Step 4: Start Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit: http://localhost:3000

### Step 5: Login

Use these credentials:
- **Admin**: username: `admin`, password: `admin123`
- **Stock Manager**: username: `stock`, password: `stock123`  
- **Biller**: username: `biller`, password: `biller123`

**⚠️ IMPORTANT: Change passwords immediately!**

---

## Detailed Configuration

### Environment Variables Explained

\`\`\`env
# PostgreSQL connection string
# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/srcycle?schema=public"

# Application URL (change for production)
NEXTAUTH_URL="http://localhost:3000"

# Secret key for JWT tokens (MUST be unique and secure)
# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET="your-generated-secret-here"

# Optional: Node environment
NODE_ENV="development"
\`\`\`

### Generating Secure Secrets

\`\`\`bash
# On Linux/Mac:
openssl rand -base64 32

# On Windows (PowerShell):
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
\`\`\`

---

## Database Management

### View Data (Prisma Studio)

\`\`\`bash
npx prisma studio
\`\`\`

Opens a web interface at http://localhost:5555 to view/edit database records.

### Reset Database

⚠️ **WARNING: This deletes ALL data!**

\`\`\`bash
npx prisma migrate reset
# Then re-seed:
npx prisma db seed
\`\`\`

### Backup Database

\`\`\`bash
pg_dump -U postgres srcycle > backup_$(date +%Y%m%d).sql
\`\`\`

### Restore Database

\`\`\`bash
psql -U postgres srcycle < backup_20240101.sql
\`\`\`

---

## Application Structure

### User Roles & Access

| Role | Access |
|------|--------|
| **Administrator** | Full access to all features |
| **Stock Manager** | Stock management, product catalog only |
| **Biller** | Billing, customers, view reports |

### Main Features by Role

#### Administrator Can:
- ✅ Manage users
- ✅ Access all billing features
- ✅ Manage stock and products
- ✅ View all reports
- ✅ Configure system settings

#### Stock Manager Can:
- ✅ Add/update/delete stock
- ✅ Manage products
- ✅ View stock reports
- ❌ Cannot create bills
- ❌ Cannot view revenue reports

#### Biller Can:
- ✅ Create all bill types
- ✅ Manage customers
- ✅ View stock levels (read-only)
- ✅ View sales reports
- ❌ Cannot modify stock directly
- ❌ Cannot manage users

---

## Features Guide

### 1. Bill Types

#### GST Bill (Tax Invoice)
- Full GST calculation
- Reduces stock automatically
- Includes in revenue reports
- Legal tax invoice

#### Estimate Bill (Quotation)
- No stock reduction
- No revenue impact
- Customer quotation
- Can be converted to GST bill

#### Shop-to-Shop Bill
- Inter-branch transfers
- Special documentation
- Stock tracking

### 2. Stock Management

#### Adding Stock
1. Go to Stock Management
2. Click "Add Stock"
3. Enter product, quantity, purchase rate
4. System creates stock log

#### Stock Alerts
- Automatic low stock detection
- Based on reorder level
- Dashboard notifications
- Email alerts (if configured)

### 3. Product Management

#### HSN Code System
- Primary identifier for products
- Used in GST compliance
- Quick product lookup
- Unique per product

#### Adding Products
1. Navigate to Products
2. Click "New Product"
3. Enter:
   - HSN Code (required, unique)
   - Product Name
   - Description
   - Unit (PCS, SET, KG, etc.)
   - GST Rate
   - Reorder Level

### 4. Billing Workflow

1. **Select Bill Type**
2. **Choose Customer** (or create new)
3. **Add Products** (search by HSN or name)
4. **Review & Calculate** (auto-calculates GST)
5. **Save Bill**
6. **Print** (A4 or thermal)

---

## Printing Setup

### A4 Printer (Standard Invoices)

The system uses browser print functionality. Configure:

1. Go to Print Settings in browser
2. Select your A4 printer
3. Set to Portrait orientation
4. Enable background graphics

### Thermal Printer (TVS RP-45)

For thermal/receipt printing:

1. Install printer drivers
2. Configure as default printer
3. Set paper size to thermal (80mm)
4. Test print from system

---

## Troubleshooting

### Database Connection Failed

**Error**: `Can't reach database server`

**Solutions**:
1. Check PostgreSQL is running: `sudo service postgresql status`
2. Verify DATABASE_URL in `.env.local`
3. Test connection: `psql -U postgres srcycle`
4. Check firewall settings

### Authentication Error

**Error**: `Invalid credentials` or `Session error`

**Solutions**:
1. Clear browser cookies
2. Check NEXTAUTH_SECRET is set
3. Verify user exists in database
4. Check password was hashed correctly

### Migration Errors

**Error**: `Migration failed`

**Solutions**:
1. Check database is accessible
2. Drop and recreate database
3. Delete `prisma/migrations` folder
4. Run `npx prisma migrate dev --name init` again

### Port Already in Use

**Error**: `Port 3000 is already in use`

**Solutions**:
\`\`\`bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# OR use different port
npm run dev -- -p 3001
\`\`\`

### Build Errors

**Error**: `Module not found` or similar

**Solutions**:
\`\`\`bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run dev
\`\`\`

---

## Production Deployment

### 1. Build Application

\`\`\`bash
npm run build
\`\`\`

### 2. Environment Setup

Create production `.env.local`:

\`\`\`env
DATABASE_URL="postgresql://user:pass@prod-server:5432/srcycle?schema=public"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="different-production-secret"
NODE_ENV="production"
\`\`\`

### 3. Start Production Server

\`\`\`bash
npm start
\`\`\`

### 4. Using PM2 (Recommended)

\`\`\`bash
# Install PM2
npm install -g pm2

# Start application
pm2 start npm --name "srcycle" -- start

# Auto-restart on server reboot
pm2 startup
pm2 save
\`\`\`

### 5. Nginx Configuration (Optional)

\`\`\`nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
\`\`\`

---

## Maintenance

### Regular Tasks

#### Daily
- Backup database
- Check error logs
- Monitor disk space

#### Weekly
- Review low stock alerts
- Check bill sequences
- Update product prices

#### Monthly
- Database optimization
- Security updates
- User audit

### Database Optimization

\`\`\`sql
-- Run in PostgreSQL
VACUUM ANALYZE;
REINDEX DATABASE srcycle;
\`\`\`

### Logs Location

- Application logs: `console` (stdout)
- Next.js logs: `.next/` folder
- Database logs: PostgreSQL logs directory

---

## Security Checklist

- [ ] Changed all default passwords
- [ ] Strong NEXTAUTH_SECRET set
- [ ] Database password is strong
- [ ] HTTPS enabled (production)
- [ ] Regular backups configured
- [ ] Firewall configured
- [ ] User permissions reviewed
- [ ] SQL injection protection (handled by Prisma)
- [ ] XSS protection (handled by Next.js)

---

## Getting Help

### Common Commands Reference

\`\`\`bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm start               # Start production server

# Database
npx prisma studio       # Open database GUI
npx prisma migrate dev  # Run migrations
npx prisma db seed      # Seed database
npx prisma generate     # Generate client

# Debugging
npm run lint            # Check code quality
\`\`\`

### Support Contacts

- **Technical Issues**: Review logs and error messages
- **Business Contact**: 9487170053, 7358446429
- **Location**: Thennampulam - 614 806

---

## Advanced Configuration

### Custom Bill Numbering

Edit `src/lib/auth.ts`:

\`\`\`typescript
export function generateBillNumber(type: string): string {
  // Customize your bill number format here
  const prefix = type === 'GST_BILL' ? 'INV' : 'EST'
  // Add your logic
}
\`\`\`

### Adding Custom Reports

1. Create new API route: `src/app/api/reports/custom/route.ts`
2. Create page: `src/app/dashboard/reports/custom/page.tsx`
3. Add navigation link in Sidebar

### Email Notifications

To add email notifications:

1. Install nodemailer: `npm install nodemailer`
2. Configure SMTP in `.env.local`
3. Create email service in `src/lib/email.ts`
4. Trigger on events (low stock, new bills, etc.)

---

## Next Steps

After setup:

1. ✅ Login and change default passwords
2. ✅ Add your products with HSN codes
3. ✅ Add customers
4. ✅ Set initial stock levels
5. ✅ Create your first test bill
6. ✅ Configure printers
7. ✅ Train users on the system
8. ✅ Start production use

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Documentation**: See README.md for additional information
