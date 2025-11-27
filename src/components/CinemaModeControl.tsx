import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Film, Clock } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCinemaMode } from "@/hooks/useCinemaMode";

export const CinemaModeControl = () => {
  const { t } = useTranslation();
  const { isActive, remainingMinutes, activate, deactivate } = useCinemaMode();
  const [selectedDuration, setSelectedDuration] = useState<number>(120);

  const handleToggle = (checked: boolean) => {
    if (checked) {
      activate(selectedDuration);
    } else {
      deactivate();
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50/50 to-indigo-50/50 dark:from-purple-950/20 dark:to-indigo-950/20 rounded-xl p-6 border-2 border-purple-200/50 dark:border-purple-800/30 space-y-4">
      <div className="flex items-center gap-3">
        <Film className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        <div className="flex-1">
          <h3 className="text-xl font-cormorant font-bold text-foreground">
            {t('settings.cinemaMode', 'Mode Cinéma')}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t('settings.cinemaModeDescription', 'Désactive temporairement toutes les cloches')}
          </p>
        </div>
        <Switch
          checked={isActive}
          onCheckedChange={handleToggle}
          className="data-[state=checked]:bg-purple-600"
        />
      </div>

      {isActive && (
        <div className="bg-purple-100/50 dark:bg-purple-900/20 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">
              {t('settings.cinemaModeActive', 'Mode actif')} - {remainingMinutes} {t('common.minutes', 'min')} {t('common.remaining', 'restantes')}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={deactivate}
            className="w-full border-purple-300 dark:border-purple-700"
          >
            {t('settings.deactivateNow', 'Désactiver maintenant')}
          </Button>
        </div>
      )}

      {!isActive && (
        <div className="space-y-3">
          <Label htmlFor="duration-select" className="text-sm font-medium">
            {t('settings.duration', 'Durée')}
          </Label>
          <Select
            value={selectedDuration.toString()}
            onValueChange={(value) => setSelectedDuration(parseInt(value))}
          >
            <SelectTrigger id="duration-select" className="border-purple-200 dark:border-purple-800">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="60">1 {t('common.hour', 'heure')}</SelectItem>
              <SelectItem value="120">2 {t('common.hours', 'heures')}</SelectItem>
              <SelectItem value="180">3 {t('common.hours', 'heures')}</SelectItem>
              <SelectItem value="240">4 {t('common.hours', 'heures')}</SelectItem>
              <SelectItem value="480">8 {t('common.hours', 'heures')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};
