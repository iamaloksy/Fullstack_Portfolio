-- Create function to check if user_roles table is empty
CREATE OR REPLACE FUNCTION public.is_roles_empty()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT NOT EXISTS (SELECT 1 FROM public.user_roles LIMIT 1);
$$;

-- Allow first authenticated user to bootstrap as admin
CREATE POLICY "Bootstrap first admin" ON public.user_roles
  FOR INSERT 
  TO authenticated
  WITH CHECK (
    public.is_roles_empty() 
    AND user_id = auth.uid() 
    AND role = 'admin'::app_role
  );

-- Make contact_info publicly viewable
CREATE POLICY "Public can view contact_info" ON public.contact_info
  FOR SELECT
  USING (true);