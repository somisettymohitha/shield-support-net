import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Inbox as InboxIcon, MessageSquare, Send, ArrowLeft, Stethoscope, Briefcase } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

type Msg = {
  id: string;
  user_id: string;
  recipient_service: string;
  subject: string;
  message: string;
  direction: string;
  parent_id: string | null;
  created_at: string;
};

type Thread = {
  key: string;
  service: "doctor" | "advocate" | "other";
  recipientId: string;
  recipientName: string;
  messages: Msg[];
  lastAt: string;
  unread: number;
};

const Inbox = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [reply, setReply] = useState("");

  const { data: userId } = useQuery({
    queryKey: ["auth-user-id"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return null;
      }
      return user.id;
    },
  });

  const { data: messages, isLoading } = useQuery({
    queryKey: ["inbox-messages", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("support_messages")
        .select("id, user_id, recipient_service, subject, message, direction, parent_id, created_at")
        .eq("user_id", userId!)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data as Msg[];
    },
  });

  const { data: directory } = useQuery({
    queryKey: ["inbox-directory"],
    queryFn: async () => {
      const [doctors, advocates] = await Promise.all([
        supabase.from("doctors").select("id, name"),
        supabase.from("advocates").select("id, name"),
      ]);
      const map: Record<string, string> = {};
      doctors.data?.forEach((d) => (map[`doctor:${d.id}`] = d.name));
      advocates.data?.forEach((a) => (map[`advocate:${a.id}`] = a.name));
      return map;
    },
  });

  const threads: Thread[] = useMemo(() => {
    if (!messages) return [];
    const grouped: Record<string, Msg[]> = {};
    for (const m of messages) {
      const key = m.recipient_service;
      (grouped[key] ||= []).push(m);
    }
    return Object.entries(grouped)
      .map(([key, msgs]) => {
        const [service, id] = key.includes(":") ? key.split(":") : ["other", key];
        const lookup = directory?.[key];
        return {
          key,
          service: (service as Thread["service"]) || "other",
          recipientId: id,
          recipientName: lookup || (service === "other" ? key : "Unknown"),
          messages: msgs,
          lastAt: msgs[msgs.length - 1].created_at,
          unread: msgs.filter((m) => m.direction === "incoming").length, // placeholder
        };
      })
      .sort((a, b) => +new Date(b.lastAt) - +new Date(a.lastAt));
  }, [messages, directory]);

  const activeThread = threads.find((t) => t.key === activeKey);

  const sendReply = useMutation({
    mutationFn: async () => {
      if (!activeThread || !userId) throw new Error("No active thread");
      if (!reply.trim()) throw new Error("Message cannot be empty");
      const last = activeThread.messages[activeThread.messages.length - 1];
      const { error } = await supabase.from("support_messages").insert({
        user_id: userId,
        recipient_service: activeThread.key,
        subject: `Re: ${last.subject}`.slice(0, 200),
        message: reply.trim().slice(0, 2000),
        preferred_contact: "in_app",
        direction: "outgoing",
        parent_id: last.id,
        status: "sent",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Reply sent");
      setReply("");
      queryClient.invalidateQueries({ queryKey: ["inbox-messages", userId] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const ServiceIcon = ({ service }: { service: Thread["service"] }) =>
    service === "doctor" ? (
      <Stethoscope className="w-5 h-5 text-primary" />
    ) : service === "advocate" ? (
      <Briefcase className="w-5 h-5 text-primary" />
    ) : (
      <MessageSquare className="w-5 h-5 text-primary" />
    );

  return (
    <Layout>
      <div className="bg-gradient-to-b from-lavender/30 to-background py-12 min-h-[calc(100vh-4rem)]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <InboxIcon className="w-10 h-10 text-primary mx-auto mb-3" />
            <h1 className="font-heading text-3xl font-bold mb-2">Messages</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Your private conversations with doctors and advocates.
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid md:grid-cols-[320px_1fr] gap-4">
            {/* Thread list */}
            <Card className={`border-border/50 ${activeKey ? "hidden md:block" : ""}`}>
              <CardContent className="p-0">
                {isLoading ? (
                  <p className="p-6 text-sm text-muted-foreground text-center">Loading...</p>
                ) : threads.length === 0 ? (
                  <div className="p-6 text-center space-y-3">
                    <p className="text-sm text-muted-foreground">No messages yet.</p>
                    <div className="flex flex-col gap-2">
                      <Button size="sm" variant="outline" onClick={() => navigate("/doctors")}>
                        Message a Doctor
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => navigate("/advocates")}>
                        Message an Advocate
                      </Button>
                    </div>
                  </div>
                ) : (
                  <ul className="divide-y divide-border">
                    {threads.map((t) => (
                      <li key={t.key}>
                        <button
                          onClick={() => setActiveKey(t.key)}
                          className={`w-full text-left p-4 hover:bg-muted/50 transition-colors flex gap-3 items-start ${
                            activeKey === t.key ? "bg-muted/40" : ""
                          }`}
                        >
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <ServiceIcon service={t.service} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="font-medium text-sm truncate">{t.recipientName}</p>
                              <span className="text-xs text-muted-foreground shrink-0">
                                {new Date(t.lastAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground truncate">
                              {t.messages[t.messages.length - 1].message}
                            </p>
                            <Badge variant="secondary" className="mt-1 text-[10px] capitalize">{t.service}</Badge>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            {/* Thread view */}
            <Card className={`border-border/50 ${!activeKey ? "hidden md:block" : ""}`}>
              <CardContent className="p-0 flex flex-col h-[600px]">
                {!activeThread ? (
                  <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground p-6 text-center">
                    Select a conversation to view messages.
                  </div>
                ) : (
                  <>
                    <div className="border-b border-border p-4 flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setActiveKey(null)}
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </Button>
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <ServiceIcon service={activeThread.service} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium truncate">{activeThread.recipientName}</p>
                        <p className="text-xs text-muted-foreground capitalize">{activeThread.service}</p>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      {activeThread.messages.map((m) => {
                        const mine = m.direction !== "incoming";
                        return (
                          <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                            <div
                              className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                                mine
                                  ? "bg-primary text-primary-foreground rounded-br-sm"
                                  : "bg-muted text-foreground rounded-bl-sm"
                              }`}
                            >
                              {m.subject && !m.subject.startsWith("Re:") && (
                                <p className="text-xs font-semibold mb-1 opacity-90">{m.subject}</p>
                              )}
                              <p className="text-sm whitespace-pre-wrap break-words">{m.message}</p>
                              <p className={`text-[10px] mt-1 ${mine ? "opacity-70" : "text-muted-foreground"}`}>
                                {new Date(m.created_at).toLocaleString("en-IN", {
                                  day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="border-t border-border p-3 flex gap-2 items-end">
                      <Textarea
                        placeholder="Write a reply..."
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        rows={2}
                        maxLength={2000}
                        className="resize-none"
                      />
                      <Button
                        onClick={() => sendReply.mutate()}
                        disabled={sendReply.isPending || !reply.trim()}
                        size="icon"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Inbox;