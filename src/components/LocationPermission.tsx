import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, Loader2 } from "lucide-react";

interface LocationPermissionProps {
  onTimeZoneDetected: (timeZone: string) => void;
}

export const LocationPermission = ({ onTimeZoneDetected }: LocationPermissionProps) => {
  useEffect(() => {
    // Auto-detect time zone
    const detectedTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    onTimeZoneDetected(detectedTimeZone);
  }, [onTimeZoneDetected]);

  return (
    <Card className="max-w-md mx-auto border-amber-200/50 dark:border-amber-800/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-5 h-5" />
          Detecting Time Zone
        </CardTitle>
        <CardDescription>
          Automatically detecting your time zone for accurate bell times...
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </CardContent>
    </Card>
  );
};
