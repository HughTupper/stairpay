# StairPay Monorepo

Enterprise-grade multi-tenant platform for shared ownership property management.

## 📁 Repository Structure

```
stairpay/
├── apps/
│   ├── housing-association-crm/    # Next.js CRM application
│   └── infrastructure/              # Global AWS infrastructure (CDK)
├── packages/
│   ├── database/                    # Supabase migrations & types
│   └── shared-types/                # Shared TypeScript types
├── docs/                            # Documentation
├── .github/workflows/               # CI/CD pipelines
├── turbo.json                       # Turborepo configuration
└── package.json                     # Workspace root
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ ([nvm](https://github.com/nvm-sh/nvm) recommended)
- Docker Desktop (for local Supabase)
- AWS CLI configured (for deployment)
- GitHub account (for CI/CD)

### Installation

```bash
# Clone repository
git clone https://github.com/HughTupper/stairpay.git
cd stairpay

# Use correct Node version
nvm use

# Install dependencies
npm install

# Start local Supabase
npm run db:start

# Apply migrations
npm run db:reset

# Seed demo data
npm run db:seed

# Start development server
npm run dev:crm
```

Open [http://localhost:3000](http://localhost:3000)

## 🏗️ Architecture

### Multi-App Monorepo

This repository uses **npm workspaces + Turborepo** for:

- **Independent deployment** - Deploy apps separately
- **Code sharing** - Shared types, database schema
- **Efficient builds** - Turborepo caching and parallelization
- **Type safety** - End-to-end TypeScript across apps

### Apps

#### `apps/housing-association-crm`

Next.js 15 application for housing association property management.

- **Tech**: Next.js 15.5.6, React 19, Tailwind CSS 4
- **Features**: Multi-tenancy, auth, property/tenant management
- **Infrastructure**: Colocated AWS CDK stack (Amplify)
- **Deployment**: AWS Amplify (SSR)

#### `apps/infrastructure`

Global AWS infrastructure shared across all applications.

- **Purpose**: VPCs, monitoring, shared IAM roles
- **Tech**: AWS CDK (TypeScript)
- **Status**: Placeholder for future expansion

### Packages

#### `packages/database`

Supabase database schema management.

- **Migrations**: Version-controlled SQL migrations
- **Local Dev**: Docker-based Supabase instance
- **Types**: Auto-generated TypeScript types
- **Seeding**: Realistic demo data generator

#### `packages/shared-types`

TypeScript types shared across applications.

- **Purpose**: Common types (ActionState, UserRole, etc.)
- **Build**: Compiled to distributable package
- **Usage**: `import type { ActionState } from '@stairpay/shared-types'`

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev                    # Start all apps
npm run dev:crm                # Start CRM only

# Building
npm run build                  # Build all apps & packages
npm run build:crm              # Build CRM only

# Database
npm run db:start               # Start local Supabase
npm run db:stop                # Stop local Supabase
npm run db:reset               # Reset and apply migrations
npm run db:push                # Deploy migrations to production
npm run db:types               # Generate TypeScript types
npm run db:seed                # Seed demo data

# Code Quality
npm run lint                   # Lint all packages
npm run typecheck              # Type check all packages
npm run clean                  # Clean build artifacts

# Deployment
npm run deploy:crm             # Deploy CRM to AWS
npm run deploy:infra           # Deploy global infrastructure
```

### Adding Dependencies

```bash
# To a specific app
npm install <package> --workspace=@stairpay/housing-association-crm

# To a package
npm install <package> --workspace=@stairpay/database

# To root (shared devDependencies)
npm install -D <package>
```

### Creating New Apps

```bash
# Create directory
mkdir apps/my-new-app
cd apps/my-new-app

# Create package.json
npm init -y

# Update workspace in root package.json (automatic)
# Add to turbo.json tasks
```

## 🗄️ Database

### Local Development

Powered by Supabase CLI + Docker:

```bash
# Start Supabase (PostgreSQL + Auth + Studio)
npm run db:start

# Access Studio UI
open http://localhost:54323

# Connection string
postgresql://postgres:postgres@localhost:54322/postgres
```

### Migrations

All schema changes are version-controlled:

