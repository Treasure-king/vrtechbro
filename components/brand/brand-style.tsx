import { brandCssVariables } from "@/lib/brand";

/** Injects the brand colour variables from lib/brand.ts into <head>. */
export function BrandStyle() {
  return (
    <style
      id="brand-tokens"
      dangerouslySetInnerHTML={{ __html: brandCssVariables() }}
    />
  );
}
