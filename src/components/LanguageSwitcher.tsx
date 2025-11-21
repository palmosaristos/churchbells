import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface LanguageSwitcherProps {
  compact?: boolean;
}

export function LanguageSwitcher({ compact = false }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();
  const isMobile = useIsMobile();

  const languages = [
    { code: 'fr', label: 'Français', nativeLabel: 'FR' },
    { code: 'it', label: 'Italiano', nativeLabel: 'IT' },
    { code: 'en', label: 'English', nativeLabel: 'EN' }
  ];

  const currentLang = languages.find(lang => lang.code === i18n.language);
  const displayLabel = compact || isMobile ? (currentLang?.nativeLabel || 'EN') : (currentLang?.label || 'English');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{displayLabel}</span>
          <span className="sm:hidden">{currentLang?.nativeLabel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => i18n.changeLanguage(lang.code)}
            className={i18n.language === lang.code ? 'bg-accent' : ''}
          >
            {lang.label}
            {i18n.language === lang.code && ' ✓'}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
