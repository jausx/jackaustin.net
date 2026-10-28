import { notFound } from "next/navigation";
import { getPage } from "@/lib/projects";

export const metadata = { title: "CV | Jack Austin" };

export default function Page() {
  const page = getPage("cv");
  if (!page) notFound();

  return (
    <main>
      <section>
        <h3>{page.title}</h3>
        <div className="prose" dangerouslySetInnerHTML={{ __html: page.html }} />
      </section>
    </main>
  );
}