```bash
# Create migration
cd packages/database
npm run db:migration -- add_feature_name

# Edit generated file
# packages/database/supabase/migrations/YYYYMMDD_add_feature_name.sql

# Apply locally
npm run db:reset

# Deploy to production
npm run db:push
```

### Type Generation

TypeScript types auto-generated from schema:

```bash
# Generate from local database
npm run db:types

# Use in code
import type { Database } from '@stairpay/database/types'
type Property = Database['public']['Tables']['properties']['Row']
```

## 🚢 Deployment

### CI/CD Pipeline

Automated deployments via GitHub Actions:

- **PR Checks** - Lint, type check, build
- **Database** - Auto-deploy migrations on merge to main
- **CRM** - Auto-deploy to AWS Amplify
- **Rollback** - Automatic rollback on failure

### Manual Deployment

#### CRM Application

```bash
# Configure AWS credentials
export AWS_PROFILE=your-profile

# Deploy
npm run deploy:crm
```

#### Database Migrations

```bash
# Set Supabase credentials
export SUPABASE_ACCESS_TOKEN=your-token

# Deploy
npm run db:push
```

### Environment Variables

#### GitHub Secrets Required

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `SUPABASE_PROJECT_REF`
- `SUPABASE_ACCESS_TOKEN`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

## 📊 Monitoring

### Build Performance

Turborepo tracks build performance:

```bash
# View task timings
turbo run build --summarize

# Generate trace
turbo run build --graph
```

### Database Monitoring

Via Supabase Dashboard:

- Query performance
- Connection pooling
- Real-time metrics

## 🏢 Multi-Tenancy

### Architecture

Session-based organization context:

1. User authenticates (Supabase Auth)
2. Selects organization (if member of multiple)
3. Organization ID stored in HTTP-only cookie
4. All queries automatically filtered via RLS

### Row Level Security

PostgreSQL RLS enforces data isolation:

```sql
-- Example: Properties table policy
CREATE POLICY "Users can only see their org's properties"
ON properties
USING (
  organisation_id IN (
    SELECT organisation_id
    FROM get_user_organisations(auth.uid())
  )
);
```

## 🔐 Security

- **Authentication**: Supabase Auth (JWT tokens)
- **Authorization**: Role-based (admin/viewer)
- **Data Isolation**: PostgreSQL RLS
- **Secrets**: Environment variables (never committed)
- **API Keys**: Supabase publishable keys (client-safe)

## 📚 Documentation

- [`apps/housing-association-crm/README.md`](apps/housing-association-crm/README.md) - CRM app details
- [`packages/database/README.md`](packages/database/README.md) - Database management
- [`docs/architecture.md`](docs/architecture.md) - System architecture
- [`docs/deployment.md`](docs/deployment.md) - Deployment guide

## 🤝 Contributing

### Workflow

1. Create feature branch
2. Make changes
3. Run tests: `npm run lint && npm run typecheck && npm run build`
4. Create PR
5. CI runs automatically
6. Merge to main
7. Auto-deploy

### Commit Convention

```
feat: add tenant equity tracking
fix: resolve authentication redirect
chore: update dependencies
docs: improve setup instructions
```

## 📦 Technology Stack

- **Monorepo**: npm workspaces + Turborepo
- **Frontend**: Next.js 15, React 19, Tailwind CSS 4
- **Backend**: Supabase (PostgreSQL + Auth)
- **Infrastructure**: AWS CDK (Amplify, CloudFormation)
- **CI/CD**: GitHub Actions
- **Type Safety**: TypeScript 5
- **Validation**: Zod

## 🎯 Roadmap

### Current

- ✅ Housing Association CRM
- ✅ Multi-tenant database
- ✅ Local development setup
- ✅ CI/CD pipeline

### Next

- [ ] Mobile app (`apps/mobile`)
- [ ] Admin portal (`apps/admin`)
- [ ] API service (`apps/api`)
- [ ] Global infrastructure (VPCs, monitoring)

## 📄 License

Private - © 2025 StairPay

## 👥 Team

**Hugh Tupper** - Technical Lead

---

Built for Stairpay technical assessment - demonstrating enterprise monorepo architecture, infrastructure as code, and production-ready deployment pipelines.
