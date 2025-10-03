import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, ExternalLink, Calendar, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { CertificationForm } from "./CertificationForm"

interface Certification {
  id: string
  title: string
  issuer: string
  description?: string
  issue_date?: string
  expiry_date?: string
  credential_id?: string
  credential_url?: string
  image_url?: string
  order_index: number
}

export function CertificationManager() {
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCert, setEditingCert] = useState<Certification | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchCertifications()
  }, [])

  const fetchCertifications = async () => {
    try {
      const { data, error } = await supabase
        .from("certifications")
        .select("*")
        .order("order_index")
      
      if (error) throw error
      setCertifications(data || [])
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch certifications",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certification?")) return

    try {
      const { error } = await supabase
        .from("certifications")
        .delete()
        .eq("id", id)
      
      if (error) throw error
      
      setCertifications(certifications.filter(c => c.id !== id))
      toast({
        title: "Success",
        description: "Certification deleted successfully"
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete certification",
        variant: "destructive"
      })
    }
  }

  const handleEdit = (cert: Certification) => {
    setEditingCert(cert)
    setIsFormOpen(true)
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingCert(null)
    fetchCertifications()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const isExpired = (expiryDate: string) => {
    return new Date(expiryDate) < new Date()
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
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-foreground">Certifications</h2>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Certification
        </Button>
      </div>

      {certifications.length === 0 ? (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No certifications yet. Add your first certification!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {certifications.map((cert) => (
            <Card key={cert.id} className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {cert.image_url ? (
                        <img
                          src={cert.image_url}
                          alt={cert.issuer}
                          className="w-12 h-12 object-contain"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                          <Award className="h-6 w-6 text-primary" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-xl font-semibold text-foreground">{cert.title}</h3>
                        <p className="text-muted-foreground">{cert.issuer}</p>
                      </div>
                    </div>
                    
                    {cert.description && (
                      <p className="text-muted-foreground mb-3">{cert.description}</p>
                    )}

                    <div className="flex flex-wrap gap-4 mb-3 text-sm">
                      {cert.issue_date && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span className="text-muted-foreground">
                            Issued: {formatDate(cert.issue_date)}
                          </span>
                        </div>
                      )}
                      {cert.expiry_date && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span className={isExpired(cert.expiry_date) ? 'text-destructive' : 'text-muted-foreground'}>
                            {isExpired(cert.expiry_date) ? 'Expired: ' : 'Expires: '}{formatDate(cert.expiry_date)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      {cert.expiry_date ? (
                        <Badge variant={isExpired(cert.expiry_date) ? "destructive" : "default"}>
                          {isExpired(cert.expiry_date) ? "Expired" : "Valid"}
                        </Badge>
                      ) : (
                        <Badge variant="default">No Expiry</Badge>
                      )}
                      
                      {cert.credential_id && (
                        <span className="text-xs text-muted-foreground">ID: {cert.credential_id}</span>
                      )}
                      
                      {cert.credential_url && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => window.open(cert.credential_url, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Certificate
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEdit(cert)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDelete(cert.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isFormOpen && (
        <CertificationForm
          certification={editingCert}
          onClose={handleFormClose}
        />
      )}
    </div>
  )
}