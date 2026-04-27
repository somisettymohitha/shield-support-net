import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList, Save, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const IMMEDIATE_NEEDS = [
  "Safe shelter", "Medical care", "Legal aid", "Police protection",
  "Financial help", "Food / essentials", "Childcare support", "Emotional support",
];
const SUPPORT_TYPES = [
  "Trauma counseling", "Group therapy", "Legal counseling", "Medical referral",
  "Career / livelihood", "Education for children", "Long-term safety planning",
];

const SurvivorIntake = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    preferred_name: "",
    age_range: "",
    pronouns: "",
    languages: "",
    current_situation: "",
    safety_status: "",
    living_situation: "",
    has_children: false,
    immediate_needs: [] as string[],
    support_types_needed: [] as string[],
    prior_counseling: false,
    medical_concerns: "",
    legal_concerns: "",
    preferred_session_mode: "",
    preferred_contact_time: "",
    additional_notes: "",
  });

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/auth"); return; }
      setUserId(session.user.id);
      const { data } = await supabase
        .from("survivor_intakes")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();
      if (data) {
        setForm({
          preferred_name: data.preferred_name ?? "",
          age_range: data.age_range ?? "",
          pronouns: data.pronouns ?? "",
          languages: data.languages ?? "",
          current_situation: data.current_situation ?? "",
          safety_status: data.safety_status ?? "",
          living_situation: data.living_situation ?? "",
          has_children: !!data.has_children,
          immediate_needs: data.immediate_needs ?? [],
          support_types_needed: data.support_types_needed ?? [],
          prior_counseling: !!data.prior_counseling,
          medical_concerns: data.medical_concerns ?? "",
          legal_concerns: data.legal_concerns ?? "",
          preferred_session_mode: data.preferred_session_mode ?? "",
          preferred_contact_time: data.preferred_contact_time ?? "",
          additional_notes: data.additional_notes ?? "",
        });
      }
      setLoading(false);
    })();
  }, [navigate]);

  const toggleArr = (key: "immediate_needs" | "support_types_needed", value: string) => {
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value],
    }));
  };

  const save = async (markComplete: boolean) => {
    if (!userId) return;
    if (form.preferred_name.trim().length > 80 || form.languages.length > 200) {
      toast({ title: "Please shorten long fields", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("survivor_intakes")
      .upsert(
        { user_id: userId, ...form, completed: markComplete },
        { onConflict: "user_id" }
      );
    setSaving(false);
    if (error) {
      toast({ title: "Could not save", description: error.message, variant: "destructive" });
      return;
    }
    toast({
      title: markComplete ? "Intake submitted" : "Draft saved",
      description: markComplete
        ? "A counselor will review your details and reach out."
        : "You can come back and finish anytime.",
    });
    if (markComplete) navigate("/dashboard");
  };

  if (loading) {
    return <Layout><div className="min-h-[60vh] flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div></Layout>;
  }

  return (
    <Layout>
      <div className="bg-gradient-to-b from-lavender/20 to-background py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-8">
            <ClipboardList className="w-10 h-10 text-primary mx-auto mb-3" />
            <h1 className="font-heading text-3xl font-bold mb-2">Personal Intake Form</h1>
            <p className="text-muted-foreground">
              Share what feels safe. This helps your counselor understand your situation and prepare the right support. You can save a draft and return anytime.
            </p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); save(true); }} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">About you</CardTitle>
                <CardDescription>Only what you wish to share.</CardDescription>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preferred_name">Preferred name</Label>
                  <Input id="preferred_name" value={form.preferred_name} maxLength={80}
                    onChange={(e) => setForm({ ...form, preferred_name: e.target.value })}
                    placeholder="What should we call you?" />
                </div>
                <div className="space-y-2">
                  <Label>Age range</Label>
                  <Select value={form.age_range} onValueChange={(v) => setForm({ ...form, age_range: v })}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under_18">Under 18</SelectItem>
                      <SelectItem value="18_25">18–25</SelectItem>
                      <SelectItem value="26_35">26–35</SelectItem>
                      <SelectItem value="36_45">36–45</SelectItem>
                      <SelectItem value="46_60">46–60</SelectItem>
                      <SelectItem value="60_plus">60+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pronouns">Pronouns</Label>
                  <Input id="pronouns" value={form.pronouns} maxLength={40}
                    onChange={(e) => setForm({ ...form, pronouns: e.target.value })}
                    placeholder="she/her, he/him, they/them..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="languages">Languages you're comfortable in</Label>
                  <Input id="languages" value={form.languages} maxLength={200}
                    onChange={(e) => setForm({ ...form, languages: e.target.value })}
                    placeholder="Hindi, English, Tamil..." />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">Your situation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current_situation">What's happening right now?</Label>
                  <Textarea id="current_situation" rows={4} maxLength={2000}
                    value={form.current_situation}
                    onChange={(e) => setForm({ ...form, current_situation: e.target.value })}
                    placeholder="Share as much or as little as you'd like." />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Are you currently safe?</Label>
                    <Select value={form.safety_status} onValueChange={(v) => setForm({ ...form, safety_status: v })}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="safe">Yes, I'm safe</SelectItem>
                        <SelectItem value="unsure">I'm not sure</SelectItem>
                        <SelectItem value="unsafe">No, I feel unsafe</SelectItem>
                        <SelectItem value="immediate_danger">In immediate danger</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Living situation</Label>
                    <Select value={form.living_situation} onValueChange={(v) => setForm({ ...form, living_situation: v })}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="with_abuser">Living with the person causing harm</SelectItem>
                        <SelectItem value="with_family">With family / friends</SelectItem>
                        <SelectItem value="alone">Living alone</SelectItem>
                        <SelectItem value="shelter">In a shelter</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="has_children" checked={form.has_children}
                    onCheckedChange={(v) => setForm({ ...form, has_children: !!v })} />
                  <Label htmlFor="has_children" className="cursor-pointer">I have children who may also need support</Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">What you need</CardTitle>
                <CardDescription>Select all that apply.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <Label className="mb-2 block">Immediate needs</Label>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {IMMEDIATE_NEEDS.map((n) => (
                      <label key={n} className="flex items-center gap-2 text-sm cursor-pointer">
                        <Checkbox checked={form.immediate_needs.includes(n)} onCheckedChange={() => toggleArr("immediate_needs", n)} />
                        {n}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="mb-2 block">Support you're looking for</Label>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {SUPPORT_TYPES.map((n) => (
                      <label key={n} className="flex items-center gap-2 text-sm cursor-pointer">
                        <Checkbox checked={form.support_types_needed.includes(n)} onCheckedChange={() => toggleArr("support_types_needed", n)} />
                        {n}
                      </label>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">Background & concerns</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Checkbox id="prior_counseling" checked={form.prior_counseling}
                    onCheckedChange={(v) => setForm({ ...form, prior_counseling: !!v })} />
                  <Label htmlFor="prior_counseling" className="cursor-pointer">I have received counseling or therapy before</Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medical_concerns">Medical concerns (optional)</Label>
                  <Textarea id="medical_concerns" rows={3} maxLength={1000}
                    value={form.medical_concerns}
                    onChange={(e) => setForm({ ...form, medical_concerns: e.target.value })}
                    placeholder="Injuries, ongoing conditions, medications..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="legal_concerns">Legal concerns (optional)</Label>
                  <Textarea id="legal_concerns" rows={3} maxLength={1000}
                    value={form.legal_concerns}
                    onChange={(e) => setForm({ ...form, legal_concerns: e.target.value })}
                    placeholder="FIR status, custody, divorce, restraining order..." />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">Preferences</CardTitle>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Preferred session mode</Label>
                  <Select value={form.preferred_session_mode} onValueChange={(v) => setForm({ ...form, preferred_session_mode: v })}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">Video call</SelectItem>
                      <SelectItem value="phone">Phone call</SelectItem>
                      <SelectItem value="chat">Text chat</SelectItem>
                      <SelectItem value="in_person">In person</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Best time to contact</Label>
                  <Select value={form.preferred_contact_time} onValueChange={(v) => setForm({ ...form, preferred_contact_time: v })}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Morning (8am – 12pm)</SelectItem>
                      <SelectItem value="afternoon">Afternoon (12pm – 5pm)</SelectItem>
                      <SelectItem value="evening">Evening (5pm – 9pm)</SelectItem>
                      <SelectItem value="anytime">Anytime</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="additional_notes">Anything else you'd like the counselor to know?</Label>
                  <Textarea id="additional_notes" rows={3} maxLength={2000}
                    value={form.additional_notes}
                    onChange={(e) => setForm({ ...form, additional_notes: e.target.value })} />
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button type="button" variant="outline" className="flex-1 gap-2" disabled={saving} onClick={() => save(false)}>
                <Save className="w-4 h-4" /> Save draft
              </Button>
              <Button type="submit" className="flex-1 gap-2" disabled={saving}>
                <CheckCircle2 className="w-4 h-4" /> {saving ? "Submitting..." : "Submit for counselor review"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Your responses are private and visible only to you and assigned counselors.
            </p>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default SurvivorIntake;
