import { Link } from "react-router-dom";
import { Shield, Scale, Phone, Heart, BookOpen, Upload, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";

const helplineCards = [
  { label: "Women Helpline", number: "181", color: "bg-lavender" },
  { label: "Police", number: "100", color: "bg-teal-light" },
  { label: "Emergency", number: "112", color: "bg-warm" },
  { label: "NCW WhatsApp", number: "7827-170-170", color: "bg-lavender" },
];

const featureCards = [
  {
    icon: Heart,
    title: "Get Help Now",
    description: "Connect with counsellors, access crisis support, and find safety resources.",
    link: "/counseling",
    color: "text-lavender-dark",
  },
  {
    icon: Scale,
    title: "Know Your Rights",
    description: "Indian laws protecting you — DV Act 2005, IPC 498A, and more by year.",
    link: "/know-your-rights",
    color: "text-primary",
  },
  {
    icon: BookOpen,
    title: "Types of Counseling",
    description: "Trauma/PTSD therapy, crisis counseling, legal counseling, and group support.",
    link: "/counseling",
    color: "text-warm-dark",
  },
  {
    icon: Phone,
    title: "Contact Police",
    description: "One-tap emergency calls, state-wise police directories, and e-FIR links.",
    link: "/contact-police",
    color: "text-destructive",
  },
  {
    icon: Shield,
    title: "File an FIR",
    description: "Step-by-step FIR guide with links to online complaint portals.",
    link: "/file-fir",
    color: "text-primary",
  },
  {
    icon: Upload,
    title: "Upload Evidence",
    description: "Securely upload photos and videos — only you and your support team can access them.",
    link: "/auth?tab=signup",
    color: "text-lavender-dark",
  },
];

const Index = () => (
  <Layout>
    {/* Hero */}
    <section className="bg-gradient-to-br from-lavender/40 via-background to-teal-light/30 py-16 md:py-24">
      <div className="container mx-auto px-4 text-center">
        <h1 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-4">
          You Are <span className="text-primary">Not Alone</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8 text-lg">
          Raksha is a safe, confidential platform offering legal resources, counseling support,
          and tools to help survivors of domestic violence take action and heal.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <Link to="/auth?tab=signup">
            <Button size="lg" className="gap-2">
              Get Help Now <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/know-your-rights">
            <Button variant="outline" size="lg">Know Your Rights</Button>
          </Link>
        </div>

        {/* Helpline strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
          {helplineCards.map((h) => (
            <a
              key={h.number}
              href={`tel:${h.number.replace(/-/g, "")}`}
              className={`${h.color} rounded-xl p-3 text-center transition-transform hover:scale-105`}
            >
              <div className="text-xs font-medium text-muted-foreground">{h.label}</div>
              <div className="text-lg font-bold text-foreground">{h.number}</div>
            </a>
          ))}
        </div>
      </div>
    </section>

    {/* Features */}
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-center mb-10">
          How We Can Help
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureCards.map((f) => (
            <Link key={f.title} to={f.link}>
              <Card className="h-full hover:shadow-lg transition-shadow border-border/50 hover:border-primary/30">
                <CardContent className="p-6">
                  <f.icon className={`w-8 h-8 ${f.color} mb-4`} />
                  <h3 className="font-heading font-bold text-lg mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="bg-primary/5 py-12">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-heading text-xl md:text-2xl font-bold mb-3">
          If you or someone you know is in danger
        </h2>
        <p className="text-muted-foreground mb-6">
          Call <strong>181</strong> (Women Helpline) or <strong>112</strong> (Emergency) immediately.
        </p>
        <a href="tel:181">
          <Button size="lg" variant="destructive" className="gap-2">
            <Phone className="w-4 h-4" /> Call 181 Now
          </Button>
        </a>
      </div>
    </section>
  </Layout>
);

export default Index;
