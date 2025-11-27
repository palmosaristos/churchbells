import { useTranslation } from "react-i18next";
import { MoonStar } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface DNDRespectControlProps {
  respectDND: boolean;
  onRespectDNDChange: (value: boolean) => void;
}

export const DNDRespectControl = ({ respectDND, onRespectDNDChange }: DNDRespectControlProps) => {
  const { t } = useTranslation();

  return (
    <div className="bg-gradient-to-br from-slate-50/50 to-blue-50/50 dark:from-slate-950/20 dark:to-blue-950/20 rounded-xl p-6 border-2 border-slate-200/50 dark:border-slate-800/30 space-y-3">
      <div className="flex items-center gap-3">
        <MoonStar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        <div className="flex-1">
          <Label htmlFor="respect-dnd" className="text-xl font-cormorant font-bold text-foreground cursor-pointer">
            {t('settings.respectDND', 'Respecter "Ne pas déranger"')}
          </Label>
          <p className="text-sm text-muted-foreground">
            {t('settings.respectDNDDescription', 'Les cloches ne sonneront pas si le mode "Ne pas déranger" est activé')}
          </p>
        </div>
        <Switch
          id="respect-dnd"
          checked={respectDND}
          onCheckedChange={onRespectDNDChange}
          className="data-[state=checked]:bg-blue-600"
        />
      </div>
      
      {respectDND && (
        <p className="text-xs text-muted-foreground bg-blue-50/50 dark:bg-blue-950/30 rounded-lg p-3">
          💡 {t('settings.dndWarning', 'Attention : si vous utilisez DND pour dormir, les cloches matinales ne sonneront pas.')}
        </p>
      )}
    </div>
  );
};
