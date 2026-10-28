"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavProject = { slug: string; title: string; category: "main" | "other" };

export default function Nav({
  projects,
  artUrl,
}: {
  projects: NavProject[];
  artUrl: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // close the dropdown on navigation
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const current = (href: string) => (pathname === href ? "page" : undefined);
  const inProjects = pathname.startsWith("/projects");
  const main = projects.filter((p) => p.category === "main");
  const other = projects.filter((p) => p.category === "other");

  const item = (p: NavProject) => (
    <li key={p.slug}>
      <Link href={`/projects/${p.slug}`} aria-current={current(`/projects/${p.slug}`)}>
        {p.title}
      </Link>
    </li>
  );

  return (
    <section>
      <nav aria-label="Main">
        <Link href="/" aria-current={current("/")}>Home</Link>

        <div className="nav-dropdown" ref={menuRef}>
          <Link href="/projects" aria-current={inProjects ? "page" : undefined}>
            Projects
          </Link>
          <button
            type="button"
            className="nav-toggle"
            aria-label="Toggle projects menu"
            aria-haspopup="true"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            ▾
          </button>
          {open && (
            <ul className="nav-menu">
              <li><Link href="/projects">All projects</Link></li>
              {main.map(item)}
              {other.length > 0 && (
                <>
                  <li className="nav-menu-label" aria-hidden="true">Other Projects</li>
                  {other.map(item)}
                </>
              )}
            </ul>
          )}
        </div>

        <Link href="/cv" aria-current={current("/cv")}>CV</Link>

        <Link rel="noopener noreferrer" href={artUrl}>Artstation ↗</Link>
      </nav>
    </section>
  );
}
