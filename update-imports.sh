#!/bin/bash

# Script to update imports from @/types to @stairpay/shared-types

set -e

echo "🔄 Updating imports in apps/housing-association-crm..."

CRM_DIR="apps/housing-association-crm"

# Find all TypeScript/TSX files and update imports
find "$CRM_DIR" -type f \( -name "*.ts" -o -name "*.tsx" \) ! -path "*/node_modules/*" ! -path "*/.next/*" -exec sed -i.bak "s|from '@/types'|from '@stairpay/shared-types'|g" {} \;
find "$CRM_DIR" -type f \( -name "*.ts" -o -name "*.tsx" \) ! -path "*/node_modules/*" ! -path "*/.next/*" -exec sed -i.bak 's|from "@/types"|from "@stairpay/shared-types"|g' {} \;
find "$CRM_DIR" -type f \( -name "*.ts" -o -name "*.tsx" \) ! -path "*/node_modules/*" ! -path "*/.next/*" -exec sed -i.bak "s|} from '@/types'|} from '@stairpay/shared-types'|g" {} \;
find "$CRM_DIR" -type f \( -name "*.ts" -o -name "*.tsx" \) ! -path "*/node_modules/*" ! -path "*/.next/*" -exec sed -i.bak 's|} from "@/types"|} from "@stairpay/shared-types"|g' {} \;

# Clean up backup files
find "$CRM_DIR" -type f -name "*.bak" -delete

echo "✅ Imports updated successfully!"
echo ""
echo "Files modified:"
grep -r "@stairpay/shared-types" "$CRM_DIR" --include="*.ts" --include="*.tsx" | cut -d: -f1 | sort -u
