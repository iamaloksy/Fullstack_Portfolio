import { useState, useEffect } from "react"
import { Mail, Clock, CheckCircle, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

interface ContactMessage {
  id: string
  name: string
  email: string
  subject?: string
  message: string
  status: string
  created_at: string
}

export function ContactMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false })
      
      if (error) throw error
      setMessages(data || [])
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch messages",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const updateMessageStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("contact_messages")
        .update({ status })
        .eq("id", id)
      
      if (error) throw error
      
      setMessages(messages.map(msg => 
        msg.id === id ? { ...msg, status } : msg
      ))
      
      toast({
        title: "Success",
        description: `Message marked as ${status}`
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update message status",
        variant: "destructive"
      })
    }
  }

  const deleteMessage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return

    try {
      const { error } = await supabase
        .from("contact_messages")
        .delete()
        .eq("id", id)
      
      if (error) throw error
      
      setMessages(messages.filter(msg => msg.id !== id))
      toast({
        title: "Success",
        description: "Message deleted successfully"
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive"
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return 'destructive'
      case 'read': return 'secondary'
      case 'replied': return 'default'
      default: return 'secondary'
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
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-foreground">Contact Messages</h2>
        <div className="flex gap-2">
          <Badge variant="destructive">
            {messages.filter(m => m.status === 'unread').length} Unread
          </Badge>
          <Badge variant="secondary">
            {messages.length} Total
          </Badge>
        </div>
      </div>

      {messages.length === 0 ? (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="py-12 text-center">
            <Mail className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">No messages yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <Card key={message.id} className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        {message.subject || `Message from ${message.name}`}
                      </h3>
                      <Badge variant={getStatusColor(message.status)}>
                        {message.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="font-medium">{message.name}</span>
                      <a 
                        href={`mailto:${message.email}`}
                        className="hover:text-primary transition-colors"
                      >
                        {message.email}
                      </a>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatDate(message.created_at)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {message.status === 'unread' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateMessageStatus(message.id, 'read')}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark Read
                      </Button>
                    )}
                    {message.status === 'read' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateMessageStatus(message.id, 'replied')}
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Mark Replied
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => deleteMessage(message.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="bg-muted/30 rounded-lg p-4">
                  <p className="text-foreground whitespace-pre-wrap">{message.message}</p>
                </div>
                
                <div className="mt-4 flex gap-2">
                  <Button 
                    size="sm"
                    onClick={() => window.open(`mailto:${message.email}?subject=Re: ${message.subject || 'Your message'}&body=Hi ${message.name},%0D%0A%0D%0A`, '_blank')}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Reply via Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}