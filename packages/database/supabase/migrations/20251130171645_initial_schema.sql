-- Create private schema for security definer functions
CREATE SCHEMA IF NOT EXISTS private;

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'viewer');
CREATE TYPE staircasing_status AS ENUM ('pending', 'approved', 'completed', 'rejected');

-- Organisations table
CREATE TABLE organisations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  address TEXT NOT NULL,
  postcode TEXT NOT NULL,
  property_value DECIMAL(12, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tenants table
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- Enable Row Level Security on all tables
ALTER TABLE organisations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_organisations ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE staircasing_applications ENABLE ROW LEVEL SECURITY;

-- Security definer function to get user's organisations
CREATE OR REPLACE FUNCTION private.get_user_organisations()
RETURNS TABLE(organisation_id UUID, role user_role)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT uo.organisation_id, uo.role
  FROM user_organisations uo
  WHERE uo.user_id = (SELECT auth.uid());
END;
$$;

-- Organisations policies
CREATE POLICY "Users can view their organisations"
  ON organisations FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT organisation_id FROM private.get_user_organisations()
    )
  );

CREATE POLICY "Admins can update their organisations"
  ON organisations FOR UPDATE
  TO authenticated
  USING (
    id IN (
      SELECT organisation_id FROM private.get_user_organisations() WHERE role = 'admin'
    )
  )
  WITH CHECK (
    id IN (
      SELECT organisation_id FROM private.get_user_organisations() WHERE role = 'admin'
    )
  );

-- User organisations policies
CREATE POLICY "Users can view their organisation memberships"
  ON user_organisations FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Admins can manage organisation memberships"
  ON user_organisations FOR ALL
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

-- Properties policies
CREATE POLICY "Users can view properties in their organisations"
  ON properties FOR SELECT
  TO authenticated
  USING (
    organisation_id IN (
      SELECT organisation_id FROM private.get_user_organisations()
    )
  );

CREATE POLICY "Admins can insert properties"
  ON properties FOR INSERT
  TO authenticated
  WITH CHECK (
    organisation_id IN (
      SELECT organisation_id FROM private.get_user_organisations() WHERE role = 'admin'
    )
  );

CREATE POLICY "Admins can update properties"
  ON properties FOR UPDATE
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

CREATE POLICY "Admins can delete properties"
  ON properties FOR DELETE
  TO authenticated
  USING (
    organisation_id IN (
      SELECT organisation_id FROM private.get_user_organisations() WHERE role = 'admin'
    )
  );

-- Tenants policies
CREATE POLICY "Users can view tenants in their organisations"
  ON tenants FOR SELECT
  TO authenticated
  USING (
    organisation_id IN (
      SELECT organisation_id FROM private.get_user_organisations()
    )
  );

CREATE POLICY "Admins can insert tenants"
  ON tenants FOR INSERT
  TO authenticated
  WITH CHECK (
    organisation_id IN (
      SELECT organisation_id FROM private.get_user_organisations() WHERE role = 'admin'
    )
  );

CREATE POLICY "Admins can update tenants"
  ON tenants FOR UPDATE
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

CREATE POLICY "Admins can delete tenants"
  ON tenants FOR DELETE
  TO authenticated
  USING (
    organisation_id IN (
      SELECT organisation_id FROM private.get_user_organisations() WHERE role = 'admin'
    )
  );

-- Staircasing applications policies
CREATE POLICY "Users can view staircasing applications in their organisations"
  ON staircasing_applications FOR SELECT
  TO authenticated
  USING (
    organisation_id IN (
      SELECT organisation_id FROM private.get_user_organisations()
    )
  );

CREATE POLICY "Admins can insert staircasing applications"
  ON staircasing_applications FOR INSERT
  TO authenticated
  WITH CHECK (
    organisation_id IN (
      SELECT organisation_id FROM private.get_user_organisations() WHERE role = 'admin'
    )
  );

CREATE POLICY "Admins can update staircasing applications"
  ON staircasing_applications FOR UPDATE
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

CREATE POLICY "Admins can delete staircasing applications"
  ON staircasing_applications FOR DELETE
  TO authenticated
  USING (
    organisation_id IN (
      SELECT organisation_id FROM private.get_user_organisations() WHERE role = 'admin'
    )
  );
