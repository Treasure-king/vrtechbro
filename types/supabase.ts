import { ServiceCardProps } from "./service-card";
import { BlogCardProps } from "./blog-card";

export interface ServiceRecord {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  long_description?: string;
  icon?: string;
  image_url?: string;
  keywords?: string[];
  featured?: boolean;
  content?: string;
  category?: string;
  display_order?: number;
  cta_label?: string;
  cta_enabled?: boolean;
  meta_title?: string;
  meta_description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface BlogRecord {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  author?: string;
  reading_time?: number;
  tags?: string[];
  keywords?: string[];
  thumbnail?: string;
  image_url?: string;
  published_at?: string;
  meta_title?: string;
  meta_description?: string;
  updated_at?: string;
}

/** Row in public.admins: users allowed into /admin (see supabase/migrations/2026-10-17_admin.sql). */
export interface AdminRecord {
  user_id: string;
  created_at: string;
}

export interface JobRecord {
  id: string;
  slug: string;
  title: string;
  location: string;
  type: string;
  description: string;
  is_open: boolean;
  display_order?: number;
  date_posted: string;
  valid_through?: string | null;
  created_at?: string;
}

export function isServiceArray(data: unknown): data is ServiceCardProps[] {
  return (
    Array.isArray(data) &&
    data.every(
      (item) => typeof item === "object" && item !== null && "title" in item,
    )
  );
}

export function isBlogArray(data: unknown): data is BlogCardProps[] {
  return (
    Array.isArray(data) &&
    data.every(
      (item) => typeof item === "object" && item !== null && "title" in item,
    )
  );
}
