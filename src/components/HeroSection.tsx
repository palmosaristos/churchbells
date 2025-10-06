import churchBellTransparent from "@/assets/church-bell-transparent.png";
import churchBellNew from "@/assets/church-bell-new.png";

interface HeroSectionProps {
  heroImage: string;
}

export const HeroSection = ({ heroImage }: HeroSectionProps) => {
  return (
    <>
      {/* Hero Image */}
      <div className="relative overflow-hidden">
        <div className="h-96 bg-cover bg-bottom bg-no-repeat relative" style={{
          backgroundImage: `url(${heroImage})`
        }}>
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-background/20 to-transparent" />
        </div>
      </div>

      {/* Hero Text Section */}
      <div className="relative -mt-12 z-10">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-amber-50/90 to-orange-50/90 dark:from-amber-950/90 dark:to-orange-950/90 rounded-3xl shadow-xl border border-amber-200/50 dark:border-amber-800/30 p-8 md:p-12">
            <div className="text-center space-y-6">
              <h1 className="text-6xl md:text-8xl font-cinzel font-bold text-foreground mb-4">
                Sacred Bells
              </h1>
              <div className="flex items-center justify-center gap-8 md:gap-12">
                <img src={churchBellTransparent} alt="Beautiful ornate church bell" className="w-12 h-12 md:w-16 md:h-16 drop-shadow-lg" />
                <img src={churchBellNew} alt="Beautiful ancient church bell" className="w-12 h-12 md:w-16 md:h-16 drop-shadow-lg" />
              </div>
              <p className="text-2xl md:text-3xl text-amber-800 dark:text-amber-200 font-cormorant max-w-4xl mx-auto leading-relaxed">
                Let the sacred sound of churchbells accompany you through the day and invite you to connect with God
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
