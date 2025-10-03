import { useEffect, useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/integrations/supabase/client"
import { useScrollAnimation } from "@/hooks/useScrollAnimation"

interface Skill {
  id: string
  name: string
  category: string
  proficiency: number
  icon_url?: string
}

// Removed hardcoded categories; using dynamic categories from data

export function Skills() {
  const [skills, setSkills] = useState<Skill[]>([])
  const { elementRef, isVisible } = useScrollAnimation()
  const categories = useMemo(() => Array.from(new Set(skills.map(s => s.category))), [skills])

  useEffect(() => {
    const fetchSkills = async () => {
      const { data } = await supabase
        .from("skills")
        .select("*")
        .order("order_index")
      
      if (data) {
        setSkills(data)
      }
    }

    fetchSkills()
  }, [])

  const groupedSkills = categories.reduce((acc, category) => {
    acc[category] = skills.filter(skill => skill.category === category)
    return acc
  }, {} as Record<string, Skill[]>)

  const getStarRating = (proficiency: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-lg ${i < proficiency ? 'text-primary' : 'text-muted-foreground/30'}`}
      >
        ★
      </span>
    ))
  }

  return (
    <section ref={elementRef} id="skills" className="py-20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'animate-fade-up' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground animate-slide-in">
              Skills & Technologies
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-up delay-300">
              Technologies and tools I work with to create amazing digital experiences
            </p>
          </div>

          <div className="grid gap-8">
            {categories.map((category) => {
              const categorySkills = groupedSkills[category]
              if (!categorySkills || categorySkills.length === 0) return null

              return (
                <div key={category} className={`transition-all duration-1000 ${isVisible ? 'animate-fade-up' : 'opacity-0 translate-y-10'}`} style={{ animationDelay: `${categories.indexOf(category) * 200}ms` }}>
                  <div className="flex items-center gap-4 mb-6 animate-slide-in" style={{ animationDelay: `${categories.indexOf(category) * 200 + 100}ms` }}>
                    <h3 className="text-2xl font-semibold text-foreground hover:text-primary transition-colors duration-300">{category}</h3>
                    <Badge variant="secondary" className="text-sm animate-bounce-gentle">
                      {categorySkills.length} skills
                    </Badge>
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categorySkills.map((skill, skillIndex) => (
                      <Card key={skill.id} className="group hover:shadow-elegant hover:shadow-glow transition-all duration-500 border-border/50 bg-card/50 backdrop-blur-sm hover:scale-105 hover:rotate-1 animate-fade-in" style={{ animationDelay: `${categories.indexOf(category) * 200 + skillIndex * 50}ms` }}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              {skill.icon_url ? (
                                <img
                                  src={skill.icon_url}
                                  alt={skill.name}
                                  className="w-8 h-8 object-contain group-hover:scale-110 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center group-hover:bg-primary/30 transition-colors duration-300 group-hover:scale-110">
                                  <span className="text-primary font-bold text-sm group-hover:scale-110 transition-transform duration-300">
                                    {skill.name.charAt(0)}
                                  </span>
                                </div>
                              )}
                              <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                                {skill.name}
                              </h4>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">Proficiency:</span>
                            <div className="flex group-hover:scale-110 transition-transform duration-300">
                              {getStarRating(skill.proficiency)}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}