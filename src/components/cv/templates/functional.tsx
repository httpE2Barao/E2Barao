import { Document, Page, Text, View, StyleSheet, Link } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: "Helvetica", fontSize: 10, color: "#1a1a1a" },
  header: { marginBottom: 16, textAlign: "center" },
  name: { fontSize: 22, fontWeight: 700, color: "#0f172a", marginBottom: 2 },
  title: { fontSize: 11, color: "#64748b", marginBottom: 8 },
  contactRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 12, fontSize: 9, color: "#475569" },
  contactItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  contactLink: { color: "#2563eb", textDecoration: "none" },
  section: { marginBottom: 14 },
  sectionTitle: { fontSize: 12, fontWeight: 700, color: "#0f172a", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, borderBottomWidth: 1, borderBottomColor: "#e2e8f0", paddingBottom: 4 },
  skillCategory: { marginBottom: 10 },
  skillCategoryTitle: { fontSize: 11, fontWeight: 600, color: "#1e293b", marginBottom: 4 },
  skillRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  skillTag: { fontSize: 9, backgroundColor: "#f1f5f9", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, color: "#334155" },
  entry: { marginBottom: 8 },
  entryHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 1 },
  entryRole: { fontSize: 10, fontWeight: 600, color: "#1e293b" },
  entryPeriod: { fontSize: 9, color: "#64748b" },
  entryCompany: { fontSize: 9, color: "#475569" },
  summary: { fontSize: 10, color: "#334155", lineHeight: 1.6, marginBottom: 14 },
});

interface CVData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  summary: string;
  language: string;
  experience: Array<{ role: string; company: string; period: string; description: string }>;
  education: Array<{ degree: string; school: string; period: string; description: string }>;
  skills: string[];
  projects: Array<{ name: string; description: string }>;
  languages: string[];
  additionalInfo: string;
  additionalData: {
    willingnessToTravel: string;
    willingnessToRelocate: string;
    driverLicense: string;
    vehicleType: string;
  };
  includeExperience: boolean;
  includeEducation: boolean;
  includeSkills: boolean;
  includeProjects: boolean;
  includeLanguages: boolean;
}

export function FunctionalCV({ data }: { data: CVData }) {
  const skillCategories = [
    { title: "Frontend Development", skills: data.skills.filter((s) => /react|next|typescript|javascript|tailwind|html|css|sass/i.test(s)) },
    { title: "Backend & Database", skills: data.skills.filter((s) => /node|python|php|postgres|mysql|prisma|api/i.test(s)) },
    { title: "Tools & Platforms", skills: data.skills.filter((s) => /git|docker|figma|wordpress|n8n|vercel/i.test(s)) },
    { title: "Concepts & Practices", skills: data.skills.filter((s) => !/react|next|typescript|javascript|tailwind|html|css|sass|node|python|php|postgres|mysql|prisma|api|git|docker|figma|wordpress|n8n|vercel/i.test(s)) },
  ].filter((cat) => cat.skills.length > 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{data.name}</Text>
          <Text style={styles.title}>{data.title}</Text>
          <View style={styles.contactRow}>
            {data.email && <Link href={`mailto:${data.email}`} style={styles.contactLink}><Text style={styles.contactItem}>{data.email}</Text></Link>}
            {data.phone && <Link href={`tel:${data.phone}`} style={styles.contactLink}><Text style={styles.contactItem}>{data.phone}</Text></Link>}
            {data.location && <Text style={styles.contactItem}>{data.location}</Text>}
            {data.linkedin && <Link href={data.linkedin} style={styles.contactLink}><Text style={styles.contactItem}>LinkedIn</Text></Link>}
            {data.github && <Link href={data.github} style={styles.contactLink}><Text style={styles.contactItem}>GitHub</Text></Link>}
          </View>
        </View>

        <Text style={styles.summary}>{data.summary}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Core Competencies</Text>
          {skillCategories.map((cat, i) => (
            <View key={i} style={styles.skillCategory}>
              <Text style={styles.skillCategoryTitle}>{cat.title}</Text>
              <View style={styles.skillRow}>
                {cat.skills.map((skill, j) => (
                  <Text key={j} style={styles.skillTag}>{skill}</Text>
                ))}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Projects</Text>
          {data.projects.map((project, i) => (
            <View key={i} style={styles.entry}>
              <Text style={styles.entryRole}>{project.name}</Text>
              <Text style={{ fontSize: 9, color: "#475569", lineHeight: 1.5 }}>{project.description}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Experience</Text>
          {data.experience.map((exp, i) => (
            <View key={i} style={styles.entry}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryRole}>{exp.role}</Text>
                <Text style={styles.entryPeriod}>{exp.period}</Text>
              </View>
              <Text style={styles.entryCompany}>{exp.company}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {data.education.map((edu, i) => (
            <View key={i} style={styles.entry}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryRole}>{edu.degree}</Text>
                <Text style={styles.entryPeriod}>{edu.period}</Text>
              </View>
              <Text style={styles.entryCompany}>{edu.school}</Text>
            </View>
          ))}
        </View>

        {data.languages.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Languages</Text>
            <Text style={{ fontSize: 10, color: "#334155" }}>{data.languages.join(" • ")}</Text>
          </View>
        )}

        {(data.additionalData?.willingnessToTravel || data.additionalData?.willingnessToRelocate || data.additionalData?.driverLicense || data.additionalData?.vehicleType) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Data</Text>
            <View style={{ fontSize: 10, color: "#334155", lineHeight: 1.6 }}>
              {data.additionalData.willingnessToTravel && <Text>• Willingness to travel: {data.additionalData.willingnessToTravel}</Text>}
              {data.additionalData.willingnessToRelocate && <Text>• Willingness to relocate: {data.additionalData.willingnessToRelocate}</Text>}
              {data.additionalData.driverLicense && <Text>• Driver's License: {data.additionalData.driverLicense}</Text>}
              {data.additionalData.vehicleType && <Text>• Vehicle: {data.additionalData.vehicleType}</Text>}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
}
