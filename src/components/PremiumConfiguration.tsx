import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PremiumConfigurationProps {
  isPremiumMember: boolean;
}

export const PremiumConfiguration = ({ isPremiumMember }: PremiumConfigurationProps) => {
  const navigate = useNavigate();

  return (
    <Card className="bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200/50 dark:border-amber-800/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-cormorant text-2xl text-foreground">
          <Crown className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          Premium Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-lg font-medium text-foreground">
              {isPremiumMember ? "Sacred Bells Community Member" : "Not yet a Sacred Bells Community Member"}
            </p>
          </div>
        </div>
        
        <Button
          onClick={() => navigate("/premium")}
          variant="outline"
          className="w-full group"
        >
          Find out more
          <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
        </Button>
      </CardContent>
    </Card>
  );
};
