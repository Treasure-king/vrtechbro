import { request, type FullConfig } from "@playwright/test";
import { allRoutes } from "./helpers";

/**
 * The dev server compiles each route on first request, which can take many
 * seconds. Hit every route once up front so the real tests measure the app,
 * not the compiler.
 */
export default async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[0].use.baseURL as string;
  const ctx = await request.newContext({ baseURL, timeout: 180_000 });
  const routes = [...(await allRoutes(ctx)), "/nope", "/admin/login"];
  for (const route of routes) {
    await ctx.get(route, { maxRedirects: 0 }).catch(() => undefined);
  }
  await ctx.dispose();
}
