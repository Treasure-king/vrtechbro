# 📍 VRTechBro — Phases Overview

> **Last Updated:** 2026-10-15
> This is the master index for all development phases. Each phase has its own detailed document with exact file changes, code patterns, and verification steps.

---

## Philosophy

**Fix the foundation before building the palace.**

Phases 1–5 are about repairing every structural, security, performance, SEO, and code quality flaw in the current codebase. Nothing new is added — only what's broken gets fixed.

Phases 6–10 are about transformation — new design system, 3D integration, new pages, storytelling, and polish.

---

## Phase Map

| Phase | Name | Focus | Status |
|---|---|---|---|
| **Phase 1** | 🏗️ Architecture Repair | Fix `next/head`, convert to SSR, fix broken imports, remove dead code | ✅ Completed |
| **Phase 2** | 🔒 Security Hardening | Headers, input validation, rate limiting, sanitization | ✅ Completed |
| **Phase 3** | ⚡ Performance Optimization | Images, code splitting, animations, loading states | ✅ Completed |
| **Phase 4** | 🔍 SEO Foundation | Dynamic sitemap, structured data, metadata, analytics | ✅ Completed |
| **Phase 5** | 🧹 Code Quality & DX | Naming, conventions, error pages, README, TypeScript | ✅ Completed |
| **Phase 6** | 🎨 Design System Revolution | Colors, typography, component library, spacing | ✅ Completed |
| **Phase 7** | 📄 Page Redesign & Storytelling | Every page rebuilt with new design, UX, narrative | 🟡 Layouts done (2026-10-15); final images + audits pending |
| **Phase 8** | 🧊 3D Integration & Interactivity | Blender model, Three.js scene, scroll animations | ⬜ Not Started |
| **Phase 9** | 🏆 Portfolio & Showcase | Projects, extensions, packages, case studies | ⬜ Not Started |
| **Phase 10** | 🚀 Infrastructure & Launch | Admin panel, CI/CD, monitoring, final audits | ⬜ Not Started |

---

### Recommended execution order (revised 2026-10-15)

**7 → 9 → 8 → 10.** The portfolio (Phase 9) only depends on Phase 7 and is what proves capability to visitors, while the 3D hero (Phase 8) is blocked on a Blender asset. Phase 8 can be developed in parallel once its model exists.

### Tooling for Phases 7–10
- **Claude Code plugins:** `frontend-design` (visual direction), `playwright` (screenshots at 375/768/1440px), `context7` (current Next.js/Tailwind/Motion docs), `superpowers` (planning & verification workflow)
- **Skills:** `design:design-critique`, `design:accessibility-review`, `marketing:seo-audit`, `security-review`, `code-review`
- **Images:** generated with Gemini using the shared style prompt in Phase 7, Task 7.0

---

## Rules

1. **Never skip a phase**, except for the 9-before-8 order above.
2. **Verify before moving on.** Each phase has a verification checklist — all items must pass.
3. **Never read `.env.*` or `.env.local` files** under any circumstance.
4. **Commit after each phase** with a descriptive conventional commit message.
5. **Update `docs/memory.md`** (the current source of truth; `docs/research/memory.md` is the older snapshot) after each phase completes with any structural changes.
