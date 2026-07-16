import { Document, Page, Text, View, StyleSheet, Link } from "@react-pdf/renderer";

const accentColor = "#f59e0b";

const styles = StyleSheet.create({
  page: { flexDirection: "row", fontFamily: "Helvetica", fontSize: 10, color: "#1a1a1a", minHeight: "100%", forcePageBreak: "no" },
  sidebar: { width: 160, backgroundColor: "#1e293b", padding: 20, color: "#e2e8f0", minHeight: 770 },
  main: { flex: 1, padding: 24 },
  sidebarName: { fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 3 },
  sidebarTitle: { fontSize: 9, color: accentColor, marginBottom: 16 },
  sidebarSection: { marginBottom: 20, wrap: false },
  sidebarSectionTitle: { fontSize: 9, fontWeight: 700, color: accentColor, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 5, borderBottomWidth: 1, borderBottomColor: accentColor, paddingBottom: 2 },
  sidebarText: { fontSize: 8.5, color: "#cbd5e1", marginBottom: 2, lineHeight: 1.3, wrap: false },
  sidebarLink: { fontSize: 8.5, color: accentColor, marginBottom: 2, lineHeight: 1.3, wrap: false },
  sidebarSkillTag: { fontSize: 7.5, backgroundColor: "rgba(245,158,11,0.15)", paddingHorizontal: 5, paddingVertical: 1.5, borderRadius: 2, color: "#fbbf24", marginBottom: 2, wrap: false },
  sidebarSkillGrid: { flexDirection: "row", flexWrap: "wrap", gap: 3 },
  skillTag: { fontSize: 8, backgroundColor: "#fef3c7", paddingHorizontal: 5, paddingVertical: 2, borderRadius: 2, color: "#92400e", wrap: false },
  skillGrid: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
  name: { fontSize: 22, fontWeight: 700, color: "#0f172a", marginBottom: 2 },
  title: { fontSize: 11, color: "#64748b", marginBottom: 12 },
  section: { marginBottom: 20, wrap: false },
  sectionTitle: { fontSize: 12, fontWeight: 700, color: "#0f172a", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12, borderBottomWidth: 2, borderBottomColor: accentColor, paddingBottom: 4 },
  entry: { marginBottom: 10, wrap: false },
  entryHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  entryRole: { fontSize: 11, fontWeight: 600, color: "#1e293b", wrap: false },
  entryPeriod: { fontSize: 9, color: "#64748b", wrap: false },
  entryCompany: { fontSize: 10, color: "#475569", marginBottom: 3, wrap: false },
  entryDesc: { fontSize: 9, color: "#334155", lineHeight: 1.5, wrap: false },
  summary: { fontSize: 10, color: "#334155", lineHeight: 1.6, marginBottom: 14, wrap: false },
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
  objective: string;
  language: string;
  experience: Array<{ role: string; company: string; period: string; description: string }>;
  education: Array<{ degree: string; school: string; period: string; description: string; type?: string }>;
  skills: string[];
  projects: Array<{ name: string; description: string; tags?: string[] }>;
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

export function CreativeCV({ data }: { data: CVData }) {
  const lang = data.language || "pt";
  const t = {
    objective: lang === "pt" ? "Objetivo" : lang === "en" ? "Objective" : "Objetivo",
    graduation: lang === "pt" ? "Educação" : lang === "en" ? "Education" : "Educación",
    complementaryCourses: lang === "pt" ? "Cursos Complementares" : lang === "en" ? "Complementary Courses" : "Cursos Complementarios",
    experience: lang === "pt" ? "Experiência Profissional" : lang === "en" ? "Work Experience" : "Experiencia Laboral",
    education: lang === "pt" ? "Educação" : lang === "en" ? "Education" : "Educación",
    skills: lang === "pt" ? "Habilidades" : lang === "en" ? "Skills" : "Habilidades",
    summary: lang === "pt" ? "Resumo Profissional" : lang === "en" ? "Professional Summary" : "Resumen Profesional",
    projects: lang === "pt" ? "Projetos" : lang === "en" ? "Projects" : "Proyectos",
    contact: lang === "pt" ? "Contato" : lang === "en" ? "Contact" : "Contacto",
    languages: lang === "pt" ? "Idiomas" : lang === "en" ? "Languages" : "Idiomas",
    additionalData: lang === "pt" ? "Complementares" : lang === "en" ? "Additional Data" : "Complementarios",
    willingnessToTravel: lang === "pt" ? "Viajar" : lang === "en" ? "Travel" : "Viajar",
    willingnessToRelocate: lang === "pt" ? "Mudar residência" : lang === "en" ? "Relocate" : "Mudarse",
    driverLicense: lang === "pt" ? "CNH" : lang === "en" ? "License" : "Licencia",
    vehicle: lang === "pt" ? "Veículo" : lang === "en" ? "Vehicle" : "Vehículo",
  };
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.sidebar}>
          <Text style={styles.sidebarName}>{data.name}</Text>
          <Text style={styles.sidebarTitle}>{data.title}</Text>

          {data.summary && (
            <View style={styles.sidebarSection}>
              <Text style={{ fontSize: 8.5, color: "#cbd5e1", lineHeight: 1.3 }}>{data.summary}</Text>
            </View>
          )}

          {data.objective && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarSectionTitle}>{t.objective}</Text>
              <Text style={{ fontSize: 8.5, color: "#cbd5e1", lineHeight: 1.3 }}>{data.objective}</Text>
            </View>
          )}

          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarSectionTitle}>{t.contact}</Text>
            {data.email && <Link href={`mailto:${data.email}`} style={styles.sidebarLink}><Text style={styles.sidebarLink}>{data.email}</Text></Link>}
            {data.phone && <Link href={`tel:${data.phone}`} style={styles.sidebarLink}><Text style={styles.sidebarLink}>{data.phone}</Text></Link>}
            {data.location && <Text style={styles.sidebarText}>{data.location}</Text>}
            {data.linkedin && <Link href={data.linkedin} style={styles.sidebarLink}><Text style={styles.sidebarLink}>LinkedIn</Text></Link>}
            {data.github && <Link href={data.github} style={styles.sidebarLink}><Text style={styles.sidebarLink}>GitHub</Text></Link>}
            <Link href="https://e2-barao.vercel.app/" style={styles.sidebarLink}><Text style={styles.sidebarLink}>Portfolio</Text></Link>
          </View>

          {data.languages.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarSectionTitle}>{t.languages}</Text>
              {data.languages.map((lang, i) => (
                <Text key={i} style={styles.sidebarText}>{lang}</Text>
              ))}
            </View>
          )}

          {data.education.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarSectionTitle}>{t.education}</Text>
              {data.education.map((edu, i) => (
                <View key={i} style={{ marginBottom: 6 }}>
                  <Text style={{ fontSize: 8.5, fontWeight: 600, color: "#fff", marginBottom: 2 }}>{edu.degree}</Text>
                  <Text style={styles.sidebarText}>{edu.school}</Text>
                  <Text style={{ fontSize: 7.5, color: "#94a3b8" }}>{edu.period}</Text>
                </View>
              ))}
            </View>
          )}

          {(data.additionalData?.willingnessToTravel || data.additionalData?.willingnessToRelocate || data.additionalData?.driverLicense || data.additionalData?.vehicleType) && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarSectionTitle}>{t.additionalData}</Text>
              {data.additionalData.willingnessToTravel && <Text style={styles.sidebarText}>• {t.willingnessToTravel}: {data.additionalData.willingnessToTravel}</Text>}
              {data.additionalData.willingnessToRelocate && <Text style={styles.sidebarText}>• {t.willingnessToRelocate}: {data.additionalData.willingnessToRelocate}</Text>}
              {data.additionalData.driverLicense && <Text style={styles.sidebarText}>• {t.driverLicense}: {data.additionalData.driverLicense}</Text>}
              {data.additionalData.vehicleType && <Text style={styles.sidebarText}>• {t.vehicle}: {data.additionalData.vehicleType}</Text>}
            </View>
          )}
        </View>

        <View style={styles.main}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.experience}</Text>
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

          {data.projects.length > 0 && (
            <View style={styles.section}>
              <View wrap={false}>
                <Text style={styles.sectionTitle}>{t.projects}</Text>
                {data.projects.slice(0, 1).map((project, i) => (
                  <View key={i} wrap={false} style={{ marginBottom: 18 }}>
                    <Text style={{ fontSize: 10, fontWeight: 600, color: "#1e293b", marginBottom: 2 }}>{project.name}</Text>
                    <Text style={{ fontSize: 9, color: "#475569", lineHeight: 1.4 }}>{project.description}</Text>
                    {project.tags && project.tags.length > 0 && (
                      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 3, marginTop: 3 }}>
                        {project.tags.map((tag, j) => (
                          <Text key={j} style={{ fontSize: 7, backgroundColor: "#f1f5f9", paddingHorizontal: 4, paddingVertical: 1, borderRadius: 2, color: "#64748b" }}>{tag}</Text>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>
              {data.projects.slice(1, 4).map((project, i) => (
                <View key={i} wrap={false} style={{ marginBottom: 18 }}>
                  <Text style={{ fontSize: 10, fontWeight: 600, color: "#1e293b", marginBottom: 2 }}>{project.name}</Text>
                  <Text style={{ fontSize: 9, color: "#475569", lineHeight: 1.4 }}>{project.description}</Text>
                  {project.tags && project.tags.length > 0 && (
                    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 3, marginTop: 3 }}>
                      {project.tags.map((tag, j) => (
                        <Text key={j} style={{ fontSize: 7, backgroundColor: "#f1f5f9", paddingHorizontal: 4, paddingVertical: 1, borderRadius: 2, color: "#64748b" }}>{tag}</Text>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}

          {data.includeSkills && data.skills.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t.skills}</Text>
              <View style={styles.skillGrid}>
                {data.skills.map((skill, i) => (
                  <Text key={i} style={styles.skillTag}>{skill}</Text>
                ))}
              </View>
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}
