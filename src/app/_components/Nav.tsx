"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavProject = { slug: string; title: string };

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
              {projects.map((p) => (
                <li key={p.slug}>
                  <Link href={`/projects/${p.slug}`} aria-current={current(`/projects/${p.slug}`)}>
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <Link rel="noopener noreferrer" href={artUrl}>Art ↗</Link>
      </nav>
    </section>
  );
}
