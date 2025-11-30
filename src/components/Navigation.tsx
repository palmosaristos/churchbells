import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { AppToggle } from "@/components/AppToggle";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { useTranslation } from "react-i18next";
import churchBellImage from "@/assets/church-bell-transparent.png";

interface NavigationProps {
  isAppEnabled?: boolean;
  onAppToggle?: (enabled: boolean) => void;
}

export function Navigation({ isAppEnabled = true, onAppToggle }: NavigationProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const currentPath = location.pathname;
  const isMobile = useIsMobile();
  const { toggleAudio } = useAudioPlayer();

  const handleBellClick = () => {
    toggleAudio({ audioUrl: "/audio/cathedral_1.mp3", traditionName: t('app.title'), type: 'bell' });
  };

  return (
    <nav className="bg-background/95 backdrop-blur-md border-b border-border/50 sticky top-0 z-50 pt-[env(safe-area-inset-top)]">
      <div className="container mx-auto px-2 sm:px-4">
        {/* First Row: Toggle ON/OFF, Logo, Theme Toggle + Language */}
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
            aria-label={t('app.title')}
          >
            <img 
              src={churchBellImage} 
              alt={t('app.title')} 
              className={`${isMobile ? 'w-7 h-7' : 'w-10 h-10'} object-contain filter drop-shadow-sm`}
            />
            {!isMobile && t('app.title')}
          </button>

          {/* Right: Theme Toggle + Language Switcher */}
          <div className="flex-shrink-0 z-10 flex items-center gap-2">
            <LanguageSwitcher compact={isMobile} />
            <ThemeToggle />
          </div>
        </div>

        {/* Second Row: Navigation Links */}
        <div className="flex items-center justify-center gap-1 sm:gap-2 h-12 sm:h-14">
          <Button
            variant={currentPath === "/" ? "default" : "ghost"}
            asChild
            className={`font-medium ${isMobile ? 'text-sm px-3 py-1.5 h-9' : ''}`}
            aria-label={t('navigation.home')}
          >
            <Link to="/" className="flex items-center gap-1">
              <span>{t('navigation.home')}</span>
            </Link>
          </Button>

          <Button
            variant={currentPath === "/more" ? "default" : "ghost"}
            asChild
            className={`font-medium ${isMobile ? 'text-sm px-3 py-1.5 h-9' : ''}`}
            aria-label={t('navigation.more')}
          >
            <Link to="/more" className="flex items-center gap-1">
              <span>{t('navigation.more')}</span>
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