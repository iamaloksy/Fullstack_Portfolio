-- Phase 1: Create contact_info table for personal data protection
CREATE TABLE public.contact_info (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT,
  phone TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on contact_info (admin only access)
ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;

-- Phase 2: Create proper role-based access control system
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles safely
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create updated_at trigger for contact_info
CREATE TRIGGER update_contact_info_updated_at
  BEFORE UPDATE ON public.contact_info
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for contact_info (admin only)
CREATE POLICY "Admin can manage contact_info"
  ON public.contact_info
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admin can manage all user roles"
  ON public.user_roles
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Update existing RLS policies to use new role system
DROP POLICY IF EXISTS "Admin can manage about_me" ON public.about_me;
DROP POLICY IF EXISTS "Admin can manage certifications" ON public.certifications;
DROP POLICY IF EXISTS "Admin can manage education" ON public.education;
DROP POLICY IF EXISTS "Admin can manage experience" ON public.experience;
DROP POLICY IF EXISTS "Admin can manage projects" ON public.projects;
DROP POLICY IF EXISTS "Admin can manage skills" ON public.skills;
DROP POLICY IF EXISTS "Admin can view contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admin can update contact messages" ON public.contact_messages;

-- Create new RLS policies using has_role function
CREATE POLICY "Admin can manage about_me"
  ON public.about_me
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can manage certifications"
  ON public.certifications
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can manage education"
  ON public.education
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can manage experience"
  ON public.experience
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can manage projects"
  ON public.projects
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can manage skills"
  ON public.skills
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can view contact messages"
  ON public.contact_messages
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can update contact messages"
  ON public.contact_messages
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Migrate existing admin user to new roles system
INSERT INTO public.user_roles (user_id, role)
SELECT user_id, 'admin'::app_role
FROM public.profiles
WHERE role = 'admin'
ON CONFLICT (user_id, role) DO NOTHING;

-- Remove sensitive personal data from about_me table (after backing up to contact_info)
-- First backup existing data before dropping columns
INSERT INTO public.contact_info (email, phone, location)
SELECT email, phone, location
FROM public.about_me
WHERE email IS NOT NULL OR phone IS NOT NULL OR location IS NOT NULL
LIMIT 1;

-- Now drop the sensitive columns
ALTER TABLE public.about_me DROP COLUMN IF EXISTS email;
ALTER TABLE public.about_me DROP COLUMN IF EXISTS phone;
ALTER TABLE public.about_me DROP COLUMN IF EXISTS location;