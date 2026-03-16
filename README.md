# S.R. Cycle & Auto Spares - Billing System

A comprehensive billing and inventory management web application for S.R. Cycle & Auto Spares.

## Features

### User Roles & Permissions
- **Administrator**: Full system access
- **Stock Manager**: Stock management only
- **Biller**: Billing and customer management

### Core Functionality
- 🧾 Multiple bill types (GST Bill, Estimate, Shop-to-Shop)
- 📦 Inventory management with HSN code tracking
- 📊 Real-time dashboard with revenue analytics
- 👥 Customer management
- 📈 Stock tracking and low stock alerts
- 🖨️ Print-ready invoice generation
- 📱 Responsive design

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **PDF Generation**: jsPDF
- **Charts**: Recharts

## Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

## Installation

### 1. Clone and Install Dependencies

\`\`\`bash
cd Projects/s_r_cycle
npm install
\`\`\`

### 2. Configure Environment Variables

Edit the `.env.local` file:

\`\`\`env
DATABASE_URL="postgresql://username:password@localhost:5432/srcycle?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-secret-key-using-openssl-rand-base64-32"
\`\`\`

To generate a secure secret:
\`\`\`bash
openssl rand -base64 32
\`\`\`

### 3. Set Up the Database

\`\`\`bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) Seed initial data
npx prisma db seed
\`\`\`

### 4. Create Initial Admin User

Run this in Prisma Studio or directly in your database:

\`\`\`sql
-- Password will be hashed by the application
INSERT INTO "User" (id, username, password, name, role, active)
VALUES (
  gen_random_uuid(),
  'admin',
  -- You'll need to hash 'admin123' using bcrypt
  '$2a$10$...',  
  'Administrator',
  'ADMINISTRATOR',
  true
);
\`\`\`

Or use the provided seed script (see below).

### 5. Run the Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit http://localhost:3000

## Default Login Credentials

After seeding the database:
- **Username**: admin
- **Password**: admin123

⚠️ **Change this immediately in production!**

## Project Structure

\`\`\`
s_r_cycle/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication
│   │   │   ├── products/      # Product management
│   │   │   ├── customers/     # Customer management
│   │   │   ├── billing/       # Billing operations
│   │   │   ├── stock/         # Stock management
│   │   │   └── reports/       # Reporting
│   │   ├── dashboard/         # Dashboard pages
│   │   │   ├── billing/       # Billing interface
│   │   │   ├── stock/         # Stock management
│   │   │   ├── products/      # Product master
│   │   │   ├── customers/     # Customer master
│   │   │   └── reports/       # Reports
│   │   ├── login/             # Login page
│   │   └── layout.tsx         # Root layout
│   ├── components/
│   │   ├── layout/            # Layout components
│   │   └── ui/                # Reusable UI components
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client
│   │   └── auth.ts            # Auth utilities
│   └── types/
│       └── index.ts           # TypeScript types
├── .env.local                 # Environment variables
├── package.json
└── README.md
\`\`\`

## Key Features Explained

### Bill Types

1. **GST Bill**: Standard sales invoice with GST calculation
2. **Estimate Bill**: Quotation without affecting stock
3. **Shop-to-Shop Bill**: Inter-shop transfer documentation

### Stock Management

- HSN code-based product identification
- Automatic stock reduction on bill finalization
- Low stock alerts based on reorder levels
- Stock history and audit trail

### Reports

- Daily/Weekly/Monthly revenue reports
- Low stock reports
- Bill history and search
- Sales tracking by product/customer

## Database Schema

### Key Tables

- **User**: System users with role-based access
- **Product**: Product master with HSN codes
- **Stock**: Current stock levels
- **Customer**: Customer information
- **Bill**: Bill header information
- **BillItem**: Line items in bills
- **StockLog**: Stock movement history

## API Endpoints

### Authentication
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout

### Products
- `GET /api/products` - List all products
- `POST /api/products` - Create product
- `GET /api/products/[id]` - Get product details
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product

### Bills
- `GET /api/billing` - List bills
- `POST /api/billing` - Create bill
- `GET /api/billing/[id]` - Get bill details
- `PUT /api/billing/[id]` - Update bill

### Stock
- `GET /api/stock` - List stock levels
- `POST /api/stock/adjust` - Adjust stock
- `GET /api/stock/low` - Get low stock items

### Customers
- `GET /api/customers` - List customers
- `POST /api/customers` - Create customer
- `PUT /api/customers/[id]` - Update customer

## Printing

The system supports two printer types:
- **A4 Printer**: Standard invoice format
- **TVS RP-45**: Thermal/receipt printer format

Print functionality uses browser print API with custom CSS for each format.

## Security

- Passwords hashed using bcrypt
- JWT-based session management
- Role-based access control
- Protected API routes

## Development

### Adding New Features

1. Create database models in `prisma/schema.prisma`
2. Run `npx prisma migrate dev`
3. Create API routes in `src/app/api/`
4. Create UI pages in `src/app/dashboard/`
5. Update types in `src/types/`

### Running Tests

\`\`\`bash
npm run test
\`\`\`

## Production Deployment

### Build for Production

\`\`\`bash
npm run build
npm start
\`\`\`

### Environment Considerations

1. Set `NODE_ENV=production`
2. Use a strong `NEXTAUTH_SECRET`
3. Configure production database
4. Set up SSL/HTTPS
5. Configure CORS if needed

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check DATABASE_URL format
- Ensure database exists

### Authentication Issues
- Verify NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your domain
- Clear browser cookies

### Build Issues
- Delete `.next` folder
- Run `npm install` again
- Check Node.js version

## Support

For issues and questions:
- Check the documentation
- Review error logs
- Contact: 9487170053, 7358446429

## Company Information

**S.R. Cycle & Auto Spares**
Address: Thennampulam - 614 806
Phone: 9487170053, 7358446429

## License

Private - For internal use only

## Version History

- v1.0.0 - Initial release
  - User authentication
  - Product management
  - Stock management
  - Billing system
  - Reports
