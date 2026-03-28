import { Building2, Phone, Heart, Banknote, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";

const resources = [
  {
    category: "Shelter Homes",
    icon: Building2,
    items: [
      { name: "One Stop Centre (Sakhi)", location: "Pan-India (700+ centres)", contact: "181", description: "Integrated support for women affected by violence — medical, legal, psychological, and shelter." },
      { name: "Swadhar Greh", location: "Pan-India", contact: "Local WCD Office", description: "Shelter for women in difficult circumstances including DV survivors, with rehabilitation services." },
      { name: "Short Stay Home", location: "Pan-India", contact: "Local WCD Office", description: "Temporary shelter for women and girls facing social/moral danger." },
    ],
  },
  {
    category: "NGOs & Helplines",
    icon: Phone,
    items: [
      { name: "Majlis Legal Centre", location: "Mumbai", contact: "022-26661252", description: "Free legal aid and representation for women facing domestic violence." },
      { name: "Jagori", location: "Delhi", contact: "011-26692700", description: "Women's empowerment and anti-violence advocacy with direct support services." },
      { name: "Sneha Foundation", location: "Chennai", contact: "044-24640050", description: "Crisis intervention and emotional support for survivors of violence." },
      { name: "Vimochana", location: "Bangalore", contact: "080-25494077", description: "Women's rights organisation offering counseling and legal support." },
    ],
  },
  {
    category: "Health Resources",
    icon: Heart,
    items: [
      { name: "Vandrevala Foundation", location: "Pan-India", contact: "1860-2662-345", description: "24/7 mental health helpline offering free counseling." },
      { name: "iCall (TISS)", location: "Mumbai", contact: "9152987821", description: "Psychosocial support via phone, email, and chat." },
      { name: "NIMHANS Helpline", location: "Bangalore", contact: "080-46110007", description: "National Institute of Mental Health — helpline for psychological distress." },
    ],
  },
  {
    category: "Financial Assistance",
    icon: Banknote,
    items: [
      { name: "National Legal Services Authority (NALSA)", location: "Pan-India", contact: "011-23385321", description: "Free legal aid and financial assistance for victims of domestic violence." },
      { name: "PM Jan Dhan Yojana", location: "Pan-India", contact: "Local Bank Branch", description: "Zero-balance bank account — financial independence for women." },
      { name: "State Women Commissions", location: "State-wise", contact: "Varies", description: "Financial aid, compensation, and rehabilitation support for DV survivors." },
    ],
  },
];

const Resources = () => {
  const [search, setSearch] = useState("");

  const filtered = resources.map((section) => ({
    ...section,
    items: section.items.filter(
      (item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.location.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((section) => section.items.length > 0);

  return (
    <Layout>
      <div className="bg-gradient-to-b from-warm/50 to-background py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <Building2 className="w-10 h-10 text-warm-dark mx-auto mb-3" />
            <h1 className="font-heading text-3xl font-bold mb-2">Support Resources</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Shelter homes, NGOs, health resources, and financial assistance across India.
            </p>
          </div>

          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search resources..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="max-w-4xl mx-auto space-y-10">
            {filtered.map((section) => (
              <div key={section.category}>
                <h2 className="font-heading text-xl font-bold mb-4 flex items-center gap-2">
                  <section.icon className="w-5 h-5 text-primary" /> {section.category}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {section.items.map((item) => (
                    <Card key={item.name} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base font-heading">{item.name}</CardTitle>
                        <Badge variant="secondary" className="w-fit text-xs">{item.location}</Badge>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                        <a
                          href={`tel:${item.contact.replace(/[^0-9+]/g, "")}`}
                          className="text-sm text-primary font-medium hover:underline flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3" /> {item.contact}
                        </a>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Resources;
