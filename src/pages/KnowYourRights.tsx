import { useState } from "react";
import { Scale, Calendar, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";

const laws = [
  // Dowry
  {
    title: "Dowry Prohibition Act",
    year: 1961,
    category: "Dowry",
    description: "Prohibits giving or taking of dowry. Punishable with imprisonment of not less than 5 years and fine of ₹15,000 or the amount of dowry, whichever is more.",
    sections: "Sections 3, 4, 4A, 6",
  },
  // Cruelty
  {
    title: "Indian Penal Code — Section 498A",
    year: 1983,
    category: "Cruelty",
    description: "Husband or relative of husband subjecting a woman to cruelty shall be punished with imprisonment up to 3 years and fine. Covers both physical and mental cruelty.",
    sections: "Section 498A IPC",
  },
  {
    title: "Bharatiya Nyaya Sanhita — Section 85",
    year: 2023,
    category: "Cruelty",
    description: "Replaces IPC 498A under the new criminal code. Retains provisions against cruelty by husband or relatives with same punishment framework.",
    sections: "Section 85 BNS",
  },
  // Domestic Violence
  {
    title: "Protection of Women from Domestic Violence Act",
    year: 2005,
    category: "Domestic Violence",
    description: "Provides civil remedies including protection orders, residence orders, monetary reliefs, and custody orders. Covers physical, sexual, verbal, emotional, and economic abuse.",
    sections: "Sections 3, 12, 17-23",
  },
  // Workplace
  {
    title: "Sexual Harassment of Women at Workplace Act (POSH)",
    year: 2013,
    category: "Workplace",
    description: "Mandates Internal Complaints Committees in organizations with 10+ employees. Covers unwelcome physical contact, demand for sexual favours, sexually coloured remarks.",
    sections: "POSH Act 2013",
  },
  {
    title: "Maternity Benefit Act",
    year: 1961,
    category: "Workplace",
    description: "Regulates employment of women during maternity. Provides 26 weeks paid leave (amended 2017), nursing breaks, and prohibition of dismissal during maternity.",
    sections: "Maternity Benefit Act 1961 (amended 2017)",
  },
  {
    title: "Equal Remuneration Act",
    year: 1976,
    category: "Workplace",
    description: "Provides for equal pay for equal work for both men and women. Prohibits discrimination in recruitment and service conditions on the basis of gender.",
    sections: "Equal Remuneration Act 1976",
  },
  // Criminal
  {
    title: "Criminal Law (Amendment) Act",
    year: 2013,
    category: "Criminal",
    description: "Broadened definition of rape, introduced stalking, voyeurism, and acid attack as offences. Increased penalties for sexual offences against women.",
    sections: "Sections 354A-D, 376 IPC (amended)",
  },
  {
    title: "BNS — Sections 63-72 (Sexual Offences)",
    year: 2023,
    category: "Criminal",
    description: "Replaces IPC sections on rape and sexual offences. Defines rape more broadly, introduces community service for first-time minor offences, and enhances punishments for repeat offenders.",
    sections: "Sections 63-72 BNS",
  },
  {
    title: "BNS — Section 78 (Stalking)",
    year: 2023,
    category: "Criminal",
    description: "Criminalizes stalking including following, contacting, or monitoring a woman despite clear disinterest. Covers both physical and cyber stalking.",
    sections: "Section 78 BNS",
  },
  {
    title: "BNS — Section 79 (Voyeurism)",
    year: 2023,
    category: "Criminal",
    description: "Penalizes watching or capturing images of a woman engaged in a private act without consent. Punishment up to 7 years for repeat offence.",
    sections: "Section 79 BNS",
  },
  {
    title: "BNS — Section 124 (Acid Attack)",
    year: 2023,
    category: "Criminal",
    description: "Acid attack carries minimum 10 years imprisonment extendable to life with fine. Compensation and free medical treatment mandatory for survivors.",
    sections: "Section 124 BNS",
  },
  {
    title: "IPC Section 354 — Assault on Woman",
    year: 1860,
    category: "Criminal",
    description: "Whoever assaults or uses criminal force on any woman, intending to outrage her modesty, shall be punished with imprisonment of 1-5 years and fine.",
    sections: "Section 354 IPC",
  },
  {
    title: "IPC Section 509 — Word/Gesture to Insult Modesty",
    year: 1860,
    category: "Criminal",
    description: "Uttering any word, making any sound or gesture intended to insult the modesty of a woman is punishable with imprisonment up to 3 years.",
    sections: "Section 509 IPC",
  },
  // Child Protection
  {
    title: "Protection of Children from Sexual Offences Act (POCSO)",
    year: 2012,
    category: "Child Protection",
    description: "Gender-neutral law protecting children under 18 from sexual assault, harassment, and pornography. Establishes special courts for speedy trials.",
    sections: "POCSO Act 2012",
  },
  {
    title: "Prohibition of Child Marriage Act",
    year: 2006,
    category: "Child Protection",
    description: "Minimum marriage age: 18 for women, 21 for men. Child marriages are voidable. Punishes those who perform, permit, or promote child marriages with up to 2 years imprisonment.",
    sections: "PCMA 2006",
  },
  {
    title: "Juvenile Justice Act",
    year: 2015,
    category: "Child Protection",
    description: "Comprehensive law for children in conflict with law and children in need of care & protection. Provides for adoption, foster care, and institutional care.",
    sections: "JJ Act 2015",
  },
  // Property & Succession
  {
    title: "Hindu Succession (Amendment) Act",
    year: 2005,
    category: "Property",
    description: "Daughters have equal coparcenary rights in ancestral property as sons. Applies to all Hindu, Sikh, Jain, and Buddhist families.",
    sections: "Section 6 (amended) Hindu Succession Act",
  },
  {
    title: "Muslim Women (Protection of Rights on Divorce) Act",
    year: 1986,
    category: "Property",
    description: "Ensures maintenance and rights of Muslim women upon divorce. Husband must provide reasonable provision during iddat period and return mehr.",
    sections: "Muslim Women Act 1986",
  },
  {
    title: "Muslim Women (Protection of Rights on Marriage) Act",
    year: 2019,
    category: "Property",
    description: "Declares triple talaq (talaq-e-biddat) void and illegal. Husband pronouncing triple talaq faces up to 3 years imprisonment.",
    sections: "Triple Talaq Act 2019",
  },
  // Trafficking
  {
    title: "Immoral Traffic (Prevention) Act",
    year: 1956,
    category: "Trafficking",
    description: "Prevents trafficking for commercial sexual exploitation. Punishes those running brothels, procuring persons for prostitution, and living off earnings of prostitution.",
    sections: "ITPA 1956",
  },
  {
    title: "BNS — Section 143 (Trafficking of Person)",
    year: 2023,
    category: "Trafficking",
    description: "Covers recruitment, transport, or harbouring of persons by force, fraud, or coercion for exploitation. Punishable with 7 years to life imprisonment.",
    sections: "Section 143 BNS",
  },
  // Cyber Crime
  {
    title: "Information Technology Act — Section 66E",
    year: 2000,
    category: "Cyber Crime",
    description: "Punishment for violation of privacy — capturing/publishing images of private areas without consent. Up to 3 years imprisonment and ₹2 lakh fine.",
    sections: "Section 66E IT Act",
  },
  {
    title: "IT Act — Section 67/67A (Obscene Material)",
    year: 2000,
    category: "Cyber Crime",
    description: "Publishing or transmitting obscene or sexually explicit material electronically. Covers revenge porn, morphed images, and non-consensual intimate content online.",
    sections: "Sections 67, 67A IT Act",
  },
  // Constitutional
  {
    title: "Article 14 — Right to Equality",
    year: 1950,
    category: "Constitutional",
    description: "The State shall not deny to any person equality before the law or the equal protection of the laws within the territory of India.",
    sections: "Article 14, Constitution of India",
  },
  {
    title: "Article 15(3) — Special Provisions for Women",
    year: 1950,
    category: "Constitutional",
    description: "Nothing shall prevent the State from making any special provision for women and children. Enables affirmative action and protective legislation.",
    sections: "Article 15(3), Constitution of India",
  },
  {
    title: "Article 21 — Right to Life and Personal Liberty",
    year: 1950,
    category: "Constitutional",
    description: "No person shall be deprived of life or personal liberty except according to procedure established by law. Includes right to live with dignity.",
    sections: "Article 21, Constitution of India",
  },
  {
    title: "Article 23 — Prohibition of Trafficking",
    year: 1950,
    category: "Constitutional",
    description: "Traffic in human beings and forced labour are prohibited. Any contravention is a punishable offence under law.",
    sections: "Article 23, Constitution of India",
  },
  // Miscellaneous
  {
    title: "Indecent Representation of Women (Prohibition) Act",
    year: 1986,
    category: "Media",
    description: "Prohibits indecent representation of women through advertisements, publications, paintings, or any manner. Punishable with up to 5 years imprisonment.",
    sections: "IRWA 1986",
  },
  {
    title: "National Commission for Women Act",
    year: 1990,
    category: "Institutional",
    description: "Establishes National Commission for Women to review constitutional & legal safeguards, recommend remedial measures, and investigate complaints of deprivation of women's rights.",
    sections: "NCW Act 1990",
  },
  {
    title: "Legal Services Authorities Act",
    year: 1987,
    category: "Legal Aid",
    description: "Provides free legal aid to women and other vulnerable groups. Every woman is entitled to free legal services irrespective of income, through District & State Legal Aid authorities.",
    sections: "Section 12, LSA Act 1987",
  },
  {
    title: "Medical Termination of Pregnancy Act",
    year: 1971,
    category: "Health",
    description: "Allows medical termination of pregnancy up to 24 weeks (amended 2021) for special categories including rape survivors, minors, and women with disabilities. Protects reproductive autonomy.",
    sections: "MTP Act 1971 (amended 2021)",
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
              Indian laws that protect you — from constitutional rights to the latest BNS provisions. Knowledge is power.
            </p>
          </div>

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
