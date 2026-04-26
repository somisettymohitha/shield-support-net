import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Phone, MessageSquare, AlertTriangle, Send, Heart, Baby, Stethoscope, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const services = [
  { id: "police", label: "Police", number: "100", sms: "100", icon: Shield, color: "destructive", description: "Immediate police assistance" },
  { id: "emergency", label: "Emergency (All)", number: "112", sms: "112", icon: AlertTriangle, color: "destructive", description: "Unified emergency number" },
  { id: "women", label: "Women Helpline", number: "181", sms: "181", icon: Heart, color: "primary", description: "24/7 helpline for women in distress" },
  { id: "ncw", label: "NCW WhatsApp", number: "7827170170", sms: "7827170170", icon: MessageSquare, color: "primary", description: "National Commission for Women" },
  { id: "ambulance", label: "Ambulance", number: "102", sms: "102", icon: Stethoscope, color: "destructive", description: "Free medical emergency transport" },
  { id: "child", label: "Child Helpline", number: "1098", sms: "1098", icon: Baby, color: "primary", description: "24/7 support for children in need" },
  { id: "domestic", label: "Domestic Abuse Helpline", number: "1091", sms: "1091", icon: Heart, color: "primary", description: "Women in distress / abuse" },
  { id: "senior", label: "Elderly Helpline", number: "14567", sms: "14567", icon: Phone, color: "primary", description: "Elderline for senior citizens" },
];

const messageSchema = z.object({
  recipient_service: z.string().min(1, "Please select a service"),
  subject: z.string().trim().min(3, "Subject is too short").max(120, "Subject must be under 120 characters"),
  message: z.string().trim().min(10, "Please describe your situation (min 10 chars)").max(2000, "Message must be under 2000 characters"),
  preferred_contact: z.enum(["phone", "email", "either"]),
  contact_value: z.string().trim().max(120).optional().or(z.literal("")),
});

const EmergencyContact = () => {
  const [recipient, setRecipient] = useState("women");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [preferred, setPreferred] = useState<"phone" | "email" | "either">("phone");
  const [contactValue, setContactValue] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: myMessages } = useQuery({
    queryKey: ["my-support-messages"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data, error } = await supabase
        .from("support_messages")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const sendMessage = useMutation({
    mutationFn: async () => {
      const parsed = messageSchema.safeParse({
        recipient_service: recipient,
        subject,
        message,
        preferred_contact: preferred,
        contact_value: contactValue,
      });
      if (!parsed.success) {
        throw new Error(parsed.error.issues[0].message);
      }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        throw new Error("Please sign in to send a message");
      }
      const { error } = await supabase.from("support_messages").insert({
        user_id: user.id,
        recipient_service: parsed.data.recipient_service,
        subject: parsed.data.subject,
        message: parsed.data.message,
        preferred_contact: parsed.data.preferred_contact,
        contact_value: parsed.data.contact_value || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Message sent", description: "Your message has been recorded. A support coordinator will reach out." });
      setSubject("");
      setMessage("");
      setContactValue("");
      queryClient.invalidateQueries({ queryKey: ["my-support-messages"] });
    },
    onError: (err: Error) => toast({ title: "Could not send", description: err.message, variant: "destructive" }),
  });

  const recipientLabel = services.find((s) => s.id === recipient)?.label ?? "";

  return (
    <Layout>
      <div className="bg-gradient-to-b from-destructive/5 to-background py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <Phone className="w-10 h-10 text-destructive mx-auto mb-3" />
            <h1 className="font-heading text-3xl font-bold mb-2">Emergency & Support Contact</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Call or message police, helplines and support services directly. In immediate danger? Call <span className="font-bold text-destructive">112</span> now.
            </p>
          </div>

          {/* Quick action grid */}
          <h2 className="font-heading text-xl font-bold mb-3 max-w-5xl mx-auto">Quick contact</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto mb-12">
            {services.map((s) => {
              const Icon = s.icon;
              const isUrgent = s.color === "destructive";
              return (
                <Card key={s.id} className={`h-full ${isUrgent ? "border-destructive/30" : "border-primary/20"}`}>
                  <CardContent className="p-5 flex flex-col h-full">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className={`w-5 h-5 ${isUrgent ? "text-destructive" : "text-primary"}`} />
                      <h3 className="font-heading font-bold">{s.label}</h3>
                    </div>
                    <p className={`text-xl font-bold ${isUrgent ? "text-destructive" : "text-primary"} mb-1`}>{s.number}</p>
                    <p className="text-xs text-muted-foreground mb-4 flex-1">{s.description}</p>
                    <div className="grid grid-cols-2 gap-2">
                      <a href={`tel:${s.number}`} className="contents">
                        <Button variant={isUrgent ? "destructive" : "default"} size="sm" className="gap-1 w-full">
                          <Phone className="w-3 h-3" /> Call
                        </Button>
                      </a>
                      <a href={`sms:${s.sms}`} className="contents">
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

          {/* In-app message form */}
          <div className="max-w-2xl mx-auto grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading flex items-center gap-2">
                  <Send className="w-5 h-5 text-primary" /> Send a written request
                </CardTitle>
                <CardDescription>
                  Prefer not to call? Send a message to a support service. A coordinator will follow up using your chosen contact method. (Sign-in required.)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => { e.preventDefault(); sendMessage.mutate(); }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label>Send to</Label>
                    <Select value={recipient} onValueChange={setRecipient}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {services.map((s) => (
                          <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Brief summary (e.g. 'Need urgent legal help')"
                      maxLength={120}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe your situation. Do not share more than you are comfortable with."
                      rows={5}
                      maxLength={2000}
                      required
                    />
                    <p className="text-xs text-muted-foreground text-right">{message.length}/2000</p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Preferred contact</Label>
                      <Select value={preferred} onValueChange={(v) => setPreferred(v as typeof preferred)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="phone">Phone call</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="either">Either</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactValue">Phone or email (optional)</Label>
                      <Input
                        id="contactValue"
                        value={contactValue}
                        onChange={(e) => setContactValue(e.target.value)}
                        placeholder="+91 9876543210"
                        maxLength={120}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={sendMessage.isPending}>
                    {sendMessage.isPending ? "Sending..." : `Send to ${recipientLabel}`}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {myMessages && myMessages.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading text-lg flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" /> Your previous messages
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {myMessages.map((m: any) => {
                    const svc = services.find((s) => s.id === m.recipient_service);
                    return (
                      <div key={m.id} className="border border-border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1 gap-2 flex-wrap">
                          <p className="font-medium text-sm">{m.subject}</p>
                          <Badge variant="secondary">{svc?.label ?? m.recipient_service}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{m.message}</p>
                        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                          <span>{new Date(m.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</span>
                          <Badge variant="outline" className="capitalize">{m.status}</Badge>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EmergencyContact;