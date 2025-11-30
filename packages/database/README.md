# Supabase Database Package

This package manages the Supabase database schema, migrations, and type generation for the StairPay platform.

## Features

- 📁 **Version-controlled migrations** - All schema changes tracked in Git
- 🐳 **Local development** - Docker-based local Supabase instance
- 🔄 **Type generation** - Auto-generate TypeScript types from schema
- 🌱 **Seeding** - Realistic demo data for development
- 🔒 **Row Level Security** - Multi-tenant data isolation

## Prerequisites

- Docker Desktop running (for local Supabase)
- Node.js 20+
- Supabase CLI (installed via package.json)

## Quick Start

### Local Development

```bash
# Start local Supabase (PostgreSQL + Studio)
npm run db:start

# Access Supabase Studio
open http://localhost:54323

# Local database credentials (auto-generated):
# URL: http://localhost:54321
# Anon key: see terminal output
```

### Apply Migrations

```bash
# Reset local database and apply all migrations
npm run db:reset

# Generate TypeScript types
npm run db:types
```

### Seed Database

```bash
# Add demo data (3 housing associations with properties and tenants)
npm run db:seed
```

This creates:

- 3 test users with admin access to each organisation
- 3 housing associations (Thames Valley Housing, London & Quadrant, Clarion Housing)
- ~30 properties across all organisations
- ~60 tenants with shared ownership details
- ~20 staircasing applications with various statuses

**Test Credentials:**

- Thames Valley Housing: `admin@thamesvalley.com` / `password123`
- London & Quadrant: `admin@londonquadrant.com` / `password123`
- Clarion Housing: `admin@clarion.com` / `password123`

## Creating Migrations

```bash
# Create a new migration file
npm run db:migration add_feature_name

# Edit the generated file in supabase/migrations/
# Example: supabase/migrations/20231130120000_add_feature_name.sql

# Apply locally
npm run db:reset

# Deploy to production
npm run db:push
```

## Project Structure

```
packages/database/
├── supabase/
│   ├── config.toml              # Supabase project config
│   ├── seed.sql                 # SQL seed data (optional)
│   └── migrations/              # Timestamped migration files
│       ├── 20231129_001_initial_schema.sql
│       ├── 20231129_002_rls_policies.sql
│       └── 20231129_003_indexes.sql
├── types/
│   └── database.ts              # Auto-generated TypeScript types
├── seed.ts                      # TypeScript seed script
├── package.json
└── README.md
```

## Useful Commands

```bash
# Local Development
npm run db:start          # Start local Supabase
npm run db:stop           # Stop local Supabase
npm run db:reset          # Reset and reapply migrations

# Migrations
npm run db:migration      # Create new migration
npm run db:push           # Deploy to production
npm run db:pull           # Pull remote schema

# Type Generation
npm run db:types          # Generate from local database
npm run db:types:remote   # Generate from production

# Seeding
npm run db:seed           # Run seed script
```

## Multi-Tenant Architecture

The database uses Row Level Security (RLS) to enforce multi-tenancy:

- **Organisations** - Top-level tenant
- **User Organisations** - Many-to-many with roles (admin/viewer)
- **Properties** - Belong to organisations
- **Tenants** - Shared ownership residents
- **Staircasing Applications** - Equity purchase requests

All queries automatically filter by user's organisation via RLS policies.

## Type Safety

Generated types are available at `@stairpay/database/types`:

```typescript
import type { Database } from "@stairpay/database/types";

type Property = Database["public"]["Tables"]["properties"]["Row"];
type Tenant = Database["public"]["Tables"]["tenants"]["Insert"];
```

## Production Deployment

Migrations are automatically deployed via GitHub Actions when changes are pushed to the `main` branch.

See `.github/workflows/deploy-database.yml` for details.

## Rollback Strategy

To rollback a migration:

1. Create a new migration that reverses the changes
2. Apply with `npm run db:push`
3. Never delete or modify existing migration files

## Local Database Credentials

After running `npm run db:start`:

- **API URL**: `http://localhost:54321`
- **Studio**: `http://localhost:54323`
- **Database**: `postgresql://postgres:postgres@localhost:54322/postgres`

Check terminal output for anon/service_role keys.
