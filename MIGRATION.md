# Monorepo Migration Guide

This guide walks through completing the monorepo migration for StairPay.

## Overview

We're transforming the current single-app structure into a monorepo with:
- `apps/housing-association-crm/` - Next.js CRM application
- `packages/database/` - Supabase schema & migrations
- `packages/shared-types/` - Shared TypeScript types
- `apps/infrastructure/` - Global AWS resources

## Prerequisites

- [ ] All changes committed to Git
- [ ] Docker Desktop installed and running
- [ ] Node.js 20+ installed
- [ ] Backup of current `.env.local` file

## Migration Steps

### Step 1: Run Migration Script

```bash
# Make script executable
chmod +x migrate-to-monorepo.sh

# Run migration
./migrate-to-monorepo.sh
```

This script will:
- Move all Next.js files to `apps/housing-association-crm/`
- Move Supabase files to `packages/database/`
- Update package.json and .gitignore
- Install all dependencies
- Initialize Supabase CLI

### Step 2: Convert SQL to Migrations

```bash
cd packages/database

# Create initial schema migration
npm run db:migration -- initial_schema

# This creates: supabase/migrations/YYYYMMDDHHMMSS_initial_schema.sql
# Copy the contents of supabase/schema.sql into this file

# Create RLS policies migration
npm run db:migration -- rls_policies

# Copy the contents of supabase/rls-policies.sql into this file

# Remove old files
rm supabase/schema.sql supabase/rls-policies.sql
```

### Step 3: Update Imports in CRM App

The types package has moved. Update all imports:

```bash
cd apps/housing-association-crm

# Find all files importing from @/types
grep -r "from '@/types'" .

# Update each file:
# OLD: import type { ActionState } from '@/types'
# NEW: import type { ActionState } from '@stairpay/shared-types'
```

Files to update:
- `actions/auth.ts`
- `actions/properties.ts`
- `app/(auth)/login/page.tsx`
- `app/(auth)/signup/page.tsx`
- `components/property-form.tsx`

### Step 4: Build Shared Packages

```bash
# From monorepo root
npm run build
```

This compiles:
- `@stairpay/shared-types` → distributable package
- `@stairpay/database` → TypeScript types

### Step 5: Test Local Development

```bash
# Start local Supabase
npm run db:start

# Wait for Supabase to start (check Docker Desktop)
# Look for output: "Supabase local development setup is running."

# Apply migrations
npm run db:reset

# Seed database
npm run db:seed

# Start CRM development server
npm run dev:crm

# Open browser
open http://localhost:3000
```

### Step 6: Verify Everything Works

- [ ] Next.js dev server starts without errors
- [ ] No TypeScript errors
- [ ] Can login/signup
- [ ] Can create properties
- [ ] Can view tenants
- [ ] Dark mode toggle works

### Step 7: Update CDK Infrastructure Path

The Amplify stack needs to reference the new app location:

```bash
cd apps/housing-association-crm/infrastructure

# Edit lib/amplify-stack.ts
# Update appRoot if needed (should be relative to infrastructure folder)
```

### Step 8: Commit Changes

```bash
# From monorepo root
git status

# Review all changes
git diff

# Stage changes
git add .

# Commit
git commit -m "refactor: migrate to monorepo structure with npm workspaces and Turborepo"

# Push
git push origin main
```

## Post-Migration Tasks

### Update CI/CD Secrets

Add to GitHub repository secrets:

```
SUPABASE_PROJECT_REF=rnsfmlijruywbaxldpvk
SUPABASE_ACCESS_TOKEN=<get from supabase.com>
AWS_ACCESS_KEY_ID=<your aws key>
AWS_SECRET_ACCESS_KEY=<your aws secret>
AWS_REGION=eu-west-2
NEXT_PUBLIC_SUPABASE_URL=<your supabase url>
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<your supabase key>
```

### Test GitHub Actions

Push a small change to trigger CI:

```bash
# Make a small change
echo "# Test" >> README.md

git add README.md
git commit -m "test: trigger CI pipeline"
git push origin main
```

Verify workflows run:
- `.github/workflows/ci.yml` - Lint, type check, build
- `.github/workflows/deploy-crm.yml` - Deploy CRM (if on main)
- `.github/workflows/deploy-database.yml` - Deploy migrations (if migrations changed)

### Link Supabase Project

```bash
cd packages/database

# Login to Supabase
npx supabase login

# Link to your project
npx supabase link --project-ref rnsfmlijruywbaxldpvk
```

## Troubleshooting

### "Module not found: @stairpay/shared-types"

```bash
# Rebuild shared packages
npm run build

# Clear Next.js cache
cd apps/housing-association-crm
rm -rf .next
npm run dev
```

### "Supabase not found"

```bash
# Install Supabase CLI
npm install

# Or globally
npm install -g supabase
```

### "Cannot find module '@/types'"

You missed updating an import. Search for all occurrences:

```bash
cd apps/housing-association-crm
grep -r "@/types" .
```

Update each to `@stairpay/shared-types`.

### Docker not running

```bash
# Check Docker is running
docker ps

# If not, start Docker Desktop
open -a Docker
```

### Build fails with TypeScript errors

```bash
# Clean everything
npm run clean

# Reinstall
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

## Rollback

If you need to rollback:

```bash
# Restore old files
mv package.json.old package.json
mv .gitignore.old .gitignore

# Reinstall
npm install

# You may need to manually move files back
# Or revert to previous git commit
git reset --hard HEAD~1
```

## Verification Checklist

After migration, verify:

- [ ] `npm install` succeeds
- [ ] `npm run build` succeeds
- [ ] `npm run lint` passes
- [ ] `npm run typecheck` passes
- [ ] `npm run dev:crm` starts dev server
- [ ] `npm run db:start` starts local Supabase
- [ ] `npm run db:types` generates types
- [ ] `npm run db:seed` seeds data
- [ ] GitHub Actions CI passes
- [ ] App works in browser (login, create property, view tenants)

## Next Steps

After successful migration:

1. **Update Documentation**
   - Update any additional docs referring to old structure
   - Add team onboarding guide

2. **Set Up Staging Environment**
   - Create separate Supabase project for staging
   - Add staging deployment workflow

3. **Add E2E Tests**
   - Playwright for critical user flows
   - Run in CI pipeline

4. **Optimize Build Performance**
   - Configure Turborepo remote caching
   - Set up build analytics

5. **Plan Future Apps**
   - Mobile app structure
   - Admin portal planning
   - API service design

## Getting Help

If you encounter issues:

1. Check terminal output for specific errors
2. Review `docs/architecture.md` for context
3. Check package-specific README files
4. Review Turborepo docs: https://turbo.build/repo/docs
5. Check Supabase CLI docs: https://supabase.com/docs/guides/cli

## Success!

Once all verification steps pass, you have successfully migrated to a production-ready monorepo structure! 🎉

Your codebase is now ready to scale with:
- Multiple applications
- Shared packages
- Type-safe database access
- Automated deployments
- Local development environment
