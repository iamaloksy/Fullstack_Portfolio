-- Fix RLS policies to allow admin operations
-- This fixes the "new row violates row level security policy" errors

-- Drop existing policies that might be too restrictive
DROP POLICY IF EXISTS "Admin can manage about_me" ON about_me;
DROP POLICY IF EXISTS "Admin can manage certifications" ON certifications;
DROP POLICY IF EXISTS "Admin can manage contact_info" ON contact_info;
DROP POLICY IF EXISTS "Admin can manage education" ON education;
DROP POLICY IF EXISTS "Admin can manage experience" ON experience;
DROP POLICY IF EXISTS "Admin can manage projects" ON projects;
DROP POLICY IF EXISTS "Admin can manage skills" ON skills;
DROP POLICY IF EXISTS "Admin can manage user_roles" ON user_roles;

-- Create granular RLS policies for INSERT, UPDATE, DELETE operations
-- About Me table
CREATE POLICY "Admins can insert about_me" ON about_me
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update about_me" ON about_me
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete about_me" ON about_me
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Certifications table  
CREATE POLICY "Admins can insert certifications" ON certifications
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update certifications" ON certifications
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete certifications" ON certifications
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Contact Info table
CREATE POLICY "Admins can insert contact_info" ON contact_info
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update contact_info" ON contact_info
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete contact_info" ON contact_info
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Education table
CREATE POLICY "Admins can insert education" ON education
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update education" ON education
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete education" ON education
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Experience table
CREATE POLICY "Admins can insert experience" ON experience
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update experience" ON experience
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete experience" ON experience
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Projects table
CREATE POLICY "Admins can insert projects" ON projects
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update projects" ON projects
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete projects" ON projects
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Skills table
CREATE POLICY "Admins can insert skills" ON skills
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update skills" ON skills
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete skills" ON skills
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'::app_role));

-- User Roles table
CREATE POLICY "Admins can insert user_roles" ON user_roles
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update user_roles" ON user_roles
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete user_roles" ON user_roles
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'::app_role));