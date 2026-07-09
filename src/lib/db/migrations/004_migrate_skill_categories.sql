-- =====================================================
-- MIGRATION: Migrate skill categories from old (tech/concept/program)
-- to new 15-category system based on skill-categories.ts
-- Date: 2026-07-09
-- =====================================================

-- Step 1: Drop the old CHECK constraint
ALTER TABLE skills DROP CONSTRAINT IF EXISTS skills_category_check;

-- Step 2: Update category values based on skill name mapping
-- Languages
UPDATE skills SET category = 'languages' WHERE name IN (
  'JavaScript', 'TypeScript', 'Python', 'PHP', 'HTML5', 'CSS3', 'SQL'
);

-- Frameworks & Libraries
UPDATE skills SET category = 'frameworks' WHERE name IN (
  'React', 'Next.js', 'Node.js', 'Vite', 'Radix UI', 'shadcn/ui',
  'Framer Motion', 'Lucide React', 'React Hook Form', 'Zod', 'NextAuth.js'
);

-- Styling & UI
UPDATE skills SET category = 'styling' WHERE name IN (
  'Tailwind CSS', 'SASS', 'Bootstrap', 'Styled Components', 'jQuery'
);

-- Database
UPDATE skills SET category = 'database' WHERE name IN (
  'PostgreSQL', 'SQLite', 'Neon', 'Prisma ORM'
);

-- State Management
UPDATE skills SET category = 'state' WHERE name IN (
  'Zustand', 'TanStack Query'
);

-- Authentication & Security
UPDATE skills SET category = 'auth' WHERE name IN (
  'JWT', 'bcrypt', '2FA (otplib)'
);

-- AI & Machine Learning
UPDATE skills SET category = 'ai' WHERE name IN (
  'NVIDIA NIM', 'Google Gemini', 'Groq SDK', 'Ollama', 'MCP'
);

-- DevOps & Cloud
UPDATE skills SET category = 'devops' WHERE name IN (
  'Git', 'Docker', 'n8n', 'GitHub'
);

-- Design & Media
UPDATE skills SET category = 'design' WHERE name IN (
  'Figma', 'Photoshop', 'Premiere Pro', 'Lightroom',
  'Adobe XD', 'Adobe Dreamweaver', 'Adobe Dimension 3D', 'Sony Vegas'
);

-- Testing
UPDATE skills SET category = 'testing' WHERE name IN (
  'Jest', 'React Testing Library'
);

-- Realtime & Payments
UPDATE skills SET category = 'realtime' WHERE name IN (
  'Socket.IO', 'Pusher', 'Mercado Pago', 'PIX', 'Lalamove',
  'Leaflet', 'react-leaflet'
);

-- Data & Visualization
UPDATE skills SET category = 'dataviz' WHERE name IN (
  'Recharts', 'lightweight-charts', 'Mermaid', 'pdf-lib', 'jsPDF',
  'sharp', 'heic2any'
);

-- Automation & Integrations
UPDATE skills SET category = 'integrations' WHERE name IN (
  'next-intl', '@vercel/blob', 'REST APIs', 'axios', 'date-fns',
  'papaparse', 'qrcode', 'Nodemailer', 'Insomnia'
);

-- Tools & Platforms
UPDATE skills SET category = 'tools' WHERE name IN (
  'VS Code', 'Notion', 'PgAdmin4', 'Microsoft 365',
  'WordPress', 'Cisco Packet Tracer'
);

-- Concepts & Methodologies (all concept entries + remaining unmatched)
UPDATE skills SET category = 'concepts' WHERE name IN (
  'Clean Code', 'Mobile First', 'Object Orientation',
  'Functional Programming', 'UI / UX Design', 'Accessibility',
  'Software Architecture', 'Information Architecture',
  'State Management', 'Server Side Rendering', 'Relational Database',
  'Information Security', 'Agile Development', 'SEO',
  'Performance Optimization', 'Continuous Learning',
  'Analytical Thinking', 'Code Versioning', 'Teamwork', 'Self-Management'
);

-- Catch any remaining skills not mapped above
UPDATE skills SET category = 'concepts' WHERE category NOT IN (
  'languages', 'frameworks', 'styling', 'database', 'state', 'auth',
  'ai', 'devops', 'design', 'testing', 'realtime', 'dataviz',
  'integrations', 'tools', 'concepts'
);

-- Step 3: Add new CHECK constraint
ALTER TABLE skills ADD CONSTRAINT skills_category_check
  CHECK (category IN (
    'languages', 'frameworks', 'styling', 'database', 'state', 'auth',
    'ai', 'devops', 'design', 'testing', 'realtime', 'dataviz',
    'integrations', 'tools', 'concepts'
  ));
