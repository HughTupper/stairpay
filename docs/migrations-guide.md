# Database Migrations Guide

## Overview

This document explains how database migrations work in the StairPay platform and demonstrates best practices for schema evolution.

## Migration Workflow

### What Are Migrations?

Migrations are version-controlled SQL files that define incremental changes to your database schema. Each migration:

- Has a timestamp-based filename (e.g., `20251202000000_add_staircasing_features.sql`)
- Runs in sequential order based on timestamp
- Is applied exactly once to a database
- Should be idempotent (safe to re-run) using `IF NOT EXISTS` clauses

### Migration Lifecycle

```
1. Developer creates migration file
   └─> packages/database/supabase/migrations/YYYYMMDDHHMMSS_description.sql

2. Test locally
   └─> supabase db reset (drops DB, applies all migrations, runs seed)

3. Review changes
   └─> Check RLS policies, indexes, constraints

4. Push to remote
   └─> supabase db push (applies only new migrations)

5. Generate types
   └─> supabase gen types typescript > types/database.ts
```

## Example: StairPay Features Migration

### Forward Migration (`20251202000000_add_staircasing_features.sql`)

This migration adds six new tables to support StairPay's core features:

#### Tables Added

1. **`property_valuations`** - Monthly HPI-based property value tracking

   - Unique constraint on `(property_id, valuation_date)` prevents duplicates
   - Indexes on property_id, date, and org_id for fast queries
   - Tracks value changes month-over-month

2. **`service_providers`** - Directory of brokers, surveyors, conveyancers

   - Enum type `provider_type` ensures valid categories
   - Boolean `is_preferred` for featured providers
   - Rating and referral tracking

3. **`marketing_campaigns`** - Targeted resident engagement campaigns

   - JSONB `target_segment` for flexible targeting criteria
   - Tracks email metrics (sent, opened, clicked, converted)
   - Status enum: draft, active, paused, completed

4. **`campaign_triggers`** - Automation rules for campaigns

   - Links campaigns to triggering conditions
   - JSONB `trigger_conditions` for flexible rule definitions
   - Tracks last triggered time for rate limiting

5. **`resident_feedback`** - NPS and satisfaction surveys

   - NPS score (0-10) with CHECK constraint
   - Satisfaction score (1-5) with CHECK constraint
   - Sentiment analysis (positive/neutral/negative)
   - Categorization by feedback type

6. **`financial_insights`** - Staircasing readiness scores
   - Calculated score (0-100) based on multiple factors
   - JSONB `factors` field stores score breakdown
   - Recommended actions for residents

#### Security (RLS Policies)

All tables enforce multi-tenant isolation:

```sql
-- View policy (all authenticated users in the org)
CREATE POLICY "Users can view in their organisations"
  ON table_name FOR SELECT
  TO authenticated
  USING (
    organisation_id IN (
      SELECT organisation_id FROM private.get_user_organisations()
    )
  );

-- Admin-only write policy
CREATE POLICY "Admins can manage"
  ON table_name FOR ALL
  TO authenticated
  USING (
    organisation_id IN (
      SELECT organisation_id FROM private.get_user_organisations() WHERE role = 'admin'
    )
  );
```

**Key Points:**

- Uses security definer function `private.get_user_organisations()` for performance
- Separate policies for SELECT (viewers + admins) vs INSERT/UPDATE/DELETE (admins only)
- Database enforces access control automatically

### Rollback Migration (`20251202000001_rollback_staircasing_features.sql`)

Rollback migrations safely remove changes if needed.

#### Best Practices

1. **Reverse Dependency Order**

   ```sql
   -- Drop tables that depend on others first
   DROP TABLE IF EXISTS financial_insights CASCADE;  -- depends on tenants, properties
   DROP TABLE IF EXISTS campaign_triggers CASCADE;   -- depends on campaigns
   DROP TABLE IF EXISTS marketing_campaigns CASCADE; -- no dependencies
   ```

2. **Use CASCADE**

   - Automatically drops dependent objects (triggers, policies)
   - Prevents foreign key constraint errors

3. **Drop Custom Types Last**

   ```sql
   DROP TYPE IF EXISTS trigger_type;
   DROP TYPE IF EXISTS campaign_status;
   ```

4. **Don't Drop Shared Functions**
   - `update_updated_at_column()` is used by multiple tables
   - Only drop functions specific to this migration

## Migration Commands

### Local Development

