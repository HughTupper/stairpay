-- Rollback migration for StairPay features
-- Migration: 20251202000001_rollback_staircasing_features.sql
-- This migration safely removes tables added in 20251202000000_add_staircasing_features.sql

-- Drop tables in reverse dependency order to avoid foreign key constraint violations

-- Drop financial insights (depends on tenants, properties)
DROP TABLE IF EXISTS financial_insights CASCADE;

-- Drop resident feedback (depends on tenants)
DROP TABLE IF EXISTS resident_feedback CASCADE;

-- Drop campaign triggers (depends on marketing_campaigns)
DROP TABLE IF EXISTS campaign_triggers CASCADE;

-- Drop marketing campaigns
DROP TABLE IF EXISTS marketing_campaigns CASCADE;

-- Drop service providers
DROP TABLE IF EXISTS service_providers CASCADE;

-- Drop property valuations (depends on properties)
DROP TABLE IF EXISTS property_valuations CASCADE;

-- Drop custom types
DROP TYPE IF EXISTS trigger_type;
DROP TYPE IF EXISTS campaign_status;
DROP TYPE IF EXISTS provider_type;

-- Note: The update_updated_at_column() function is shared and should not be dropped
-- Note: RLS policies are automatically removed when tables are dropped
