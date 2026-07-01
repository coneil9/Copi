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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      cafes: {
        Row: {
          created_at: string
          id: string
          name: string
          owner_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          owner_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          owner_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      invites: {
        Row: {
          cafe_id: string
          created_at: string
          created_by: string
          email: string
          expires_at: string
          id: string
          location_id: string | null
          role: Database["public"]["Enums"]["user_role"]
          token: string
          used_at: string | null
        }
        Insert: {
          cafe_id: string
          created_at?: string
          created_by: string
          email: string
          expires_at: string
          id?: string
          location_id?: string | null
          role: Database["public"]["Enums"]["user_role"]
          token: string
          used_at?: string | null
        }
        Update: {
          cafe_id?: string
          created_at?: string
          created_by?: string
          email?: string
          expires_at?: string
          id?: string
          location_id?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          token?: string
          used_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invites_cafe_id_fkey"
            columns: ["cafe_id"]
            isOneToOne: false
            referencedRelation: "cafes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invites_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_tracks: {
        Row: {
          created_at: string
          id: string
          name: string
          role: Database["public"]["Enums"]["user_role"]
          volumes: string[]
        }
        Insert: {
          created_at?: string
          id: string
          name: string
          role: Database["public"]["Enums"]["user_role"]
          volumes?: string[]
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          role?: Database["public"]["Enums"]["user_role"]
          volumes?: string[]
        }
        Relationships: []
      }
      lesson_progress: {
        Row: {
          finals: Json
          lessons: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          finals?: Json
          lessons?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          finals?: Json
          lessons?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          address: string | null
          cafe_id: string
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          cafe_id: string
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          cafe_id?: string
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "locations_cafe_id_fkey"
            columns: ["cafe_id"]
            isOneToOne: false
            referencedRelation: "cafes"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_milestones: {
        Row: {
          cafe_id: string | null
          category: string
          created_at: string
          description: string | null
          id: string
          order: number
          requires_manager_signoff: boolean
          title: string
          updated_at: string
        }
        Insert: {
          cafe_id?: string | null
          category: string
          created_at?: string
          description?: string | null
          id?: string
          order?: number
          requires_manager_signoff?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          cafe_id?: string | null
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          order?: number
          requires_manager_signoff?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_milestones_cafe_id_fkey"
            columns: ["cafe_id"]
            isOneToOne: false
            referencedRelation: "cafes"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_progress: {
        Row: {
          completed: boolean
          completed_at: string | null
          completed_by: string | null
          milestone_id: string
          note: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          completed_by?: string | null
          milestone_id: string
          note?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          completed_by?: string | null
          milestone_id?: string
          note?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_progress_completed_by_fkey"
            columns: ["completed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "onboarding_progress_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "onboarding_milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "onboarding_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          cafe_id: string
          created_at: string
          email: string
          id: string
          joined: string | null
          location_id: string | null
          name: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          cafe_id: string
          created_at?: string
          email: string
          id: string
          joined?: string | null
          location_id?: string | null
          name: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          cafe_id?: string
          created_at?: string
          email?: string
          id?: string
          joined?: string | null
          location_id?: string | null
          name?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_cafe_id_fkey"
            columns: ["cafe_id"]
            isOneToOne: false
            referencedRelation: "cafes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_cafe_id: { Args: never; Returns: string }
      current_location_id: { Args: never; Returns: string }
      current_role: {
        Args: never
        Returns: Database["public"]["Enums"]["user_role"]
      }
      current_user_claims: {
        Args: never
        Returns: {
          cafe_id: string
          location_id: string
          role: Database["public"]["Enums"]["user_role"]
        }[]
      }
      is_manager: { Args: never; Returns: boolean }
      is_owner_or_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      user_role: "owner" | "admin" | "manager" | "barista" | "host"
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
      user_role: ["owner", "admin", "manager", "barista", "host"],
    },
  },
} as const
