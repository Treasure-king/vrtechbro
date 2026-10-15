
import { UUID } from "crypto";
import { LucideIcon } from "lucide-react";

/**
 * Props for the ServiceCard component.
 *
 * The `icon` field has a dual nature:
 * - In Supabase data, `icon` is stored as a string (e.g., "Bot", "Code") — the name of a Lucide icon.
 * - The parent component looks up the string in `iconMap` (lib/helper.ts) and passes the resolved
 *   LucideIcon component as the `icon` prop.
 * - If no match is found in iconMap, `icon` will be `undefined`.
 */
export interface ServiceCardProps {
  id?: UUID;

  // Basic Info
  title: string;
  slug: string;
  short_description?: string;
  long_description?: string;

  // SEO & Content
  keywords?: string[];
  meta_title?: string;
  meta_description?: string;
  content?: string;

  // UI & Display — icon is resolved from iconMap before being passed as a prop
  icon?: LucideIcon | string;
  image_url?: string;
  category?: string;
  display_order?: number;

  // CTA / Overlay Support
  cta_label?: string;
  cta_enabled?: boolean;

  // Audit
  created_at?: string;
  updated_at?: string;

  featured?: boolean;
  delay?: number;
}
