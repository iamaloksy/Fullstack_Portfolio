import { useState } from "react"
import { X, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const skillSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  category: z.string().min(1, "Category is required").max(50, "Category must be less than 50 characters"),
  proficiency: z.number().min(1, "Proficiency must be at least 1").max(5, "Proficiency must be at most 5"),
  icon_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  order_index: z.number().min(0)
})

type SkillFormData = z.infer<typeof skillSchema>

interface Skill {
  id: string
  name: string
  category: string
  proficiency: number
  icon_url?: string
  order_index: number
}

interface SkillFormProps {
  skill?: Skill | null
  onClose: () => void
}

export function SkillForm({ skill, onClose }: SkillFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: skill?.name || "",
      category: skill?.category || "",
      proficiency: skill?.proficiency || 5,
      icon_url: skill?.icon_url || "",
      order_index: skill?.order_index || 0
    }
  })

  const onSubmit = async (data: SkillFormData) => {
    setIsSubmitting(true)

    try {
      const skillData = {
        name: data.name,
        category: data.category,
        proficiency: data.proficiency,
        icon_url: data.icon_url || null,
        order_index: data.order_index
      }

      if (skill) {
        const { error } = await supabase
          .from("skills")
          .update(skillData)
          .eq("id", skill.id)
        
        if (error) throw error
        
        toast({
          title: "Success",
          description: "Skill updated successfully"
        })
      } else {
        const { error } = await supabase
          .from("skills")
          .insert([skillData])
        
        if (error) throw error
        
        toast({
          title: "Success",
          description: "Skill created successfully"
        })
      }

      onClose()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save skill",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStarRating = (currentValue: number, onChange: (value: number) => void) => {
    return (
      <div className="flex gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i + 1)}
            className="focus:outline-none"
          >
            <Star
              className={`h-6 w-6 transition-colors ${
                i < currentValue 
                  ? 'text-primary fill-primary' 
                  : 'text-muted-foreground/30 hover:text-primary/50'
              }`}
            />
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg border-border/50 bg-card/95 backdrop-blur-sm">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{skill ? "Edit Skill" : "Add New Skill"}</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skill Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., React, Python" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Frontend, Backend" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="proficiency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Proficiency Level (1-5 stars)</FormLabel>
                    <FormControl>
                      <div>
                        {renderStarRating(field.value, field.onChange)}
                        <p className="text-sm text-muted-foreground mt-2">
                          Current level: {field.value} star{field.value !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="icon_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon URL (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/icon.png" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="order_index"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order Index</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : skill ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}