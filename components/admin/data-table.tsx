/** Simple responsive table shell for admin lists. */
export function DataTable({
  headers,
  children,
  empty,
  isEmpty,
}: {
  headers: string[];
  children: React.ReactNode;
  empty: React.ReactNode;
  isEmpty: boolean;
}) {
  if (isEmpty) {
    return (
      <div className="border-border-subtle text-text-secondary rounded-2xl border border-dashed p-10 text-center">
        {empty}
      </div>
    );
  }
  return (
    <div className="border-border-subtle overflow-x-auto rounded-2xl border">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="bg-bg-secondary text-text-muted">
          <tr>
            {headers.map((h) => (
              <th key={h} scope="col" className="px-4 py-3 font-medium">
                {h}
              </th>
            ))}
            <th scope="col" className="px-4 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-border-subtle divide-y">{children}</tbody>
      </table>
    </div>
  );
}

export function formatDate(value?: string | null) {
  if (!value) return "–";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
