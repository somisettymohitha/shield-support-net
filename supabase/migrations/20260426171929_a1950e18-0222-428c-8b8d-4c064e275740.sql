
-- Expand advocates with extra professional info
ALTER TABLE public.advocates
  ADD COLUMN IF NOT EXISTS qualifications TEXT,
  ADD COLUMN IF NOT EXISTS languages TEXT,
  ADD COLUMN IF NOT EXISTS court TEXT,
  ADD COLUMN IF NOT EXISTS fees TEXT,
  ADD COLUMN IF NOT EXISTS availability TEXT,
  ADD COLUMN IF NOT EXISTS address TEXT;

-- Doctors table (medical / psychological support)
CREATE TABLE IF NOT EXISTS public.doctors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  specialization TEXT NOT NULL,
  qualifications TEXT,
  languages TEXT,
  hospital TEXT,
  address TEXT,
  fees TEXT,
  availability TEXT,
  phone TEXT,
  email TEXT,
  bio TEXT,
  years_experience INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Doctors are viewable by everyone"
  ON public.doctors FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert doctors"
  ON public.doctors FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update doctors"
  ON public.doctors FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete doctors"
  ON public.doctors FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_doctors_updated_at
  BEFORE UPDATE ON public.doctors
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Doctor appointments
CREATE TABLE IF NOT EXISTS public.doctor_appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  appointment_date DATE NOT NULL,
  appointment_time TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.doctor_appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own doctor appointments"
  ON public.doctor_appointments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own doctor appointments"
  ON public.doctor_appointments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own doctor appointments"
  ON public.doctor_appointments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own doctor appointments"
  ON public.doctor_appointments FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER update_doctor_appointments_updated_at
  BEFORE UPDATE ON public.doctor_appointments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
