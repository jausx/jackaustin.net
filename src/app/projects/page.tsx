import Link from "next/link";
import { getAllProjects } from "@/lib/projects";

export const metadata = { title: "Projects | Jack Austin" };

export default function Page() {
  const projects = getAllProjects();

  return (
    <main>
      <section>
        <h3>Projects</h3>
        <div className="project-grid">
          {projects.map((p) => (
            <Link key={p.slug} href={`/projects/${p.slug}`} className="project-card">
              {p.cover && <img src={p.cover} alt="" />}
              <h4>{p.title}</h4>
              <p>{p.summary}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
