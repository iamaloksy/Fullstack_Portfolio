import { useEffect, useState } from "react"
import { ChevronDown, Github, Linkedin, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/integrations/supabase/client"

interface AboutData {
  title: string
  description: string
  bio: string
  linkedin_url?: string
  github_url?: string
  email?: string
}

export function Hero() {
  const [aboutData, setAboutData] = useState<AboutData | null>(null)

  useEffect(() => {
    const fetchAboutData = async () => {
      const { data } = await supabase
        .from("about_me")
        .select("*")
        .single()
      
      if (data) {
        setAboutData(data)
      }
    }

    fetchAboutData()
  }, [])

  const scrollToContact = () => {
    const element = document.querySelector("#contact")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const scrollToAbout = () => {
    const element = document.querySelector("#about")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {aboutData?.title || "Full Stack Developer"}
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {aboutData?.description || "Passionate about creating amazing web experiences"}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button 
              onClick={scrollToContact}
              className="px-8 py-3 text-lg hover:shadow-glow transition-all duration-300"
            >
              Get In Touch
            </Button>
            
            <Button 
              variant="outline" 
              onClick={scrollToAbout}
              className="px-8 py-3 text-lg hover:shadow-elegant transition-all duration-300"
            >
              Learn More
            </Button>
          </div>

          {/* Social Links */}
          <div className="flex items-center justify-center gap-6 mb-12">
            {aboutData?.github_url && (
              <a 
                href={aboutData.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors duration-200 hover:scale-110 transform"
              >
                <Github className="h-6 w-6" />
              </a>
            )}
            {aboutData?.linkedin_url && (
              <a 
                href={aboutData.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors duration-200 hover:scale-110 transform"
              >
                <Linkedin className="h-6 w-6" />
              </a>
            )}
            {aboutData?.email && (
              <a 
                href={`mailto:${aboutData.email}`}
                className="text-muted-foreground hover:text-primary transition-colors duration-200 hover:scale-110 transform"
              >
                <Mail className="h-6 w-6" />
              </a>
            )}
          </div>

          {/* Scroll indicator */}
          <div className="animate-bounce">
            <ChevronDown 
              className="h-8 w-8 text-muted-foreground mx-auto cursor-pointer hover:text-primary transition-colors duration-200"
              onClick={scrollToAbout}
            />
          </div>
        </div>
      </div>
    </section>
  )
}