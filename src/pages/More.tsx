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
  const handleResetData = () => {
    if (window.confirm("Are you sure you want to reset all your data? This action cannot be undone.")) {
      localStorage.clear();
      toast.success("All data has been reset");
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-muted/20">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-4xl font-bold text-center mb-8 font-cormorant">More</h1>

        {/* About Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              About
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <img 
              src={churchBellImage} 
              alt="Sacred Bell" 
              className="w-16 h-16 mx-auto mb-4 object-contain filter drop-shadow-sm"
            />
            <h2 className="text-2xl font-bold font-cinzel mb-2">Sacred Bells</h2>
            <p className="text-muted-foreground mb-1">Version: 1.0.0</p>
            <p className="text-muted-foreground mb-2">Build: 2025.01.29</p>
            <p className="text-sm">Developed with 🙏</p>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              Help & FAQ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="ghost" asChild className="w-full justify-start">
              <Link to="/support">
                <HelpCircle className="w-4 h-4 mr-2" />
                Help & FAQ
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              💬 CONTACT
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="ghost" asChild className="w-full justify-start">
              <a href="mailto:sacredchurchbells@gmail.com">
                <Mail className="w-4 h-4 mr-2" />
                Contact Us
              </a>
            </Button>
            
            <Separator />
            
            <div className="pt-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Support Us
              </h3>
              <CardDescription className="space-y-3 text-sm">
                <p>Sacred Bells's core features are free and ad-free. If they help you in your spiritual life:</p>
                <ul className="space-y-2 ml-4">
                  <li>⭐ <strong>Leave a review on the App Store/Play Store</strong></li>
                  <li>
                    <strong>💝 Share it with your community</strong>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Button 
                        onClick={() => {
                          const text = encodeURIComponent(`🔔 Check out Sacred Bells! It's like having a church bell tower in your pocket. Beautiful way to mark the time throughout the day: ${window.location.origin}`);
                          window.open(`https://wa.me/?text=${text}`, '_blank');
                        }}
                        className="text-sm font-cormorant px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                        size="sm"
                      >
                        WhatsApp
                      </Button>
                      <Button 
                        onClick={() => {
                          const subject = encodeURIComponent('A beautiful app I thought you\'d appreciate');
                          const body = encodeURIComponent(`Hi,

I wanted to share something special with you. I've been using Sacred Bells, an app that recreates the traditional rhythm of church bells throughout the day.

It's been a wonderful way to stay connected to the sacred rhythm that churches have maintained for centuries.

I think you might enjoy it too!

Download: ${window.location.origin}

Blessings`);
                          window.location.href = `mailto:?subject=${subject}&body=${body}`;
                        }}
                        className="text-sm font-cormorant px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                        size="sm"
                      >
                        Email
                      </Button>
                      <Button 
                        onClick={() => {
                          const text = encodeURIComponent(`🔔 Check out Sacred Bells! It's like having a church bell tower in your pocket. Beautiful way to mark the time throughout the day: ${window.location.origin}`);
                          window.location.href = `sms:?body=${text}`;
                        }}
                        className="text-sm font-cormorant px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                        size="sm"
                      >
                        SMS
                      </Button>
                    </div>
                  </li>
                  <li>☕ <strong>Make a donation (paypal : sacredchurchbells@gmail.com)</strong></li>
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
              LEGAL & PRIVACY
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-0">
            <Button variant="ghost" asChild className="w-full justify-start h-auto py-2">
              <Link to="/privacy-policy">
                <Shield className="w-4 h-4 mr-2" />
                Privacy Policy
              </Link>
            </Button>
            <Button variant="ghost" asChild className="w-full justify-start h-auto py-2">
              <Link to="/terms-of-service">
                <FileText className="w-4 h-4 mr-2" />
                Terms of Service
              </Link>
            </Button>
            <Button variant="ghost" asChild className="w-full justify-start h-auto py-2">
              <Link to="/rgpd-compliance">
                <Scale className="w-4 h-4 mr-2" />
                GDPR Compliance
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
              Reset All My Data
            </Button>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
