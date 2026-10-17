import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminPageHeader({
  title,
  description,
  newHref,
  newLabel,
}: {
  title: string;
  description?: string;
  newHref?: string;
  newLabel?: string;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-text-primary text-2xl font-semibold md:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="text-text-secondary mt-2">{description}</p>
        )}
      </div>
      {newHref && (
        <Button asChild>
          <Link href={newHref}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            {newLabel ?? "Add new"}
          </Link>
        </Button>
      )}
    </div>
  );
}
