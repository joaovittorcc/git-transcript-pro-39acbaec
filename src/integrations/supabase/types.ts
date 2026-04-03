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
      challenges: {
        Row: {
          challenged_id: string
          challenged_name: string
          challenged_pos: number
          challenger_id: string
          challenger_name: string
          challenger_pos: number
          created_at: string
          discord_notified_status: string | null
          id: string
          list_id: string
          score: number[] | null
          status: string
          tracks: string[] | null
          type: string
        }
        Insert: {
          challenged_id: string
          challenged_name: string
          challenged_pos?: number
          challenger_id: string
          challenger_name: string
          challenger_pos?: number
          created_at?: string
          discord_notified_status?: string | null
          id?: string
          list_id: string
          score?: number[] | null
          status?: string
          tracks?: string[] | null
          type?: string
        }
        Update: {
          challenged_id?: string
          challenged_name?: string
          challenged_pos?: number
          challenger_id?: string
          challenger_name?: string
          challenger_pos?: number
          created_at?: string
          discord_notified_status?: string | null
          id?: string
          list_id?: string
          score?: number[] | null
          status?: string
          tracks?: string[] | null
          type?: string
        }
        Relationships: []
      }
      championship_race_results: {
        Row: {
          finish_position: number
          id: string
          points: number
          race_number: number
          registration_id: string
          season_id: string
        }
        Insert: {
          finish_position: number
          id?: string
          points?: number
          race_number: number
          registration_id: string
          season_id: string
        }
        Update: {
          finish_position?: number
          id?: string
          points?: number
          race_number?: number
          registration_id?: string
          season_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "championship_race_results_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: false
            referencedRelation: "championship_registrations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "championship_race_results_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "championship_seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      championship_race_tracks: {
        Row: {
          id: string
          race_number: number
          season_id: string
          track_name: string
        }
        Insert: {
          id?: string
          race_number: number
          season_id: string
          track_name: string
        }
        Update: {
          id?: string
          race_number?: number
          season_id?: string
          track_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "championship_race_tracks_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "championship_seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      championship_registrations: {
        Row: {
          car: string
          created_at: string
          id: string
          pilot_name: string
          season_id: string
        }
        Insert: {
          car: string
          created_at?: string
          id?: string
          pilot_name: string
          season_id: string
        }
        Update: {
          car?: string
          created_at?: string
          id?: string
          pilot_name?: string
          season_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "championship_registrations_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "championship_seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      championship_seasons: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
          phase: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          phase?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          phase?: string
        }
        Relationships: []
      }
      global_logs: {
        Row: {
          category: string
          created_at: string
          description: string
          id: string
          player_one: string | null
          player_two: string | null
          type: string
          winner: string | null
        }
        Insert: {
          category?: string
          created_at?: string
          description: string
          id?: string
          player_one?: string | null
          player_two?: string | null
          type: string
          winner?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          player_one?: string | null
          player_two?: string | null
          type?: string
          winner?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
