import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Search,
  Phone,
  Mail,
  Stethoscope,
  Calendar,
  Clock,
  User,
  Star,
  GraduationCap,
  Languages,
  Building2,
  Wallet,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Doctors = () => {
  const [search, setSearch] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [appointmentNotes, setAppointmentNotes] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: doctors, isLoading } = useQuery({
    queryKey: ["doctors"],
    queryFn: async () => {
      const { data, error } = await supabase.from("doctors").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: myAppointments } = useQuery({
    queryKey: ["my-doctor-appointments"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data, error } = await supabase
        .from("doctor_appointments")
        .select("*, doctors(name, specialization)")
        .eq("user_id", user.id)
        .order("appointment_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const bookAppointment = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        throw new Error("Please sign in to book an appointment");
      }
      if (!selectedDoctor || !appointmentDate || !appointmentTime) {
        throw new Error("Please fill in all required fields");
      }
      const { error } = await supabase.from("doctor_appointments").insert({
        user_id: user.id,
        doctor_id: selectedDoctor,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        notes: appointmentNotes || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Appointment booked successfully!");
      setDialogOpen(false);
      setAppointmentDate("");
      setAppointmentTime("");
      setAppointmentNotes("");
      setSelectedDoctor(null);
      queryClient.invalidateQueries({ queryKey: ["my-doctor-appointments"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const filtered = doctors?.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.specialization.toLowerCase().includes(search.toLowerCase()) ||
      (d.bio && d.bio.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Layout>
      <div className="bg-gradient-to-b from-lavender/30 to-background py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <Stethoscope className="w-10 h-10 text-primary mx-auto mb-3" />
            <h1 className="font-heading text-3xl font-bold mb-2">Medical & Counselling Support</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Trusted doctors, psychiatrists and counsellors who specialise in supporting survivors. Book a confidential consultation.
            </p>
          </div>

          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, specialization..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {isLoading ? (
            <p className="text-center text-muted-foreground">Loading doctors...</p>
          ) : (
            <div className="max-w-4xl mx-auto grid gap-6 md:grid-cols-2">
              {filtered?.map((doctor) => (
                <Card key={doctor.id} className="border-border/50 hover:border-primary/30 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <User className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg font-heading">{doctor.name}</CardTitle>
                        <Badge variant="secondary" className="mt-1">{doctor.specialization}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Star className="w-4 h-4 text-primary" />
                      <span>{doctor.years_experience} years experience</span>
                    </div>

                    {doctor.bio && (
                      <p className="text-sm text-muted-foreground leading-relaxed">{doctor.bio}</p>
                    )}

                    <div className="grid grid-cols-1 gap-1 text-xs text-muted-foreground">
                      {doctor.qualifications && (
                        <div className="flex items-start gap-2"><GraduationCap className="w-3.5 h-3.5 mt-0.5 shrink-0" /><span>{doctor.qualifications}</span></div>
                      )}
                      {doctor.languages && (
                        <div className="flex items-start gap-2"><Languages className="w-3.5 h-3.5 mt-0.5 shrink-0" /><span>{doctor.languages}</span></div>
                      )}
                      {doctor.hospital && (
                        <div className="flex items-start gap-2"><Building2 className="w-3.5 h-3.5 mt-0.5 shrink-0" /><span>{doctor.hospital}</span></div>
                      )}
                      {doctor.fees && (
                        <div className="flex items-start gap-2"><Wallet className="w-3.5 h-3.5 mt-0.5 shrink-0" /><span>{doctor.fees}</span></div>
                      )}
                      {doctor.availability && (
                        <div className="flex items-start gap-2"><Clock className="w-3.5 h-3.5 mt-0.5 shrink-0" /><span>{doctor.availability}</span></div>
                      )}
                      {doctor.address && (
                        <div className="flex items-start gap-2"><MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" /><span>{doctor.address}</span></div>
                      )}
                    </div>

                    <div className="space-y-1">
                      {doctor.phone && (
                        <a href={`tel:${doctor.phone}`} className="flex items-center gap-2 text-sm text-primary hover:underline">
                          <Phone className="w-4 h-4" /> {doctor.phone}
                        </a>
                      )}
                      {doctor.email && (
                        <a href={`mailto:${doctor.email}`} className="flex items-center gap-2 text-sm text-primary hover:underline">
                          <Mail className="w-4 h-4" /> {doctor.email}
                        </a>
                      )}
                    </div>

                    <div className="flex items-center justify-end pt-2">
                      <Dialog open={dialogOpen && selectedDoctor === doctor.id} onOpenChange={(open) => {
                        setDialogOpen(open);
                        if (open) setSelectedDoctor(doctor.id);
                      }}>
                        <DialogTrigger asChild>
                          <Button size="sm">
                            <Calendar className="w-4 h-4 mr-1" /> Book Appointment
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Book Appointment with {doctor.name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 pt-2">
                            <div>
                              <label className="text-sm font-medium">Date *</label>
                              <Input
                                type="date"
                                value={appointmentDate}
                                onChange={(e) => setAppointmentDate(e.target.value)}
                                min={new Date().toISOString().split("T")[0]}
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Time *</label>
                              <Input
                                type="time"
                                value={appointmentTime}
                                onChange={(e) => setAppointmentTime(e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Notes (optional)</label>
                              <Textarea
                                placeholder="Briefly describe what you need help with..."
                                value={appointmentNotes}
                                onChange={(e) => setAppointmentNotes(e.target.value)}
                                maxLength={500}
                              />
                            </div>
                            <Button
                              className="w-full"
                              onClick={() => bookAppointment.mutate()}
                              disabled={bookAppointment.isPending}
                            >
                              {bookAppointment.isPending ? "Booking..." : "Confirm Appointment"}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {myAppointments && myAppointments.length > 0 && (
            <div className="max-w-3xl mx-auto mt-12">
              <h2 className="font-heading text-2xl font-bold mb-4 flex items-center gap-2">
                <Clock className="w-6 h-6 text-primary" /> My Doctor Appointments
              </h2>
              <div className="space-y-3">
                {myAppointments.map((apt: any) => (
                  <Card key={apt.id} className="border-border/50">
                    <CardContent className="py-4 flex items-center justify-between gap-4 flex-wrap">
                      <div>
                        <p className="font-medium">{apt.doctors?.name}</p>
                        <p className="text-sm text-muted-foreground">{apt.doctors?.specialization}</p>
                        {apt.notes && <p className="text-xs text-muted-foreground mt-1">{apt.notes}</p>}
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {new Date(apt.appointment_date).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short", year: "numeric",
                          })}
                        </p>
                        <p className="text-xs text-muted-foreground">{apt.appointment_time}</p>
                        <Badge variant={apt.status === "pending" ? "secondary" : apt.status === "confirmed" ? "default" : "outline"} className="mt-1">
                          {apt.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Doctors;