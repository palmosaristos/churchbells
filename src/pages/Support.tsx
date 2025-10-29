import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";

const Support = () => {
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch("/support.md")
      .then((response) => response.text())
      .then((text) => {
        // Simple markdown to HTML conversion
        const html = text
          .replace(/^# (.*$)/gim, '<h1 class="text-4xl font-bold mb-6 text-foreground">$1</h1>')
          .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold mt-8 mb-4 text-foreground">$1</h2>')
          .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mt-6 mb-3 text-foreground">$1</h3>')
          .replace(/^#### (.*$)/gim, '<h4 class="text-lg font-semibold mt-4 mb-2 text-foreground">$1</h4>')
          .replace(/^\*\*(.*)\*\*/gim, '<strong>$1</strong>')
          .replace(/^\*(.*)\*$/gim, '<em class="text-muted-foreground">$1</em>')
          .replace(/^- (.*$)/gim, '<li class="ml-6 mb-2">$1</li>')
          .replace(/\n\n/g, '</p><p class="mb-4 text-foreground/90 leading-relaxed">');
        
        setContent(`<div class="prose prose-lg max-w-none">${html}</div>`);
      });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 mt-16">
        <Card className="p-8 max-w-4xl mx-auto bg-card/50 backdrop-blur-sm">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </Card>
      </main>
    </div>
  );
};

export default Support;
