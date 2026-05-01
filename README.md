# S.R. Cycle & Auto Spares Billing System

Billing, inventory, and customer management web app for S.R. Cycle & Auto Spares.

## Overview

This project is a Next.js application for running day-to-day billing and stock operations in the shop. It supports multiple bill types, product and stock tracking, customer management, and authenticated access for different staff roles.

## Features

- Login-based access with role support for Administrator, Stock Manager, and Biller
- GST Bill, Estimate Bill, and Shop-to-Shop Bill flows
- Product master with HSN code-based lookup
- Stock tracking with low-stock visibility
- Customer management
- Dashboard for operational summaries and reports
- Print-ready billing output

## Tech Stack

- Next.js 15
- React 18
- TypeScript
- Prisma ORM
- SQLite
- NextAuth
- Tailwind CSS

## Requirements

- Node.js 18 or newer
- npm

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env.local` file in the project root:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-strong-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

3. Create and seed the database:

```bash
npx prisma migrate dev --name init
npm run postinstall
npx prisma db seed
```

4. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` - start the development server
- `npm run build` - create a production build
- `npm run start` - run the production server
- `npm run lint` - run Next.js linting
- `npm run postinstall` - generate Prisma client

## Default Login

After seeding, use these credentials:

- Administrator: `admin` / `admin123`
- Stock Manager: `stock` / `stock123`
- Biller: `biller` / `biller123`

Change these passwords after the first login.

## App Routes

- `/login` - sign-in page
- `/dashboard` - main application dashboard
- `/dashboard/billing` - billing pages
- `/dashboard/customers` - customer management
- `/dashboard/products` - product management
- `/dashboard/stock` - stock management
- `/dashboard/reports` - reports
- `/dashboard/settings` - app settings

## Project Notes

- The root route redirects to `/dashboard`.
- Prisma is configured for SQLite in `schema.prisma`.
- Authentication uses `NEXTAUTH_SECRET` from environment variables.

## Shop Details

S.R. Cycle & Auto Spares

Thennampulam - 614 806

Phone: 9487170053, 7358446429
