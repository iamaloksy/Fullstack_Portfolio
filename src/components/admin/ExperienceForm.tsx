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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Upload, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

const experienceSchema = z.object({
  company: z.string().min(1, "Company is required"),
  position: z.string().min(1, "Position is required"),
  employment_type: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  current: z.boolean().default(false),
  description: z.string().optional(),
  location: z.string().optional(),
  company_url: z.string().optional(),
  order_index: z.number().default(0),
})

type ExperienceFormData = z.infer<typeof experienceSchema>

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

interface ExperienceFormProps {
  experience?: Experience | null
  onClose: () => void
}

const employmentTypes = [
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
  "Internship",
  "Self-employed"
]

export function ExperienceForm({ experience, onClose }: ExperienceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [currentLogoUrl, setCurrentLogoUrl] = useState(experience?.logo_url || "")
  const { toast } = useToast()

  const form = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      company: experience?.company || "",
      position: experience?.position || "",
      employment_type: experience?.employment_type || "",
      start_date: experience?.start_date || "",
      end_date: experience?.end_date || "",
      current: experience?.current || false,
      description: experience?.description || "",
      location: experience?.location || "",
      company_url: experience?.company_url || "",
      order_index: experience?.order_index || 0,
    }
  })

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setLogoFile(file)
      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      setCurrentLogoUrl(previewUrl)
    }
  }

  const removeLogo = () => {
    setLogoFile(null)
    setCurrentLogoUrl("")
  }

  const uploadLogo = async (): Promise<string | null> => {
    if (!logoFile) return currentLogoUrl || null

    const fileExt = logoFile.name.split('.').pop()
    const fileName = `company-logo-${Date.now()}.${fileExt}`

    const { data, error } = await supabase.storage
      .from('portfolio-images')
      .upload(fileName, logoFile)

    if (error) {
      console.error('Error uploading logo:', error)
      return null
    }

    const { data: { publicUrl } } = supabase.storage
      .from('portfolio-images')
      .getPublicUrl(fileName)

    return publicUrl
  }

  const onSubmit = async (data: ExperienceFormData) => {
    setIsSubmitting(true)
    
    try {
      const logoUrl = await uploadLogo()
      
      const experienceData = {
        company: data.company,
        position: data.position,
        employment_type: data.employment_type,
        start_date: data.start_date,
        end_date: data.end_date,
        current: data.current,
        description: data.description,
        location: data.location,
        company_url: data.company_url,
        order_index: data.order_index,
        logo_url: logoUrl,
      }

      if (experience) {
        const { error } = await supabase
          .from("experience")
          .update(experienceData)
          .eq("id", experience.id)

        if (error) throw error

        toast({
          title: "Success",
          description: "Experience updated successfully"
        })
      } else {
        const { error } = await supabase
          .from("experience")
          .insert(experienceData)

        if (error) throw error

        toast({
          title: "Success",
          description: "Experience added successfully"
        })
      }

      onClose()
    } catch (error) {
      console.error('Error saving experience:', error)
      toast({
        title: "Error",
        description: "Failed to save experience",
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
            {experience ? "Edit Experience" : "Add Experience"}
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
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input placeholder="Company name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Input placeholder="Software Engineer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="employment_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employment Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select employment type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {employmentTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                      <Input placeholder="San Francisco, CA" {...field} />
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
                name="company_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://company.com" {...field} />
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
                    <FormLabel className="text-base">Currently Working</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      I am currently working at this company
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
                      placeholder="Describe your role, responsibilities, achievements..."
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormLabel>Company Logo</FormLabel>
              {currentLogoUrl && (
                <div className="relative w-24 h-24">
                  <img
                    src={currentLogoUrl}
                    alt="Company logo"
                    className="w-full h-full object-contain rounded-lg border bg-background/50 p-2"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6"
                    onClick={removeLogo}
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
                    onChange={handleLogoUpload}
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
                {isSubmitting ? "Saving..." : (experience ? "Update" : "Add")} Experience
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