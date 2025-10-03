-- Grant current owner/admin user (by email) the admin role in user_roles
INSERT INTO public.user_roles (user_id, role)
SELECT p.user_id, 'admin'::app_role
FROM public.profiles p
WHERE p.email = 'kr.alok.sy@gmail.com'
  AND NOT EXISTS (
    SELECT 1 FROM public.user_roles ur WHERE ur.user_id = p.user_id
  );

-- Allow admins to delete contact messages (needed for Admin UI delete action)
CREATE POLICY "Admin can delete contact messages"
ON public.contact_messages
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));
