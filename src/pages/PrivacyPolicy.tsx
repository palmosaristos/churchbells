import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Shield } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-cinzel font-semibold text-lg">Privacy Policy</span>
          </div>
          <div className="w-24" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Content */}
      <main className="container max-w-4xl py-8 md:py-12">
        <article className="prose prose-slate dark:prose-invert max-w-none">
          <div className="text-center mb-8">
            <h1 className="font-cinzel text-4xl md:text-5xl font-bold mb-4">
              Privacy Policy – Sacred Bells
            </h1>
            <p className="text-muted-foreground">Last updated: November 7, 2024</p>
          </div>

          <section className="mb-8">
            <h2 className="font-cinzel text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-foreground/90 leading-relaxed">
              The Sacred Bells application respects your privacy. This policy explains how we collect, use, and protect your personal data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-cinzel text-2xl font-semibold mb-4">2. Data Collected</h2>
            
            <h3 className="font-cinzel text-xl font-semibold mb-3">2.1 Data we collect directly</h3>
            <ul className="space-y-2 text-foreground/90">
              <li><strong>Prayer preferences</strong>: Reminder schedules you configure</li>
              <li><strong>Audio settings</strong>: Bell sound choices</li>
              <li><strong>Technical data</strong>: Device type, operating system version</li>
              <li><strong>Subscription status</strong>: If you have subscribed to the Premium version (via an anonymous identifier, without personal information)</li>
            </ul>

            <h3 className="font-cinzel text-xl font-semibold mb-3 mt-6">2.2 Data collected by payment platforms</h3>
            <p className="text-foreground/90 leading-relaxed mb-3">
              When you subscribe to the Premium version via <strong>Google Play In-App Payments (Android)</strong> or Apple (via the App Store):
            </p>
            <ul className="space-y-2 text-foreground/90">
              <li>These platforms handle the payment</li>
              <li>They collect: name, email, payment information</li>
              <li>We do NOT have access to this information</li>
              <li>We only receive a subscription confirmation (anonymous identifier)</li>
            </ul>
            <p className="text-foreground/90 leading-relaxed mt-3">
              To manage your payment data:
            </p>
            <ul className="space-y-2 text-foreground/90">
              <li><strong>iOS</strong>: Settings &gt; [Your Name] &gt; Subscriptions</li>
              <li><strong>Android</strong>: Play Store &gt; Menu &gt; Subscriptions</li>
            </ul>

            <h3 className="font-cinzel text-xl font-semibold mb-3 mt-6">2.3 Data we do NOT collect</h3>
            <ul className="space-y-2 text-foreground/90">
              <li>❌ No location data</li>
              <li>❌ No email or name (unless you contact us voluntarily)</li>
              <li>❌ No payment information</li>
              <li>❌ No prayer history or personal religious content</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-cinzel text-2xl font-semibold mb-4">3. Use of Data</h2>
            <p className="text-foreground/90 leading-relaxed mb-3">
              We use your data only to:
            </p>
            <ul className="space-y-2 text-foreground/90">
              <li>✅ Save your bell preferences</li>
              <li>✅ Trigger prayer reminders at chosen times</li>
              <li>✅ Improve the application's performance</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-cinzel text-2xl font-semibold mb-4">4. Data Storage</h2>
            <ul className="space-y-2 text-foreground/90">
              <li><strong>Local storage</strong>: All your preferences are stored locally on your device</li>
              <li><strong>No external servers</strong>: We do not transfer any data to servers</li>
              <li><strong>Retention period</strong>: Data remains until app uninstallation</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-cinzel text-2xl font-semibold mb-4">5. Data Sharing</h2>
            <p className="text-foreground/90 leading-relaxed">
              We do not share, sell, or rent your data to third parties. Ever.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-cinzel text-2xl font-semibold mb-4">6. Third-Party Services</h2>
            <p className="text-foreground/90 leading-relaxed mb-3">
              The application uses:
            </p>
            <ul className="space-y-2 text-foreground/90">
              <li><strong>Push notifications (Apple/Google)</strong>: For prayer reminders</li>
              <li><strong>No third-party analytics or trackers</strong>: 100% local app</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-cinzel text-2xl font-semibold mb-4">7. Your Rights (GDPR)</h2>
            <p className="text-foreground/90 leading-relaxed mb-3">
              You have the right to:
            </p>
            <ul className="space-y-2 text-foreground/90">
              <li>✅ Access your data (in the app settings)</li>
              <li>✅ Delete your data (by uninstalling the app)</li>
              <li>✅ Modify your preferences at any time</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-cinzel text-2xl font-semibold mb-4">8. Security</h2>
            <p className="text-foreground/90 leading-relaxed">
              We implement security measures to protect your data against unauthorized access.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-cinzel text-2xl font-semibold mb-4">9. Changes</h2>
            <p className="text-foreground/90 leading-relaxed">
              We may update this policy. Changes will be notified via the application.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-cinzel text-2xl font-semibold mb-4">10. Contact</h2>
            <p className="text-foreground/90 leading-relaxed">
              For any questions: <a href="mailto:sacredchurchbells@gmail.com" className="text-primary hover:underline">sacredchurchbells@gmail.com</a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-cinzel text-2xl font-semibold mb-4">11. Compliance</h2>
            <p className="text-foreground/90 leading-relaxed">
              This application complies with GDPR (EU) and data protection laws.
            </p>
          </section>
        </article>

        <div className="mt-12 text-center">
          <Link to="/">
            <Button size="lg" className="gap-2">
              <ChevronLeft className="h-4 w-4" />
              Return to Sacred Bells
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
