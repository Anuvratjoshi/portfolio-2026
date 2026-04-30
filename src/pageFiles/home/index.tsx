import { Hero } from "./Hero";
import { About } from "./About";
import { Skills } from "./Skills";
import { Experience } from "./Experience";
import { Projects } from "./Projects";
import { OpenSource } from "./OpenSource";
import { AIWorkflow } from "./AIWorkflow";
import { Contact } from "./Contact";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <OpenSource />
      <AIWorkflow />
      <Contact />
    </main>
  );
}
