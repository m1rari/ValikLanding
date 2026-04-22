import type { Metadata } from "next";
import Hero        from "@/sections/Hero";
import WorkFormats from "@/sections/WorkFormats";
import Services    from "@/sections/Services";
import Works       from "@/sections/Works";
import Timeline    from "@/sections/Timeline";
import LeadForm    from "@/sections/LeadForm";
import { readSeoSettings } from "@/utils/seoSettings";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await readSeoSettings();
  return {
    alternates: {
      canonical: seo.canonicalPath,
    },
  };
}

export default function Home() {
  return (
    <main>
      <Hero />
      <WorkFormats />
      <Services />
      <Works />
      <Timeline />
      <LeadForm />
    </main>
  );
}
