import { Link, useLocation } from "react-router-dom";
import { Bell, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navigation() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="bg-background/95 backdrop-blur-md border-b border-border/50 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-foreground">
            <Bell className="w-6 h-6 text-amber-600" />
            Sacred Bells
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-4">
            <Button
              variant={currentPath === "/" ? "default" : "ghost"}
              asChild
              className="font-medium"
            >
              <Link to="/">Home</Link>
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