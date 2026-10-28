import type { Metadata } from "next";
import Link from "next/link";
import { getAllProjects } from "@/lib/projects";
import { ARTSTATION_URL } from "@/lib/links";
import Nav from "./_components/Nav";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://jackaustin.net"),
  title: "Jack Austin",
  description: "You know what time it is.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://rsms.me/"/>
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css"/>
      </head>
      <body>
        <header className="title">
				  <h1>Jack Austin</h1>
          <p>
            <em>
              makes <Link rel="noopener noreferrer" href="https://jackaustin.itch.io/">games</Link>, not websites!
            </em>
          </p>
        </header>
        <Nav
          projects={getAllProjects().map(({ slug, title }) => ({ slug, title }))}
          artUrl={ARTSTATION_URL}
        />
        {children}
      </body>
    </html>
  );
}
