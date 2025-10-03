import { useEffect, useState } from "react"
import { ExternalLink, Calendar, Award } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { supabase } from "@/integrations/supabase/client"

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
}

export function Certifications() {
  const [certifications, setCertifications] = useState<Certification[]>([])

  useEffect(() => {
    const fetchCertifications = async () => {
      const { data } = await supabase
        .from("certifications")
        .select("*")
        .order("order_index")
      
      if (data) {
        setCertifications(data)
      }
    }

    fetchCertifications()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    })
  }

  const isExpired = (expiryDate: string) => {
    return new Date(expiryDate) < new Date()
  }

  return (
    <section id="certifications" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Certifications
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional certifications and achievements that validate my expertise
            </p>
          </div>

          {certifications.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {certifications.map((cert, index) => (
                <Card 
                  key={cert.id} 
                  className="group hover:shadow-elegant transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
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
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2">
                            {cert.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {cert.issuer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    {cert.description && (
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                        {cert.description}
                      </p>
                    )}

                    {/* Dates */}
                    <div className="space-y-2 mb-4">
                      {cert.issue_date && (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span className="text-muted-foreground">
                            Issued: {formatDate(cert.issue_date)}
                          </span>
                        </div>
                      )}
                      {cert.expiry_date && (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span className={`${isExpired(cert.expiry_date) ? 'text-destructive' : 'text-muted-foreground'}`}>
                            {isExpired(cert.expiry_date) ? 'Expired: ' : 'Expires: '}{formatDate(cert.expiry_date)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Status Badge */}
                    <div className="mb-4">
                      {cert.expiry_date ? (
                        <Badge variant={isExpired(cert.expiry_date) ? "destructive" : "default"}>
                          {isExpired(cert.expiry_date) ? "Expired" : "Valid"}
                        </Badge>
                      ) : (
                        <Badge variant="default">
                          No Expiry
                        </Badge>
                      )}
                    </div>

                    {/* Credential ID */}
                    {cert.credential_id && (
                      <p className="text-xs text-muted-foreground mb-4">
                        ID: {cert.credential_id}
                      </p>
                    )}

                    {/* Action Button */}
                    {cert.credential_url && (
                      <Button 
                        size="sm" 
                        className="w-full hover:shadow-glow transition-all duration-300"
                        onClick={() => window.open(cert.credential_url, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Certificate
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 animate-fade-in">
              <Award className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">
                No certifications available yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}