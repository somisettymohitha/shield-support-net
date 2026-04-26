import { Stethoscope, Phone, MessageSquare, Heart, Brain, ShieldAlert, BookOpen, Video, MapPin, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import { Link } from "react-router-dom";

const helplines = [
  { label: "iCall (Mental Health)", number: "9152987821", description: "Free phone & email counselling, 8 AM – 10 PM Mon-Sat", color: "primary" },
  { label: "Vandrevala Foundation", number: "1860-2662-345", description: "24/7 mental-health helpline (free)", color: "primary" },
  { label: "NIMHANS Helpline", number: "080-46110007", description: "24/7 mental-health support (toll-free)", color: "primary" },
  { label: "Ambulance", number: "102", description: "Free medical emergency transport", color: "destructive" },
  { label: "Free Ambulance (Dial 108)", number: "108", description: "Emergency response service", color: "destructive" },
  { label: "AIDS Helpline", number: "1097", description: "Confidential HIV/AIDS support", color: "primary" },
  { label: "Snehi Suicide Prevention", number: "9582208181", description: "Listen & support, 12 PM – 8 PM daily", color: "primary" },
  { label: "Tele MANAS", number: "14416", description: "National tele-mental-health service, 24/7", color: "primary" },
];

const guides = [
  {
    icon: ShieldAlert,
    title: "Medical care after sexual assault",
    points: [
      "Try to reach a hospital within 72 hours — emergency contraception and HIV PEP are most effective in this window.",
      "Do NOT bathe, change clothes, or clean the area before examination if you intend to file a complaint — it preserves forensic evidence.",
      "Government hospitals must provide free first-aid, examination and a medico-legal certificate (Section 357C CrPC).",
      "Ask for a female doctor and a support person to be present during examination — both are your right.",
      "A SAFE kit (Sexual Assault Forensic Evidence) will be collected. You can refuse any step you are not comfortable with.",
    ],
  },
  {
    icon: Brain,
    title: "Mental-health self-help after trauma",
    points: [
      "Grounding: name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste — calms acute anxiety.",
      "Sleep, food and hydration are not 'extras' — your body needs them to process stress.",
      "Flashbacks and numbness are normal stress reactions, not weakness. They usually improve with support.",
      "Avoid alcohol/recreational drugs — they worsen anxiety and depression.",
      "Reach out to one trusted person, even briefly. Isolation deepens distress.",
    ],
  },
  {
    icon: AlertCircle,
    title: "When to see a doctor urgently",
    points: [
      "Heavy bleeding, severe pain, loss of consciousness, head injury or chest pain — go to ER immediately.",
      "Suicidal thoughts or plans — call Tele MANAS (14416) or Vandrevala (1860-2662-345) now.",
      "Symptoms of pregnancy or STI after assault — visit a gynaecologist within days.",
      "Persistent flashbacks, panic attacks or insomnia for more than 2 weeks — see a mental-health professional.",
      "Any injury that does not heal in 3-5 days, or shows redness, pus, fever — seek medical care.",
    ],
  },
  {
    icon: Heart,
    title: "Emergency contraception & STI prevention",
    points: [
      "Emergency contraceptive pills (e.g. i-Pill, Unwanted-72) work best within 72 hours, available over the counter at any pharmacy.",
      "HIV PEP (Post-Exposure Prophylaxis) must be started within 72 hours — available free at government ART centres.",
      "Hepatitis B vaccine and STI testing should be done within 1 week.",
      "Testing is confidential. Most government hospitals do not require a police complaint for medical care.",
    ],
  },
  {
    icon: Video,
    title: "Telehealth & online consultation",
    points: [
      "eSanjeevani (esanjeevani.in) — free Government of India telemedicine, includes mental-health.",
      "Practo, MFine, Apollo 24/7 — paid private telemedicine, doctors in 5-15 minutes.",
      "iCall (icallhelpline.org) — free email and chat counselling.",
      "Trijya, YourDost, Manastha — affordable online therapy platforms in regional languages.",
    ],
  },
  {
    icon: BookOpen,
    title: "Medication safety basics",
    points: [
      "Never take prescription medicines (especially psychiatric) without a doctor's guidance.",
      "Don't stop antidepressants suddenly — taper under medical supervision.",
      "Keep a list of all medicines, including dose and timing, and share it during any consultation.",
      "Tell your doctor about pregnancy, allergies, or other ongoing conditions before any new prescription.",
    ],
  },
];

const firstAid = [
  { title: "Bleeding", steps: ["Apply firm pressure with a clean cloth.", "Elevate the injured area above the heart if possible.", "Do not remove embedded objects — stabilise around them.", "Call 102/108 if bleeding does not stop in 10 minutes."] },
  { title: "Choking (adult)", steps: ["Give 5 sharp back blows between the shoulder blades.", "If unsuccessful, perform 5 abdominal thrusts (Heimlich).", "Alternate until the object comes out or person collapses.", "If unconscious, start CPR and call 102."] },
  { title: "Suspected fracture", steps: ["Do not try to straighten the limb.", "Immobilise with a splint or rolled cloth.", "Apply ice (wrapped in cloth) to reduce swelling.", "Get to a hospital — call 102 if movement is impossible."] },
  { title: "Burns", steps: ["Cool with running water for 20 minutes — not ice.", "Remove jewellery/clothing near (but not stuck to) the burn.", "Cover loosely with cling-film or clean cloth.", "Seek medical care for burns larger than a palm or on face/hands/genitals."] },
  { title: "Panic attack", steps: ["Sit somewhere safe; loosen tight clothing.", "Breathe in for 4, hold for 4, breathe out for 6 — repeat.", "Name your surroundings out loud to reground.", "It will pass — usually within 10 minutes."] },
];

const hospitals = [
  { city: "Delhi", name: "AIIMS Delhi", note: "24/7 emergency, free medico-legal services", address: "Ansari Nagar" },
  { city: "Mumbai", name: "KEM Hospital", note: "Free, public, dedicated OSCC (One Stop Crisis Centre)", address: "Parel" },
  { city: "Bengaluru", name: "Vanitha Sahayavani / Bowring Hospital", note: "Police-linked OSCC for women", address: "Shivaji Nagar" },
  { city: "Chennai", name: "Government Kasturba Gandhi Hospital", note: "Women & children, 24/7 emergency", address: "Triplicane" },
  { city: "Kolkata", name: "SSKM Hospital", note: "Free trauma & gynaecology services", address: "AJC Bose Road" },
  { city: "Hyderabad", name: "Osmania General Hospital", note: "Free emergency & forensic medicine", address: "Afzal Gunj" },
];

const DoctorResources = () => (
  <Layout>
    <div className="bg-gradient-to-b from-lavender/30 to-background py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-8">
          <Stethoscope className="w-10 h-10 text-primary mx-auto mb-3" />
          <h1 className="font-heading text-3xl font-bold mb-2">Doctor & Medical Resources</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Trusted medical helplines, first-aid steps and guidance for survivors. Looking to book a doctor instead?{" "}
            <Link to="/doctors" className="text-primary underline">Browse our doctors directory</Link>.
          </p>
        </div>

        {/* Helplines */}
        <h2 className="font-heading text-xl font-bold mb-3 flex items-center gap-2">
          <Phone className="w-5 h-5 text-primary" /> Medical & mental-health helplines
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {helplines.map((h) => {
            const isUrgent = h.color === "destructive";
            return (
              <Card key={h.number} className={`${isUrgent ? "border-destructive/30" : "border-primary/20"}`}>
                <CardContent className="p-4 flex flex-col h-full">
                  <h3 className="font-heading font-bold">{h.label}</h3>
                  <p className={`text-lg font-bold ${isUrgent ? "text-destructive" : "text-primary"} mt-1`}>{h.number}</p>
                  <p className="text-xs text-muted-foreground mb-3 flex-1">{h.description}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <a href={`tel:${h.number}`} className="contents">
                      <Button variant={isUrgent ? "destructive" : "default"} size="sm" className="gap-1 w-full">
                        <Phone className="w-3 h-3" /> Call
                      </Button>
                    </a>
                    <a href={`sms:${h.number}`} className="contents">
                      <Button variant="outline" size="sm" className="gap-1 w-full">
                        <MessageSquare className="w-3 h-3" /> SMS
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Educational guides */}
        <h2 className="font-heading text-xl font-bold mb-3 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" /> Educational guides
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {guides.map((g) => {
            const Icon = g.icon;
            return (
              <Card key={g.title}>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-primary" />
                    <CardTitle className="text-base font-heading">{g.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-4">
                    {g.points.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* First aid accordion */}
        <h2 className="font-heading text-xl font-bold mb-3 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-destructive" /> First-aid quick reference
        </h2>
        <Card className="mb-12">
          <CardContent className="p-2 sm:p-4">
            <Accordion type="single" collapsible className="w-full">
              {firstAid.map((f) => (
                <AccordionItem key={f.title} value={f.title}>
                  <AccordionTrigger className="text-left font-medium">{f.title}</AccordionTrigger>
                  <AccordionContent>
                    <ol className="text-sm text-muted-foreground space-y-1 list-decimal pl-5">
                      {f.steps.map((s, i) => <li key={i}>{s}</li>)}
                    </ol>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Hospitals */}
        <h2 className="font-heading text-xl font-bold mb-3 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" /> Survivor-friendly public hospitals
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          {hospitals.map((h) => (
            <Card key={h.name}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="font-heading font-bold">{h.name}</h3>
                  <Badge variant="secondary">{h.city}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{h.note}</p>
                <p className="text-xs text-muted-foreground mt-1">{h.address}, {h.city}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="p-4 text-sm">
            <p className="font-medium mb-1">Disclaimer</p>
            <p className="text-muted-foreground">
              This information is educational and not a substitute for professional medical advice. In a medical emergency, call <span className="font-bold text-destructive">112</span> or <span className="font-bold text-destructive">102</span> immediately.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  </Layout>
);

export default DoctorResources;