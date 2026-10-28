import Link from "next/link";
import { getAllProjects, type Project } from "@/lib/projects";

export const metadata = { title: "Projects | Jack Austin" };

function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="project-grid">
      {projects.map((p) => (
        <Link key={p.slug} href={`/projects/${p.slug}`} className="project-card">
          {p.cover ? <img src={p.cover} alt="" /> : <div className="project-card-empty" />}
          <h4>{p.title}</h4>
        </Link>
      ))}
    </div>
  );
}

export default function Page() {
  const projects = getAllProjects();
  const main = projects.filter((p) => p.category === "main");
  const other = projects.filter((p) => p.category === "other");

  return (
    <main>
      <section>
        <h3>Projects</h3>
        <ProjectGrid projects={main} />
      </section>
      {other.length > 0 && (
        <section>
          <h3>Other Projects</h3>
          <ProjectGrid projects={other} />
        </section>
      )}
    </main>
  );
}
