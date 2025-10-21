import { Link, useLocation } from "react-router-dom";
import { Crown, Settings, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import churchBellImage from "@/assets/church-bell-transparent.png";

export function Navigation() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="bg-background/95 backdrop-blur-md border-b border-border/50 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center gap-3 text-3xl font-bold text-foreground font-cinzel">
            <img 
              src={churchBellImage} 
              alt="Sacred Bell" 
              className="w-10 h-10 object-contain filter drop-shadow-sm"
            />
            Sacred Bells
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            <Button
              variant={currentPath === "/" ? "default" : "ghost"}
              asChild
              className="font-medium"
            >
              <Link to="/">Home</Link>
            </Button>

            <Button
              variant={currentPath === "/settings" ? "default" : "ghost"}
              asChild
              className="font-medium"
            >
              <Link to="/settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </Link>
            </Button>

            <Button
              variant={currentPath === "/prayer-times" ? "default" : "ghost"}
              asChild
              className="font-medium"
            >
              <Link to="/prayer-times" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Prayer Times
              </Link>
            </Button>
            
            <Button
              variant={currentPath === "/premium" ? "amber" : "outline"}
              asChild
              className="font-medium"
            >
              <Link to="/premium" className="flex items-center gap-2">
                <Crown className="w-4 h-4" />
                Premium
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}