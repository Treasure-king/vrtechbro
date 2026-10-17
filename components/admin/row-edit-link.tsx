import Link from "next/link";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RowEditLink({ href, label }: { href: string; label: string }) {
  return (
    <Button asChild variant="ghost" size="sm" aria-label={`Edit ${label}`}>
      <Link href={href}>
        <Pencil className="h-4 w-4" />
      </Link>
    </Button>
  );
}
