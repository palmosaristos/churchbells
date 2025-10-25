import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PremiumConfigurationProps {
  isPremiumMember: boolean;
}

export const PremiumConfiguration = ({ isPremiumMember }: PremiumConfigurationProps) => {
  const navigate = useNavigate();

  return (
    <Card className="bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200/50 dark:border-amber-800/30">
      <CardContent className="space-y-4 p-5">
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
