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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      advocates: {
        Row: {
          address: string | null
          availability: string | null
          bio: string | null
          court: string | null
          created_at: string
          email: string | null
          experience_years: number
          fees: string | null
          id: string
          is_available: boolean
          languages: string | null
          name: string
          phone: string | null
          photo_url: string | null
          qualifications: string | null
          specialization: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          availability?: string | null
          bio?: string | null
          court?: string | null
          created_at?: string
          email?: string | null
          experience_years?: number
          fees?: string | null
          id?: string
          is_available?: boolean
          languages?: string | null
          name: string
          phone?: string | null
          photo_url?: string | null
          qualifications?: string | null
          specialization: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          availability?: string | null
          bio?: string | null
          court?: string | null
          created_at?: string
          email?: string | null
          experience_years?: number
          fees?: string | null
          id?: string
          is_available?: boolean
          languages?: string | null
          name?: string
          phone?: string | null
          photo_url?: string | null
          qualifications?: string | null
          specialization?: string
          updated_at?: string
        }
        Relationships: []
      }
      appointments: {
        Row: {
          advocate_id: string
          created_at: string
          id: string
          notes: string | null
          scheduled_at: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          advocate_id: string
          created_at?: string
          id?: string
          notes?: string | null
          scheduled_at: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          advocate_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          scheduled_at?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_advocate_id_fkey"
            columns: ["advocate_id"]
            isOneToOne: false
            referencedRelation: "advocates"
            referencedColumns: ["id"]
          },
        ]
      }
      cases: {
        Row: {
          assigned_counsellor_id: string | null
          assigned_legal_advisor_id: string | null
          created_at: string
          description: string | null
          id: string
          priority: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_counsellor_id?: string | null
          assigned_legal_advisor_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          priority?: string | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_counsellor_id?: string | null
          assigned_legal_advisor_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          priority?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      counseling_sessions: {
        Row: {
          completed_at: string | null
          counsellor_id: string | null
          created_at: string
          id: string
          progress_notes: string | null
          scheduled_at: string | null
          session_type: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          counsellor_id?: string | null
          created_at?: string
          id?: string
          progress_notes?: string | null
          scheduled_at?: string | null
          session_type: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          counsellor_id?: string | null
          created_at?: string
          id?: string
          progress_notes?: string | null
          scheduled_at?: string | null
          session_type?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      doctor_appointments: {
        Row: {
          appointment_date: string
          appointment_time: string
          created_at: string
          doctor_id: string
          id: string
          notes: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          appointment_date: string
          appointment_time: string
          created_at?: string
          doctor_id: string
          id?: string
          notes?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          created_at?: string
          doctor_id?: string
          id?: string
          notes?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "doctor_appointments_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
        ]
      }
      doctors: {
        Row: {
          address: string | null
          availability: string | null
          bio: string | null
          created_at: string
          email: string | null
          fees: string | null
          hospital: string | null
          id: string
          languages: string | null
          name: string
          phone: string | null
          qualifications: string | null
          specialization: string
          updated_at: string
          years_experience: number | null
        }
        Insert: {
          address?: string | null
          availability?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          fees?: string | null
          hospital?: string | null
          id?: string
          languages?: string | null
          name: string
          phone?: string | null
          qualifications?: string | null
          specialization: string
          updated_at?: string
          years_experience?: number | null
        }
        Update: {
          address?: string | null
          availability?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          fees?: string | null
          hospital?: string | null
          id?: string
          languages?: string | null
          name?: string
          phone?: string | null
          qualifications?: string | null
          specialization?: string
          updated_at?: string
          years_experience?: number | null
        }
        Relationships: []
      }
      evidence_uploads: {
        Row: {
          case_id: string | null
          created_at: string
          description: string | null
          file_name: string
          file_path: string
          file_type: string
          id: string
          review_status: string
          user_id: string
        }
        Insert: {
          case_id?: string | null
          created_at?: string
          description?: string | null
          file_name: string
          file_path: string
          file_type: string
          id?: string
          review_status?: string
          user_id: string
        }
        Update: {
          case_id?: string | null
          created_at?: string
          description?: string | null
          file_name?: string
          file_path?: string
          file_type?: string
          id?: string
          review_status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "evidence_uploads_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      safety_checkins: {
        Row: {
          created_at: string
          id: string
          is_location_safe: boolean
          mood: string
          notes: string | null
          safety_level: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_location_safe?: boolean
          mood: string
          notes?: string | null
          safety_level: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_location_safe?: boolean
          mood?: string
          notes?: string | null
          safety_level?: number
          user_id?: string
        }
        Relationships: []
      }
      support_messages: {
        Row: {
          contact_value: string | null
          created_at: string
          direction: string
          id: string
          message: string
          parent_id: string | null
          preferred_contact: string
          recipient_service: string
          status: string
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          contact_value?: string | null
          created_at?: string
          direction?: string
          id?: string
          message: string
          parent_id?: string | null
          preferred_contact?: string
          recipient_service: string
          status?: string
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          contact_value?: string | null
          created_at?: string
          direction?: string
          id?: string
          message?: string
          parent_id?: string | null
          preferred_contact?: string
          recipient_service?: string
          status?: string
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_messages_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "support_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      survivor_intakes: {
        Row: {
          additional_notes: string | null
          age_range: string | null
          completed: boolean
          created_at: string
          current_situation: string | null
          has_children: boolean | null
          id: string
          immediate_needs: string[] | null
          languages: string | null
          legal_concerns: string | null
          living_situation: string | null
          medical_concerns: string | null
          preferred_contact_time: string | null
          preferred_name: string | null
          preferred_session_mode: string | null
          prior_counseling: boolean | null
          pronouns: string | null
          safety_status: string | null
          support_types_needed: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          additional_notes?: string | null
          age_range?: string | null
          completed?: boolean
          created_at?: string
          current_situation?: string | null
          has_children?: boolean | null
          id?: string
          immediate_needs?: string[] | null
          languages?: string | null
          legal_concerns?: string | null
          living_situation?: string | null
          medical_concerns?: string | null
          preferred_contact_time?: string | null
          preferred_name?: string | null
          preferred_session_mode?: string | null
          prior_counseling?: boolean | null
          pronouns?: string | null
          safety_status?: string | null
          support_types_needed?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          additional_notes?: string | null
          age_range?: string | null
          completed?: boolean
          created_at?: string
          current_situation?: string | null
          has_children?: boolean | null
          id?: string
          immediate_needs?: string[] | null
          languages?: string | null
          legal_concerns?: string | null
          living_situation?: string | null
          medical_concerns?: string | null
          preferred_contact_time?: string | null
          preferred_name?: string | null
          preferred_session_mode?: string | null
          prior_counseling?: boolean | null
          pronouns?: string | null
          safety_status?: string | null
          support_types_needed?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "victim" | "counsellor" | "legal_advisor"
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
      app_role: ["admin", "victim", "counsellor", "legal_advisor"],
    },
  },
} as const
