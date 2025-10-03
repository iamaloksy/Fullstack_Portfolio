-- Soften RLS to allow authenticated users to manage content (temporary fix)
-- This will let you add certificates, projects, skills, experience, education from admin panel

-- ABOUT ME
DROP POLICY IF EXISTS "Authenticated can insert about_me" ON public.about_me;
DROP POLICY IF EXISTS "Authenticated can update about_me" ON public.about_me;
DROP POLICY IF EXISTS "Authenticated can delete about_me" ON public.about_me;
CREATE POLICY "Authenticated can insert about_me" ON public.about_me
  FOR INSERT TO authenticated
  WITH CHECK (true);
CREATE POLICY "Authenticated can update about_me" ON public.about_me
  FOR UPDATE TO authenticated
  USING (true);
CREATE POLICY "Authenticated can delete about_me" ON public.about_me
  FOR DELETE TO authenticated
  USING (true);

-- CERTIFICATIONS
DROP POLICY IF EXISTS "Authenticated can insert certifications" ON public.certifications;
DROP POLICY IF EXISTS "Authenticated can update certifications" ON public.certifications;
DROP POLICY IF EXISTS "Authenticated can delete certifications" ON public.certifications;
CREATE POLICY "Authenticated can insert certifications" ON public.certifications
  FOR INSERT TO authenticated
  WITH CHECK (true);
CREATE POLICY "Authenticated can update certifications" ON public.certifications
  FOR UPDATE TO authenticated
  USING (true);
CREATE POLICY "Authenticated can delete certifications" ON public.certifications
  FOR DELETE TO authenticated
  USING (true);

-- CONTACT INFO (manage from admin)
DROP POLICY IF EXISTS "Authenticated can insert contact_info" ON public.contact_info;
DROP POLICY IF EXISTS "Authenticated can update contact_info" ON public.contact_info;
DROP POLICY IF EXISTS "Authenticated can delete contact_info" ON public.contact_info;
CREATE POLICY "Authenticated can insert contact_info" ON public.contact_info
  FOR INSERT TO authenticated
  WITH CHECK (true);
CREATE POLICY "Authenticated can update contact_info" ON public.contact_info
  FOR UPDATE TO authenticated
  USING (true);
CREATE POLICY "Authenticated can delete contact_info" ON public.contact_info
  FOR DELETE TO authenticated
  USING (true);

-- EDUCATION
DROP POLICY IF EXISTS "Authenticated can insert education" ON public.education;
DROP POLICY IF EXISTS "Authenticated can update education" ON public.education;
DROP POLICY IF EXISTS "Authenticated can delete education" ON public.education;
CREATE POLICY "Authenticated can insert education" ON public.education
  FOR INSERT TO authenticated
  WITH CHECK (true);
CREATE POLICY "Authenticated can update education" ON public.education
  FOR UPDATE TO authenticated
  USING (true);
CREATE POLICY "Authenticated can delete education" ON public.education
  FOR DELETE TO authenticated
  USING (true);

-- EXPERIENCE
DROP POLICY IF EXISTS "Authenticated can insert experience" ON public.experience;
DROP POLICY IF EXISTS "Authenticated can update experience" ON public.experience;
DROP POLICY IF EXISTS "Authenticated can delete experience" ON public.experience;
CREATE POLICY "Authenticated can insert experience" ON public.experience
  FOR INSERT TO authenticated
  WITH CHECK (true);
CREATE POLICY "Authenticated can update experience" ON public.experience
  FOR UPDATE TO authenticated
  USING (true);
CREATE POLICY "Authenticated can delete experience" ON public.experience
  FOR DELETE TO authenticated
  USING (true);

-- PROJECTS
DROP POLICY IF EXISTS "Authenticated can insert projects" ON public.projects;
DROP POLICY IF EXISTS "Authenticated can update projects" ON public.projects;
DROP POLICY IF EXISTS "Authenticated can delete projects" ON public.projects;
CREATE POLICY "Authenticated can insert projects" ON public.projects
  FOR INSERT TO authenticated
  WITH CHECK (true);
CREATE POLICY "Authenticated can update projects" ON public.projects
  FOR UPDATE TO authenticated
  USING (true);
CREATE POLICY "Authenticated can delete projects" ON public.projects
  FOR DELETE TO authenticated
  USING (true);

-- SKILLS
DROP POLICY IF EXISTS "Authenticated can insert skills" ON public.skills;
DROP POLICY IF EXISTS "Authenticated can update skills" ON public.skills;
DROP POLICY IF EXISTS "Authenticated can delete skills" ON public.skills;
CREATE POLICY "Authenticated can insert skills" ON public.skills
  FOR INSERT TO authenticated
  WITH CHECK (true);
CREATE POLICY "Authenticated can update skills" ON public.skills
  FOR UPDATE TO authenticated
  USING (true);
CREATE POLICY "Authenticated can delete skills" ON public.skills
  FOR DELETE TO authenticated
  USING (true);
