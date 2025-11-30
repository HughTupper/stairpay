#!/bin/bash

# Migration script for monorepo restructuring
# This script moves files from the old structure to the new monorepo structure

set -e

echo "🚀 Starting monorepo migration..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 1. Backup current package files
echo -e "${BLUE}📦 Backing up configuration files...${NC}"
mv package.json package.json.old
mv .gitignore .gitignore.old
mv package.json.new package.json
mv .gitignore.new .gitignore

# 2. Move Next.js app files to apps/housing-association-crm
echo -e "${BLUE}🏠 Moving Next.js app to apps/housing-association-crm...${NC}"
mv app apps/housing-association-crm/
mv components apps/housing-association-crm/
mv actions apps/housing-association-crm/
mv utils apps/housing-association-crm/
mv lib apps/housing-association-crm/
mv public apps/housing-association-crm/
mv middleware.ts apps/housing-association-crm/
mv next.config.ts apps/housing-association-crm/
mv postcss.config.mjs apps/housing-association-crm/
mv eslint.config.mjs apps/housing-association-crm/

# 3. Move infrastructure to apps/housing-association-crm/infrastructure
echo -e "${BLUE}🏗️  Moving Amplify infrastructure...${NC}"
mv infrastructure apps/housing-association-crm/

# 4. Move Supabase files to packages/database
echo -e "${BLUE}💾 Moving database files to packages/database...${NC}"
mv supabase packages/database/

# 5. Move seed.ts to packages/database
mv apps/housing-association-crm/lib/seed.ts packages/database/seed.ts

# 6. Clean up old environment files
echo -e "${BLUE}🔧 Moving environment files...${NC}"
cp .env.example apps/housing-association-crm/.env.example
cp .env.local apps/housing-association-crm/.env.local 2>/dev/null || true

# 7. Install dependencies
echo -e "${BLUE}📥 Installing dependencies...${NC}"
npm install

# 8. Initialize Supabase in database package
echo -e "${BLUE}🎯 Initializing Supabase CLI...${NC}"
cd packages/database
npx supabase init

echo -e "${GREEN}✅ Monorepo migration complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Review the changes with 'git status'"
echo "2. Convert SQL files to migrations:"
echo "   cd packages/database"
echo "   npm run db:migration -- initial_schema"
echo "   # Copy contents of supabase/schema.sql into the new migration"
echo "   npm run db:migration -- rls_policies" 
echo "   # Copy contents of supabase/rls-policies.sql into the new migration"
echo "3. Start local development:"
echo "   npm run db:start"
echo "   npm run db:reset"
echo "   npm run dev:crm"
echo ""
echo "4. Update imports in apps/housing-association-crm:"
echo "   Find: from '@/types'"
echo "   Replace: from '@stairpay/shared-types'"
