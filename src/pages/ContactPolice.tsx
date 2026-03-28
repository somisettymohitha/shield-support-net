import { Phone, MapPin, MessageCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/Layout";

const emergencyNumbers = [
  { label: "Women Helpline", number: "181", icon: Phone, description: "24/7 helpline for women in distress" },
  { label: "Police", number: "100", icon: Phone, description: "Emergency police assistance" },
  { label: "Emergency (All)", number: "112", icon: AlertTriangle, description: "Unified emergency number" },
  { label: "NCW WhatsApp", number: "7827170170", icon: MessageCircle, description: "National Commission for Women" },
];

const stateDirectories = [
  { state: "Delhi", helpline: "1091", website: "https://delhipolice.gov.in" },
  { state: "Maharashtra", helpline: "103", website: "https://mahapolice.gov.in" },
  { state: "Karnataka", helpline: "1091", website: "https://ksp.karnataka.gov.in" },
  { state: "Tamil Nadu", helpline: "1091", website: "https://eservices.tnpolice.gov.in" },
  { state: "Uttar Pradesh", helpline: "1090", website: "https://uppolice.gov.in" },
  { state: "West Bengal", helpline: "1091", website: "https://kolkatapolice.gov.in" },
  { state: "Kerala", helpline: "1515", website: "https://keralapolice.gov.in" },
  { state: "Rajasthan", helpline: "1091", website: "https://police.rajasthan.gov.in" },
];

const ContactPolice = () => (
  <Layout>
    <div className="bg-gradient-to-b from-destructive/5 to-background py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <Phone className="w-10 h-10 text-destructive mx-auto mb-3" />
          <h1 className="font-heading text-3xl font-bold mb-2">Contact Police</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            If you are in immediate danger, call for help right away. Every second matters.
          </p>
        </div>

        {/* Emergency numbers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-10">
          {emergencyNumbers.map((e) => (
            <a key={e.number} href={`tel:${e.number}`}>
              <Card className="h-full text-center hover:shadow-lg transition-shadow border-destructive/20 hover:border-destructive/40">
                <CardContent className="p-6">
                  <e.icon className="w-8 h-8 text-destructive mx-auto mb-3" />
                  <h3 className="font-heading font-bold text-lg">{e.label}</h3>
                  <p className="text-2xl font-bold text-primary my-2">{e.number}</p>
                  <p className="text-xs text-muted-foreground">{e.description}</p>
                  <Button variant="destructive" size="sm" className="mt-3 w-full gap-2">
                    <Phone className="w-3 h-3" /> Call Now
                  </Button>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>

        {/* State directory */}
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading text-xl font-bold mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" /> State-wise Police Directory
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {stateDirectories.map((s) => (
              <Card key={s.state} className="hover:shadow-sm transition-shadow">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-heading font-bold text-sm">{s.state}</h3>
                    <p className="text-xs text-muted-foreground">Women Helpline: {s.helpline}</p>
                  </div>
                  <div className="flex gap-2">
                    <a href={`tel:${s.helpline}`}>
                      <Button variant="outline" size="sm"><Phone className="w-3 h-3" /></Button>
                    </a>
                    <a href={s.website} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="sm" className="text-xs">Website</Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  </Layout>
);

export default ContactPolice;
