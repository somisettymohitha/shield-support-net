ALTER TABLE public.support_messages
  ADD COLUMN IF NOT EXISTS direction text NOT NULL DEFAULT 'outgoing',
  ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES public.support_messages(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_support_messages_user_recipient
  ON public.support_messages(user_id, recipient_service);

CREATE INDEX IF NOT EXISTS idx_support_messages_parent
  ON public.support_messages(parent_id);