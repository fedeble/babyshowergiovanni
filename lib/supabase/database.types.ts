export type Database = {
  public: {
    Tables: {
      events: {
        Row: {
          id: string;
          name: string;
          baby_name: string;
          event_date: string | null;
          event_time: string | null;
          venue: string | null;
          address: string | null;
          latitude: number | null;
          longitude: number | null;
          welcome_message: string | null;
          cover_image: string | null;
          is_public: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          baby_name: string;
          event_date?: string | null;
          event_time?: string | null;
          venue?: string | null;
          address?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          welcome_message?: string | null;
          cover_image?: string | null;
          is_public?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["events"]["Insert"]>;
        Relationships: [];
      };
      gifts: {
        Row: {
          id: string;
          event_id: string;
          name: string;
          description: string | null;
          image: string | null;
          quantity: number;
          reserved_quantity: number;
          is_available: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          name: string;
          description?: string | null;
          image?: string | null;
          quantity: number;
          reserved_quantity?: number;
          is_available?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["gifts"]["Insert"]>;
        Relationships: [];
      };
      gift_reservations: {
        Row: {
          id: string;
          gift_id: string;
          guest_name: string;
          quantity: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          gift_id: string;
          guest_name: string;
          quantity: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["gift_reservations"]["Insert"]>;
        Relationships: [];
      };
      event_admins: {
        Row: {
          user_id: string;
          event_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          event_id: string;
          created_at?: string;
        };
        Update: never;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      reserve_gift: {
        Args: {
          p_gift_id: string;
          p_guest_name: string;
          p_requested_quantity: number;
        };
        Returns: string;
      };
      gift_reservation_exists: {
        Args: { p_reservation_id: string };
        Returns: boolean;
      };
      cancel_gift_reservation: {
        Args: {
          p_reservation_id: string;
        };
        Returns: string;
      };
      is_event_admin: {
        Args: { p_event_id: string };
        Returns: boolean;
      };
      is_gift_admin: {
        Args: { p_gift_id: string };
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};