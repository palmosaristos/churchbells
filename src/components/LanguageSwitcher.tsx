import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'fr', label: 'Français' },
    { code: 'it', label: 'Italiano' },
    { code: 'en', label: 'English' }
  ];

  return (
    <div className="flex gap-2 flex-wrap">
      {languages.map((lang) => (
        <Button
          key={lang.code}
          onClick={() => i18n.changeLanguage(lang.code)}
          variant={i18n.language === lang.code ? 'default' : 'outline'}
          size="sm"
          className="flex items-center gap-2"
        >
          <Globe className="h-4 w-4" />
          {lang.label}
        </Button>
      ))}
    </div>
  );
}
