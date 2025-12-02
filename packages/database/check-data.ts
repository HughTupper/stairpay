import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function checkData() {
  const tables = [
    'property_valuations',
    'marketing_campaigns',
    'campaign_triggers',
    'service_providers',
    'resident_feedback',
    'financial_insights'
  ]
  
  console.log('📊 Checking data in new tables...\n')
  
  for (const table of tables) {
    const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true })
    if (error) {
      console.log(`❌ ${table}: Error - ${error.message}`)
    } else {
      console.log(`✓ ${table}: ${count} records`)
    }
  }
}

checkData()
