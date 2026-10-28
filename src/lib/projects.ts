import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");

export type ProjectLink = { label: string; url: string };

// "main" = career-relevant work; "other" = music, skits, and similar
export type ProjectCategory = "main" | "other";

export type ProjectMeta = {
  slug: string;
  category: ProjectCategory;
  title: string;
  date: string;
  summary: string;
  cover?: string;
  links: ProjectLink[];
};

export type Project = ProjectMeta & { html: string };

function readProject(file: string): (Project & { draft: boolean }) | null {
  const slug = file.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(PROJECTS_DIR, file), "utf8");
  const { data, content } = matter(raw);
  if (!data.title) return null;

  // content is author-trusted; raw HTML (iframes, etc.) passes through
  const html = marked.parse(content, { async: false }) as string;
  // tile image: explicit `cover` frontmatter wins, else the first image in the body
  const firstImage = html.match(/<img[^>]+src=["']([^"']+)["']/)?.[1];

  return {
    slug,
    category: data.category === "other" ? "other" : "main",
    title: String(data.title),
    // gray-matter parses bare YAML dates into Date objects
    date: data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date ?? ""),
    summary: String(data.summary ?? ""),
    cover: data.cover ? String(data.cover) : firstImage,
    links: Array.isArray(data.links) ? data.links : [],
    draft: Boolean(data.draft),
    html,
  };
}

function loadAll(): Project[] {
  if (!fs.existsSync(PROJECTS_DIR)) return [];
  return fs
    .readdirSync(PROJECTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map(readProject)
    .filter((p): p is Project & { draft: boolean } => p !== null && !p.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getAllProjects(): Project[] {
  return loadAll();
}

export function getProject(slug: string): Project | undefined {
  return loadAll().find((p) => p.slug === slug);
}

const PAGES_DIR = path.join(process.cwd(), "content", "pages");

export type Page = { title: string; html: string };

// Standalone markdown pages (e.g. the CV) from content/pages/<slug>.md
export function getPage(slug: string): Page | undefined {
  const file = path.join(PAGES_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return undefined;
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  return {
    title: String(data.title ?? slug),
    html: marked.parse(content, { async: false }) as string,
  };
}
