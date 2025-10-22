import { Link, useLocation } from "react-router-dom";
import { Crown, Settings, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AppToggle } from "@/components/AppToggle";
import { useIsMobile } from "@/hooks/use-mobile";
import churchBellImage from "@/assets/church-bell-transparent.png";

interface NavigationProps {
  isAppEnabled?: boolean;
  onAppToggle?: (enabled: boolean) => void;
}

export function Navigation({ isAppEnabled = true, onAppToggle }: NavigationProps) {
  const location = useLocation();
  const currentPath = location.pathname;
  const isMobile = useIsMobile();

  return (
    <nav className="bg-background/95 backdrop-blur-md border-b border-border/50 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className={`flex ${isMobile ? 'flex-col py-3 gap-3' : 'items-center justify-between h-16'}`}>
          {/* Logo/Brand and Controls */}
          <div className="flex items-center justify-between">
            <Link to="/" className={`flex items-center gap-3 ${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-foreground font-cinzel`}>
              <img 
                src={churchBellImage} 
                alt="Sacred Bell" 
                className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} object-contain filter drop-shadow-sm`}
              />
              Sacred Bells
            </Link>

            {isMobile && (
              <div className="flex items-center gap-2">
                {onAppToggle && (
                  <AppToggle isEnabled={isAppEnabled} onToggle={onAppToggle} />
                )}
                <ThemeToggle />
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div className={`flex items-center ${isMobile ? 'justify-between w-full flex-wrap' : 'gap-2'}`}>
            <Button
              variant={currentPath === "/" ? "default" : "ghost"}
              asChild
              className={`font-medium ${isMobile ? 'text-xs px-3 py-2 h-9' : ''}`}
            >
              <Link to="/">Home</Link>
            </Button>

            <Button
              variant={currentPath === "/settings" ? "default" : "ghost"}
              asChild
              className={`font-medium ${isMobile ? 'text-xs px-3 py-2 h-9' : ''}`}
            >
              <Link to="/settings" className="flex items-center gap-2">
                <Settings className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
                Settings
              </Link>
            </Button>

            <Button
              variant={currentPath === "/prayer-times" ? "default" : "ghost"}
              asChild
              className={`font-medium ${isMobile ? 'text-xs px-3 py-2 h-9' : ''}`}
            >
              <Link to="/prayer-times" className="flex items-center gap-2">
                <Clock className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
                Prayer Times
              </Link>
            </Button>
            
            <Button
              variant={currentPath === "/premium" ? "amber" : "outline"}
              asChild
              className={`font-medium ${isMobile ? 'text-xs px-3 py-2 h-9' : ''}`}
            >
              <Link to="/premium" className="flex items-center gap-2">
                <Crown className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
                Premium
              </Link>
            </Button>

            {!isMobile && (
              <>
                {onAppToggle && (
                  <AppToggle isEnabled={isAppEnabled} onToggle={onAppToggle} />
                )}
                <ThemeToggle />
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}