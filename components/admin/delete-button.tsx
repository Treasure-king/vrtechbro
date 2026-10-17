"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { ActionResult } from "@/lib/admin/validation";

/** Delete with a confirmation dialog. `action` is a server action bound to the item id. */
export function DeleteButton({
  itemLabel,
  action,
}: {
  itemLabel: string;
  action: () => Promise<ActionResult>;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const onConfirm = () =>
    startTransition(async () => {
      const result = await action();
      if (result.ok) {
        toast.success(`Deleted "${itemLabel}"`);
        setOpen(false);
        router.refresh();
      } else {
        toast.error(result.error ?? "Couldn't delete. Try again.");
      }
    });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" aria-label={`Delete ${itemLabel}`}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-bg-secondary border-border-subtle">
        <DialogHeader>
          <DialogTitle>Delete &ldquo;{itemLabel}&rdquo;?</DialogTitle>
          <DialogDescription>
            It will disappear from the website straight away. This can&apos;t be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Keep it</Button>
          </DialogClose>
          <Button variant="destructive" onClick={onConfirm} isLoading={pending}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
