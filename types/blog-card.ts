import { UUID } from "crypto"

export interface BlogCardProps {
    id?: UUID;
    title: string;               // Blog title
    description: string;         // Meta description
    content?: string;             // Full blog content
    slug: string;                // Final SEO-friendly slug stored in DB
    keywords?: string[];         // Extra SEO keywords
    tags?: string[];             // Categories/labels
    published_at?: Date;
    updated_at?: Date;           // For freshness in SEO
    author?: string;             // Author name
    meta_title?: string;         // Custom SEO title (if different from main title)
    meta_description?: string;   // Custom SEO description
    reading_time?: number;       // For UI (and Google rich snippets)
    thumbnail?: string;          // Blog image
    delay?:number;
}