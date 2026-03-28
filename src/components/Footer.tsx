import { Heart, Phone } from "lucide-react";

const Footer = () => (
  <footer className="bg-card border-t border-border mt-auto">
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-heading font-bold text-foreground mb-3">Emergency Helplines</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <a href="tel:181" className="flex items-center gap-2 hover:text-primary">
              <Phone className="w-4 h-4" /> Women Helpline: 181
            </a>
            <a href="tel:100" className="flex items-center gap-2 hover:text-primary">
              <Phone className="w-4 h-4" /> Police: 100
            </a>
            <a href="tel:112" className="flex items-center gap-2 hover:text-primary">
              <Phone className="w-4 h-4" /> Emergency: 112
            </a>
            <a href="tel:7827170170" className="flex items-center gap-2 hover:text-primary">
              <Phone className="w-4 h-4" /> NCW: 7827-170-170
            </a>
          </div>
        </div>
        <div>
          <h3 className="font-heading font-bold text-foreground mb-3">Quick Links</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <a href="/know-your-rights" className="block hover:text-primary">Know Your Rights</a>
            <a href="/file-fir" className="block hover:text-primary">File an FIR</a>
            <a href="/counseling" className="block hover:text-primary">Counseling Services</a>
            <a href="/resources" className="block hover:text-primary">Resources</a>
          </div>
        </div>
        <div>
          <h3 className="font-heading font-bold text-foreground mb-3">About Raksha</h3>
          <p className="text-sm text-muted-foreground">
            A gender-responsive platform providing support, resources, and legal guidance
            for those affected by domestic violence. You are not alone.
          </p>
        </div>
      </div>
      <div className="border-t border-border mt-6 pt-4 text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
        Made with <Heart className="w-3 h-3 text-lavender-dark" /> for a safer tomorrow
      </div>
    </div>
  </footer>
);

export default Footer;
