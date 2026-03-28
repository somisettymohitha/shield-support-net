import { useState } from "react";
import { Scale, Calendar, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";

const laws = [
  {
    title: "Dowry Prohibition Act",
    year: 1961,
    category: "Dowry",
    description: "Prohibits giving or taking of dowry. Punishable with imprisonment of not less than 5 years and fine of ₹15,000 or the amount of dowry, whichever is more.",
    sections: "Sections 3, 4, 4A, 6",
  },
  {
    title: "Indian Penal Code — Section 498A",
    year: 1983,
    category: "Cruelty",
    description: "Husband or relative of husband subjecting a woman to cruelty shall be punished with imprisonment up to 3 years and fine. Covers both physical and mental cruelty.",
    sections: "Section 498A IPC",
  },
  {
    title: "Protection of Women from Domestic Violence Act",
    year: 2005,
    category: "Domestic Violence",
    description: "Provides civil remedies including protection orders, residence orders, monetary reliefs, and custody orders. Covers physical, sexual, verbal, emotional, and economic abuse.",
    sections: "Sections 3, 12, 17-23",
  },
  {
    title: "Sexual Harassment of Women at Workplace Act",
    year: 2013,
    category: "Workplace",
    description: "Mandates Internal Complaints Committees in organizations with 10+ employees. Covers unwelcome physical contact, demand for sexual favours, sexually coloured remarks.",
    sections: "POSH Act 2013",
  },
  {
    title: "Criminal Law (Amendment) Act",
    year: 2013,
    category: "Criminal",
    description: "Broadened definition of rape, introduced stalking, voyeurism, and acid attack as offences. Increased penalties for sexual offences against women.",
    sections: "Sections 354A-D, 376 IPC (amended)",
  },
  {
    title: "Protection of Children from Sexual Offences Act (POCSO)",
    year: 2012,
    category: "Child Protection",
    description: "Gender-neutral law protecting children under 18 from sexual assault, harassment, and pornography. Establishes special courts for speedy trials.",
    sections: "POCSO Act 2012",
  },
  {
    title: "Bharatiya Nyaya Sanhita — Section 85",
    year: 2023,
    category: "Cruelty",
    description: "Replaces IPC 498A under the new criminal code. Retains provisions against cruelty by husband or relatives with same punishment framework.",
    sections: "Section 85 BNS",
  },
];

const categories = ["All", ...Array.from(new Set(laws.map((l) => l.category)))];

const KnowYourRights = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filtered = laws.filter((law) => {
    const matchesSearch =
      law.title.toLowerCase().includes(search.toLowerCase()) ||
      law.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || law.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <div className="bg-gradient-to-b from-lavender/30 to-background py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <Scale className="w-10 h-10 text-primary mx-auto mb-3" />
            <h1 className="font-heading text-3xl font-bold mb-2">Know Your Rights</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Indian laws that protect you from domestic violence, organised by year. Knowledge is power.
            </p>
          </div>

          {/* Filters */}
          <div className="max-w-2xl mx-auto mb-8 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search laws..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Laws */}
          <div className="max-w-3xl mx-auto space-y-4">
            {filtered.map((law) => (
              <Card key={law.title} className="border-border/50 hover:border-primary/30 transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg font-heading">{law.title}</CardTitle>
                    <Badge variant="secondary" className="flex items-center gap-1 shrink-0">
                      <Calendar className="w-3 h-3" /> {law.year}
                    </Badge>
                  </div>
                  <Badge variant="outline" className="w-fit">{law.category}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">{law.description}</p>
                  <p className="text-xs font-medium text-primary">{law.sections}</p>
                </CardContent>
              </Card>
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No laws found matching your search.</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default KnowYourRights;
