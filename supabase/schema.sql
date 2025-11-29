-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'viewer');
CREATE TYPE staircasing_status AS ENUM ('pending', 'approved', 'completed', 'rejected');

-- Organisations table
CREATE TABLE organisations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User organisations junction table (many-to-many with roles)
CREATE TABLE user_organisations (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, organisation_id)
);

-- Properties table
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  address TEXT NOT NULL,
  postcode TEXT NOT NULL,
  property_value DECIMAL(12, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tenants table
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  current_equity_percentage DECIMAL(5, 2) NOT NULL DEFAULT 25.00 CHECK (current_equity_percentage >= 0 AND current_equity_percentage <= 100),
  monthly_rent DECIMAL(10, 2) NOT NULL,
  monthly_mortgage DECIMAL(10, 2) NOT NULL,
  monthly_service_charge DECIMAL(10, 2) NOT NULL,
  move_in_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Staircasing applications table
CREATE TABLE staircasing_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  equity_percentage_requested DECIMAL(5, 2) NOT NULL CHECK (equity_percentage_requested > 0 AND equity_percentage_requested <= 100),
  estimated_cost DECIMAL(12, 2) NOT NULL,
  status staircasing_status NOT NULL DEFAULT 'pending',
  application_date TIMESTAMPTZ DEFAULT NOW(),
  approved_date TIMESTAMPTZ,
  completed_date TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_user_organisations_user_id ON user_organisations(user_id);
CREATE INDEX idx_user_organisations_organisation_id ON user_organisations(organisation_id);
CREATE INDEX idx_properties_organisation_id ON properties(organisation_id);
CREATE INDEX idx_tenants_organisation_id ON tenants(organisation_id);
CREATE INDEX idx_tenants_property_id ON tenants(property_id);
CREATE INDEX idx_staircasing_organisation_id ON staircasing_applications(organisation_id);
CREATE INDEX idx_staircasing_tenant_id ON staircasing_applications(tenant_id);
CREATE INDEX idx_staircasing_status ON staircasing_applications(status);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_organisations_updated_at BEFORE UPDATE ON organisations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_staircasing_updated_at BEFORE UPDATE ON staircasing_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
