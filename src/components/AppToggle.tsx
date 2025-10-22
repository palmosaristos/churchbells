import { Bell, BellOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

interface AppToggleProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export function AppToggle({ isEnabled, onToggle }: AppToggleProps) {
  const { toast } = useToast();

  const handleToggle = (enabled: boolean) => {
    onToggle(enabled);
    toast({
      title: enabled ? "App Activated" : "App Deactivated",
      description: enabled 
        ? "Sacred Bells will now ring at scheduled times" 
        : "All bell notifications are paused",
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
        aria-label={isEnabled ? "Deactivate app" : "Activate app"}
      />
    </div>
  );
}
