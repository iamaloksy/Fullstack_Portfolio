import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { SkillForm } from "./SkillForm"

interface Skill {
  id: string
  name: string
  category: string
  proficiency: number
  icon_url?: string
  order_index: number
}

export function SkillManager() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .order("category, order_index")
      
      if (error) throw error
      setSkills(data || [])
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch skills",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return

    try {
      const { error } = await supabase
        .from("skills")
        .delete()
        .eq("id", id)
      
      if (error) throw error
      
      setSkills(skills.filter(s => s.id !== id))
      toast({
        title: "Success",
        description: "Skill deleted successfully"
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete skill",
        variant: "destructive"
      })
    }
  }

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill)
    setIsFormOpen(true)
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingSkill(null)
    fetchSkills()
  }

  const getStarRating = (proficiency: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < proficiency ? 'text-primary fill-primary' : 'text-muted-foreground/30'}`}
      />
    ))
  }

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = []
    }
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, Skill[]>)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-foreground">Skills</h2>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Skill
        </Button>
      </div>

      {skills.length === 0 ? (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No skills yet. Add your first skill!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <div key={category}>
              <div className="flex items-center gap-4 mb-4">
                <h3 className="text-xl font-semibold text-foreground">{category}</h3>
                <Badge variant="secondary">{categorySkills.length} skills</Badge>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categorySkills.map((skill) => (
                  <Card key={skill.id} className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          {skill.icon_url ? (
                            <img
                              src={skill.icon_url}
                              alt={skill.name}
                              className="w-8 h-8 object-contain"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                              <span className="text-primary font-bold text-sm">
                                {skill.name.charAt(0)}
                              </span>
                            </div>
                          )}
                          <h4 className="font-semibold text-foreground">{skill.name}</h4>
                        </div>
                        
                        <div className="flex gap-1">
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleEdit(skill)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleDelete(skill.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Proficiency:</span>
                        <div className="flex">
                          {getStarRating(skill.proficiency)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {isFormOpen && (
        <SkillForm
          skill={editingSkill}
          onClose={handleFormClose}
        />
      )}
    </div>
  )
}