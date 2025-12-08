-- Add StairPay core features: valuations, campaigns, providers, feedback, insights
-- Migration: 20251202000000_add_staircasing_features.sql

-- Create custom types
CREATE TYPE provider_type AS ENUM ('broker', 'surveyor', 'valuer', 'conveyancer', 'solicitor');
CREATE TYPE campaign_status AS ENUM ('draft', 'active', 'paused', 'completed');
CREATE TYPE trigger_type AS ENUM ('equity_threshold', 'move_in_anniversary', 'property_value_increase', 'manual');

-- Property valuations table (monthly HPI tracking)
CREATE TABLE property_valuations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  valuation_date DATE NOT NULL,
  estimated_value DECIMAL(12, 2) NOT NULL,
  value_change_percent DECIMAL(5, 2),
  hpi_index DECIMAL(10, 4), -- House Price Index value
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(property_id, valuation_date)
);

-- Service providers directory
CREATE TABLE service_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  provider_type provider_type NOT NULL,
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  website TEXT,
  specializations TEXT[],
  is_preferred BOOLEAN DEFAULT false,
  average_rating DECIMAL(3, 2),
  total_referrals INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Marketing campaigns
CREATE TABLE marketing_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status campaign_status NOT NULL DEFAULT 'draft',
  target_segment JSONB, -- Store targeting criteria
  email_template TEXT,
  start_date DATE,
  end_date DATE,
  total_sent INTEGER DEFAULT 0,
  total_opened INTEGER DEFAULT 0,
  total_clicked INTEGER DEFAULT 0,
  total_converted INTEGER DEFAULT 0, -- Led to staircasing application
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Campaign triggers (automation rules)
CREATE TABLE campaign_triggers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  campaign_id UUID NOT NULL REFERENCES marketing_campaigns(id) ON DELETE CASCADE,
  trigger_type trigger_type NOT NULL,
  trigger_conditions JSONB NOT NULL, -- e.g., {"equity_percent": 50, "operator": ">="}
  is_active BOOLEAN DEFAULT true,
  last_triggered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Resident feedback
CREATE TABLE resident_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  nps_score INTEGER CHECK (nps_score >= 0 AND nps_score <= 10),
  satisfaction_score INTEGER CHECK (satisfaction_score >= 1 AND satisfaction_score <= 5),
  feedback_text TEXT,
  category TEXT, -- e.g., 'staircasing_process', 'customer_service', 'platform_usability'
  sentiment TEXT, -- 'positive', 'neutral', 'negative'
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Financial insights (staircasing readiness scores)
CREATE TABLE financial_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  readiness_score DECIMAL(5, 2) NOT NULL CHECK (readiness_score >= 0 AND readiness_score <= 100),
  equity_growth_potential DECIMAL(12, 2), -- How much more equity they could afford
  estimated_monthly_savings DECIMAL(10, 2), -- Rent savings if they staircase
  recommended_action TEXT, -- 'staircase_now', 'save_more', 'wait_for_value_increase'
  factors JSONB, -- Detailed breakdown of score components
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_property_valuations_property_id ON property_valuations(property_id);
CREATE INDEX idx_property_valuations_date ON property_valuations(valuation_date);
CREATE INDEX idx_property_valuations_org_id ON property_valuations(organisation_id);

CREATE INDEX idx_service_providers_org_id ON service_providers(organisation_id);
CREATE INDEX idx_service_providers_type ON service_providers(provider_type);
CREATE INDEX idx_service_providers_preferred ON service_providers(is_preferred);

CREATE INDEX idx_marketing_campaigns_org_id ON marketing_campaigns(organisation_id);
CREATE INDEX idx_marketing_campaigns_status ON marketing_campaigns(status);
CREATE INDEX idx_marketing_campaigns_dates ON marketing_campaigns(start_date, end_date);

CREATE INDEX idx_campaign_triggers_campaign_id ON campaign_triggers(campaign_id);
CREATE INDEX idx_campaign_triggers_org_id ON campaign_triggers(organisation_id);
CREATE INDEX idx_campaign_triggers_active ON campaign_triggers(is_active);

CREATE INDEX idx_resident_feedback_tenant_id ON resident_feedback(tenant_id);
CREATE INDEX idx_resident_feedback_org_id ON resident_feedback(organisation_id);
CREATE INDEX idx_resident_feedback_submitted ON resident_feedback(submitted_at);

CREATE INDEX idx_financial_insights_tenant_id ON financial_insights(tenant_id);
CREATE INDEX idx_financial_insights_org_id ON financial_insights(organisation_id);
CREATE INDEX idx_financial_insights_score ON financial_insights(readiness_score);

