
CREATE TABLE IF NOT EXISTS public.support_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  recipient_service TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  preferred_contact TEXT NOT NULL DEFAULT 'phone',
  contact_value TEXT,
  status TEXT NOT NULL DEFAULT 'sent',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own support messages"
  ON public.support_messages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own support messages"
  ON public.support_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own support messages"
  ON public.support_messages FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own support messages"
  ON public.support_messages FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all support messages"
  ON public.support_messages FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_support_messages_updated_at
  BEFORE UPDATE ON public.support_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
