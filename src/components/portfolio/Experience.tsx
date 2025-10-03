import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Building, ExternalLink } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { format } from "date-fns"

interface Experience {
  id: string
  company: string
  position: string
  employment_type?: string
  start_date?: string
  end_date?: string
  current: boolean
  description?: string
  location?: string
  company_url?: string
  logo_url?: string
  order_index: number
}

export function Experience() {
  const [experience, setExperience] = useState<Experience[]>([])

  useEffect(() => {
    const fetchExperience = async () => {
      const { data } = await supabase
        .from("experience")
        .select("*")
        .order("order_index")
      
      if (data) {
        setExperience(data)
      }
    }

    fetchExperience()
  }, [])

  const formatDate = (dateString?: string) => {
    if (!dateString) return null
    return format(new Date(dateString), "MMM yyyy")
  }

  const getEmploymentTypeColor = (type?: string) => {
    switch (type?.toLowerCase()) {
      case 'full-time': return 'bg-green-500/20 text-green-700 dark:text-green-300'
      case 'part-time': return 'bg-blue-500/20 text-blue-700 dark:text-blue-300'
      case 'contract': return 'bg-orange-500/20 text-orange-700 dark:text-orange-300'
      case 'freelance': return 'bg-purple-500/20 text-purple-700 dark:text-purple-300'
      case 'internship': return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <section id="experience" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Professional Experience
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              My professional journey and career milestones
            </p>
          </div>

          <div className="space-y-8">
            {experience.map((exp, index) => (
              <Card 
                key={exp.id} 
                className="group hover:shadow-elegant transition-all duration-500 border-border/50 bg-card/50 backdrop-blur-sm animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {exp.logo_url && (
                      <div className="flex-shrink-0">
                        <img
                          src={exp.logo_url}
                          alt={exp.company}
                          className="w-16 h-16 lg:w-20 lg:h-20 object-contain rounded-lg bg-background/50 p-2"
                        />
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-200">
                            {exp.position}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Building className="h-4 w-4 text-primary" />
                            {exp.company_url ? (
                              <a 
                                href={exp.company_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-lg text-primary font-semibold hover:underline flex items-center gap-1"
                              >
                                {exp.company}
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            ) : (
                              <p className="text-lg text-primary font-semibold">
                                {exp.company}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {exp.current && (
                            <Badge variant="default" className="bg-green-500/20 text-green-700 dark:text-green-300">
                              Current
                            </Badge>
                          )}
                          {exp.employment_type && (
                            <Badge variant="secondary" className={getEmploymentTypeColor(exp.employment_type)}>
                              {exp.employment_type}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                        {(exp.start_date || exp.end_date) && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {formatDate(exp.start_date)} - {exp.current ? "Present" : formatDate(exp.end_date)}
                            </span>
                          </div>
                        )}
                        {exp.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{exp.location}</span>
                          </div>
                        )}
                      </div>

                      {exp.description && (
                        <p className="text-muted-foreground leading-relaxed">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}