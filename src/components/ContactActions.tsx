import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, MessageSquare, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface ContactActionsProps {
  recipientName: string;
  recipientService: "advocate" | "doctor";
  recipientId: string;
  phone?: string | null;
}

export const ContactActions = ({ recipientName, recipientService, recipientId, phone }: ContactActionsProps) => {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const sendMessage = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        throw new Error("Please sign in to send a message");
      }
      if (!subject.trim() || !message.trim()) throw new Error("Subject and message are required");
      const { error } = await supabase.from("support_messages").insert({
        user_id: user.id,
        recipient_service: `${recipientService}:${recipientId}`,
        subject: subject.trim().slice(0, 200),
        message: message.trim().slice(0, 2000),
        preferred_contact: "in_app",
        status: "sent",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(`Message sent to ${recipientName}`);
      setOpen(false);
      setSubject("");
      setMessage("");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="flex gap-2 flex-wrap">
      {phone && (
        <Button size="sm" variant="outline" asChild>
          <a href={`tel:${phone}`}>
            <Phone className="w-4 h-4 mr-1" /> Call
          </a>
        </Button>
      )}
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        <MessageSquare className="w-4 h-4 mr-1" /> Message
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Message {recipientName}</DialogTitle>
            <DialogDescription>
              Your message is private and shared securely. They'll respond via your preferred contact method.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            <div>
              <label className="text-sm font-medium">Subject *</label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief subject"
                maxLength={200}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Message *</label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message..."
                rows={5}
                maxLength={2000}
              />
            </div>
            <Button className="w-full" onClick={() => sendMessage.mutate()} disabled={sendMessage.isPending}>
              {sendMessage.isPending ? "Sending..." : "Send Message"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  details: { label: string; value: string }[];
}

export const ConfirmationDialog = ({ open, onOpenChange, title, details }: ConfirmationDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <div className="flex items-center justify-center mb-3">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-primary" />
          </div>
        </div>
        <DialogTitle className="text-center">{title}</DialogTitle>
        <DialogDescription className="text-center">
          You'll be contacted to confirm. Check "My Appointments" below for status updates.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-2 pt-2 border-t">
        {details.map((d) => (
          <div key={d.label} className="flex justify-between text-sm">
            <span className="text-muted-foreground">{d.label}</span>
            <span className="font-medium text-right">{d.value}</span>
          </div>
        ))}
      </div>
      <Button className="w-full mt-2" onClick={() => onOpenChange(false)}>Done</Button>
    </DialogContent>
  </Dialog>
);