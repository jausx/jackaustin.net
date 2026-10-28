import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");

export type ProjectLink = { label: string; url: string };

export type ProjectMeta = {
  slug: string;
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

  return {
    slug,
    title: String(data.title),
    // gray-matter parses bare YAML dates into Date objects
    date: data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date ?? ""),
    summary: String(data.summary ?? ""),
    cover: data.cover ? String(data.cover) : undefined,
    links: Array.isArray(data.links) ? data.links : [],
    draft: Boolean(data.draft),
    // content is author-trusted; raw HTML (iframes, etc.) passes through
    html: marked.parse(content, { async: false }) as string,
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
