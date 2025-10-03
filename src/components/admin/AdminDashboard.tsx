import { useState } from "react"
import { LogOut, User, FolderOpen, Award, MessageSquare, Settings, Home, Building, GraduationCap, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/ThemeToggle"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { ProjectManager } from "./ProjectManager"
import { SkillManager } from "./SkillManager"
import { CertificationManager } from "./CertificationManager"
import { ContactMessages } from "./ContactMessages"
import { ProfileEditor } from "./ProfileEditor"
import { ContactInfoManager } from "./ContactInfoManager"
import { EducationManager } from "./EducationManager"
import { ExperienceManager } from "./ExperienceManager"
import { Link } from "react-router-dom"

type AdminView = 'overview' | 'profile' | 'contact' | 'projects' | 'skills' | 'experience' | 'education' | 'certifications' | 'messages'

export function AdminDashboard() {
  const [currentView, setCurrentView] = useState<AdminView>('overview')
  const { toast } = useToast()

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive"
      })
    } else {
      toast({
        title: "Success", 
        description: "Signed out successfully"
      })
    }
  }

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: Settings },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'contact', label: 'Contact Info', icon: Mail },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'skills', label: 'Skills', icon: Settings },
    { id: 'experience', label: 'Experience', icon: Building },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'certifications', label: 'Certifications', icon: Award },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
  ]

  const renderCurrentView = () => {
    switch (currentView) {
      case 'profile':
        return <ProfileEditor />
      case 'contact':
        return <ContactInfoManager />
      case 'projects':
        return <ProjectManager />
      case 'skills':
        return <SkillManager />
      case 'experience':
        return <ExperienceManager />
      case 'education':
        return <EducationManager />
      case 'certifications':
        return <CertificationManager />
      case 'messages':
        return <ContactMessages />
      default:
        return (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-elegant transition-all duration-300 animate-fade-in">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start hover:shadow-elegant transition-all duration-300 hover:scale-105"
                  onClick={() => setCurrentView('projects')}
                >
                  <FolderOpen className="h-4 w-4 mr-2" />
                  Manage Projects
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start hover:shadow-elegant transition-all duration-300 hover:scale-105"
                  onClick={() => setCurrentView('skills')}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Update Skills
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start hover:shadow-elegant transition-all duration-300 hover:scale-105"
                  onClick={() => setCurrentView('messages')}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  View Messages
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-elegant transition-all duration-300 animate-fade-in delay-200">
              <CardHeader>
                <CardTitle className="text-lg">Portfolio Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Manage all aspects of your portfolio from this admin dashboard.
                </p>
                <Link to="/">
                  <Button variant="outline" className="w-full hover:shadow-elegant transition-all duration-300 hover:scale-105">
                    <Home className="h-4 w-4 mr-2" />
                    View Portfolio
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-elegant transition-all duration-300 animate-fade-in delay-400">
              <CardHeader>
                <CardTitle className="text-lg">System Info</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>Portfolio Admin Panel</p>
                <p className="mt-2">Manage your content dynamically and efficiently.</p>
              </CardContent>
            </Card>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm animate-slide-in">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-foreground gradient-text animate-fade-in delay-300">
              Portfolio Admin
            </h1>
            
            <div className="flex items-center space-x-4 animate-fade-in delay-500">
              <ThemeToggle />
              <Link to="/">
                <Button variant="outline" size="sm" className="hover:shadow-elegant transition-all duration-300 hover:scale-105">
                  <Home className="h-4 w-4 mr-2" />
                  View Site
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleSignOut} className="hover:shadow-elegant transition-all duration-300 hover:scale-105">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1 animate-slide-left delay-700">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-elegant transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg">Navigation</CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  {navigationItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Button
                        key={item.id}
                        variant={currentView === item.id ? "default" : "ghost"}
                        className="w-full justify-start hover:shadow-elegant transition-all duration-300 hover:scale-105"
                        onClick={() => setCurrentView(item.id as AdminView)}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {item.label}
                      </Button>
                    )
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 animate-slide-right delay-900">
            {renderCurrentView()}
          </div>
        </div>
      </div>
    </div>
  )
}