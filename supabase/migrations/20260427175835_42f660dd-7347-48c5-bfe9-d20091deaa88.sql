CREATE TABLE public.survivor_intakes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  preferred_name TEXT,
  age_range TEXT,
  pronouns TEXT,
  languages TEXT,
  current_situation TEXT,
  safety_status TEXT,
  living_situation TEXT,
  has_children BOOLEAN DEFAULT false,
  immediate_needs TEXT[] DEFAULT '{}',
  support_types_needed TEXT[] DEFAULT '{}',
  prior_counseling BOOLEAN DEFAULT false,
  medical_concerns TEXT,
  legal_concerns TEXT,
  preferred_session_mode TEXT,
  preferred_contact_time TEXT,
  additional_notes TEXT,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.survivor_intakes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own intake"
  ON public.survivor_intakes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Counsellors can view all intakes"
  ON public.survivor_intakes FOR SELECT
  USING (public.has_role(auth.uid(), 'counsellor'::app_role));

CREATE POLICY "Admins can view all intakes"
  ON public.survivor_intakes FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can create own intake"
  ON public.survivor_intakes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own intake"
  ON public.survivor_intakes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own intake"
  ON public.survivor_intakes FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER update_survivor_intakes_updated_at
  BEFORE UPDATE ON public.survivor_intakes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();