```bash
# Start local Supabase
supabase start

# Reset database (drops all data, applies all migrations)
supabase db reset

# Apply only new migrations
supabase migration up

# Generate TypeScript types
supabase gen types typescript --local > types/database.ts

# Run seed script
npm run seed
```

### Production Deployment

```bash
# Apply migrations to remote database
supabase db push

# Generate types from remote
supabase gen types typescript > types/database.ts

# Rollback (apply rollback migration, then push)
supabase db push
```

## The Expand-Migrate-Contract Pattern

For **zero-downtime deployments**, use this three-phase approach:

### Phase 1: Expand (Additive Changes)

```sql
-- Add new columns/tables without removing old ones
ALTER TABLE tenants ADD COLUMN new_field TEXT;

-- Both old and new code can run simultaneously
```

### Phase 2: Migrate (Dual Write)

```sql
-- Application writes to both old and new columns
-- Background job migrates existing data
UPDATE tenants SET new_field = old_field WHERE new_field IS NULL;
```

### Phase 3: Contract (Remove Old)

```sql
-- Once all code uses new_field, remove old_field
ALTER TABLE tenants DROP COLUMN old_field;
```

**Benefits:**

- No downtime
- Rollback is just reverting code, not data
- Gradual migration reduces risk

## Type Safety with Generated Types

After running migrations, regenerate TypeScript types:

```bash
supabase gen types typescript > packages/database/types/database.ts
```

This creates type-safe interfaces for all tables:

```typescript
import { Database } from "@stairpay/database/types/database";

type PropertyValuation =
  Database["public"]["Tables"]["property_valuations"]["Row"];
type MarketingCampaign =
  Database["public"]["Tables"]["marketing_campaigns"]["Insert"];
```

**Benefits:**

- Autocomplete in IDE
- Compile-time errors for invalid queries
- Refactoring safety across apps

## Testing Migrations

### Checklist

- [ ] Migration runs successfully on fresh database
- [ ] Migration runs successfully on database with existing data
- [ ] Rollback migration cleanly removes changes
- [ ] RLS policies prevent cross-tenant data access
- [ ] Indexes are created for foreign keys and frequently queried columns
- [ ] CHECK constraints prevent invalid data
- [ ] TypeScript types regenerated and packages rebuilt

### Example Test Script

```typescript
// test-migration.ts
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(url, serviceKey);

// Test RLS isolation
const { data: valuations } = await supabase
  .from("property_valuations")
  .select("*")
  .eq("organisation_id", "different-org-id");

// Should return empty array (RLS blocks access)
console.assert(valuations?.length === 0, "RLS policy leaked data!");
```

## Common Pitfalls

### ❌ Don't Do This

```sql
-- Missing IF NOT EXISTS (fails on re-run)
CREATE TABLE property_valuations (...);

-- No RLS policies (data leak risk!)
CREATE TABLE sensitive_data (...);

-- Missing indexes (slow queries)
CREATE TABLE large_table (...);
-- Foreign key on property_id but no index
```

### ✅ Do This

```sql
-- Idempotent
CREATE TABLE IF NOT EXISTS property_valuations (...);

-- Always enable RLS
ALTER TABLE property_valuations ENABLE ROW LEVEL SECURITY;

-- Index foreign keys
CREATE INDEX idx_valuations_property_id ON property_valuations(property_id);
```

## Migration File Organization

```
packages/database/supabase/migrations/
├── 20251130171645_initial_schema.sql       # Initial tables
├── 20251202000000_add_staircasing_features.sql  # Feature addition
├── 20251202000001_rollback_staircasing_features.sql  # Rollback
└── 20251203000000_add_payments_table.sql   # Future migration
```

**Naming Convention:**

- Timestamp: `YYYYMMDDHHMMSS` (ensures ordering)
- Description: snake_case, descriptive (shows intent)
- Rollback: Same timestamp + 1 second, prefixed with `rollback_`

## Further Reading

- [Supabase Migrations Docs](https://supabase.com/docs/guides/database/migrations)
- [PostgreSQL RLS](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Expand-Migrate-Contract Pattern](https://openpracticelibrary.com/practice/expand-and-contract-pattern/)
- [Database Versioning Best Practices](https://www.liquibase.org/get-started/best-practices)

## Summary

1. **Migrations are version control for your database schema**
2. **Always write rollback migrations for safety**
3. **Use RLS policies to enforce multi-tenant isolation**
4. **Test migrations locally before pushing to production**
5. **Regenerate TypeScript types after schema changes**
6. **Use Expand-Migrate-Contract for zero-downtime deployments**

This approach ensures **safe, auditable, and reversible** database evolution.
