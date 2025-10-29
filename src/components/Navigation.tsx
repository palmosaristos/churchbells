import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AppToggle } from "@/components/AppToggle";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { Settings, Clock, MoreHorizontal } from "lucide-react";
import churchBellImage from "@/assets/church-bell-transparent.png";

interface NavigationProps {
  isAppEnabled?: boolean;
  onAppToggle?: (enabled: boolean) => void;
}

export function Navigation({ isAppEnabled = true, onAppToggle }: NavigationProps) {
  const location = useLocation();
  const currentPath = location.pathname;
  const isMobile = useIsMobile();
  const { toggleAudio } = useAudioPlayer();

  const handleBellClick = () => {
    toggleAudio("/audio/cathedral-bell.mp3", "Sacred Bells");
  };

  return (
    <nav className="bg-background/95 backdrop-blur-md border-b border-border/50 sticky top-0 z-50">
      <div className="container mx-auto px-2 sm:px-4">
        {/* First Row: Toggle ON/OFF, Logo, Theme Toggle */}
        <div className="relative flex items-center justify-between h-12 sm:h-14 border-b border-border/30">
          {/* Left: App Toggle */}
          <div className="flex-shrink-0 z-10">
            {onAppToggle && (
              <AppToggle isEnabled={isAppEnabled} onToggle={onAppToggle} />
            )}
          </div>

          {/* Center: Logo - Absolutely centered */}
          <button 
            onClick={handleBellClick}
            className={`absolute left-1/2 -translate-x-1/2 flex items-center gap-2 ${isMobile ? 'text-xl' : 'text-3xl'} font-bold text-foreground font-cinzel hover:opacity-80 transition-opacity cursor-pointer`}
            aria-label="Jouer le son de la cloche sacrée"
          >
            <img 
              src={churchBellImage} 
              alt="Sacred Bell" 
              className={`${isMobile ? 'w-7 h-7' : 'w-10 h-10'} object-contain filter drop-shadow-sm`}
            />
            {!isMobile && "Sacred Bells"}
          </button>

          {/* Right: Theme Toggle */}
          <div className="flex-shrink-0 z-10">
            <ThemeToggle />
          </div>
        </div>

        {/* Second Row: Navigation Links */}
        <div className="flex items-center justify-center gap-1 sm:gap-2 h-12 sm:h-14">
          <Button
            variant={currentPath === "/" ? "default" : "ghost"}
            asChild
            className={`font-medium ${isMobile ? 'text-sm px-3 py-1.5 h-9' : ''}`}
            aria-label="Aller à la page d'accueil"
          >
            <Link to="/" className="flex items-center gap-1">
              <span>Home</span>
            </Link>
          </Button>

          <Button
            variant={currentPath === "/settings" ? "default" : "ghost"}
            asChild
            className={`font-medium ${isMobile ? 'text-sm px-3 py-1.5 h-9' : ''}`}
            aria-label="Aller à la page des paramètres"
          >
            <Link to="/settings" className="flex items-center gap-1">
              <Settings className={`${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />
              <span>Settings</span>
            </Link>
          </Button>

          <Button
            variant={currentPath === "/prayer-times" ? "default" : "ghost"}
            asChild
            className={`font-medium ${isMobile ? 'text-sm px-3 py-1.5 h-9' : ''}`}
            aria-label="Aller à la page des heures de prière"
          >
            <Link to="/prayer-times" className="flex items-center gap-1">
              <Clock className={`${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />
              <span>Prayer Times</span>
            </Link>
          </Button>

          <Button
            variant={currentPath === "/more" ? "default" : "ghost"}
            asChild
            className={`font-medium ${isMobile ? 'text-sm px-3 py-1.5 h-9' : ''}`}
            aria-label="Aller à la page More"
          >
            <Link to="/more" className="flex items-center gap-1">
              <MoreHorizontal className={`${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />
              <span>More</span>
            </Link>
          </Button>
          
          {/* Premium page temporarily hidden - uncomment when ready
          <Button
            variant={currentPath === "/premium" ? "amber" : "outline"}
            asChild
            className={`font-medium ${isMobile ? 'text-xs px-2 py-1 h-8' : ''}`}
            aria-label="Aller à la page premium"
          >
            <Link to="/premium" className="flex items-center gap-1">
              <Crown className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
              <span>Premium</span>
            </Link>
          </Button>
          */}
        </div>
      </div>
    </nav>
  );
}