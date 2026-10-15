const DISCIPLINES = [
  {
    name: 'Websites',
    what: 'Marketing sites, landing pages and content-driven sites that load fast and rank well.',
    tools: ['Next.js', 'React', 'Tailwind CSS'],
  },
  {
    name: 'Web apps and SaaS',
    what: 'Dashboards, portals and subscription products with accounts, data and payments.',
    tools: ['Next.js', 'TypeScript', 'Supabase'],
  },
  {
    name: 'Mobile apps',
    what: 'Cross-platform apps for iOS and Android that share one codebase.',
    tools: ['React Native', 'Supabase'],
  },
  {
    name: 'Backends and APIs',
    what: 'Databases, REST APIs, authentication and transactional email.',
    tools: ['Node.js', 'SQL', 'MongoDB', 'Resend'],
  },
  {
    name: 'Chrome extensions and npm packages',
    what: 'Browser tools and reusable libraries, published and maintained.',
    tools: ['TypeScript', 'JavaScript'],
  },
  {
    name: 'Interface design and motion',
    what: 'Design systems, interaction design and animation that explains what changed.',
    tools: ['Figma', 'Motion'],
  },
]

/** Disciplines as a ruled table: what we build, what it means, what we use. */
export function Disciplines() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border-subtle">
      <table className="w-full text-left">
        <caption className="sr-only">Disciplines, what each covers, and the usual tools</caption>
        <thead className="hidden bg-bg-secondary/60 text-sm text-text-muted md:table-header-group">
          <tr>
            <th scope="col" className="px-6 py-4 font-medium">
              Discipline
            </th>
            <th scope="col" className="px-6 py-4 font-medium">
              What it covers
            </th>
            <th scope="col" className="px-6 py-4 font-medium">
              Usual tools
            </th>
          </tr>
        </thead>
        <tbody>
          {DISCIPLINES.map((d) => (
            <tr
              key={d.name}
              className="flex flex-col gap-2 border-t border-border-subtle px-6 py-6 first:border-t-0 md:table-row md:px-0 md:py-0 md:first:border-t"
            >
              <th
                scope="row"
                className="font-display text-lg font-semibold tracking-tight text-text-primary md:w-1/4 md:px-6 md:py-6 md:align-top"
              >
                {d.name}
              </th>
              <td className="leading-relaxed text-text-secondary md:px-6 md:py-6 md:align-top">{d.what}</td>
              <td className="md:w-1/4 md:px-6 md:py-6 md:align-top">
                <ul className="flex flex-wrap gap-2">
                  {d.tools.map((t) => (
                    <li
                      key={t}
                      className="rounded-md border border-border-subtle px-2 py-0.5 font-mono text-xs text-text-secondary"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
