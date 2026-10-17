import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

/**
 * Next.js 16 "proxy" (formerly middleware): refreshes the Supabase session and
 * keeps signed-out visitors out of the admin area.
 */
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

// Only the admin area runs the proxy, so public pages stay static and fast.
export const config = {
  matcher: ["/admin/:path*"],
};
