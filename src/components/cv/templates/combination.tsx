import { Document, Page, Text, View, StyleSheet, Font, Link } from "@react-pdf/renderer";

Font.register({
  family: "Inter",
  fonts: [
    { src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvXhkl5Yw.woff2", fontWeight: 400 },
    { src: "https://fonts.gstatic.com/s/inter/v13/UcCT3FwrK3iLTeHuS_fvXhkl5Yw.woff2", fontWeight: 600 },
    { src: "https://fonts.gstatic.com/s/inter/v13/UcCZ3FwrK3iLTeHuS_fvXhkl5Yw.woff2", fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: "Inter", fontSize: 10, color: "#1a1a1a" },
  header: { marginBottom: 16 },
  name: { fontSize: 22, fontWeight: 700, color: "#0f172a", marginBottom: 2 },
  title: { fontSize: 11, color: "#64748b", marginBottom: 8 },
  contactRow: { flexDirection: "row", flexWrap: "wrap", gap: 12, fontSize: 9, color: "#475569" },
  contactItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  contactLink: { color: "#2563eb", textDecoration: "none" },
  section: { marginBottom: 14 },
  sectionTitle: { fontSize: 12, fontWeight: 700, color: "#0f172a", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, borderBottomWidth: 1, borderBottomColor: "#e2e8f0", paddingBottom: 4 },
  skillRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  skillTag: { fontSize: 9, backgroundColor: "#f1f5f9", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, color: "#334155" },
  entry: { marginBottom: 10 },
  entryHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  entryRole: { fontSize: 11, fontWeight: 600, color: "#1e293b" },
  entryPeriod: { fontSize: 9, color: "#64748b" },
  entryCompany: { fontSize: 10, color: "#475569", marginBottom: 3 },
  entryDesc: { fontSize: 9, color: "#334155", lineHeight: 1.5 },
  twoCol: { flexDirection: "row", gap: 24 },
  col: { flex: 1 },
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
  experience: Array<{ role: string; company: string; period: string; description: string }>;
  education: Array<{ degree: string; school: string; period: string; description: string }>;
  skills: string[];
  projects: Array<{ name: string; description: string }>;
  languages: string[];
}

export function CombinationCV({ data }: { data: CVData }) {
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Summary</Text>
          <Text style={styles.summary}>{data.summary}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Core Skills</Text>
          <View style={styles.skillRow}>
            {data.skills.map((skill, i) => (
              <Text key={i} style={styles.skillTag}>{skill}</Text>
            ))}
          </View>
        </View>

        <View style={styles.twoCol}>
          <View style={styles.col}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Work Experience</Text>
              {data.experience.map((exp, i) => (
                <View key={i} style={styles.entry}>
                  <View style={styles.entryHeader}>
                    <Text style={styles.entryRole}>{exp.role}</Text>
                    <Text style={styles.entryPeriod}>{exp.period}</Text>
                  </View>
                  <Text style={styles.entryCompany}>{exp.company}</Text>
                  <Text style={styles.entryDesc}>{exp.description}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.col}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Education</Text>
              {data.education.map((edu, i) => (
                <View key={i} style={styles.entry}>
                  <View style={styles.entryHeader}>
                    <Text style={styles.entryRole}>{edu.degree}</Text>
                    <Text style={styles.entryPeriod}>{edu.period}</Text>
                  </View>
                  <Text style={styles.entryCompany}>{edu.school}</Text>
                  {edu.description && <Text style={styles.entryDesc}>{edu.description}</Text>}
                </View>
              ))}
            </View>

            {data.projects.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Projects</Text>
                {data.projects.slice(0, 3).map((project, i) => (
                  <View key={i} style={{ marginBottom: 6 }}>
                    <Text style={{ fontSize: 10, fontWeight: 600, color: "#1e293b" }}>{project.name}</Text>
                    <Text style={{ fontSize: 8, color: "#475569", lineHeight: 1.4 }}>{project.description}</Text>
                  </View>
                ))}
              </View>
            )}

            {data.languages.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Languages</Text>
                <Text style={{ fontSize: 10, color: "#334155" }}>{data.languages.join(" • ")}</Text>
              </View>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
}
