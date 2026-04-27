import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Upload, FileText, Phone, Heart, Scale, Users, LogOut, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/auth");
      else setUser(session.user);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Signed out successfully" });
    navigate("/");
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </Layout>
    );
  }

  const role = user?.user_metadata?.role || "victim";
  const name = user?.user_metadata?.full_name || "there";

  return (
    <Layout>
      <div className="bg-gradient-to-b from-lavender/20 to-background py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-heading text-2xl font-bold">Welcome, {name}</h1>
              <p className="text-sm text-muted-foreground capitalize">Role: {role.replace("_", " ")}</p>
            </div>
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut className="w-4 h-4" /> Sign Out
            </Button>
          </div>

          {/* Victim Dashboard */}
          {role === "victim" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <DashCard icon={Upload} title="Upload Evidence" desc="Securely upload photos or videos as evidence." color="text-lavender-dark" link="/file-fir" />
              <DashCard icon={FileText} title="File an FIR" desc="Step-by-step guide and online portals." color="text-primary" link="/file-fir" />
              <DashCard icon={Phone} title="Contact Police" desc="One-tap emergency calls." color="text-destructive" link="/contact-police" />
              <DashCard icon={ClipboardList} title="Personal Intake Form" desc="Share details so a counselor can support you better." color="text-primary" link="/intake" />
              <DashCard icon={Heart} title="Request Counseling" desc="Connect with a trauma counsellor." color="text-lavender-dark" link="/counseling" />
              <DashCard icon={Scale} title="Know Your Rights" desc="Indian laws that protect you." color="text-primary" link="/know-your-rights" />
              <DashCard icon={Users} title="Support Resources" desc="Shelters, NGOs, and helplines." color="text-warm-dark" link="/resources" />
            </div>
          )}

          {/* Counsellor Dashboard */}
          {role === "counsellor" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="font-heading">Assigned Cases</CardTitle>
                  <CardDescription>View and manage your assigned survivor cases.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">No cases assigned yet. Cases will appear here when survivors request counseling.</p>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="font-heading">Session Notes</CardTitle>
                  <CardDescription>Track progress and add session notes.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Session notes will appear here as you work with survivors.</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Legal Advisor Dashboard */}
          {role === "legal_advisor" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="font-heading">Legal Resources</CardTitle>
                  <CardDescription>Add and update legal information and laws.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">You can manage legal resources from here.</p>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="font-heading">Case Assistance</CardTitle>
                  <CardDescription>Assist survivors with legal actions and advice.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Pending legal assistance requests will appear here.</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

const DashCard = ({ icon: Icon, title, desc, color, link }: { icon: any; title: string; desc: string; color: string; link: string }) => {
  const navigate = useNavigate();
  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow border-border/50 hover:border-primary/30" onClick={() => navigate(link)}>
      <CardContent className="p-6">
        <Icon className={`w-8 h-8 ${color} mb-3`} />
        <h3 className="font-heading font-bold mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </CardContent>
    </Card>
  );
};

export default Dashboard;
