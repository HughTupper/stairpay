/**
 * Type utilities and helpers for database types
 * Provides convenient exports and utility types for common patterns
 */

import type { Database } from "@stairpay/database/types/database";

// ============================================================================
// Base Table Types
// ============================================================================

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];

// ============================================================================
// Core Entity Types
// ============================================================================

export type Organisation = Tables<"organisations">;
export type UserOrganisation = Tables<"user_organisations">;
export type Property = Tables<"properties">;
export type Tenant = Tables<"tenants">;
export type StaircasingApplication = Tables<"staircasing_applications">;
export type PropertyValuation = Tables<"property_valuations">;
export type ServiceProvider = Tables<"service_providers">;
export type ResidentFeedback = Tables<"resident_feedback">;
export type MarketingCampaign = Tables<"marketing_campaigns">;
export type FinancialInsight = Tables<"financial_insights">;

// Insert types
export type PropertyInsert = TablesInsert<"properties">;
export type TenantInsert = TablesInsert<"tenants">;
export type StaircasingApplicationInsert =
  TablesInsert<"staircasing_applications">;

// Update types
export type PropertyUpdate = TablesUpdate<"properties">;
export type TenantUpdate = TablesUpdate<"tenants">;

// Enum types
export type UserRole = Enums<"user_role">;
export type StaircasingStatus = Enums<"staircasing_status">;
export type ProviderType = Enums<"provider_type">;
export type TriggerType = Enums<"trigger_type">;
export type CampaignStatus = Enums<"campaign_status">;

// ============================================================================
// Joined/Nested Types
// ============================================================================

/**
 * Property with its latest valuation data
 */
export type PropertyWithValuations = Property & {
  property_valuations: PropertyValuation[] | null;
};

/**
 * Property with aggregated valuation info for list views
 */
export type PropertyWithValuationSummary = {
  id: string;
  address: string;
  postcode: string;
  originalValue: number;
  currentValue: number;
  valuationDate: string | null;
  monthlyChange: number;
  yearlyChange: string;
};

/**
 * Tenant with their property details
 */
export type TenantWithProperty = Tenant & {
  properties: {
    address: string;
    postcode: string;
  } | null;
};

/**
 * Tenant with full property and application details
 */
export type TenantDetail = Tenant & {
  properties: Property | null;
  staircasing_applications: StaircasingApplication[] | null;
};

/**
 * Feedback with associated tenant information
 */
export type FeedbackWithTenant = ResidentFeedback & {
  tenants: {
    first_name: string | null;
    last_name: string | null;
    email: string | null;
  } | null;
};

/**
 * Staircasing application with tenant and property details
 */
export type StaircasingApplicationDetail = StaircasingApplication & {
  tenants: {
    first_name: string | null;
    last_name: string | null;
    email: string | null;
  } | null;
  properties: {
    address: string;
    postcode: string;
  } | null;
};

/**
 * Organisation with user's role
 */
export type OrganisationWithRole = {
  id: string;
  name: string;
  role: UserRole;
};

// ============================================================================
// Dashboard Metrics Types
// ============================================================================

export type DashboardMetrics = {
  propertyCount: number;
  tenantCount: number;
  pendingApplications: number;
  completedApplications: number;
  avgNPS: number;
  avgSatisfaction: number;
  campaignConversionRate: number;
  topInsights: FinancialInsight[];
};
