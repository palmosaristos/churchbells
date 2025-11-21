import { useTranslation } from 'react-i18next';
import { Bell, BellOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

interface AppToggleProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export function AppToggle({ isEnabled, onToggle }: AppToggleProps) {
  const { t } = useTranslation();
  const { toast } = useToast();

  const handleToggle = (enabled: boolean) => {
    onToggle(enabled);
    toast({
      title: enabled ? t('appToggle.activated') : t('appToggle.deactivated'),
      description: enabled 
        ? t('appToggle.activatedDesc')
        : t('appToggle.deactivatedDesc'),
    });
  };

  return (
    <div className="flex items-center gap-2">
      {isEnabled ? (
        <Bell className="w-4 h-4 text-primary" />
      ) : (
        <BellOff className="w-4 h-4 text-muted-foreground" />
      )}
      <Switch 
        checked={isEnabled}
        onCheckedChange={handleToggle}
        className="data-[state=checked]:bg-primary"
        aria-label={isEnabled ? t('appToggle.deactivate') : t('appToggle.activate')}
      />
    </div>
  );
}
