import { useEffect, useState } from "react"
import { Download, Linkedin, Github } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { supabase } from "@/integrations/supabase/client"

interface AboutData {
  title: string
  description: string
  bio: string
  linkedin_url?: string
  github_url?: string
  resume_url?: string
  image_url?: string
}

export function About() {
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

  return (
    <section id="about" className="py-20 bg-secondary/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground animate-slide-in">
              About Me
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-up delay-150">
              Get to know me better and discover my journey in web development
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Profile Image */}
            <div className="flex justify-center animate-slide-left delay-300">
              <div className="relative transform transition-all duration-700 hover:scale-105 hover:rotate-1">
                {aboutData?.image_url ? (
                  <img
                    src={aboutData.image_url}
                    alt="Profile"
                    className="w-80 h-80 object-cover rounded-2xl shadow-elegant hover:shadow-glow transition-all duration-500"
                  />
                ) : (
                  <div className="w-80 h-80 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center shadow-elegant animate-pulse">
                    <span className="text-6xl font-bold text-primary opacity-50">AK</span>
                  </div>
                )}
              </div>
            </div>

            {/* About Content */}
            <div className="space-y-6 animate-slide-right delay-500">
              <div className="prose prose-lg max-w-none">
                <p className="text-muted-foreground leading-relaxed animate-fade-up delay-500">
                  {aboutData?.bio || "I am a passionate full stack developer with expertise in modern web technologies. I love building scalable applications and solving complex problems."}
                </p>
              </div>

              {/* Social Links */}
              <div className="space-y-4 animate-fade-up delay-700">
                <p className="text-muted-foreground text-sm">
                  For inquiries and collaboration opportunities, please use the contact form or reach out through my social profiles.
                </p>
                
                <div className="flex gap-4">
                  {aboutData?.linkedin_url && (
                    <a
                      href={aboutData.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-125 hover:rotate-6"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                  )}
                  {aboutData?.github_url && (
                    <a
                      href={aboutData.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-125 hover:rotate-6"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Resume Download */}
              {aboutData?.resume_url && (
                <Button 
                  className="w-full sm:w-auto hover:shadow-glow transition-all duration-300 animate-fade-up delay-900"
                  onClick={() => window.open(aboutData.resume_url, '_blank')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Resume
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}