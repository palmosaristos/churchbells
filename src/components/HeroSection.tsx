import churchBellTransparent from "@/assets/church-bell-transparent.png";
import churchBellNew from "@/assets/church-bell-new.png";
import { useTranslation } from 'react-i18next';

interface HeroSectionProps {
  heroImage: string;
}
export const HeroSection = ({
  heroImage
}: HeroSectionProps) => {
  const { t } = useTranslation();
  
  return <>
      {/* Hero Image */}
      <div className="relative overflow-hidden pt-2">
        <div className="h-48 md:h-96 bg-cover bg-top md:bg-bottom bg-no-repeat relative" style={{
        backgroundImage: `url(${heroImage})`
      }}>
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-background/20 to-transparent" />
        </div>
      </div>

      {/* Hero Text Section */}
      <div className="relative -mt-8 md:-mt-12 z-10">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-amber-50/90 to-orange-50/90 dark:from-amber-950/90 dark:to-orange-950/90 rounded-3xl shadow-xl border border-amber-200/50 dark:border-amber-800/30 p-6 md:p-12">
            <div className="text-center space-y-3 md:space-y-6">
              <div className="**flex items-center justify-center gap-20 md:gap-24 lg:gap-28**">
                <img src={churchBellTransparent} alt="Beautiful ornate church bell" className="w-20 h-20 md:w-32 md:h-32 drop-shadow-lg flex-shrink-0" />
                <div className="flex flex-col items-center text-5xl md:text-6xl font-cinzel font-bold text-foreground leading-tight">
                  <span>{t('hero.title').split(' ')[0]}</span>
                  <span>{t('hero.title').split(' ')[1]}</span>
                </div>
                <img src={churchBellNew} alt="Beautiful ancient church bell" className="w-20 h-20 md:w-32 md:h-32 drop-shadow-lg flex-shrink-0" />
              </div>
              <p className="italic font-bold text-3xl md:text-4xl font-cormorant text-foreground/90 text-center leading-relaxed max-w-2xl mx-auto">{t('hero.subtitle')}</p>
            </div>
          </div>
        </div>
      </div>
    </>;
};
