/**
 * Hand-authored Supabase schema types. Once a Supabase project is linked,
 * regenerate with: npx supabase gen types typescript --linked
 * and keep the row shapes in sync with supabase/migrations.
 */

export type ProfileRow = {
  id: string;
  name: string;
  username: string;
  email: string;
  bio: string | null;
  country: string;
  avatar_url: string | null;
  payment_method: string | null;
  payment_identifier: string | null;
  theme: string;
  onboarded: boolean;
  created_at: string;
  updated_at: string;
};

export type PaymentMethodRow = {
  id: string;
  user_id: string;
  provider: string;
  identifier: string;
  country: string;
  is_default: boolean;
  created_at: string;
};

export type SocialLinkRow = {
  id: string;
  user_id: string;
  platform: string;
  url: string;
  position: number;
  created_at: string;
};

export type SettingsRow = {
  id: string;
  user_id: string;
  show_qr: boolean;
  show_social_links: boolean;
  allow_custom_amount: boolean;
  theme: string;
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: Partial<ProfileRow> &
          Pick<ProfileRow, "id" | "username" | "name" | "email">;
        Update: Partial<ProfileRow>;
        Relationships: [];
      };
      payment_methods: {
        Row: PaymentMethodRow;
        Insert: Partial<PaymentMethodRow> &
          Pick<PaymentMethodRow, "user_id" | "provider" | "identifier" | "country">;
        Update: Partial<PaymentMethodRow>;
        Relationships: [];
      };
      social_links: {
        Row: SocialLinkRow;
        Insert: Partial<SocialLinkRow> &
          Pick<SocialLinkRow, "user_id" | "platform" | "url">;
        Update: Partial<SocialLinkRow>;
        Relationships: [];
      };
      settings: {
        Row: SettingsRow;
        Insert: Partial<SettingsRow> & Pick<SettingsRow, "user_id">;
        Update: Partial<SettingsRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_username_available: {
        Args: { candidate: string };
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

/** A creator profile with its relations, as consumed by the public page. */
export type PublicProfile = ProfileRow & {
  social_links: SocialLinkRow[];
  settings: SettingsRow | null;
};
