import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="bg-background/95 backdrop-blur-md border-t border-border/50 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Sacred Bells. Developed with 🙏</p>
        </div>
      </div>
    </footer>
  );
}
