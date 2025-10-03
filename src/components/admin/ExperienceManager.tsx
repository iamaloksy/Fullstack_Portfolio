import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Pencil, Trash2, Building, Calendar, MapPin, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { ExperienceForm } from "./ExperienceForm"
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

export function ExperienceManager() {
  const [experience, setExperience] = useState<Experience[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchExperience()
  }, [])

  const fetchExperience = async () => {
    const { data, error } = await supabase
      .from("experience")
      .select("*")
      .order("order_index")

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch experience",
        variant: "destructive"
      })
    } else if (data) {
      setExperience(data)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience?")) return

    const { error } = await supabase
      .from("experience")
      .delete()
      .eq("id", id)

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete experience",
        variant: "destructive"
      })
    } else {
      toast({
        title: "Success",
        description: "Experience deleted successfully"
      })
      fetchExperience()
    }
  }

  const handleEdit = (exp: Experience) => {
    setEditingExperience(exp)
    setIsFormOpen(true)
  }

  const handleAdd = () => {
    setEditingExperience(null)
    setIsFormOpen(true)
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingExperience(null)
    fetchExperience()
  }

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-foreground">Experience Management</h2>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Experience
        </Button>
      </div>

      {isFormOpen && (
        <ExperienceForm
          experience={editingExperience}
          onClose={handleFormClose}
        />
      )}

      <div className="grid gap-6">
        {experience.map((exp) => (
          <Card key={exp.id} className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-4">
                  {exp.logo_url ? (
                    <img
                      src={exp.logo_url}
                      alt={exp.company}
                      className="w-12 h-12 object-contain rounded-lg bg-background/50 p-1"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                      <Building className="h-6 w-6 text-primary" />
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-xl">{exp.position}</CardTitle>
                    <div className="flex items-center gap-2">
                      {exp.company_url ? (
                        <a 
                          href={exp.company_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary font-semibold hover:underline flex items-center gap-1"
                        >
                          {exp.company}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <p className="text-primary font-semibold">{exp.company}</p>
                      )}
                      {exp.employment_type && (
                        <span className={`px-2 py-1 rounded text-xs ${getEmploymentTypeColor(exp.employment_type)}`}>
                          {exp.employment_type}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(exp)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(exp.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
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
                <p className="text-muted-foreground text-sm">{exp.description}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {experience.length === 0 && (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="py-12 text-center">
            <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No experience records found. Add your first experience.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}