import { HONEYPOT_FIELD } from "@/lib/honeypot";

/**
 * Hidden spam trap (see lib/honeypot.ts). Moved off-screen rather than
 * display:none, because some bots skip fields that are display:none.
 * Hidden from assistive tech and the tab order so real visitors never meet it.
 */
export function Honeypot() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -left-[9999px] h-px w-px overflow-hidden"
    >
      <label>
        Leave this field empty
        <input
          type="text"
          name={HONEYPOT_FIELD}
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </label>
    </div>
  );
}
