import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Pencil, Trash2, GraduationCap, Calendar, MapPin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { EducationForm } from "./EducationForm"
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

export function EducationManager() {
  const [education, setEducation] = useState<Education[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingEducation, setEditingEducation] = useState<Education | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchEducation()
  }, [])

  const fetchEducation = async () => {
    const { data, error } = await supabase
      .from("education")
      .select("*")
      .order("order_index")

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch education",
        variant: "destructive"
      })
    } else if (data) {
      setEducation(data)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this education record?")) return

    const { error } = await supabase
      .from("education")
      .delete()
      .eq("id", id)

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete education record",
        variant: "destructive"
      })
    } else {
      toast({
        title: "Success",
        description: "Education record deleted successfully"
      })
      fetchEducation()
    }
  }

  const handleEdit = (edu: Education) => {
    setEditingEducation(edu)
    setIsFormOpen(true)
  }

  const handleAdd = () => {
    setEditingEducation(null)
    setIsFormOpen(true)
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingEducation(null)
    fetchEducation()
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return null
    return format(new Date(dateString), "MMM yyyy")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-foreground">Education Management</h2>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Education
        </Button>
      </div>

      {isFormOpen && (
        <EducationForm
          education={editingEducation}
          onClose={handleFormClose}
        />
      )}

      <div className="grid gap-6">
        {education.map((edu) => (
          <Card key={edu.id} className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-4">
                  {edu.image_url ? (
                    <img
                      src={edu.image_url}
                      alt={edu.institution}
                      className="w-12 h-12 object-contain rounded-lg bg-background/50 p-1"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                      <GraduationCap className="h-6 w-6 text-primary" />
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-xl">{edu.degree}</CardTitle>
                    <p className="text-primary font-semibold">{edu.institution}</p>
                    {edu.field_of_study && (
                      <p className="text-muted-foreground text-sm">{edu.field_of_study}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(edu)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(edu.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
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
                {edu.grade && (
                  <div className="bg-secondary px-2 py-1 rounded text-xs">
                    {edu.grade}
                  </div>
                )}
              </div>
              {edu.description && (
                <p className="text-muted-foreground text-sm">{edu.description}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {education.length === 0 && (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="py-12 text-center">
            <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No education records found. Add your first education entry.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}