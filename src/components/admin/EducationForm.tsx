import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { X, Upload, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

const educationSchema = z.object({
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().min(1, "Degree is required"),
  field_of_study: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  current: z.boolean().default(false),
  description: z.string().optional(),
  location: z.string().optional(),
  grade: z.string().optional(),
  order_index: z.number().default(0),
})

type EducationFormData = z.infer<typeof educationSchema>

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

interface EducationFormProps {
  education?: Education | null
  onClose: () => void
}

export function EducationForm({ education, onClose }: EducationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [currentImageUrl, setCurrentImageUrl] = useState(education?.image_url || "")
  const { toast } = useToast()

  const form = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      institution: education?.institution || "",
      degree: education?.degree || "",
      field_of_study: education?.field_of_study || "",
      start_date: education?.start_date || "",
      end_date: education?.end_date || "",
      current: education?.current || false,
      description: education?.description || "",
      location: education?.location || "",
      grade: education?.grade || "",
      order_index: education?.order_index || 0,
    }
  })

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setImageFile(file)
      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      setCurrentImageUrl(previewUrl)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setCurrentImageUrl("")
  }

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return currentImageUrl || null

    const fileExt = imageFile.name.split('.').pop()
    const fileName = `education-${Date.now()}.${fileExt}`

    const { data, error } = await supabase.storage
      .from('portfolio-images')
      .upload(fileName, imageFile)

    if (error) {
      console.error('Error uploading image:', error)
      return null
    }

    const { data: { publicUrl } } = supabase.storage
      .from('portfolio-images')
      .getPublicUrl(fileName)

    return publicUrl
  }

  const onSubmit = async (data: EducationFormData) => {
    setIsSubmitting(true)
    
    try {
      const imageUrl = await uploadImage()
      
      const educationData = {
        institution: data.institution,
        degree: data.degree,
        field_of_study: data.field_of_study,
        start_date: data.start_date,
        end_date: data.end_date,
        current: data.current,
        description: data.description,
        location: data.location,
        grade: data.grade,
        order_index: data.order_index,
        image_url: imageUrl,
      }

      if (education) {
        const { error } = await supabase
          .from("education")
          .update(educationData)
          .eq("id", education.id)

        if (error) throw error

        toast({
          title: "Success",
          description: "Education updated successfully"
        })
      } else {
        const { error } = await supabase
          .from("education")
          .insert(educationData)

        if (error) throw error

        toast({
          title: "Success",
          description: "Education added successfully"
        })
      }

      onClose()
    } catch (error) {
      console.error('Error saving education:', error)
      toast({
        title: "Error",
        description: "Failed to save education",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>
            {education ? "Edit Education" : "Add Education"}
          </CardTitle>
          <Button variant="outline" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="institution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Institution</FormLabel>
                    <FormControl>
                      <Input placeholder="University name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="degree"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Degree</FormLabel>
                    <FormControl>
                      <Input placeholder="Bachelor of Science" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="field_of_study"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Field of Study</FormLabel>
                    <FormControl>
                      <Input placeholder="Computer Science" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="grade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grade/GPA</FormLabel>
                    <FormControl>
                      <Input placeholder="3.8 GPA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field} 
                        disabled={form.watch("current")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="New York, NY" {...field} />
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
                    <FormLabel>Order</FormLabel>
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
            </div>

            <FormField
              control={form.control}
              name="current"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Currently Studying</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      I am currently studying at this institution
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your studies, achievements, activities..."
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormLabel>Institution Logo</FormLabel>
              {currentImageUrl && (
                <div className="relative w-24 h-24">
                  <img
                    src={currentImageUrl}
                    alt="Institution logo"
                    className="w-full h-full object-contain rounded-lg border bg-background/50 p-2"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6"
                    onClick={removeImage}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              )}
              <div className="flex items-center gap-4">
                <Button type="button" variant="outline" className="relative">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Logo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </Button>
                <span className="text-sm text-muted-foreground">
                  PNG, JPG up to 5MB
                </span>
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : (education ? "Update" : "Add")} Education
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}