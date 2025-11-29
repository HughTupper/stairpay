# Quick Setup Guide

## 1. Supabase Setup

### Create Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the database to provision

### Run Migrations

1. Open the SQL Editor in your Supabase dashboard
2. Copy and paste the contents of `supabase/schema.sql` and run it
3. Copy and paste the contents of `supabase/rls-policies.sql` and run it

### Get Credentials

1. Go to Project Settings → API
2. Copy the Project URL and publishable key (starts with `sb_publishable_`)
3. Add to `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your-url-here
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-key-here
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 4. Seed Demo Data (Optional)

```bash
npm run seed
```

This creates 3 housing associations with realistic data.

## 5. Test the Application

1. Sign up at `/signup` with an email and organisation name
2. You'll be logged in as an admin of your organisation
3. Add properties via the Properties page
4. If you seeded data, switch to one of the demo organisations to see populated data

## Next Steps

- Review the README.md for architecture details
- Check the infrastructure folder for AWS CDK deployment
- Explore the multi-tenant RLS policies in `supabase/rls-policies.sql`
