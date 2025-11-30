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
