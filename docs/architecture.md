<!-- TODO review  -->

# StairPay Architecture

## Overview

StairPay is built as a **monorepo platform** designed to scale from a single CRM application to a complete property management ecosystem.

## Architecture Decisions

### Monorepo Pattern

**Decision**: Use npm workspaces + Turborepo instead of polyrepo.

**Rationale**:

- **Code Sharing**: Database schema, types shared across apps
- **Atomic Changes**: Update schema + apps in single PR
- **Build Efficiency**: Turborepo caches and parallelizes builds
- **Type Safety**: End-to-end TypeScript across packages
- **Developer Experience**: Single `npm install`, unified tooling

**Tradeoffs**:

- ✅ Easier refactoring across apps
- ✅ Consistent tooling and versions
- ❌ Larger repo size (not an issue yet)
- ❌ Need discipline with package boundaries

### Infrastructure as Code

**Decision**: AWS CDK (TypeScript) for infrastructure.

**Rationale**:

- **Type Safety**: Same language as application code
- **IDE Support**: Auto-complete, inline docs
- **Amplify Constructs**: Built-in Next.js SSR support
- **Familiarity**: Team already uses TypeScript

**Alternative Considered**: Terraform

- ✅ More mature, industry standard
- ❌ HCL learning curve
- ❌ Less type-safe
- ❌ Weaker Amplify support

**Decision**: Colocate app-specific infrastructure with apps.

**Rationale**:

- Amplify deployment lives in `apps/housing-association-crm/infrastructure/`
- Keeps deployment context close to code
- Changes to app infrastructure don't affect other apps
- Global infrastructure (VPCs, monitoring) in separate `apps/infrastructure/`

### Database Management

**Decision**: Supabase with CLI-managed migrations.

**Rationale**:

- **Version Control**: All schema changes in Git
- **Local Development**: Docker-based Supabase instance
- **Type Generation**: Auto-generate TypeScript types
- **Multi-Tenant**: Built-in RLS for data isolation
- **Auth**: Integrated authentication system

**Alternative Considered**: Prisma

- ✅ Better TypeScript integration
- ✅ Migrations as code
- ❌ No built-in auth
- ❌ RLS requires raw SQL anyway
- ❌ Less multi-tenant focused

**Decision**: Database lives in `packages/database/`.

**Rationale**:

- Shared by all apps (CRM, mobile, admin)
- Migrations independent of app deployments
- Type generation published as package
- Infrastructure for Supabase provisioning colocated

### Multi-Tenancy

**Decision**: Session-based organization context + PostgreSQL RLS.

**Rationale**:

- **Security**: Database-level isolation
- **Performance**: Queries auto-filtered by DB
- **Simplicity**: No app-level filtering logic
- **Audit**: All access logged by DB

**Flow**:

1. User logs in (Supabase Auth)
2. User belongs to N organizations (junction table)
3. User selects organization → stored in HTTP-only cookie
4. Server reads cookie → passes to RLS via `set_config()`
5. Database enforces access automatically

**Alternative Considered**: App-level filtering

- ✅ More flexible
- ❌ Error-prone (easy to miss filter)
- ❌ No DB-level guarantees
- ❌ Harder to audit

### Deployment Strategy

**Decision**: Auto-deploy with rollback capabilities.

**Rationale**:

- **Speed**: Deploy on merge to main
- **Confidence**: Comprehensive CI checks before merge
- **Safety**: Auto-rollback on failure
- **Audit Trail**: Every deployment logged in GitHub

**Pipeline**:

```
PR → Lint/Type/Build → Review → Merge
      ↓
Main → Deploy → Health Check → Success/Rollback
```

**Rollback Strategy**:

- **App Deployment**: Redeploy previous commit
- **Database Migrations**: Create reverse migration
- **Monitoring**: CloudWatch alarms trigger alerts

### Package Structure

**Decision**: Three package types - apps, packages, infrastructure.

**`apps/`** - Independently deployable applications

- `housing-association-crm/` - Next.js CRM
- `infrastructure/` - Global AWS resources
- Future: `mobile/`, `admin/`, `api/`

**`packages/`** - Reusable code libraries

- `database/` - Supabase schema, migrations, types
- `shared-types/` - Common TypeScript types
- Future: `ui/`, `utils/`, `config/`

**Rationale**:

- Clear separation between deployable vs shared code
- Apps can evolve independently
- Packages enable code reuse without duplication
- Easy to add new apps consuming same packages

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         GitHub                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Monorepo     │  │ CI/CD        │  │ Secrets      │     │
│  │ Source Code  │──│ Actions      │──│ Management   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ├─── Push to main
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐      ┌──────────────┐     ┌──────────────┐
│   Supabase   │      │ AWS Amplify  │     │  AWS CDK     │
│              │      │              │     │              │
│ • PostgreSQL │      │ • Next.js    │     │ • CloudFormation
│ • RLS        │◄─────┤   SSR        │     │ • IAM Roles  │
│ • Auth       │      │ • CloudFront │     │ • Monitoring │
│ • Migrations │      │ • Build/Deploy     │              │
└──────────────┘      └──────────────┘     └──────────────┘
        │                     │
        │                     │
        └──────────┬──────────┘
                   │
                   ▼
           ┌──────────────┐
           │   End Users  │
           │              │
           │ • Housing    │
           │   Associations
           │ • Tenants    │
           │ • Admins     │
           └──────────────┘
