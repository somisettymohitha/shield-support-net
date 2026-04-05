import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Activity, Heart, FileText, Calendar, Plus, CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const moodEmojis: Record<string, string> = {
  very_bad: "😢", bad: "😟", okay: "😐", good: "🙂", great: "😊"
};

const statusColors: Record<string, string> = {
  open: "bg-blue-100 text-blue-800",
  in_progress: "bg-yellow-100 text-yellow-800",
  resolved: "bg-green-100 text-green-800",
  closed: "bg-muted text-muted-foreground",
  requested: "bg-blue-100 text-blue-800",
  scheduled: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  pending: "bg-yellow-100 text-yellow-800",
  reviewed: "bg-green-100 text-green-800",
  flagged: "bg-red-100 text-red-800",
};

const Tracker = () => {
  const [user, setUser] = useState<any>(null);
  const [cases, setCases] = useState<any[]>([]);
  const [checkins, setCheckins] = useState<any[]>([]);
  const [evidence, setEvidence] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) navigate("/auth");
      else setUser(session.user);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/auth");
      else { setUser(session.user); fetchAll(); }
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchAll = async () => {
    const [c, s, e, cs] = await Promise.all([
      supabase.from("cases").select("*").order("created_at", { ascending: false }),
      supabase.from("safety_checkins").select("*").order("created_at", { ascending: false }),
      supabase.from("evidence_uploads").select("*").order("created_at", { ascending: false }),
      supabase.from("counseling_sessions").select("*").order("created_at", { ascending: false }),
    ]);
    if (c.data) setCases(c.data);
    if (s.data) setCheckins(s.data);
    if (e.data) setEvidence(e.data);
    if (cs.data) setSessions(cs.data);
  };

  // --- Add Case ---
  const [newCase, setNewCase] = useState({ title: "", description: "", priority: "medium" });
  const [caseDialogOpen, setCaseDialogOpen] = useState(false);
  const addCase = async () => {
    if (!newCase.title.trim()) return;
    const { error } = await supabase.from("cases").insert({
      user_id: user.id, title: newCase.title, description: newCase.description, priority: newCase.priority
    });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Case created" }); setNewCase({ title: "", description: "", priority: "medium" }); setCaseDialogOpen(false); fetchAll(); }
  };

  // --- Safety Check-in ---
  const [checkin, setCheckin] = useState({ mood: "", safety_level: "3", is_location_safe: true, notes: "" });
  const [checkinDialogOpen, setCheckinDialogOpen] = useState(false);
  const addCheckin = async () => {
    if (!checkin.mood) return;
    const { error } = await supabase.from("safety_checkins").insert({
      user_id: user.id, mood: checkin.mood, safety_level: parseInt(checkin.safety_level), is_location_safe: checkin.is_location_safe, notes: checkin.notes || null
    });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Check-in recorded" }); setCheckin({ mood: "", safety_level: "3", is_location_safe: true, notes: "" }); setCheckinDialogOpen(false); fetchAll(); }
  };

  // --- Counseling Session Request ---
  const [sessionType, setSessionType] = useState("");
  const [sessionDialogOpen, setSessionDialogOpen] = useState(false);
  const requestSession = async () => {
    if (!sessionType) return;
    const { error } = await supabase.from("counseling_sessions").insert({
      user_id: user.id, session_type: sessionType
    });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Session requested" }); setSessionType(""); setSessionDialogOpen(false); fetchAll(); }
  };

  if (loading) {
    return <Layout><div className="min-h-[60vh] flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div></Layout>;
  }

  return (
    <Layout>
      <div className="bg-gradient-to-b from-lavender/20 to-background py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h1 className="font-heading text-2xl font-bold flex items-center gap-2">
              <Activity className="w-6 h-6 text-primary" /> My Tracker
            </h1>
            <p className="text-sm text-muted-foreground">Track your cases, safety, evidence, and counseling sessions</p>
          </div>

          <Tabs defaultValue="cases" className="space-y-4">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
              <TabsTrigger value="cases" className="gap-1"><Shield className="w-4 h-4" /> Cases</TabsTrigger>
              <TabsTrigger value="safety" className="gap-1"><Heart className="w-4 h-4" /> Safety</TabsTrigger>
              <TabsTrigger value="evidence" className="gap-1"><FileText className="w-4 h-4" /> Evidence</TabsTrigger>
              <TabsTrigger value="sessions" className="gap-1"><Calendar className="w-4 h-4" /> Sessions</TabsTrigger>
            </TabsList>

            {/* CASE PROGRESS TAB */}
            <TabsContent value="cases" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="font-heading font-semibold text-lg">Case Progress</h2>
                <Dialog open={caseDialogOpen} onOpenChange={setCaseDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-1"><Plus className="w-4 h-4" /> New Case</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Create New Case</DialogTitle></DialogHeader>
                    <div className="space-y-3">
                      <div><Label>Title</Label><Input value={newCase.title} onChange={e => setNewCase(p => ({ ...p, title: e.target.value }))} placeholder="Brief case title" /></div>
                      <div><Label>Description</Label><Textarea value={newCase.description} onChange={e => setNewCase(p => ({ ...p, description: e.target.value }))} placeholder="Describe your situation..." /></div>
                      <div><Label>Priority</Label>
                        <Select value={newCase.priority} onValueChange={v => setNewCase(p => ({ ...p, priority: v }))}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={addCase} className="w-full">Create Case</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              {cases.length === 0 ? (
                <Card><CardContent className="p-6 text-center text-muted-foreground">No cases yet. Create one to start tracking your progress.</CardContent></Card>
              ) : cases.map(c => (
                <Card key={c.id} className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-heading font-semibold">{c.title}</h3>
                        <p className="text-sm text-muted-foreground">{c.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={statusColors[c.status] || ""}>{c.status.replace("_", " ")}</Badge>
                        <Badge variant="outline">{c.priority}</Badge>
                      </div>
                    </div>
                    <Progress value={c.status === "open" ? 10 : c.status === "in_progress" ? 50 : c.status === "resolved" ? 90 : 100} className="h-2 mt-2" />
                    <p className="text-xs text-muted-foreground mt-1">Created {new Date(c.created_at).toLocaleDateString()}</p>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* SAFETY CHECK-INS TAB */}
            <TabsContent value="safety" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="font-heading font-semibold text-lg">Safety Check-ins</h2>
                <Dialog open={checkinDialogOpen} onOpenChange={setCheckinDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-1"><Plus className="w-4 h-4" /> Check In</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Safety Check-in</DialogTitle></DialogHeader>
                    <div className="space-y-3">
                      <div><Label>How are you feeling?</Label>
                        <div className="flex gap-2 mt-1">
                          {Object.entries(moodEmojis).map(([mood, emoji]) => (
                            <button key={mood} onClick={() => setCheckin(p => ({ ...p, mood }))}
                              className={`text-2xl p-2 rounded-lg border transition-colors ${checkin.mood === mood ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"}`}
                              title={mood.replace("_", " ")}>{emoji}</button>
                          ))}
                        </div>
                      </div>
                      <div><Label>Safety Level (1-5)</Label>
                        <Select value={checkin.safety_level} onValueChange={v => setCheckin(p => ({ ...p, safety_level: v }))}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {[1,2,3,4,5].map(n => <SelectItem key={n} value={String(n)}>{n} - {n <= 2 ? "Unsafe" : n === 3 ? "Moderate" : "Safe"}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" checked={checkin.is_location_safe} onChange={e => setCheckin(p => ({ ...p, is_location_safe: e.target.checked }))} id="loc-safe" className="rounded" />
                        <Label htmlFor="loc-safe">I feel safe at my current location</Label>
                      </div>
                      <div><Label>Notes (optional)</Label><Textarea value={checkin.notes} onChange={e => setCheckin(p => ({ ...p, notes: e.target.value }))} placeholder="How are things going..." /></div>
                      <Button onClick={addCheckin} className="w-full">Submit Check-in</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              {checkins.length === 0 ? (
                <Card><CardContent className="p-6 text-center text-muted-foreground">No check-ins yet. Regular check-ins help track your safety over time.</CardContent></Card>
              ) : checkins.map(ch => (
                <Card key={ch.id} className="border-border/50">
                  <CardContent className="p-4 flex items-center gap-4">
                    <span className="text-3xl">{moodEmojis[ch.mood] || "😐"}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium capitalize">{ch.mood.replace("_", " ")}</span>
                        <Badge variant={ch.is_location_safe ? "default" : "destructive"}>
                          {ch.is_location_safe ? "Location Safe" : "Location Unsafe"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Shield className="w-3 h-3" /> Safety: {ch.safety_level}/5
                      </div>
                      {ch.notes && <p className="text-sm mt-1">{ch.notes}</p>}
                      <p className="text-xs text-muted-foreground mt-1">{new Date(ch.created_at).toLocaleString()}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* EVIDENCE TAB */}
            <TabsContent value="evidence" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="font-heading font-semibold text-lg">Evidence & Documents</h2>
                <Button size="sm" className="gap-1" onClick={() => navigate("/file-fir")}>
                  <Plus className="w-4 h-4" /> Upload Evidence
                </Button>
              </div>
              {evidence.length === 0 ? (
                <Card><CardContent className="p-6 text-center text-muted-foreground">No evidence uploaded yet. Go to File FIR to upload photos, videos, or documents.</CardContent></Card>
              ) : evidence.map(ev => (
                <Card key={ev.id} className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-primary" />
                        <div>
                          <h3 className="font-medium">{ev.file_name}</h3>
                          <p className="text-sm text-muted-foreground">{ev.description || "No description"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={statusColors[ev.review_status] || ""}>{ev.review_status}</Badge>
                        <Badge variant="outline">{ev.file_type}</Badge>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{new Date(ev.created_at).toLocaleString()}</p>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* COUNSELING SESSIONS TAB */}
            <TabsContent value="sessions" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="font-heading font-semibold text-lg">Counseling Sessions</h2>
                <Dialog open={sessionDialogOpen} onOpenChange={setSessionDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-1"><Plus className="w-4 h-4" /> Request Session</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Request Counseling Session</DialogTitle></DialogHeader>
                    <div className="space-y-3">
                      <div><Label>Session Type</Label>
                        <Select value={sessionType} onValueChange={setSessionType}>
                          <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="crisis">Crisis Counseling</SelectItem>
                            <SelectItem value="trauma_ptsd">Trauma/PTSD Therapy</SelectItem>
                            <SelectItem value="legal">Legal Counseling</SelectItem>
                            <SelectItem value="group_support">Group Support</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={requestSession} className="w-full">Submit Request</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              {sessions.length === 0 ? (
                <Card><CardContent className="p-6 text-center text-muted-foreground">No sessions yet. Request a counseling session to get started.</CardContent></Card>
              ) : sessions.map(s => (
                <Card key={s.id} className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {s.status === "completed" ? <CheckCircle className="w-5 h-5 text-green-600" /> :
                         s.status === "cancelled" ? <AlertTriangle className="w-5 h-5 text-red-500" /> :
                         <Clock className="w-5 h-5 text-yellow-600" />}
                        <h3 className="font-heading font-semibold capitalize">{s.session_type.replace("_", " ")}</h3>
                      </div>
                      <Badge className={statusColors[s.status] || ""}>{s.status}</Badge>
                    </div>
                    {s.scheduled_at && <p className="text-sm text-muted-foreground">Scheduled: {new Date(s.scheduled_at).toLocaleString()}</p>}
                    {s.progress_notes && <p className="text-sm mt-1 bg-muted/50 p-2 rounded">{s.progress_notes}</p>}
                    <p className="text-xs text-muted-foreground mt-2">Requested {new Date(s.created_at).toLocaleDateString()}</p>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Tracker;
