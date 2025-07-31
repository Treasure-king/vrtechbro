import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-dark text-gray-400 border-t border-slate-700">
      <div className="container mx-auto p-6 text-sm flex flex-col md:flex-row justify-between">
        <p>© {new Date().getFullYear()} TechEdge. All rights reserved.</p>
        <div className="flex gap-4 mt-2 md:mt-0">
          <Link href="/privacy" className="hover:text-white">Privacy</Link>
          <Link href="/terms" className="hover:text-white">Terms</Link>
        </div>
      </div>
    </footer>
  )
}
