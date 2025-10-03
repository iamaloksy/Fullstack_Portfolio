import { useState, useEffect } from "react"
import { Upload, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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

const profileSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().min(1, "Description is required").max(200, "Description must be less than 200 characters"),
  bio: z.string().min(1, "Bio is required").max(1000, "Bio must be less than 1000 characters"),
  linkedin_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  github_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  twitter_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  resume_url: z.string().url("Invalid URL").optional().or(z.literal(""))
})

type ProfileFormData = z.infer<typeof profileSchema>

export function ProfileEditor() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      title: "",
      description: "",
      bio: "",
      linkedin_url: "",
      github_url: "",
      twitter_url: "",
      resume_url: ""
    }
  })

  useEffect(() => {
    fetchProfileData()
  }, [])

  const fetchProfileData = async () => {
    try {
      const { data, error } = await supabase
        .from("about_me")
        .select("*")
        .maybeSingle()
      
      if (error) throw error
      
      if (data) {
        form.reset({
          title: data.title || "",
          description: data.description || "",
          bio: data.bio || "",
          linkedin_url: data.linkedin_url || "",
          github_url: data.github_url || "",
          twitter_url: data.twitter_url || "",
          resume_url: data.resume_url || ""
        })
        setCurrentImageUrl(data.image_url)
      }
    } catch (error: any) {
      console.error("Profile fetch error:", error)
      toast({
        title: "Error",
        description: "Failed to fetch profile data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setImageFile(file)
    }
  }

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null

    try {
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `profile.${fileExt}`
      const filePath = `profile/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('portfolio-images')
        .upload(filePath, imageFile, { upsert: true })

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(filePath)

      return data.publicUrl
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive"
      })
      return null
    }
  }

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true)

    try {
      let imageUrl = currentImageUrl
      
      if (imageFile) {
        const uploadedUrl = await uploadImage()
        if (uploadedUrl) {
          imageUrl = uploadedUrl
        }
      }

      const profileData = {
        title: data.title,
        description: data.description,
        bio: data.bio,
        linkedin_url: data.linkedin_url || null,
        github_url: data.github_url || null,
        twitter_url: data.twitter_url || null,
        resume_url: data.resume_url || null,
        image_url: imageUrl
      }

      // Try to update first, if no rows exist, insert
      const { data: existingData, error: fetchError } = await supabase
        .from("about_me")
        .select("id")
        .maybeSingle()

      if (fetchError) throw fetchError

      if (existingData) {
        const { error } = await supabase
          .from("about_me")
          .update(profileData)
          .eq("id", existingData.id)
        
        if (error) throw error
      } else {
        const { error } = await supabase
          .from("about_me")
          .insert([profileData])
        
        if (error) throw error
      }

      setCurrentImageUrl(imageUrl)
      toast({
        title: "Success",
        description: "Profile updated successfully"
      })
    } catch (error: any) {
      console.error("Profile update error:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save profile",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-foreground">Profile Settings</h2>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Edit Your Profile Information</CardTitle>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Professional Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Full Stack Developer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Brief description that appears in the hero section"
                        rows={2}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Detailed biography for the about section"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />


              {/* Social Links */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Social Links</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="linkedin_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LinkedIn URL (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://linkedin.com/in/username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="github_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GitHub URL (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://github.com/username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="twitter_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Twitter URL (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://twitter.com/username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="resume_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Resume URL (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/resume.pdf" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Profile Image */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Profile Image</h3>
                
                {currentImageUrl && (
                  <div className="flex justify-center">
                    <img
                      src={currentImageUrl}
                      alt="Current profile"
                      className="w-32 h-32 object-cover rounded-full"
                    />
                  </div>
                )}
                
                <div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full hover:shadow-glow transition-all duration-300"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Profile
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}