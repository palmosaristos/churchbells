import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import heroImage from "/lovable-uploads/church-bells-hero-hq.jpg";
import { useTranslation } from 'react-i18next';

interface WelcomeScreenProps {
  isOpen: boolean;
  onComplete: () => void;
}

export const WelcomeScreen = ({ isOpen, onComplete }: WelcomeScreenProps) => {
  const { t } = useTranslation();
  
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="max-w-2xl p-0 overflow-hidden border-amber-200/50 dark:border-amber-800/30">
        <div className="relative">
          {/* Hero Image */}
          <div className="h-64 bg-cover bg-center relative" style={{ backgroundImage: `url(${heroImage})` }}>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          </div>
          
          {/* Content */}
          <div className="relative -mt-20 px-8 pb-8">
            <AlertDialogHeader className="space-y-6">
              <AlertDialogTitle className="text-5xl md:text-6xl font-cinzel font-bold text-center text-foreground">
                {t('welcome.title')}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-3xl md:text-4xl text-center font-cormorant font-bold text-amber-900 dark:text-amber-100 leading-relaxed italic">
                {t('welcome.description')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            
            <AlertDialogFooter className="mt-8">
              <Button 
                onClick={onComplete}
                className="w-full text-lg py-6"
                size="lg"
              >
                {t('welcome.continue')}
              </Button>
            </AlertDialogFooter>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
