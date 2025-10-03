import { Header } from "@/components/portfolio/Header"
import { Hero } from "@/components/portfolio/Hero"
import { About } from "@/components/portfolio/About"
import { Skills } from "@/components/portfolio/Skills"
import { Experience } from "@/components/portfolio/Experience"
import { Education } from "@/components/portfolio/Education"
import { Projects } from "@/components/portfolio/Projects"
import { Certifications } from "@/components/portfolio/Certifications"
import { Contact } from "@/components/portfolio/Contact"
import { ThemeProvider } from "@/components/ThemeProvider"

const Index = () => {
  return (
    <ThemeProvider defaultTheme="dark">
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <Hero />
          <About />
          <Skills />
          <Experience />
          <Education />
          <Projects />
          <Certifications />
          <Contact />
        </main>
      </div>
    </ThemeProvider>
  );
};

export default Index;