```

## Data Flow

### Authentication Flow

```
1. User → Login page
2. Supabase Auth → JWT token
3. Token stored in HTTP-only cookie
4. Middleware validates token on each request
5. User lands on dashboard
```

### Multi-Tenant Data Access

```
1. User requests /properties
2. Server reads org ID from cookie
3. Creates Supabase client with user session
4. Query: SELECT * FROM properties
5. RLS policy auto-adds: WHERE org_id IN (user's orgs)
6. Only user's org data returned
```

### Deployment Flow

```
1. Developer pushes to feature branch
2. CI runs lint/type/build checks
3. PR review
4. Merge to main
5. GitHub Action triggers:
   a. Database migrations (if changed)
   b. Build shared packages
   c. Build CRM app
   d. Deploy CDK stack to AWS
   e. Amplify builds and deploys Next.js
6. Health check
7. Success → done
   Failure → rollback to previous version
```

## Security Model

### Layers of Security

1. **Network**: CloudFront → Amplify (HTTPS only)
2. **Application**: Supabase Auth (JWT validation)
3. **Authorization**: Role-based access (admin/viewer)
4. **Data**: PostgreSQL RLS (tenant isolation)
5. **Secrets**: Environment variables (never in code)

### Threat Model

| Threat                 | Mitigation                      |
| ---------------------- | ------------------------------- |
| Unauthorized access    | Supabase Auth + JWT             |
| Cross-tenant data leak | PostgreSQL RLS policies         |
| SQL injection          | Supabase client (parameterized) |
| XSS                    | Next.js auto-escaping           |
| CSRF                   | HTTP-only cookies               |
| Secrets exposure       | Env vars, AWS Secrets Manager   |

## Scalability

### Current Scale

- **Users**: <1000
- **Orgs**: <100
- **Properties**: <10,000
- **Tenants**: <10,000

### Scaling Strategy

**Database**:

- Supabase auto-scales (managed PostgreSQL)
- Connection pooling enabled
- Indexes on foreign keys
- RLS optimized with security definer functions

**Application**:

- Amplify auto-scales (CloudFront CDN)
- SSR for SEO, client-side for interactivity
- React Suspense for progressive loading
- Optimistic UI for perceived performance

**Future Optimizations** (if needed):

- Database read replicas
- Redis caching layer
- CDN for static assets
- GraphQL API for efficient queries

## Monitoring

### Application Metrics

- CloudWatch (via Amplify)
- Request counts, error rates
- Response times
- Build failures

### Database Metrics

- Supabase Dashboard
- Query performance
- Connection pool usage
- RLS policy execution time

### Alerts

- Build failures → GitHub notifications
- Error rate spikes → CloudWatch alarms
- Database slow queries → Supabase alerts

## Cost Analysis

### Current Infrastructure

| Service        | Monthly Cost (estimate) |
| -------------- | ----------------------- |
| Supabase (Pro) | $25                     |
| AWS Amplify    | ~$15 (low traffic)      |
| CloudFormation | Free                    |
| GitHub Actions | Free (public repo)      |
| **Total**      | **~$40/month**          |

### Scaling Costs

- +1000 users: +$50/month (Amplify bandwidth)
- +10k database rows: Included in Supabase Pro
- Production monitoring: +$10/month (CloudWatch)

## Trade-offs

### What We Optimized For

✅ **Developer Experience** - Fast iteration, type safety
✅ **Type Safety** - End-to-end TypeScript
✅ **Security** - Multi-tenant isolation, RLS
✅ **Scalability** - Managed services, auto-scaling
✅ **Cost** - Serverless, pay-per-use

### What We Sacrificed

❌ **Vendor Lock-in** - Tied to AWS + Supabase
❌ **Self-hosting** - No on-premise option
❌ **Complex Queries** - RLS adds overhead
❌ **Full Control** - Managed services limit customization

## Future Architecture

### Phase 2: Mobile App

```
apps/mobile/
├── React Native app
└── Uses @stairpay/database types
```

### Phase 3: Admin Portal

```
apps/admin/
├── Super-admin dashboard
├── Cross-org analytics
└── System configuration
```

### Phase 4: API Service

```
apps/api/
├── GraphQL API
├── Third-party integrations
└── Webhooks
```

### Phase 5: Shared Infrastructure

```
apps/infrastructure/
├── Shared VPC
├── Global monitoring
├── API Gateway
└── Service mesh
```

## Lessons Learned

### What Worked Well

- ✅ Monorepo enabled rapid iteration
- ✅ Supabase RLS eliminated tenant leak bugs
- ✅ CDK provided type-safe infrastructure
- ✅ Turborepo sped up builds significantly
- ✅ Auto-deploy with rollback gave confidence

### What We'd Do Differently

- Consider Prisma for better type generation
- Add E2E tests earlier in project
- Set up staging environment from day 1
- Document API contracts before building

## Conclusion

This architecture balances:

- **Speed** - Fast development, quick deployments
- **Safety** - Type safety, data isolation, rollbacks
- **Scale** - Managed services, auto-scaling
- **Cost** - Efficient, pay-per-use model

Built for a technical assessment but designed for production use at scale.

---

Notes

Why?

- Note using publishable keys instead of anon keys
- Using CDK instead of Terraform
- The Expand-Migrate-Contract Pattern - DB updates without downtime
-
- Supabase migrations, staging environments, pipelines
- Ops as code look at supabase CLI.
- Not prisma, use Postgress directly with RLS. Supabase gen types for typescript. Looks like SQL.
-

- Supabase auth. Cloudflare turnstile - https://supabase.com/docs/guides/auth/auth-captcha. cloudflare.com/application-services/products/turnstile/
- Client side Supabase
- Implement env - theo
- Centralising routes
