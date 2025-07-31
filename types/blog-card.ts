import { UUID } from "crypto"

export interface BlogCardProps {
    id?: UUID;
    title: string;
    description: string;
    slug: string;
    tags?: string[];
    published_at?: Date;
    delay?: number;
}