import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type AuthView = "signin" | "signup" | "forgot" | "reset";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const [view, setView] = useState<AuthView>(
    searchParams.get("tab") === "signup" ? "signup" : "signin"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("victim");
  const [loading, setLoading] = useState(false);
  const [signInMethod, setSignInMethod] = useState<"email" | "phone">("email");
  const [phoneLogin, setPhoneLogin] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if this is a password recovery redirect
  useState(() => {
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setView("reset");
    }
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast({ title: "Welcome back!" });
      navigate("/dashboard");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // Cooldown ticker for resend OTP button
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const sendOtp = async () => {
    if (!phoneLogin.startsWith("+")) {
      const msg = "Phone number must start with country code, e.g. +91...";
      setOtpError(msg);
      toast({ title: "Invalid number", description: msg, variant: "destructive" });
      return;
    }
    setLoading(true);
    setOtpError(null);
    try {
      const { error } = await supabase.auth.signInWithOtp({ phone: phoneLogin });
      if (error) throw error;
      setOtpSent(true);
      setResendCooldown(45);
      toast({ title: "Code sent!", description: "Check your phone for the verification code." });
    } catch (error: any) {
      const msg = (error?.message || "").toLowerCase();
      const providerNotConfigured =
        msg.includes("sms") ||
        msg.includes("provider") ||
        msg.includes("phone") ||
        msg.includes("not enabled") ||
        msg.includes("disabled") ||
        msg.includes("unsupported") ||
        error?.status === 422 ||
        error?.status === 500 ||
        error?.status === 501;
      const rateLimited = msg.includes("rate") || msg.includes("too many") || error?.status === 429;
      const friendly = providerNotConfigured
        ? "Phone sign-in isn't available right now because an SMS provider hasn't been set up for this app. Please use email sign-in, or ask the admin to configure an SMS provider (e.g. Twilio) in the backend Auth settings."
        : rateLimited
        ? "Too many requests. Please wait a minute before trying again."
        : error?.message || "Could not send verification code.";
      setOtpError(friendly);
      if (rateLimited) setResendCooldown(60);
      toast({ title: "Couldn't send code", description: friendly, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendOtp();
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || loading) return;
    setOtpCode("");
    await sendOtp();
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setOtpError(null);
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone: phoneLogin,
        token: otpCode,
        type: "sms",
      });
      if (error) throw error;
      toast({ title: "Welcome back!" });
      navigate("/dashboard");
    } catch (error: any) {
      const friendly = error?.message?.includes("expired")
        ? "That code has expired. Please request a new one."
        : error?.message?.toLowerCase().includes("invalid")
        ? "That code didn't match. Double-check and try again."
        : error?.message || "Could not verify code.";
      setOtpError(friendly);
      toast({ title: "Verification failed", description: friendly, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: { full_name: fullName, role, phone },
        },
      });
      if (error) throw error;
      toast({ title: "Account created!", description: "You can now sign in with your credentials." });
      setView("signin");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth#type=recovery`,
      });
      if (error) throw error;
      toast({
        title: "Reset link sent!",
        description: "Check your email for a password reset link.",
      });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast({ title: "Password updated!", description: "You can now sign in with your new password." });
      setView("signin");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (view) {
      case "signup": return "Create Your Account";
      case "forgot": return "Forgot Password";
      case "reset": return "Set New Password";
      default: return "Welcome Back";
    }
  };

  const getDescription = () => {
    switch (view) {
      case "signup": return "Sign up to access support resources and connect with professionals.";
      case "forgot": return "Enter your email and we'll send you a reset link.";
      case "reset": return "Enter your new password below.";
      default: return "Sign in to continue to your dashboard.";
    }
  };

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="font-heading text-2xl">{getTitle()}</CardTitle>
            <CardDescription>{getDescription()}</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Sign In */}
            {view === "signin" && (
              <Tabs value={signInMethod} onValueChange={(v) => { setSignInMethod(v as "email" | "phone"); setOtpSent(false); }} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="email">Email</TabsTrigger>
                  <TabsTrigger value="phone">Phone</TabsTrigger>
                </TabsList>

                <TabsContent value="email">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <button type="button" onClick={() => setView("forgot")} className="text-xs text-primary hover:underline">
                          Forgot password?
                        </button>
                      </div>
                      <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Please wait..." : "Sign In"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="phone">
                  {otpError && (
                    <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm space-y-2">
                      <p className="font-medium text-destructive">{otpError}</p>
                      <details className="text-xs text-muted-foreground">
                        <summary className="cursor-pointer hover:text-foreground">Troubleshooting tips</summary>
                        <ul className="mt-2 ml-4 list-disc space-y-1">
                          <li>Use the <button type="button" className="text-primary underline" onClick={() => { setSignInMethod("email"); setOtpError(null); }}>Email tab</button> to sign in instead.</li>
                          <li>Make sure your number includes the country code (e.g. <span className="font-mono">+91</span> for India) with no spaces or dashes.</li>
                          <li>Phone sign-in needs an SMS provider (such as Twilio) configured in the app's backend Auth settings. If you're the admin, enable it in Cloud → Users → Auth Settings → Phone provider.</li>
                          <li>If a code was sent, it can take up to a minute to arrive. Wait, then request a new one.</li>
                        </ul>
                      </details>
                    </div>
                  )}
                  {!otpSent ? (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="phoneLogin">Phone Number</Label>
                        <Input id="phoneLogin" type="tel" value={phoneLogin} onChange={e => setPhoneLogin(e.target.value)} placeholder="+91 9876543210" required />
                        <p className="text-xs text-muted-foreground">Include country code (e.g. +91 for India).</p>
                      </div>
                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Sending..." : "Send Verification Code"}
                      </Button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="otpCode">Verification Code</Label>
                        <Input id="otpCode" inputMode="numeric" value={otpCode} onChange={e => setOtpCode(e.target.value)} placeholder="6-digit code" required />
                        <p className="text-xs text-muted-foreground">Sent to {phoneLogin}</p>
                      </div>
                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Verifying..." : "Verify & Sign In"}
                      </Button>
                      <div className="flex items-center justify-between text-xs">
                        <button
                          type="button"
                          onClick={() => { setOtpSent(false); setOtpCode(""); setOtpError(null); }}
                          className="text-primary hover:underline"
                        >
                          Use a different number
                        </button>
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          disabled={resendCooldown > 0 || loading}
                          className="text-primary hover:underline disabled:text-muted-foreground disabled:no-underline disabled:cursor-not-allowed"
                        >
                          {loading
                            ? "Sending..."
                            : resendCooldown > 0
                            ? `Resend in ${resendCooldown}s`
                            : "Resend code"}
                        </button>
                      </div>
                    </form>
                  )}
                </TabsContent>
              </Tabs>
            )}

            {/* Sign Up */}
            {view === "signup" && (
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 9876543210" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">I am a</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="victim">Victim / Survivor</SelectItem>
                      <SelectItem value="counsellor">Counsellor</SelectItem>
                      <SelectItem value="legal_advisor">Legal Advisor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Please wait..." : "Create Account"}
                </Button>
              </form>
            )}

            {/* Forgot Password */}
            {view === "forgot" && (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            )}

            {/* Reset Password */}
            {view === "reset" && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input id="confirmPassword" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Updating..." : "Update Password"}
                </Button>
              </form>
            )}

            {/* Footer links */}
            <div className="mt-4 text-center text-sm text-muted-foreground">
              {view === "signin" && (
                <>Don't have an account?{" "}<button onClick={() => setView("signup")} className="text-primary font-medium hover:underline">Sign Up</button></>
              )}
              {view === "signup" && (
                <>Already have an account?{" "}<button onClick={() => setView("signin")} className="text-primary font-medium hover:underline">Sign In</button></>
              )}
              {(view === "forgot" || view === "reset") && (
                <button onClick={() => setView("signin")} className="text-primary font-medium hover:underline">Back to Sign In</button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Auth;
