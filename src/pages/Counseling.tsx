import { Heart, Brain, Scale, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import { Link } from "react-router-dom";

const counselingTypes = [
  {
    icon: Heart,
    title: "Crisis Counseling",
    description: "Immediate emotional support during emergencies. Available 24/7 through helplines.",
    whatToExpect: [
      "Confidential one-on-one support",
      "Safety planning and risk assessment",
      "Emotional stabilisation techniques",
      "Referral to long-term services",
    ],
    color: "text-destructive",
    bgColor: "bg-destructive/5",
    primary: false,
  },
  {
    icon: Brain,
    title: "Trauma / PTSD Therapy",
    description: "Specialised long-term therapy for survivors dealing with post-traumatic stress, anxiety, and depression from domestic violence.",
    whatToExpect: [
      "Cognitive Behavioural Therapy (CBT)",
      "Eye Movement Desensitisation (EMDR)",
      "Trauma-focused counseling sessions",
      "Coping mechanisms and resilience building",
      "Progress monitoring with your counsellor",
    ],
    color: "text-lavender-dark",
    bgColor: "bg-lavender/20",
    primary: true,
  },
  {
    icon: Scale,
    title: "Legal Counseling",
    description: "Understand your legal options, rights under Indian law, and the process of seeking justice.",
    whatToExpect: [
      "Understanding protection orders",
      "FIR filing assistance",
      "Court process guidance",
      "Connecting with legal aid lawyers",
    ],
    color: "text-primary",
    bgColor: "bg-teal-light/50",
    primary: false,
  },
  {
    icon: Users,
    title: "Group Support",
    description: "Peer support sessions with other survivors. Share experiences and find strength in community.",
    whatToExpect: [
      "Moderated group sessions",
      "Shared healing experiences",
      "Community building and solidarity",
      "Anonymous participation option",
    ],
    color: "text-warm-dark",
    bgColor: "bg-warm",
    primary: false,
  },
];

const Counseling = () => (
  <Layout>
    <div className="bg-gradient-to-b from-lavender/30 to-background py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <Brain className="w-10 h-10 text-lavender-dark mx-auto mb-3" />
          <h1 className="font-heading text-3xl font-bold mb-2">Types of Counseling</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Healing is a journey. Find the right type of support for where you are today.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {counselingTypes.map((type) => (
            <Card
              key={type.title}
              className={`${type.primary ? "ring-2 ring-primary/30 shadow-lg" : ""} border-border/50`}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${type.bgColor}`}>
                    <type.icon className={`w-6 h-6 ${type.color}`} />
                  </div>
                  <div>
                    <CardTitle className="font-heading text-lg flex items-center gap-2">
                      {type.title}
                      {type.primary && <Badge className="bg-primary text-primary-foreground">Recommended</Badge>}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{type.description}</p>
                <h4 className="text-sm font-bold mb-2">What to expect:</h4>
                <ul className="space-y-1 mb-4">
                  {type.whatToExpect.map((item) => (
                    <li key={item} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-1">•</span> {item}
                    </li>
                  ))}
                </ul>
                <Link to="/auth?tab=signup">
                  <Button variant={type.primary ? "default" : "outline"} size="sm" className="gap-2">
                    Request Session <ArrowRight className="w-3 h-3" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  </Layout>
);

export default Counseling;
