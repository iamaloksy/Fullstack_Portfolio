import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Menu, X, User, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ThemeToggle"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

const navItems = [
  { name: "Home", href: "#hero" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Experience", href: "#experience" },
  { name: "Education", href: "#education" },
  { name: "Projects", href: "#projects" },
  { name: "Certifications", href: "#certifications" },
  { name: "Contact", href: "#contact" }
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [user, setUser] = useState(null)
  const { toast } = useToast()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

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

  const scrollToSection = (href: string) => {
    if (href.startsWith("#")) {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
        setIsMenuOpen(false)
      }
    }
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? "bg-background/80 backdrop-blur-md border-b border-border shadow-elegant" 
        : "bg-transparent"
    }`}>
      <nav className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 md:py-4 gap-2 md:gap-4">
          {/* Logo - Flexible width */}
          <div className="text-xl sm:text-2xl font-bold text-primary flex-shrink-0 min-w-fit">
            AK's Portfolio
          </div>

          {/* Desktop Navigation - Hidden on mobile/tablet */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-6 flex-1 justify-center mx-4">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="text-sm xl:text-base text-foreground hover:text-primary transition-colors duration-200 font-medium whitespace-nowrap"
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Right side actions - Responsive */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3 flex-shrink-0">
            <ThemeToggle />
            
            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/admin">
                  <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                    <User className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Admin</span>
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleSignOut} className="text-xs sm:text-sm">
                  <span className="hidden md:inline">Sign Out</span>
                  <span className="md:hidden">Out</span>
                </Button>
              </div>
            ) : (
              <Link to="/auth" className="hidden sm:block">
                <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                  <LogIn className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Login</span>
                </Button>
              </Link>
            )}

            {/* Mobile menu button */}
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden h-8 w-8 sm:h-9 sm:w-9"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation - Full screen overlay */}
        {isMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-[57px] sm:top-[65px] bg-background/95 backdrop-blur-md z-50">
            <div className="container mx-auto px-4 py-6 h-full overflow-y-auto">
              <div className="flex flex-col space-y-1">
                {navItems.map((item, index) => (
                  <button
                    key={item.name}
                    onClick={() => scrollToSection(item.href)}
                    className="text-left text-foreground hover:text-primary transition-all duration-200 font-medium py-4 px-4 rounded-lg hover:bg-muted/50 animate-fade-in text-lg"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    {item.name}
                  </button>
                ))}
                
                {/* Mobile auth buttons */}
                <div className="pt-4 border-t border-border mt-4 space-y-2">
                  {user ? (
                    <>
                      <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="block">
                        <Button variant="outline" className="w-full justify-start text-lg py-6">
                          <User className="h-5 w-5 mr-3" />
                          Admin Panel
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start text-lg py-6" 
                        onClick={() => {
                          handleSignOut()
                          setIsMenuOpen(false)
                        }}
                      >
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <Link to="/auth" onClick={() => setIsMenuOpen(false)} className="block">
                      <Button variant="outline" className="w-full justify-start text-lg py-6">
                        <LogIn className="h-5 w-5 mr-3" />
                        Login
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}