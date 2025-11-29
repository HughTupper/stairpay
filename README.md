# StairProperty - Multi-Tenant Shared Ownership Platform

A modern property management platform for housing associations managing shared ownership tenants. Built with Next.js 15, Supabase, and deployed on AWS Amplify.

## 🏗️ Architecture Overview

This application demonstrates a production-ready multi-tenant SaaS architecture with:

- **Session-based tenancy**: Organisation context stored in secure HTTP-only cookies
- **Row Level Security (RLS)**: Database-level multi-tenant data isolation via Supabase
- **Role-based access control**: Admin and viewer roles with granular permissions
- **Server Actions**: Modern data mutations with optimistic UI updates
- **Progressive loading**: React Suspense boundaries for streaming HTML
- **Dark mode**: Class-based theme switching with localStorage persistence

## 🚀 Tech Stack

- **Framework**: Next.js 15.5.6 (App Router)
- **Language**: TypeScript 5
- **Database**: Supabase (PostgreSQL with RLS)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS 4
- **Infrastructure**: AWS CDK (TypeScript)
- **Hosting**: AWS Amplify
- **Validation**: Zod

## 🎯 Key Features

### Multi-Tenancy
- Organisation-scoped data isolation enforced at database level
- Users can belong to multiple organisations with different roles
- Secure organisation context switching via encrypted cookies

### Property Management
- Create, view, and manage shared ownership properties
- Optimistic UI updates with `useOptimistic` hook
- Server Actions for type-safe mutations
- Real-time validation with Zod schemas

### Tenant Equity Tracking
- Visual equity ownership timeline
- Monthly payment breakdown (rent/mortgage/service charge)
- Staircasing application history with status tracking
- Affordability calculations

### Modern UI/UX
- Dark mode toggle (light/dark/system)
- Progressive loading with Suspense boundaries
- Error boundaries with retry functionality
- Responsive design for mobile/tablet/desktop

## 📦 Getting Started

### Prerequisites

- Node.js 20+ 
- npm or yarn
- Supabase account
- AWS account (for deployment)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd stairpay
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

### Database Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)

2. Run the schema migration:
```sql
-- In Supabase SQL Editor, run:
supabase/schema.sql
```

3. Apply Row Level Security policies:
```sql
-- In Supabase SQL Editor, run:
supabase/rls-policies.sql
```

4. (Optional) Seed demo data:
```bash
npm run seed
```

This creates 3 housing associations with realistic data:
- Thames Valley Housing
- London & Quadrant
- Clarion Housing

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏛️ Infrastructure as Code

### Why AWS CDK over Terraform?

While I understand the team uses Terraform, I chose AWS CDK for this technical test to demonstrate:

1. **TypeScript Consistency**: Share types and utilities across infrastructure and application code
2. **Type Safety**: Catch configuration errors at compile-time, not deploy-time
3. **Superior Amplify Constructs**: AWS CDK has first-class support for Amplify with better abstractions
4. **Programmatic Infrastructure**: Leverage loops, conditionals, and functions for DRY infrastructure
5. **Faster Iteration**: IntelliSense and autocomplete for all AWS resources

**Note**: The patterns and architecture shown are easily translatable to Terraform HCL. The CDK code serves as a blueprint for infrastructure requirements.

### CDK Deployment

```bash
cd infrastructure
npm install
cdk bootstrap
cdk deploy
```

The CDK stack provisions:
- AWS Amplify application
- Environment variables for Supabase
- Custom domain configuration
- Branch-based deployments (main → production, feature → preview)
- Build settings optimized for Next.js 15

## 📁 Project Structure

```
stairpay/
├── actions/              # Server Actions
│   ├── auth.ts          # Authentication actions
│   └── properties.ts    # Property CRUD actions
├── app/
│   ├── (auth)/          # Auth route group
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/     # Protected route group
│   │   ├── properties/
│   │   ├── tenants/
│   │   ├── layout.tsx   # Dashboard layout with nav
│   │   ├── loading.tsx  # Loading skeleton
│   │   └── error.tsx    # Error boundary
│   ├── api/             # Route handlers
│   └── layout.tsx       # Root layout
├── components/          # React components
│   ├── theme-toggle.tsx
│   ├── organisation-switcher.tsx
│   └── property-form.tsx
├── infrastructure/      # AWS CDK
│   └── lib/
│       └── amplify-stack.ts
├── lib/                 # Utilities
│   └── seed.ts         # Database seeding script
├── supabase/           # Database
│   ├── schema.sql      # Table definitions
│   └── rls-policies.sql # Security policies
├── types/              # TypeScript types
├── utils/
│   └── supabase/       # Supabase clients
│       ├── client.ts   # Browser client
│       ├── server.ts   # Server component client
│       └── middleware.ts # Session management
└── middleware.ts       # Next.js middleware
```

