# Shared Types Package

Application-level TypeScript types shared across the StairPay monorepo.

## Purpose

- 🔒 **Application logic types** - Server Action responses, UI state, business abstractions
- 📦 **Zero dependencies** - Pure TypeScript definitions
- 🔄 **Reusable** - Import across all workspace packages

**Note**: For database types (tables, enums), use `@stairpay/database/types/database` instead.

## Installation

This is a private workspace package. Import from any app or package in the monorepo:

```typescript
import type { ActionState } from "@stairpay/shared-types";
import type { Database } from "@stairpay/database/types/database";
```

## Available Types

### ActionState

Generic type for Server Action responses:

```typescript
type ActionState<T = unknown> = {
  error?: string;
  success?: boolean;
  data?: T;
};

// Usage
async function createProperty(
  formData: FormData
): Promise<ActionState<Property>> {
  try {
    const property = await db.insert(formData);
    return { success: true, data: property };
  } catch (error) {
    return { error: "Failed to create property" };
  }
}
```

## Usage Example

```typescript
import type { ActionState } from "@stairpay/shared-types";
import type { Database } from "@stairpay/database/types/database";

type Property = Database["public"]["Tables"]["properties"]["Row"];

export async function createProperty(
  formData: FormData
): Promise<ActionState<Property>> {
  try {
    const property = await db.insert(formData);
    return { success: true, data: property };
  } catch (error) {
    return { error: "Failed to create property" };
  }
}
```

## Development

```bash
# Build types
npm run build

# Type check
npm run typecheck
```

## When to Use Each Package

| Type                    | Package                    | Example                                             |
| ----------------------- | -------------------------- | --------------------------------------------------- |
| Server Action responses | `@stairpay/shared-types`   | `ActionState<Property>`                             |
| Database tables         | `@stairpay/database/types` | `Database["public"]["Tables"]["properties"]["Row"]` |
| Database enums          | `@stairpay/database/types` | `Database["public"]["Enums"]["user_role"]`          |
| Component-specific      | Component file             | `interface DashboardProps { ... }`                  |

## Adding New Types

1. Add type definitions to `src/index.ts`
2. Run `npm run build` to compile
3. Import from `@stairpay/shared-types` in any workspace package

**Keep types focused on application abstractions**, not database entities. Database types are auto-generated from your Supabase schema.
