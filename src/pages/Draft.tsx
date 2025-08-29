import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";

export default function Draft() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-amber-50/30 dark:from-slate-900 dark:to-slate-800">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold text-center mb-8">Éléments en Brouillon</h1>
          
          {/* Premium Promotion Card - Sauvegardé de Index.tsx */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Encadré Premium (sauvegardé de la page d'accueil)</h2>
            <Card className="bg-gradient-to-br from-amber-50/80 to-orange-50/80 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200/50 dark:border-amber-800/30 shadow-lg">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-2">
                    <Crown className="w-6 h-6 text-amber-600" />
                    <Sparkles className="w-5 h-5 text-amber-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-amber-800 dark:text-amber-200">
                    Discover All Premium Bell Traditions
                  </h3>
                  <p className="text-amber-700 dark:text-amber-300 max-w-lg mx-auto">Unlock the complete collection of sacred bell traditions : Carillon melodies, Russian Zvon, Byzantine chants, and more...</p>
                  <Button asChild variant="outline" size="lg" className="font-semibold">
                    <Link to="/premium" className="flex items-center gap-2">
                      <Crown className="w-4 h-4" />
                      Explore All Premium Traditions
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}