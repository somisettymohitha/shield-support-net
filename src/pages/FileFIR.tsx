import { ExternalLink, FileText, Upload, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { Link } from "react-router-dom";

const steps = [
  "Go to the nearest police station or use an online e-FIR portal.",
  "Provide your name, address, and details of the incident.",
  "Describe the offence clearly — include dates, times, and persons involved.",
  "If you have evidence (photos, videos, messages), present or upload them.",
  "The police are legally obligated to register your FIR — they cannot refuse (Supreme Court directive).",
  "Get a copy of the FIR with a reference number for your records.",
];

const portals = [
  { name: "National Commission for Women (NCW)", url: "http://ncw.nic.in/ncw-cells/complaint-registration", desc: "Online complaint registration portal" },
  { name: "Delhi Police e-FIR", url: "https://efir.delhipolice.gov.in/", desc: "File FIR online in Delhi" },
  { name: "Maharashtra Police e-FIR", url: "https://citizen.mahapolice.gov.in/Aboretum/Login.aspx", desc: "File FIR online in Maharashtra" },
  { name: "Karnataka Police e-FIR", url: "https://ksp.karnataka.gov.in/", desc: "File FIR online in Karnataka" },
];

const FileFIR = () => (
  <Layout>
    <div className="bg-gradient-to-b from-teal-light/30 to-background py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <FileText className="w-10 h-10 text-primary mx-auto mb-3" />
          <h1 className="font-heading text-3xl font-bold mb-2">File an FIR</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Filing a First Information Report (FIR) is your legal right. Here's how to do it.
          </p>
        </div>

        {/* Important note */}
        <Card className="max-w-3xl mx-auto mb-8 border-destructive/30 bg-destructive/5">
          <CardContent className="p-4 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <p className="text-sm text-foreground">
              <strong>Important:</strong> Police cannot refuse to file your FIR. If they do, you can
              approach the Superintendent of Police or file a complaint with the Judicial Magistrate
              under Section 156(3) CrPC.
            </p>
          </CardContent>
        </Card>

        {/* Steps */}
        <div className="max-w-3xl mx-auto mb-10">
          <h2 className="font-heading text-xl font-bold mb-4">Step-by-Step Guide</h2>
          <div className="space-y-3">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                  {i + 1}
                </div>
                <p className="text-sm text-foreground pt-1">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Online portals */}
        <div className="max-w-3xl mx-auto mb-10">
          <h2 className="font-heading text-xl font-bold mb-4">Online FIR & Complaint Portals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {portals.map((p) => (
              <Card key={p.name} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-heading">{p.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{p.desc}</p>
                  <a href={p.url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="gap-2">
                      <ExternalLink className="w-3 h-3" /> Visit Portal
                    </Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Upload evidence */}
        <div className="max-w-3xl mx-auto text-center bg-lavender/30 rounded-2xl p-8">
          <Upload className="w-8 h-8 text-lavender-dark mx-auto mb-3" />
          <h2 className="font-heading text-xl font-bold mb-2">Upload Evidence Securely</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Sign in to upload photos, videos, or documents as evidence. Files are stored
            securely and only accessible to you and your support team.
          </p>
          <Link to="/auth?tab=signup">
            <Button className="gap-2">
              <Upload className="w-4 h-4" /> Sign Up to Upload
            </Button>
          </Link>
        </div>
      </div>
    </div>
  </Layout>
);

export default FileFIR;
