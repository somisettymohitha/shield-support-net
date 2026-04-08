import { useState, useEffect } from "react";
import { ExternalLink, FileText, Upload, AlertTriangle, MapPin, Loader2, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

const FileFIR = () => {
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; id: string }[]>([]);

  // Location state
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const validTypes = ["image/jpeg", "image/png", "image/webp", "video/mp4", "video/webm", "application/pdf"];
      const filtered = newFiles.filter(f => {
        if (!validTypes.includes(f.type)) {
          toast({ title: "Unsupported file", description: `${f.name} is not a supported format.`, variant: "destructive" });
          return false;
        }
        if (f.size > 50 * 1024 * 1024) {
          toast({ title: "File too large", description: `${f.name} exceeds 50MB limit.`, variant: "destructive" });
          return false;
        }
        return true;
      });
      setFiles(prev => [...prev, ...filtered]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!user) return;
    if (files.length === 0) {
      toast({ title: "No files", description: "Please select files to upload.", variant: "destructive" });
      return;
    }

    setUploading(true);
    const results: { name: string; id: string }[] = [];

    for (const file of files) {
      const filePath = `${user.id}/${Date.now()}_${file.name}`;
      const { error: storageError } = await supabase.storage.from("evidence").upload(filePath, file);

      if (storageError) {
        toast({ title: "Upload failed", description: `Failed to upload ${file.name}: ${storageError.message}`, variant: "destructive" });
        continue;
      }

      const { data: insertData, error: dbError } = await supabase.from("evidence_uploads").insert({
        user_id: user.id,
        file_name: file.name,
        file_path: filePath,
        file_type: file.type,
        description: description || null,
      }).select("id").single();

      if (dbError) {
        toast({ title: "Record failed", description: dbError.message, variant: "destructive" });
      } else {
        results.push({ name: file.name, id: insertData.id });
      }
    }

    if (results.length > 0) {
      setUploadedFiles(prev => [...prev, ...results]);
      toast({ title: "Upload complete", description: `${results.length} file(s) uploaded securely.` });
    }

    setFiles([]);
    setDescription("");
    setUploading(false);
  };

  const trackLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }
    setLocationLoading(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationLoading(false);
        toast({ title: "Location captured", description: "Your current location has been recorded." });
      },
      (err) => {
        setLocationError(err.message);
        setLocationLoading(false);
        toast({ title: "Location error", description: err.message, variant: "destructive" });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
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

          {/* Location Tracking */}
          <div className="max-w-3xl mx-auto mb-10">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-heading">
                  <MapPin className="w-5 h-5 text-primary" /> Track Your Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Capture your current location for safety records. This can be useful as evidence or to help authorities reach you.
                </p>
                <Button onClick={trackLocation} disabled={locationLoading} variant="outline" className="gap-2">
                  {locationLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
                  {locationLoading ? "Getting location…" : "Capture My Location"}
                </Button>
                {locationError && (
                  <p className="text-sm text-destructive">{locationError}</p>
                )}
                {location && (
                  <div className="bg-muted rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span className="font-medium">Location captured</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Latitude: {location.lat.toFixed(6)} | Longitude: {location.lng.toFixed(6)}
                    </p>
                    {/* Map visualization */}
                    <div className="rounded-lg overflow-hidden border border-border">
                      <iframe
                        title="Your Location"
                        width="100%"
                        height="250"
                        style={{ border: 0 }}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${location.lng - 0.01},${location.lat - 0.01},${location.lng + 0.01},${location.lat + 0.01}&layer=mapnik&marker=${location.lat},${location.lng}`}
                      />
                    </div>
                    <a
                      href={`https://www.google.com/maps?q=${location.lat},${location.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="link" size="sm" className="p-0 h-auto text-xs gap-1">
                        <ExternalLink className="w-3 h-3" /> View on Google Maps
                      </Button>
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Upload evidence */}
          <div className="max-w-3xl mx-auto mb-10">
            {user ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-heading">
                    <Upload className="w-5 h-5 text-primary" /> Upload Evidence Securely
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Upload photos, videos, or documents. Files are encrypted and only accessible to you.
                  </p>

                  <div>
                    <Label htmlFor="evidence-files" className="text-sm font-medium">Select Files</Label>
                    <Input
                      id="evidence-files"
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,application/pdf"
                      onChange={handleFileSelect}
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Supported: JPG, PNG, WebP, MP4, WebM, PDF (max 50MB each)
                    </p>
                  </div>

                  {files.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Selected files</Label>
                      {files.map((f, i) => (
                        <div key={i} className="flex items-center justify-between bg-muted rounded-md px-3 py-2 text-sm">
                          <span className="truncate mr-2">{f.name} ({(f.size / 1024 / 1024).toFixed(1)}MB)</span>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => removeFile(i)}>
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div>
                    <Label htmlFor="evidence-desc" className="text-sm font-medium">Description (optional)</Label>
                    <Textarea
                      id="evidence-desc"
                      placeholder="Describe the evidence..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="mt-1"
                      maxLength={500}
                    />
                  </div>

                  <Button onClick={handleUpload} disabled={uploading || files.length === 0} className="gap-2">
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {uploading ? "Uploading…" : "Upload Evidence"}
                  </Button>

                  {uploadedFiles.length > 0 && (
                    <div className="border border-primary/20 rounded-lg p-4 space-y-2">
                      <p className="text-sm font-medium flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary" /> Uploaded Successfully
                      </p>
                      {uploadedFiles.map((f) => (
                        <p key={f.id} className="text-xs text-muted-foreground">✓ {f.name}</p>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="text-center bg-lavender/30 rounded-2xl p-8">
                <Upload className="w-8 h-8 text-lavender-dark mx-auto mb-3" />
                <h2 className="font-heading text-xl font-bold mb-2">Upload Evidence Securely</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Sign in to upload photos, videos, or documents as evidence. Files are stored
                  securely and only accessible to you.
                </p>
                <Link to="/auth?tab=signup">
                  <Button className="gap-2">
                    <Upload className="w-4 h-4" /> Sign Up to Upload
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FileFIR;
