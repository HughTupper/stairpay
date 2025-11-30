/**
 * Centralized route configuration
 * All application routes are defined here to ensure consistency
 */

export const routes = {
  // Public routes
  home: "/",
  login: "/login",
  signup: "/signup",

  // Dashboard routes
  dashboard: {
    root: "/dashboard",
    properties: "/dashboard/properties",
    tenants: "/dashboard/tenants",
    tenant: (id: string) => `/dashboard/tenants/${id}`,
  },

  // API routes
  api: {
    organisationSwitch: "/api/organisation/switch",
  },
} as const;
