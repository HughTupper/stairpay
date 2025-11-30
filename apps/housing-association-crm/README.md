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

## Development

```bash
# Install dependencies (from monorepo root)
npm install

# Start development server
npm run dev:crm

# Open browser
open http://localhost:3000
```

### Test Accounts

If you've run the database seed (`npm run db:seed`), you can log in with:

- Thames Valley Housing: `admin@thamesvalley.com` / `password123`
- London & Quadrant: `admin@londonquadrant.com` / `password123`
- Clarion Housing: `admin@clarion.com` / `password123`

Each account is an admin for their respective organisation.

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

Get these from your Supabase project settings.

## Database Setup

The database is managed in the `@stairpay/database` package.

From monorepo root:

```bash
# Start local Supabase
npm run db:start

# Apply migrations
npm run db:reset

# Seed demo data
npm run db:seed
```

## Building

```bash
# Build for production
npm run build:crm

# Build this app only
cd apps/housing-association-crm && npm run build
```

## Deployment

Deploy to AWS Amplify using CDK:

```bash
# Deploy infrastructure
npm run deploy:crm

# Or from this directory
cd apps/housing-association-crm && npm run deploy
```

## Project Structure

```
apps/housing-association-crm/
├── app/                       # Next.js App Router
│   ├── (auth)/               # Authentication pages
│   ├── (dashboard)/          # Protected dashboard
│   ├── api/                  # API routes
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/               # React components
├── actions/                  # Server Actions
├── utils/                    # Utilities (Supabase clients)
├── lib/                      # Libraries
├── public/                   # Static assets
├── infrastructure/           # AWS CDK (Amplify)
└── middleware.ts             # Auth middleware
```

## Multi-Tenancy

The app uses session-based organization context:

1. User logs in
2. Selects organization (if member of multiple)
3. Organization ID stored in HTTP-only cookie
4. All queries automatically filtered by RLS

## Deployment Architecture

- **Hosting**: AWS Amplify (SSR Next.js)
- **Database**: Supabase (managed PostgreSQL)
- **Auth**: Supabase Auth
- **CDN**: CloudFront (via Amplify)
- **CI/CD**: GitHub Actions → Amplify

See `infrastructure/` folder for CDK stack definitions.
