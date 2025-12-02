# Housing Association CRM

Multi-tenant shared ownership property management platform for housing associations.

## Features

- 🏢 **Multi-tenant Architecture** - Secure org isolation with Row Level Security
- 🔐 **Authentication** - Supabase Auth with role-based access (admin/viewer)
- 🏘️ **Property Management** - CRUD operations for shared ownership properties
- 👥 **Tenant Tracking** - Equity percentage, monthly payments, staircasing history
- 📊 **Dashboard** - Real-time stats and analytics
- 🌙 **Dark Mode** - System-based theme toggle
- ⚡ **Optimistic UI** - Instant feedback with Server Actions

## Tech Stack

- **Framework**: Next.js 15.5.6 (App Router, React 19, Turbopack)
- **Styling**: Tailwind CSS 4
- **Backend**: Supabase (PostgreSQL + Auth + RLS)
- **Validation**: Zod
- **Infrastructure**: AWS CDK (Amplify deployment)

## Quick Start

```bash
# Install dependencies (from monorepo root)
npm install

# Start local Supabase
npm run db:start

# Apply migrations and seed demo data
npm run db:seed

# Start development server
npm run dev:crm

# Open http://localhost:3000
```

### Test Accounts

After running `npm run db:seed`:

- **Thames Valley Housing**: `admin@thamesvalley.com` / `password123`
- **London & Quadrant**: `admin@londonquadrant.com` / `password123`
- **Clarion Housing**: `admin@clarion.com` / `password123`
- **All Organizations**: `admin@all.com` / `password123` (access to all orgs)

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

## Testing

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui

# Run Storybook
npm run storybook
```

All UI components have comprehensive test coverage (80%+) and Storybook stories.

## Building

```bash
# Build for production
npm run build:crm

# Or from this directory
cd apps/housing-association-crm && npm run build
```

## Deployment

Deploy to AWS Amplify using CDK:

```bash
# Deploy infrastructure
cd apps/housing-association-crm && npm run deploy
```

## Project Structure

```
apps/housing-association-crm/
├── app/                       # Next.js App Router
│   ├── (auth)/               # Authentication pages
│   ├── dashboard/            # Protected dashboard
│   ├── api/                  # API routes
│   └── globals.css           # Global styles
├── components/
│   └── ui/                   # Tested UI components
├── actions/                  # Server Actions
├── utils/                    # Supabase clients
└── infrastructure/           # AWS CDK stack
```
