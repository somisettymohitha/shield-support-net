import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Heart, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/know-your-rights", label: "Know Your Rights" },
  { to: "/file-fir", label: "File FIR" },
  { to: "/contact-police", label: "Contact Police" },
  { to: "/counseling", label: "Counseling" },
  { to: "/resources", label: "Resources" },
  { to: "/tracker", label: "Tracker" },
  { to: "/advocates", label: "Advocates" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="bg-card/90 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2 text-primary font-heading font-bold text-lg">
          <Shield className="w-6 h-6" />
          <span>Raksha</span>
          <Heart className="w-4 h-4 text-lavender-dark" />
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Link to="/auth">
            <Button variant="outline" size="sm">Sign In</Button>
          </Link>
          <Link to="/auth?tab=signup">
            <Button size="sm">Get Help</Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-card px-4 pb-4">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={`block py-2 text-sm font-medium ${
                location.pathname === link.to ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-2 mt-3">
            <Link to="/auth" className="flex-1" onClick={() => setOpen(false)}>
              <Button variant="outline" size="sm" className="w-full">Sign In</Button>
            </Link>
            <Link to="/auth?tab=signup" className="flex-1" onClick={() => setOpen(false)}>
              <Button size="sm" className="w-full">Get Help</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
