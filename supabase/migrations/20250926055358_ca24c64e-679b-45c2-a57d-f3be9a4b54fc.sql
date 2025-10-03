-- Create education table
CREATE TABLE public.education (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field_of_study TEXT,
  start_date DATE,
  end_date DATE,
  current BOOLEAN DEFAULT FALSE,
  description TEXT,
  location TEXT,
  grade TEXT,
  image_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create experience table
CREATE TABLE public.experience (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  employment_type TEXT, -- Full-time, Part-time, Contract, Internship, etc.
  start_date DATE,
  end_date DATE,
  current BOOLEAN DEFAULT FALSE,
  description TEXT,
  location TEXT,
  company_url TEXT,
  logo_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;

-- Create policies for education
CREATE POLICY "Public can view education" 
ON public.education 
FOR SELECT 
USING (true);

CREATE POLICY "Admin can manage education" 
ON public.education 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = 'admin'
));

-- Create policies for experience
CREATE POLICY "Public can view experience" 
ON public.experience 
FOR SELECT 
USING (true);

CREATE POLICY "Admin can manage experience" 
ON public.experience 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = 'admin'
));

-- Add triggers for timestamps
CREATE TRIGGER update_education_updated_at
BEFORE UPDATE ON public.education
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_experience_updated_at
BEFORE UPDATE ON public.experience
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample education data
INSERT INTO public.education (institution, degree, field_of_study, start_date, end_date, description, location, grade, order_index) VALUES
('University of Technology', 'Bachelor of Science', 'Computer Science', '2018-09-01', '2022-06-15', 'Focused on software engineering, data structures, algorithms, and web development. Participated in coding competitions and hackathons.', 'New York, NY', '3.8 GPA', 1),
('Tech Institute', 'Certification', 'Full Stack Development', '2022-07-01', '2022-12-15', 'Intensive bootcamp covering modern web technologies including React, Node.js, and database management.', 'Online', 'Certificate', 2);

-- Insert sample experience data
INSERT INTO public.experience (company, position, employment_type, start_date, end_date, current, description, location, order_index) VALUES
('Tech Solutions Inc.', 'Senior Frontend Developer', 'Full-time', '2023-01-15', NULL, true, 'Leading frontend development for enterprise web applications. Built responsive user interfaces using React, TypeScript, and modern CSS frameworks. Collaborated with cross-functional teams to deliver high-quality software solutions.', 'San Francisco, CA', 1),
('StartupXYZ', 'Frontend Developer', 'Full-time', '2022-06-01', '2023-01-10', false, 'Developed and maintained multiple React applications. Implemented responsive designs and optimized application performance. Worked closely with designers and backend developers.', 'Remote', 2),
('FreelanceHub', 'Web Developer', 'Freelance', '2021-09-01', '2022-05-30', false, 'Created custom websites for small businesses using modern web technologies. Managed complete project lifecycle from requirements gathering to deployment.', 'Remote', 3);

-- Add Tools to skills
INSERT INTO public.skills (name, category, proficiency, order_index) VALUES
('VS Code', 'Tools', 5, 1),
('Git', 'Tools', 5, 2),
('Docker', 'Tools', 4, 3),
('Figma', 'Tools', 4, 4),
('Postman', 'Tools', 5, 5),
('Webpack', 'Tools', 3, 6),
('ESLint', 'Tools', 4, 7),
('Prettier', 'Tools', 5, 8);