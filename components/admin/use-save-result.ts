"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { ActionResult } from "@/lib/admin/validation";

/** After a save: toast, then go back to the list on success. */
export function useSaveResult(
  state: ActionResult | null,
  listHref: string,
  noun: string,
) {
  const router = useRouter();

  useEffect(() => {
    if (!state) return;
    if (state.ok) {
      toast.success(`${noun} saved`);
      router.push(listHref);
      router.refresh();
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state, router, listHref, noun]);
}
