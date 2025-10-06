import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import monasteryIcon from "@/assets/monastery-icon.png";

export const PremiumPreview = () => {
  return (
    <Card className="bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200/50 dark:border-amber-800/30 shadow-lg backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 font-cormorant text-3xl text-foreground">
          <img src={monasteryIcon} alt="Monastery" className="w-8 h-8 object-contain" />
          Premium Prayer Traditions
          <span className="text-lg font-cormorant text-muted-foreground italic">(Coming Soon)</span>
        </CardTitle>
        <CardDescription className="font-cormorant text-xl text-foreground">
          Experience authentic Catholic and Orthodox prayer schedules with advanced features
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-4 rounded-lg border bg-card">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-burgundy"></div>
              <span className="font-cormorant text-xl text-foreground">Roman Catholic</span>
            </div>
            <p className="text-lg text-muted-foreground mb-3">Complete 8-prayer daily cycle including Matins, Lauds, Prime, Tierce, Sexte, None, Vespers, and Compline</p>
            <div className="space-y-1">
              <div className="flex justify-between text-lg">
                <span>Matins</span>
                <span className="text-muted-foreground">00:00</span>
              </div>
              <div className="flex justify-between text-lg">
                <span>Lauds</span>
                <span className="text-muted-foreground">06:00</span>
              </div>
              <div className="flex justify-between text-lg">
                <span>Vespers</span>
                <span className="text-muted-foreground">18:00</span>
              </div>
              <div className="text-lg text-muted-foreground">+ 5 more...</div>
            </div>
          </div>
          
          <div className="p-4 rounded-lg border bg-card">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span className="font-cormorant text-xl text-foreground">Orthodox</span>
            </div>
            <p className="text-lg text-muted-foreground mb-3">Traditional Byzantine prayer hours with Midnight Office, Matins, and canonical hours</p>
            <div className="space-y-1">
              <div className="flex justify-between text-lg">
                <span>Midnight Office</span>
                <span className="text-muted-foreground">00:00</span>
              </div>
              <div className="flex justify-between text-lg">
                <span>Matins</span>
                <span className="text-muted-foreground">04:00</span>
              </div>
              <div className="flex justify-between text-lg">
                <span>Vespers</span>
                <span className="text-muted-foreground">18:00</span>
              </div>
              <div className="text-lg text-muted-foreground">+ 5 more...</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
