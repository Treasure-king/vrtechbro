/**
 * Spam protection for the public forms. Each form renders a hidden "website"
 * field that people never see or fill in, but form-filling bots usually do.
 * If it arrives non-empty, the API answers as if it succeeded and sends nothing,
 * so the bot gets no signal that it was caught.
 */
export const HONEYPOT_FIELD = "website";

export function isHoneypotFilled(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}
