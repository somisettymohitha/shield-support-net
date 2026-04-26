import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setEmail(session.user.email ?? "");
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, phone")
        .eq("user_id", session.user.id)
        .maybeSingle();
      if (error) {
        toast({ title: "Error loading profile", description: error.message, variant: "destructive" });
      } else if (data) {
        setFullName(data.full_name ?? "");
        setPhone(data.phone ?? "");
      }
      setLoading(false);
    };
    load();
  }, [navigate, toast]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName, phone })
        .eq("user_id", session.user.id);
      if (error) throw error;
      toast({ title: "Profile updated" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto max-w-2xl py-12 px-4">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-2xl">Profile Settings</CardTitle>
            <CardDescription>View and update your account details.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground text-sm">Loading...</p>
            ) : (
              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={email} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 9876543210" />
                </div>
                <Button type="submit" className="w-full" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Profile;