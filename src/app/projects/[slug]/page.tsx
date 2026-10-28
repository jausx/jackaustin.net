import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllProjects, getProject } from "@/lib/projects";

export const dynamicParams = false;

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: `${project.title} | Jack Austin`,
    description: project.summary,
    openGraph: project.cover ? { images: [project.cover] } : undefined,
  };
}

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <main>
      <section>
        <h3>{project.title}</h3>
        <div className="prose" dangerouslySetInnerHTML={{ __html: project.html }} />
        {project.links.length > 0 && (
          <p className="project-links">
            {project.links.map((l) => (
              <Link key={l.url} rel="noopener noreferrer" href={l.url}>
                {l.label}
              </Link>
            ))}
          </p>
        )}
      </section>
    </main>
  );
}
