import Hero        from "@/sections/Hero";
import WorkFormats from "@/sections/WorkFormats";
import Services    from "@/sections/Services";
import Works       from "@/sections/Works";
import Timeline    from "@/sections/Timeline";
import LeadForm    from "@/sections/LeadForm";

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
