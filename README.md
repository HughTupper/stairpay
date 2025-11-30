# StairPay Monorepo

Enterprise-grade multi-tenant platform for shared ownership property management.

## 📁 Repository Structure

```
stairpay/
├── apps/
│   ├── housing-association-crm/    # Next.js CRM application
├── packages/
│   ├── database/                    # Supabase migrations & types
│   └── shared-types/                # Shared TypeScript types
├── docs/                            # Documentation
├── .github/workflows/               # CI/CD pipelines
├── turbo.json                       # Turborepo configuration
└── package.json                     # Workspace root
```

## 📚 Documentation

- [`apps/housing-association-crm/README.md`](apps/housing-association-crm/README.md) - CRM app details
- [`packages/database/README.md`](packages/database/README.md) - Database management
- [`docs/architecture.md`](docs/architecture.md) - Architecture decisions and system design

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ ([nvm](https://github.com/nvm-sh/nvm) recommended)
- Docker Desktop (for local Supabase)
- AWS CLI configured (for deployment)

### Installation

```bash
# Clone repository
git clone https://github.com/HughTupper/stairpay.git
cd stairpay

# Install dependencies
npm install
```

Open [http://localhost:3000](http://localhost:3000)

## 🏗️ Architecture

### Multi-App Monorepo

This repository uses **[npm workspaces](https://docs.npmjs.com/cli/v10/using-npm/workspaces) + [Turborepo](https://turbo.build/repo/docs)** for:

- **Independent deployment** - Deploy apps separately
- **Code sharing** - Shared types, database schema
- **Efficient builds** - Turborepo caching and parallelisation
- **Type safety** - End-to-end TypeScript across apps

### Apps

#### `apps/housing-association-crm`

Next.js 15 application for housing association property management.

- **Tech**: Next.js 15.5.6, React 19, Tailwind CSS 4
- **Features**: Multi-tenancy, auth, property/tenant management
- **Infrastructure**: Colocated AWS CDK stack (Amplify)
- **Deployment**: AWS Amplify (SSR)

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

See [`package.json`](package.json) for all available scripts. Common commands include:

- `npm run dev:crm` - Start CRM development server
- `npm run build` - Build all apps & packages
- `npm run db:start` - Start local Supabase
- `npm run lint` - Lint all packages
- `npm run typecheck` - Type check all packages

### Adding Dependencies

See [npm workspaces documentation](https://docs.npmjs.com/cli/v10/using-npm/workspaces) for details.

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

### Environment Variables

#### GitHub Secrets Required

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `SUPABASE_PROJECT_REF`
- `SUPABASE_ACCESS_TOKEN`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

### Build Performance

[Turborepo](https://turbo.build/repo/docs/core-concepts/monitoring) tracks build performance:

````bash
# View task timings
turbo run build --summarize

# Generate trace
turbo run build --graph
```enerate trace
turbo run build --graph
````

### Database Monitoring

Via Supabase Dashboard:

- Query performance
- Connection pooling
- Real-time metrics

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

## 📄 License

Private - © 2025 StairPay

## 👥 Team

**Hugh Tupper** - Technical Lead

---

Built for Stairpay technical assessment - demonstrating enterprise monorepo architecture, infrastructure as code, and production-ready deployment pipelines.