## 🔒 Security

### Multi-Tenant Isolation

Data isolation is enforced at multiple levels:

1. **Database RLS Policies**: PostgreSQL row-level security filters queries by organisation
2. **Security Definer Functions**: Optimize complex permission checks
3. **Server-Side Validation**: All mutations validate organisation membership
4. **Cookie-Based Context**: HTTP-only cookies prevent XSS attacks

### Authentication Flow

```
User Sign Up → Create User (Supabase Auth)
           → Create Organisation
           → Link User to Organisation (admin role)
           → Set organisation cookie
           → Redirect to dashboard
```

### Role-Based Access Control

- **Admin**: Full CRUD on properties, tenants, and applications
- **Viewer**: Read-only access to organisation data

Enforced via:
- RLS policies checking `user_organisations.role`
- Server Action validation before mutations
- UI-level conditional rendering

## 🎨 UI Patterns

### Dark Mode Implementation

```typescript
// Class-based strategy with system preference fallback
localStorage.theme === 'dark'    → Force dark
localStorage.theme === 'light'   → Force light  
localStorage.theme === undefined → System preference
```

### Optimistic Updates

Properties created via Server Actions show instantly in the UI:

```tsx
const [optimisticProps, addOptimistic] = useOptimistic(
  properties,
  (state, newProp) => [...state, newProp]
)
```

### Progressive Loading

Suspense boundaries stream HTML for fast perceived performance:

```tsx
<Suspense fallback={<PropertyListSkeleton />}>
  <PropertyList />
</Suspense>
```

## 📊 Domain Model

### Core Entities

- **Organisations**: Housing associations managing properties
- **User Organisations**: Junction table with role-based permissions
- **Properties**: Shared ownership properties with valuation
- **Tenants**: Residents with equity percentages and monthly payments
- **Staircasing Applications**: Requests to purchase additional equity

### Business Logic

**Staircasing**: The process where shared ownership tenants purchase additional equity in their property, increasing ownership percentage from the initial share (typically 25-75%) toward 100% ownership.

**Monthly Payments**:
- **Rent**: Paid on the portion not owned (decreases as equity increases)
- **Mortgage**: Paid on the owned portion
- **Service Charge**: Building maintenance (fixed regardless of equity)

## 🧪 Testing the Application

1. Sign up with an email and create your organisation
2. Add properties via the Properties page
3. Run seed script to populate demo tenants
4. View tenant details and staircasing history
5. Test organisation switching (create a second org via signup)
6. Toggle dark mode and verify persistence
7. Test optimistic UI updates on property creation

## 🚢 Deployment

### Manual Deployment

```bash
# Build production bundle
npm run build

# Test production locally
npm start
```

### AWS Amplify Deployment

The CDK stack automatically:
1. Connects to your Git repository
2. Triggers builds on push to main
3. Creates preview environments for feature branches
4. Provisions SSL certificates
5. Configures environment variables

### Environment Variables

Required in Amplify:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

## 🔍 Technical Decisions

### Next.js 15 Async APIs

All request APIs (`cookies()`, `headers()`, `params`) are now async:

```typescript
const cookieStore = await cookies()  // Next.js 15
const cookieStore = cookies()        // Next.js 14 (deprecated)
```

### Server Actions Return Types

Structured error handling:

```typescript
type ActionState<T> = {
  error?: string
  success?: boolean  
  data?: T
}
```

Benefits:
- Type-safe error handling
- No try/catch in client components
- Easy to display inline errors

### Supabase SSR Package

Using `@supabase/ssr` instead of `@supabase/auth-helpers-nextjs`:
- Better Next.js 15 compatibility
- Simplified cookie management
- Works with App Router middleware

## 📈 Future Enhancements

- [ ] Real-time updates with Supabase Realtime
- [ ] Document upload for staircasing applications
- [ ] Email notifications for application status changes
- [ ] Advanced analytics dashboard
- [ ] Export reports to PDF
- [ ] Integration with property valuation APIs
- [ ] Multi-factor authentication
- [ ] Audit logs for compliance

## 📝 Notes for Reviewers

This technical test demonstrates:

✅ **Modern Next.js 15 patterns** - Server Actions, Suspense, async request APIs
✅ **Enterprise authentication** - Multi-tenant with RBAC
✅ **Database architecture** - RLS policies, security definer functions
✅ **Type safety** - End-to-end TypeScript with Zod validation
✅ **UX polish** - Dark mode, optimistic updates, error boundaries
✅ **Infrastructure** - AWS CDK with Amplify deployment
✅ **Domain knowledge** - Understanding of Stairpay's shared ownership business

The application is intentionally focused on core features to keep scope manageable while showcasing architectural thinking and technical depth appropriate for a technical lead role.

## 📄 License

MIT

## 🤝 Contact

Built as a technical assessment for Stairpay.
