# Global Infrastructure

Platform-level AWS infrastructure shared across all StairPay applications.

## Purpose

This package manages global/shared AWS resources:

- **Networking** - VPCs, subnets, NAT gateways
- **Monitoring** - CloudWatch dashboards, alarms
- **Security** - IAM roles, KMS keys, secrets
- **Shared Services** - API Gateway, Load Balancers

## Why Separate from App Infrastructure?

- **Separation of Concerns** - Platform vs application resources
- **Independent Deployment** - Global infra changes don't redeploy apps
- **Multi-App Support** - Shared by CRM, mobile app, admin panel
- **Cost Optimization** - Single VPC for all apps

## Stacks

### NetworkingStack (Future)

- VPC with public/private subnets
- NAT gateways
- VPC endpoints for AWS services

### MonitoringStack (Future)

- CloudWatch dashboard
- SNS topics for alerts
- Log aggregation

### SecurityStack (Future)

- Shared IAM roles
- KMS keys
- Secrets Manager

## Deployment

```bash
# From monorepo root
npm run deploy:infra

# From this directory
npm run deploy

# Preview changes
npm run diff

# Destroy all stacks
npm run destroy
```

## Environment

Set AWS credentials:

```bash
export AWS_PROFILE=your-profile
# or
export AWS_ACCESS_KEY_ID=xxx
export AWS_SECRET_ACCESS_KEY=xxx
export AWS_REGION=eu-west-2
```

## Current State

Currently placeholder for future global infrastructure.

App-specific infrastructure (Amplify deployment) lives in `apps/housing-association-crm/infrastructure/`.

## Roadmap

- [ ] VPC and networking stack
- [ ] Shared monitoring and alerting
- [ ] Cross-account IAM roles
- [ ] Shared API Gateway
- [ ] Global CloudFront distribution
