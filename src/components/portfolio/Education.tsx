import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Award } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { format } from "date-fns"

interface Education {
  id: string
  institution: string
  degree: string
  field_of_study?: string
  start_date?: string
  end_date?: string
  current: boolean
  description?: string
  location?: string
  grade?: string
  image_url?: string
  order_index: number
}

export function Education() {
  const [education, setEducation] = useState<Education[]>([])

  useEffect(() => {
    const fetchEducation = async () => {
      const { data } = await supabase
        .from("education")
        .select("*")
        .order("order_index")
      
      if (data) {
        setEducation(data)
      }
    }

    fetchEducation()
  }, [])

  const formatDate = (dateString?: string) => {
    if (!dateString) return null
    return format(new Date(dateString), "MMM yyyy")
  }

  return (
    <section id="education" className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Education
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              My academic journey and continuous learning path
            </p>
          </div>

          <div className="space-y-8">
            {education.map((edu, index) => (
              <Card 
                key={edu.id} 
                className="group hover:shadow-elegant transition-all duration-500 border-border/50 bg-card/50 backdrop-blur-sm animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {edu.image_url && (
                      <div className="flex-shrink-0">
                        <img
                          src={edu.image_url}
                          alt={edu.institution}
                          className="w-16 h-16 lg:w-20 lg:h-20 object-contain rounded-lg bg-background/50 p-2"
                        />
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-200">
                            {edu.degree}
                          </h3>
                          <p className="text-lg text-primary font-semibold">
                            {edu.institution}
                          </p>
                          {edu.field_of_study && (
                            <p className="text-muted-foreground">
                              {edu.field_of_study}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {edu.current ? (
                            <Badge variant="default" className="bg-green-500/20 text-green-700 dark:text-green-300">
                              Current
                            </Badge>
                          ) : null}
                          {edu.grade && (
                            <Badge variant="secondary">
                              <Award className="h-3 w-3 mr-1" />
                              {edu.grade}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                        {(edu.start_date || edu.end_date) && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {formatDate(edu.start_date)} - {edu.current ? "Present" : formatDate(edu.end_date)}
                            </span>
                          </div>
                        )}
                        {edu.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{edu.location}</span>
                          </div>
                        )}
                      </div>

                      {edu.description && (
                        <p className="text-muted-foreground leading-relaxed">
                          {edu.description}
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