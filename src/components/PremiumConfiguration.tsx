import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PremiumConfigurationProps {
  isPremiumMember: boolean;
}

export const PremiumConfiguration = ({ isPremiumMember }: PremiumConfigurationProps) => {
  const navigate = useNavigate();

  return (
    <Card className="bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200/50 dark:border-amber-800/30">
      <CardContent className="space-y-2 p-2">
        <div className="flex items-center justify-center">
          <div className="space-y-1">
            <p className="font-cormorant text-xl text-foreground font-semibold text-center">
              {isPremiumMember ? "Sacred Bells Community Member" : "Join the Sacred Bells Community and Unlock Premium Features"}
            </p>
          </div>
        </div>
        
        <div className="text-center mt-2">
          <Button
            onClick={() => navigate("/premium")}
            variant="amber"
            size="lg"
            className="gap-3 font-cormorant text-lg font-semibold"
          >
            <Crown className="w-5 h-5" />
            Find out more
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
