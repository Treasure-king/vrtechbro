
import { UUID } from "crypto";
import { LucideIcon } from "lucide-react";

export interface ServiceCardProps {
    id?: UUID
    title: string;
    description: string;
    icon?: LucideIcon | string;
    image_url?: any;
    href?: string;
    tags?: string[];
    created_at?: string;
    featured?: boolean;
    delay?: number;
}