-- Updated_at triggers
CREATE TRIGGER update_property_valuations_updated_at BEFORE UPDATE ON property_valuations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_providers_updated_at BEFORE UPDATE ON service_providers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_marketing_campaigns_updated_at BEFORE UPDATE ON marketing_campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaign_triggers_updated_at BEFORE UPDATE ON campaign_triggers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_financial_insights_updated_at BEFORE UPDATE ON financial_insights
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE property_valuations ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_triggers ENABLE ROW LEVEL SECURITY;
ALTER TABLE resident_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_insights ENABLE ROW LEVEL SECURITY;

-- Property valuations policies
CREATE POLICY "Users can view valuations in their organisations"
  ON property_valuations FOR SELECT
  TO authenticated
  USING (
    organisation_id IN (
      SELECT organisation_id FROM private.get_user_organisations()
    )
  );

CREATE POLICY "Admins can insert valuations"
  ON property_valuations FOR INSERT
  TO authenticated
  WITH CHECK (
    organisation_id IN (
      SELECT organisation_id FROM private.get_user_organisations() WHERE role = 'admin'
    )
  );

CREATE POLICY "Admins can update valuations"
  ON property_valuations FOR UPDATE
  TO authenticated
  USING (
    organisation_id IN (
      SELECT organisation_id FROM private.get_user_organisations() WHERE role = 'admin'
    )
  )
  WITH CHECK (
    organisation_id IN (
      SELECT organisation_id FROM private.get_user_organisations() WHERE role = 'admin'
    )
  );

CREATE POLICY "Admins can delete valuations"
  ON property_valuations FOR DELETE
  TO authenticated
  USING (
    organisation_id IN (
      SELECT organisation_id FROM private.get_user_organisations() WHERE role = 'admin'
    )
  );

-- Service providers policies
CREATE POLICY "Users can view service providers in their organisations"
  ON service_providers FOR SELECT
  TO authenticated
  USING (
    organisation_id IN (
      SELECT organisation_id FROM private.get_user_organisations()
    )
  );

CREATE POLICY "Admins can manage service providers"
  ON service_providers FOR ALL
  TO authenticated
  USING (
    organisation_id IN (
      SELECT organisation_id FROM private.get_user_organisations() WHERE role = 'admin'
    )
  )
  WITH CHECK (
    organisation_id IN (
      SELECT organisation_id FROM private.get_user_organisations() WHERE role = 'admin'
    )
  );

-- Marketing campaigns policies
CREATE POLICY "Users can view campaigns in their organisations"
  ON marketing_campaigns FOR SELECT
  TO authenticated
  USING (
    organisation_id IN (
      SELECT organisation_id FROM private.get_user_organisations()
    )
  );

CREATE POLICY "Admins can manage campaigns"
  ON marketing_campaigns FOR ALL
  TO authenticated
  USING (
    organisation_id IN (
      SELECT organisation_id FROM private.get_user_organisations() WHERE role = 'admin'
    )
  )
  WITH CHECK (
    organisation_id IN (
      SELECT organisation_id FROM private.get_user_organisations() WHERE role = 'admin'
    )
  );

-- Campaign triggers policies
CREATE POLICY "Users can view campaign triggers in their organisations"
  ON campaign_triggers FOR SELECT
  TO authenticated
  USING (
    organisation_id IN (
      SELECT organisation_id FROM private.get_user_organisations()
    )
  );

CREATE POLICY "Admins can manage campaign triggers"
  ON campaign_triggers FOR ALL
  TO authenticated
  USING (
    organisation_id IN (
      SELECT organisation_id FROM private.get_user_organisations() WHERE role = 'admin'
    )
  )
  WITH CHECK (
    organisation_id IN (
      SELECT organisation_id FROM private.get_user_organisations() WHERE role = 'admin'
    )
  );

-- Resident feedback policies
CREATE POLICY "Users can view feedback in their organisations"
  ON resident_feedback FOR SELECT
  TO authenticated
  USING (
    organisation_id IN (
      SELECT organisation_id FROM private.get_user_organisations()
    )
  );

CREATE POLICY "Admins can manage feedback"
  ON resident_feedback FOR ALL
  TO authenticated
  USING (
    organisation_id IN (
      SELECT organisation_id FROM private.get_user_organisations() WHERE role = 'admin'
    )
  )
  WITH CHECK (
    organisation_id IN (
      SELECT organisation_id FROM private.get_user_organisations() WHERE role = 'admin'
    )
  );

-- Financial insights policies
CREATE POLICY "Users can view financial insights in their organisations"
  ON financial_insights FOR SELECT
  TO authenticated
  USING (
    organisation_id IN (
      SELECT organisation_id FROM private.get_user_organisations()
    )
  );

CREATE POLICY "Admins can manage financial insights"
  ON financial_insights FOR ALL
  TO authenticated
  USING (
    organisation_id IN (
      SELECT organisation_id FROM private.get_user_organisations() WHERE role = 'admin'
    )
  )
  WITH CHECK (
    organisation_id IN (
      SELECT organisation_id FROM private.get_user_organisations() WHERE role = 'admin'
    )
  );
