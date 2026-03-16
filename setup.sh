#!/bin/bash

echo "========================================"
echo "S.R. Cycle & Auto Spares - Setup Script"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

echo "✓ Node.js version: $(node -v)"

# Check if PostgreSQL is accessible
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL client not found. Make sure PostgreSQL is installed and running."
fi

echo ""
echo "Step 1: Installing dependencies..."
npm install

echo ""
echo "Step 2: Setting up environment variables..."
if [ ! -f .env.local ]; then
    echo "❌ .env.local file not found!"
    echo "Please create .env.local file with the following variables:"
    echo ""
    echo "DATABASE_URL=\"postgresql://user:password@localhost:5432/srcycle?schema=public\""
    echo "NEXTAUTH_URL=\"http://localhost:3000\""
    echo "NEXTAUTH_SECRET=\"$(openssl rand -base64 32)\""
    echo ""
    echo "A template has been created. Please update it with your database credentials."
    exit 1
else
    echo "✓ .env.local file found"
fi

echo ""
echo "Step 3: Generating Prisma Client..."
npx prisma generate

echo ""
echo "Step 4: Running database migrations..."
npx prisma migrate dev --name init

echo ""
echo "Step 5: Seeding database with initial data..."
npx prisma db seed

echo ""
echo "========================================"
echo "✓ Setup completed successfully!"
echo "========================================"
echo ""
echo "To start the development server, run:"
echo "  npm run dev"
echo ""
echo "Default login credentials:"
echo "  Administrator - username: admin, password: admin123"
echo "  Stock Manager - username: stock, password: stock123"
echo "  Biller - username: biller, password: biller123"
echo ""
echo "⚠️  Please change these passwords after first login!"
echo ""
echo "Application will be available at: http://localhost:3000"
echo "========================================"
