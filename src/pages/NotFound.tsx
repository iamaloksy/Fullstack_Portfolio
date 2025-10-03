import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 px-4">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          {/* Animated 404 */}
          <div className="mb-8 animate-fade-in">
            <div className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4 animate-bounce-gentle">
              404
            </div>
            <div className="text-6xl mb-6 animate-float">
              🔍
            </div>
          </div>

          {/* Content Card */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-elegant animate-fade-in delay-300">
            <CardContent className="p-8">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 animate-slide-in delay-500">
                Oops! Page not found
              </h1>
              <p className="text-xl text-muted-foreground mb-6 animate-slide-in delay-700">
                The page you're looking for doesn't exist or has been moved.
              </p>
              <p className="text-muted-foreground mb-8 animate-slide-in delay-900">
                Don't worry, let's get you back on track!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in delay-1000">
                <Button 
                  asChild
                  className="hover:shadow-glow transition-all duration-300 hover:scale-105"
                >
                  <a href="/">
                    <Home className="h-4 w-4 mr-2" />
                    Return to Home
                  </a>
                </Button>
                <Button 
                  variant="outline"
                  asChild
                  className="hover:shadow-elegant transition-all duration-300 hover:scale-105"
                >
                  <a href="/#projects">
                    <Search className="h-4 w-4 mr-2" />
                    Browse Projects
                  </a>
                </Button>
              </div>

              {/* Error details for debugging */}
              <div className="mt-8 p-4 bg-muted/50 rounded-lg animate-fade-in delay-1200">
                <p className="text-sm text-muted-foreground">
                  <strong>Requested URL:</strong> {location.pathname}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Floating background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-20 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-20 right-20 w-48 h-48 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
