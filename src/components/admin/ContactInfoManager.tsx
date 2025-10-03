import { useState, useEffect } from "react"
import { Save, Mail, Phone, MapPin } from "lucide-react"
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

const contactInfoSchema = z.object({
  email: z.string().email("Invalid email").max(255, "Email must be less than 255 characters").optional().or(z.literal("")),
  phone: z.string().max(20, "Phone must be less than 20 characters").optional().or(z.literal("")),
  location: z.string().max(100, "Location must be less than 100 characters").optional().or(z.literal(""))
})

type ContactInfoFormData = z.infer<typeof contactInfoSchema>

export function ContactInfoManager() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const form = useForm<ContactInfoFormData>({
    resolver: zodResolver(contactInfoSchema),
    defaultValues: {
      email: "",
      phone: "",
      location: ""
    }
  })

  useEffect(() => {
    fetchContactInfo()
  }, [])

  const fetchContactInfo = async () => {
    try {
      const { data, error } = await supabase
        .from("contact_info")
        .select("*")
        .maybeSingle()
      
      if (error) {
        console.error("Error fetching contact info:", error)
        return
      }
      
      if (data) {
        form.reset({
          email: data.email || "",
          phone: data.phone || "",
          location: data.location || ""
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch contact information",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: ContactInfoFormData) => {
    setIsSubmitting(true)

    try {
      const contactData = {
        email: data.email || null,
        phone: data.phone || null,
        location: data.location || null
      }

      // Try to update first, if no rows exist, insert
      const { data: existingData } = await supabase
        .from("contact_info")
        .select("id")
        .maybeSingle()

      if (existingData) {
        const { error } = await supabase
          .from("contact_info")
          .update(contactData)
          .eq("id", existingData.id)
        
        if (error) throw error
      } else {
        const { error } = await supabase
          .from("contact_info")
          .insert([contactData])
        
        if (error) throw error
      }

      toast({
        title: "Success",
        description: "Contact information updated successfully"
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save contact information",
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
      <div>
        <h2 className="text-3xl font-bold text-foreground">Contact Information</h2>
        <p className="text-muted-foreground mt-2">
          Manage your private contact details. This information is only visible to admins and will be displayed on the contact page.
        </p>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Contact Details
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="your.email@example.com" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="+1 (555) 123-4567" 
                        {...field} 
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
                    <FormLabel className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Location
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="City, Country" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="bg-secondary/20 border border-border/50 rounded-lg p-4">
                <h4 className="font-semibold text-foreground mb-2">Security Notice</h4>
                <p className="text-sm text-muted-foreground">
                  This contact information is stored securely and only accessible to authenticated administrators. 
                  It will be displayed on your public contact page for visitors to reach you.
                </p>
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
                    Save Contact Information
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