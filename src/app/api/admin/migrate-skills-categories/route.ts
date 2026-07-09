import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

const categoryMap: Record<string, string> = {
  // Old "tech" categories -> new categories based on skill name
  'JavaScript': 'languages',
  'TypeScript': 'languages',
  'Python': 'languages',
  'PHP': 'languages',
  'HTML5': 'languages',
  'CSS3': 'languages',
  'SQL': 'languages',
  
  'React': 'frameworks',
  'Next.js': 'frameworks',
  'Node.js': 'frameworks',
  'Vite': 'frameworks',
  'Radix UI': 'frameworks',
  'shadcn/ui': 'frameworks',
  'Framer Motion': 'frameworks',
  'Lucide React': 'frameworks',
  'React Hook Form': 'frameworks',
  'Zod': 'frameworks',
  'NextAuth.js': 'frameworks',
  
  'Tailwind CSS': 'styling',
  'SASS': 'styling',
  'Bootstrap': 'styling',
  'Styled Components': 'styling',
  'jQuery': 'styling',
  
  'PostgreSQL': 'database',
  'SQLite': 'database',
  'Neon': 'database',
  'Prisma ORM': 'database',
  
  'Zustand': 'state',
  'TanStack Query': 'state',
  
  'JWT': 'auth',
  'bcrypt': 'auth',
  '2FA (otplib)': 'auth',
  
  'NVIDIA NIM': 'ai',
  'Google Gemini': 'ai',
  'Groq SDK': 'ai',
  'Ollama': 'ai',
  'MCP': 'ai',
  
  'Git': 'devops',
  'GitHub': 'devops',
  'Docker': 'devops',
  'n8n': 'devops',
  
  'Figma': 'design',
  'Photoshop': 'design',
  'Premiere Pro': 'design',
  'Lightroom': 'design',
  'Adobe XD': 'design',
  'Adobe Dreamweaver': 'design',
  'Adobe Dimension 3D': 'design',
  'Sony Vegas': 'design',
  
  'Jest': 'testing',
  'React Testing Library': 'testing',
  
  'Socket.IO': 'realtime',
  'Pusher': 'realtime',
  'Mercado Pago': 'realtime',
  'PIX': 'realtime',
  'Lalamove': 'realtime',
  'Leaflet': 'realtime',
  'react-leaflet': 'realtime',
  
  'Recharts': 'dataviz',
  'lightweight-charts': 'dataviz',
  'Mermaid': 'dataviz',
  'pdf-lib': 'dataviz',
  'jsPDF': 'dataviz',
  'sharp': 'dataviz',
  'heic2any': 'dataviz',
  
  'next-intl': 'integrations',
  '@vercel/blob': 'integrations',
  'REST APIs': 'integrations',
  'axios': 'integrations',
  'date-fns': 'integrations',
  'papaparse': 'integrations',
  'qrcode': 'integrations',
  'Nodemailer': 'integrations',
  'Insomnia': 'integrations',
  
  'VS Code': 'tools',
  'Notion': 'tools',
  'PgAdmin4': 'tools',
  'Microsoft 365': 'tools',
  'WordPress': 'tools',
  'Cisco Packet Tracer': 'tools',
  
  'Clean Code': 'concepts',
  'Mobile First': 'concepts',
  'Object Orientation': 'concepts',
  'Functional Programming': 'concepts',
  'UI / UX Design': 'concepts',
  'Accessibility': 'concepts',
  'Software Architecture': 'concepts',
  'Information Architecture': 'concepts',
  'State Management': 'concepts',
  'Server Side Rendering': 'concepts',
  'Relational Database': 'concepts',
  'Information Security': 'concepts',
  'Agile Development': 'concepts',
  'SEO': 'concepts',
  'Performance Optimization': 'concepts',
  'Continuous Learning': 'concepts',
  'Analytical Thinking': 'concepts',
  'Code Versioning': 'concepts',
  'Teamwork': 'concepts',
  'Self-Management': 'concepts',
  'Kanban': 'concepts',
  'Scrum': 'concepts',
};

export async function GET() {
  try {
    // Get all skills with old categories
    const { rows: skills } = await sql`SELECT id, name, category FROM skills`;
    
    let updated = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const skill of skills) {
      const newCategory = categoryMap[skill.name];
      
      if (newCategory && newCategory !== skill.category) {
        try {
          await sql`UPDATE skills SET category = ${newCategory}, updated_at = NOW() WHERE id = ${skill.id}`;
          console.log(`Updated: ${skill.name} (${skill.category} -> ${newCategory})`);
          updated++;
        } catch (e: any) {
          errors.push(`Failed to update ${skill.name}: ${e.message}`);
        }
      } else {
        skipped++;
      }
    }

    return NextResponse.json({ 
      message: 'Skills categories migration completed',
      total: skills.length,
      updated,
      skipped,
      errors
    });
  } catch (error: any) {
    console.error('Migration error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
