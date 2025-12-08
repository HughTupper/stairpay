# Supabase Database Package

Manages the Supabase database schema, migrations, and type generation for the StairPay platform.

## Features

- 📁 **Version-controlled migrations** - All schema changes tracked in Git
- 🐳 **Local development** - Docker-based local Supabase instance
- 🔄 **Type generation** - Auto-generate TypeScript types from schema
- 🌱 **Seeding** - Realistic demo data for development
- 🔒 **Row Level Security** - Multi-tenant data isolation
- 🚀 **Remote deployment** - Deploy to production with safety checks

## Quick Start (Local Development)

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

## Remote Deployment

````bash
# Local Development
npm run db:start          # Start local Supabase
npm run db:stop           # Stop local Supabase
npm run db:reset          # Reset and reapply migrations

# Migrations
npm run db:migration      # Create new migration
npm run db:push           # Deploy migrations to remote
npm run db:pull           # Pull remote schema

# Type Generation
npm run db:types          # Generate from local database
npm run db:types:remote   # Generate from remote database

# Seeding
npm run db:seed           # Seed local database
npm run db:seed:production   # Seed production database
```Edit `.env.production`:
   ```bash
   SUPABASE_URL=https://rnsfmlijruywbaxldpvk.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key
````

> **Get your keys from:** Supabase Dashboard → Project Settings → API → `service_role` key

### Deploying Migrations

```bash
# Deploy to remote
npm run db:push

# Pull remote schema changes
npm run db:pull

# Generate types from remote database
npm run db:types:remote
```

### Seeding Remote Databases

**⚠️ WARNING: Seeding will create test data in your database!**

````bash
# Seed production environment
npm run db:seed:production

## Environment Files

- `.env.local` - Local development (gitignored)
- `.env.production` - production environment (gitignored)
- `.env.example` - Template with all required variables

**Never commit environment files containing secrets!**


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

**Types are committed to Git for reliable builds.**

```bash
# Generate types from production (after schema changes)
npm run db:types:remote

# Then commit the generated types
git add types/database.ts
git commit -m "chore: update database types"
git push
```

For local development, you can generate types from your local instance:

```bash
npm run db:types          # Generate from local database
```

**Important:** Always generate and commit types from production after deploying schema changes. This ensures:
- Build reliability (no dependency on Supabase API during builds)
- Version control (types match the schema for that commit)
- Faster CI/CD (no type generation overhead)

# Seeding
npm run db:seed           # Run seed script
````

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

- **API URL**: `http://localhost:54321`
- **Studio**: `http://localhost:54323`
- **Database**: `postgresql://postgres:postgres@localhost:54322/postgres`

Check terminal output for anon/service_role keys.

### Remote:

- **Project ID**: `rnsfmlijruywbaxldpvk`
- **API URL**: `https://rnsfmlijruywbaxldpvk.supabase.co`
- **Studio**: Visit Supabase Dashboard
- **Keys**: Get from Project Settings → API

## Troubleshooting

**Migrations fail on remote:**

- Ensure you've run `supabase link` first
- Check that your service role key is correct
- Verify migrations work locally with `npm run db:reset`

**Seed script fails:**

- Verify environment variables are set correctly
- Check that migrations have been applied (`npm run db:push`)
- Ensure service role key has admin privileges

**Type generation fails:**

- For local: ensure database is running (`npm run db:start`)
- For remote: ensure you're linked to the project
- **Tenants** - Shared ownership residents
- **Staircasing Applications** - Equity purchase requests

All queries automatically filter by user's organisation via RLS policies.

## Local Database Credentials

After `npm run db:start`:

- **API URL**: `http://localhost:54321`
- **Studio**: `http://localhost:54323`
- **Database**: `postgresql://postgres:postgres@localhost:54322/postgres`

Check terminal output for anon/service_role keys.
