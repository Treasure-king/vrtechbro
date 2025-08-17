
import { UUID } from "crypto";
import { LucideIcon } from "lucide-react";

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

  // UI & Display
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
