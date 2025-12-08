export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      campaign_triggers: {
        Row: {
          campaign_id: string
          created_at: string | null
          id: string
          is_active: boolean | null
          last_triggered_at: string | null
          organisation_id: string
          trigger_conditions: Json
          trigger_type: Database["public"]["Enums"]["trigger_type"]
          updated_at: string | null
        }
        Insert: {
          campaign_id: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_triggered_at?: string | null
          organisation_id: string
          trigger_conditions: Json
          trigger_type: Database["public"]["Enums"]["trigger_type"]
          updated_at?: string | null
        }
        Update: {
          campaign_id?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_triggered_at?: string | null
          organisation_id?: string
          trigger_conditions?: Json
          trigger_type?: Database["public"]["Enums"]["trigger_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_triggers_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "marketing_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_triggers_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_insights: {
        Row: {
          calculated_at: string | null
          created_at: string | null
          equity_growth_potential: number | null
          estimated_monthly_savings: number | null
          factors: Json | null
          id: string
          organisation_id: string
          property_id: string
          readiness_score: number
          recommended_action: string | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          calculated_at?: string | null
          created_at?: string | null
          equity_growth_potential?: number | null
          estimated_monthly_savings?: number | null
          factors?: Json | null
          id?: string
          organisation_id: string
          property_id: string
          readiness_score: number
          recommended_action?: string | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          calculated_at?: string | null
          created_at?: string | null
          equity_growth_potential?: number | null
          estimated_monthly_savings?: number | null
          factors?: Json | null
          id?: string
          organisation_id?: string
          property_id?: string
          readiness_score?: number
          recommended_action?: string | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_insights_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_insights_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_insights_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      marketing_campaigns: {
        Row: {
          created_at: string | null
          description: string | null
          email_template: string | null
          end_date: string | null
          id: string
          name: string
          organisation_id: string
          start_date: string | null
          status: Database["public"]["Enums"]["campaign_status"]
          target_segment: Json | null
          total_clicked: number | null
          total_converted: number | null
          total_opened: number | null
          total_sent: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          email_template?: string | null
          end_date?: string | null
          id?: string
          name: string
          organisation_id: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["campaign_status"]
          target_segment?: Json | null
          total_clicked?: number | null
          total_converted?: number | null
          total_opened?: number | null
          total_sent?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          email_template?: string | null
          end_date?: string | null
          id?: string
          name?: string
          organisation_id?: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["campaign_status"]
          target_segment?: Json | null
          total_clicked?: number | null
          total_converted?: number | null
          total_opened?: number | null
          total_sent?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marketing_campaigns_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      organisations: {
        Row: {
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string
          created_at: string | null
          id: string
          organisation_id: string
          postcode: string
          property_value: number
          updated_at: string | null
        }
        Insert: {
          address: string
          created_at?: string | null
          id?: string
          organisation_id: string
          postcode: string
          property_value: number
          updated_at?: string | null
        }
        Update: {
          address?: string
          created_at?: string | null
          id?: string
          organisation_id?: string
          postcode?: string
          property_value?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      property_valuations: {
        Row: {
          created_at: string | null
          estimated_value: number
          hpi_index: number | null
          id: string
          notes: string | null
          organisation_id: string
          property_id: string
          updated_at: string | null
          valuation_date: string
          value_change_percent: number | null
        }
        Insert: {
          created_at?: string | null
          estimated_value: number
          hpi_index?: number | null
          id?: string
          notes?: string | null
          organisation_id: string
          property_id: string
          updated_at?: string | null
          valuation_date: string
          value_change_percent?: number | null
        }
        Update: {
          created_at?: string | null
          estimated_value?: number
          hpi_index?: number | null
          id?: string
          notes?: string | null
          organisation_id?: string
          property_id?: string
          updated_at?: string | null
          valuation_date?: string
          value_change_percent?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "property_valuations_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_valuations_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      resident_feedback: {
        Row: {
          category: string | null
          created_at: string | null
          feedback_text: string | null
          id: string
          nps_score: number | null
          organisation_id: string
          satisfaction_score: number | null
          sentiment: string | null
          submitted_at: string | null
          tenant_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          feedback_text?: string | null
          id?: string
          nps_score?: number | null
          organisation_id: string
          satisfaction_score?: number | null
          sentiment?: string | null
          submitted_at?: string | null
          tenant_id: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          feedback_text?: string | null
          id?: string
          nps_score?: number | null
          organisation_id?: string
          satisfaction_score?: number | null
          sentiment?: string | null
          submitted_at?: string | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "resident_feedback_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resident_feedback_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      service_providers: {
        Row: {
          average_rating: number | null
          company_name: string
          contact_name: string
          created_at: string | null
          email: string
          id: string
          is_preferred: boolean | null
          organisation_id: string
          phone: string
          provider_type: Database["public"]["Enums"]["provider_type"]
          specializations: string[] | null
          total_referrals: number | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          average_rating?: number | null
          company_name: string
          contact_name: string
          created_at?: string | null
          email: string
          id?: string
          is_preferred?: boolean | null
          organisation_id: string
          phone: string
          provider_type: Database["public"]["Enums"]["provider_type"]
          specializations?: string[] | null
          total_referrals?: number | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          average_rating?: number | null
          company_name?: string
          contact_name?: string
          created_at?: string | null
          email?: string
          id?: string
          is_preferred?: boolean | null
          organisation_id?: string
          phone?: string
          provider_type?: Database["public"]["Enums"]["provider_type"]
          specializations?: string[] | null
          total_referrals?: number | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_providers_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      staircasing_applications: {
        Row: {
          application_date: string | null
          approved_date: string | null
          completed_date: string | null
          created_at: string | null
          equity_percentage_requested: number
          estimated_cost: number
          id: string
          notes: string | null
          organisation_id: string
          property_id: string
          status: Database["public"]["Enums"]["staircasing_status"]
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          application_date?: string | null
          approved_date?: string | null
          completed_date?: string | null
          created_at?: string | null
          equity_percentage_requested: number
          estimated_cost: number
          id?: string
          notes?: string | null
          organisation_id: string
          property_id: string
          status?: Database["public"]["Enums"]["staircasing_status"]
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          application_date?: string | null
          approved_date?: string | null
          completed_date?: string | null
          created_at?: string | null
          equity_percentage_requested?: number
          estimated_cost?: number
          id?: string
          notes?: string | null
          organisation_id?: string
          property_id?: string
          status?: Database["public"]["Enums"]["staircasing_status"]
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staircasing_applications_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staircasing_applications_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staircasing_applications_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          created_at: string | null
          current_equity_percentage: number
          email: string
          first_name: string
          id: string
          last_name: string
          monthly_mortgage: number
          monthly_rent: number
          monthly_service_charge: number
          move_in_date: string
          organisation_id: string
          phone: string | null
          property_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_equity_percentage?: number
          email: string
          first_name: string
          id?: string
          last_name: string
          monthly_mortgage: number
          monthly_rent: number
          monthly_service_charge: number
          move_in_date: string
          organisation_id: string
          phone?: string | null
          property_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_equity_percentage?: number
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          monthly_mortgage?: number
          monthly_rent?: number
          monthly_service_charge?: number
          move_in_date?: string
          organisation_id?: string
          phone?: string | null
          property_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tenants_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenants_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      user_organisations: {
        Row: {
          created_at: string | null
          organisation_id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          organisation_id: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          organisation_id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_organisations_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      campaign_status: "draft" | "active" | "paused" | "completed"
      provider_type:
        | "broker"
        | "surveyor"
        | "valuer"
        | "conveyancer"
        | "solicitor"
      staircasing_status: "pending" | "approved" | "completed" | "rejected"
      trigger_type:
        | "equity_threshold"
        | "move_in_anniversary"
        | "property_value_increase"
        | "manual"
      user_role: "admin" | "viewer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      campaign_status: ["draft", "active", "paused", "completed"],
      provider_type: [
        "broker",
        "surveyor",
        "valuer",
        "conveyancer",
        "solicitor",
      ],
      staircasing_status: ["pending", "approved", "completed", "rejected"],
      trigger_type: [
        "equity_threshold",
        "move_in_anniversary",
        "property_value_increase",
        "manual",
      ],
      user_role: ["admin", "viewer"],
    },
  },
} as const
