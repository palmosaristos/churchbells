import { useTranslation } from 'react-i18next';
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { Info, HelpCircle, Mail, Heart, Shield, FileText, Scale, Trash2, Book } from "lucide-react";
import { toast } from "sonner";
import churchBellImage from "@/assets/church-bell-transparent.png";

export default function More() {
  const { t } = useTranslation();
  
  const handleResetData = () => {
    if (window.confirm(t('more.resetConfirm'))) {
      localStorage.clear();
      toast.success(t('more.dataReset'));
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-muted/20">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-4xl font-bold text-center mb-8 font-cormorant">{t('more.title')}</h1>

        {/* About Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              {t('more.about')}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <img 
              src={churchBellImage} 
              alt="Sacred Bell" 
              className="w-16 h-16 mx-auto mb-4 object-contain filter drop-shadow-sm"
            />
            <h2 className="text-2xl font-bold font-cinzel mb-2">Sacred Bells</h2>
            <p className="text-muted-foreground mb-1">{t('more.version', { version: '1.0.0' })}</p>
            <p className="text-muted-foreground mb-2">{t('more.build', { build: '2025.01.29' })}</p>
            <p className="text-sm">{t('more.developedWith')}</p>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              {t('more.helpAndFaq')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="ghost" asChild className="w-full justify-start">
              <Link to="/support">
                <HelpCircle className="w-4 h-4 mr-2" />
                {t('more.helpAndFaq')}
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {t('more.contact')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="ghost" asChild className="w-full justify-start">
              <a href="mailto:sacredchurchbells@gmail.com">
                <Mail className="w-4 h-4 mr-2" />
                {t('more.contactUs')}
              </a>
            </Button>
            
            <Separator />
            
            <div className="pt-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Heart className="w-4 h-4" />
                {t('more.supportUs')}
              </h3>
              <CardDescription className="space-y-3 text-sm">
                <p>{t('more.supportDescription')}</p>
                <ul className="space-y-2 ml-4">
                  <li>{t('more.leaveReview')}</li>
                  <li>
                    <strong>{t('more.shareWithCommunity')}</strong>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Button 
                        onClick={() => {
                          const text = encodeURIComponent(t('settings.shareMessage', { url: window.location.origin }));
                          window.open(`https://wa.me/?text=${text}`, '_blank');
                        }}
                        className="text-sm font-cormorant px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                        size="sm"
                      >
                        {t('settings.whatsapp')}
                      </Button>
                      <Button 
                        onClick={() => {
                          const subject = encodeURIComponent(t('settings.shareEmailSubject'));
                          const body = encodeURIComponent(t('settings.shareEmailBody', { url: window.location.origin }));
                          window.location.href = `mailto:?subject=${subject}&body=${body}`;
                        }}
                        className="text-sm font-cormorant px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                        size="sm"
                      >
                        {t('settings.email')}
                      </Button>
                      <Button 
                        onClick={() => {
                          const text = encodeURIComponent(t('settings.shareMessage', { url: window.location.origin }));
                          window.location.href = `sms:?body=${text}`;
                        }}
                        className="text-sm font-cormorant px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                        size="sm"
                      >
                        {t('settings.sms')}
                      </Button>
                    </div>
                  </li>
                  <li>{t('more.makeDonation')}</li>
                </ul>
              </CardDescription>
            </div>
          </CardContent>
        </Card>

        {/* Legal & Privacy Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="w-5 h-5" />
              {t('more.legalAndPrivacy')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-0">
            <Button variant="ghost" asChild className="w-full justify-start h-auto py-2">
              <Link to="/privacy-policy">
                <Shield className="w-4 h-4 mr-2" />
                {t('more.privacyPolicy')}
              </Link>
            </Button>
            <Button variant="ghost" asChild className="w-full justify-start h-auto py-2">
              <Link to="/terms-of-service">
                <FileText className="w-4 h-4 mr-2" />
                {t('more.termsOfService')}
              </Link>
            </Button>
            <Button variant="ghost" asChild className="w-full justify-start h-auto py-2">
              <Link to="/rgpd-compliance">
                <Scale className="w-4 h-4 mr-2" />
                {t('more.gdprCompliance')}
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Reset Data Section */}
        <Card className="mb-6 border-destructive/50">
          <CardContent className="pt-6">
            <Button 
              variant="destructive" 
              onClick={handleResetData}
              className="w-full"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {t('more.resetAllData')}
            </Button>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
