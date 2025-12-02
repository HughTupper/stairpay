# Supabase Database Package

Manages the Supabase database schema, migrations, and type generation for the StairPay platform.

## Features

- 📁 **Version-controlled migrations** - All schema changes tracked in Git
- 🐳 **Local development** - Docker-based local Supabase instance
- 🔄 **Type generation** - Auto-generate TypeScript types from schema
- 🌱 **Seeding** - Realistic demo data for development
- 🔒 **Row Level Security** - Multi-tenant data isolation

## Quick Start

```bash
# Start local Supabase (requires Docker Desktop)
npm run db:start

# Apply all migrations and seed demo data
npm run db:reset && npm run db:seed

# Access Supabase Studio at http://localhost:54323

# Generate TypeScript types
npm run db:types
```

### Test Accounts

After `npm run db:seed`:

- **Thames Valley Housing**: `admin@thamesvalley.com` / `password123`
- **London & Quadrant**: `admin@londonquadrant.com` / `password123`
- **Clarion Housing**: `admin@clarion.com` / `password123`
- **All Organizations**: `admin@all.com` / `password123` (access to all orgs)

## Commands

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

# Seeding
npm run db:seed           # Run seed script
```

## Creating Migrations

```bash
# Create a new migration
npm run db:migration add_feature_name

# Edit the generated file in supabase/migrations/
# Example: supabase/migrations/20231130120000_add_feature_name.sql

# Apply locally
npm run db:reset

# Deploy to production
npm run db:push
```

## Type Safety

Generated types are available at `@stairpay/database/types`:

```typescript
import type { Database } from "@stairpay/database/types";

type Property = Database["public"]["Tables"]["properties"]["Row"];
type Tenant = Database["public"]["Tables"]["tenants"]["Insert"];
```

## Multi-Tenant Architecture

Row Level Security (RLS) enforces multi-tenancy:

- **Organisations** - Top-level tenant
- **User Organisations** - Many-to-many with roles (admin/viewer)
- **Properties** - Belong to organisations
- **Tenants** - Shared ownership residents
- **Staircasing Applications** - Equity purchase requests

All queries automatically filter by user's organisation via RLS policies.

## Local Database Credentials

After `npm run db:start`:

- **API URL**: `http://localhost:54321`
- **Studio**: `http://localhost:54323`
- **Database**: `postgresql://postgres:postgres@localhost:54322/postgres`

Check terminal output for anon/service_role keys.
