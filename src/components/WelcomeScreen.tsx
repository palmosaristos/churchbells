import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import churchBellsHero from "@/assets/church-bells-hero.jpg";

interface WelcomeScreenProps {
  isOpen: boolean;
  onComplete: () => void;
}

export const WelcomeScreen = ({ isOpen, onComplete }: WelcomeScreenProps) => {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="max-w-2xl p-0 overflow-hidden border-amber-200/50 dark:border-amber-800/30">
        <div className="relative">
          {/* Hero Image */}
          <div className="h-64 bg-cover bg-center relative" style={{ backgroundImage: `url(${churchBellsHero})` }}>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          </div>
          
          {/* Content */}
          <div className="relative -mt-20 px-8 pb-8">
            <AlertDialogHeader className="space-y-6">
              <AlertDialogTitle className="text-5xl md:text-6xl font-cinzel font-bold text-center text-foreground">
                Welcome to Sacred Bells
              </AlertDialogTitle>
              <AlertDialogDescription className="text-xl md:text-2xl text-center font-cormorant text-amber-800 dark:text-amber-200 leading-relaxed">
                Let the sacred sound of church bells guide you through the day
              </AlertDialogDescription>
            </AlertDialogHeader>
            
            <AlertDialogFooter className="mt-8">
              <Button 
                onClick={onComplete}
                className="w-full text-lg py-6"
                size="lg"
              >
                Continue
              </Button>
            </AlertDialogFooter>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
