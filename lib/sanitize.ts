/**
 * Escapes HTML special characters to prevent XSS payloads in email templates and raw HTML contexts.
 */
export function escapeHtml(str: string): string {
  if (!str) return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

/** Strips path separators and unsafe characters from an uploaded file name. */
export function sanitizeFilename(name: string, fallback = 'attachment'): string {
  const base = name.split(/[\\/]/).pop() ?? ''
  const cleaned = base.replace(/[^\w.\- ]/g, '_').replace(/^\.+/, '').slice(0, 100)
  return cleaned || fallback
}

/** Strips CR/LF so user input cannot break out of an email header such as the subject. */
export function stripNewlines(str: string): string {
  return str.replace(/[\r\n]+/g, ' ')
}
