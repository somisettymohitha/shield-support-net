import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, XCircle, AlertCircle, Loader2, Smartphone, ExternalLink, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Status = "checking" | "configured" | "not_configured" | "unauthorized" | "error";

const AdminSmsStatus = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<Status>("checking");
  const [detail, setDetail] = useState<string>("");
  const [testPhone, setTestPhone] = useState("");
  const [testing, setTesting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/auth"); return; }
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);
      const admin = (data ?? []).some((r: any) => r.role === "admin");
      setIsAdmin(admin);
      setAuthChecked(true);
      if (admin) checkProvider();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkProvider = async () => {
    setStatus("checking");
    setDetail("");
    // Probe: try sending OTP to an obviously invalid number. If the SMS provider
    // is not configured, the API returns a provider/disabled error before any
    // SMS is sent. If configured, we'll get a number-format / validation error.
    try {
      const { error } = await supabase.auth.signInWithOtp({ phone: "+10000000000" });
      if (!error) {
        setStatus("configured");
        setDetail("OTP request accepted by the backend.");
        return;
      }
      const msg = (error.message || "").toLowerCase();
      const notConfigured =
        msg.includes("provider") ||
        msg.includes("not enabled") ||
        msg.includes("disabled") ||
        msg.includes("unsupported phone provider") ||
        msg.includes("sms provider");
      if (notConfigured) {
        setStatus("not_configured");
        setDetail(error.message);
      } else {
        // Validation / rate-limit errors mean the provider IS configured
        setStatus("configured");
        setDetail(error.message);
      }
    } catch (e: any) {
      setStatus("error");
      setDetail(e?.message ?? "Unknown error while probing the provider.");
    }
  };

  const sendTest = async () => {
    if (!testPhone.startsWith("+") || testPhone.length < 8) {
      toast({ title: "Invalid number", description: "Use E.164 format, e.g. +919876543210.", variant: "destructive" });
      return;
    }
    setTesting(true);
    const { error } = await supabase.auth.signInWithOtp({ phone: testPhone });
    setTesting(false);
    if (error) {
      toast({ title: "Test failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Test SMS dispatched", description: `If configured correctly, ${testPhone} should receive a code shortly.` });
    }
  };

  if (!authChecked) {
    return <Layout><div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div></Layout>;
  }

  if (!isAdmin) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <Shield className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
              <CardTitle>Admin access required</CardTitle>
              <CardDescription>This page is only visible to admins.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => navigate("/dashboard")}>Back to dashboard</Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gradient-to-b from-lavender/20 to-background py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-8">
            <Smartphone className="w-10 h-10 text-primary mx-auto mb-3" />
            <h1 className="font-heading text-3xl font-bold mb-2">SMS / Phone OTP Status</h1>
            <p className="text-muted-foreground">
              Check whether phone-based sign-in is ready to deliver verification codes.
            </p>
          </div>

          {/* Status card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="font-heading text-lg flex items-center gap-2">
                {status === "checking" && <><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /> Checking provider...</>}
                {status === "configured" && <><CheckCircle2 className="w-5 h-5 text-primary" /> SMS provider appears configured</>}
                {status === "not_configured" && <><XCircle className="w-5 h-5 text-destructive" /> SMS provider not configured</>}
                {status === "error" && <><AlertCircle className="w-5 h-5 text-destructive" /> Could not determine status</>}
              </CardTitle>
              {detail && (
                <CardDescription className="font-mono text-xs break-words">
                  {detail}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="flex items-center gap-3">
              <Badge variant={status === "configured" ? "default" : "destructive"} className="capitalize">
                {status.replace("_", " ")}
              </Badge>
              <Button size="sm" variant="outline" onClick={checkProvider} disabled={status === "checking"}>
                Re-check
              </Button>
            </CardContent>
          </Card>

          {/* Setup steps when not configured */}
          {status === "not_configured" && (
            <Card className="mb-6 border-destructive/30">
              <CardHeader>
                <CardTitle className="font-heading text-lg">Setup steps</CardTitle>
                <CardDescription>Phone OTP needs an SMS provider to deliver codes.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <ol className="list-decimal ml-5 space-y-2">
                  <li>Pick an SMS provider (Twilio, MessageBird, Vonage, or Textlocal). Twilio is the most common in India.</li>
                  <li>Create the account and buy a phone number that can send SMS to your target countries.</li>
                  <li>Collect: <span className="font-mono">Account SID</span>, <span className="font-mono">Auth Token</span> (or API Key SID + Secret), and the <span className="font-mono">From</span> number.</li>
                  <li>Open <span className="font-medium">Cloud → Users → Auth Settings → Phone provider</span> and paste the credentials.</li>
                  <li>Enable <span className="font-medium">SMS Pumping Protection</span> and restrict <span className="font-medium">SMS Geo Permissions</span> to the countries you support (India only, in most cases).</li>
                  <li>Return here and click <span className="font-medium">Re-check</span>.</li>
                </ol>
                <div className="flex flex-wrap gap-2 pt-2">
                  <a href="https://console.twilio.com/" target="_blank" rel="noreferrer">
                    <Button size="sm" variant="outline" className="gap-1">Twilio Console <ExternalLink className="w-3 h-3" /></Button>
                  </a>
                  <a href="https://www.twilio.com/docs/messaging/features/sms-pumping-protection-programmable-messaging" target="_blank" rel="noreferrer">
                    <Button size="sm" variant="outline" className="gap-1">SMS Pumping Protection <ExternalLink className="w-3 h-3" /></Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Test send card (only when configured) */}
          {status === "configured" && (
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">Send a test code</CardTitle>
                <CardDescription>Use your own number in E.164 format (e.g. +919876543210).</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  type="tel"
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  placeholder="+919876543210"
                />
                <Button className="w-full" onClick={sendTest} disabled={testing}>
                  {testing ? "Sending..." : "Send test SMS"}
                </Button>
                <p className="text-xs text-muted-foreground">
                  Note: This consumes one SMS credit on your provider account.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminSmsStatus;
