import { Document, Page, Text, View, StyleSheet, Link } from "@react-pdf/renderer";

const accentColor = "#f59e0b";

const styles = StyleSheet.create({
  page: { flexDirection: "row", fontFamily: "Helvetica", fontSize: 10, color: "#1a1a1a" },
  sidebar: { width: 160, backgroundColor: "#1e293b", padding: 24, color: "#e2e8f0", minHeight: 770 },
  main: { flex: 1, padding: 24 },
  sidebarName: { fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 4 },
  sidebarTitle: { fontSize: 9, color: accentColor, marginBottom: 16 },
  sidebarSection: { marginBottom: 16 },
  sidebarSectionTitle: { fontSize: 9, fontWeight: 700, color: accentColor, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6, borderBottomWidth: 1, borderBottomColor: accentColor, paddingBottom: 3 },
  sidebarText: { fontSize: 8, color: "#cbd5e1", marginBottom: 3, lineHeight: 1.4 },
  sidebarLink: { fontSize: 8, color: accentColor, marginBottom: 3, lineHeight: 1.4 },
  sidebarSkill: { fontSize: 8, color: "#e2e8f0", marginBottom: 2 },
  name: { fontSize: 22, fontWeight: 700, color: "#0f172a", marginBottom: 2 },
  title: { fontSize: 11, color: "#64748b", marginBottom: 12 },
  section: { marginBottom: 14 },
  sectionTitle: { fontSize: 12, fontWeight: 700, color: "#0f172a", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, borderBottomWidth: 2, borderBottomColor: accentColor, paddingBottom: 4 },
  entry: { marginBottom: 10 },
  entryHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  entryRole: { fontSize: 11, fontWeight: 600, color: "#1e293b" },
  entryPeriod: { fontSize: 9, color: "#64748b" },
  entryCompany: { fontSize: 10, color: "#475569", marginBottom: 3 },
  entryDesc: { fontSize: 9, color: "#334155", lineHeight: 1.5 },
  summary: { fontSize: 10, color: "#334155", lineHeight: 1.6, marginBottom: 14 },
  skillRow: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
  skillTag: { fontSize: 8, backgroundColor: "#fef3c7", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 3, color: "#92400e" },
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

export function CreativeCV({ data }: { data: CVData }) {
  const lang = data.language || "pt";
  const t = {
    experience: lang === "pt" ? "Experiência Profissional" : lang === "en" ? "Work Experience" : "Experiencia Laboral",
    education: lang === "pt" ? "Educação" : lang === "en" ? "Education" : "Educación",
    skills: lang === "pt" ? "Habilidades" : lang === "en" ? "Skills" : "Habilidades",
    summary: lang === "pt" ? "Resumo Profissional" : lang === "en" ? "Professional Summary" : "Resumen Profesional",
    projects: lang === "pt" ? "Projetos" : lang === "en" ? "Projects" : "Proyectos",
    contact: lang === "pt" ? "Contato" : lang === "en" ? "Contact" : "Contacto",
    languages: lang === "pt" ? "Idiomas" : lang === "en" ? "Languages" : "Idiomas",
    additionalData: lang === "pt" ? "Dados Complementares" : lang === "en" ? "Additional Data" : "Datos Adicionales",
    willingnessToTravel: lang === "pt" ? "Disponibilidade para viajar" : lang === "en" ? "Willingness to travel" : "Disponibilidad para viajar",
    willingnessToRelocate: lang === "pt" ? "Disponibilidade para mudar" : lang === "en" ? "Willingness to relocate" : "Disponibilidad para mudarse",
    driverLicense: lang === "pt" ? "Carteira de Habilitação" : lang === "en" ? "Driver's License" : "Licencia de Conducir",
    vehicle: lang === "pt" ? "Veículo" : lang === "en" ? "Vehicle" : "Vehículo",
  };
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.sidebar}>
          <Text style={styles.sidebarName}>{data.name}</Text>
          <Text style={styles.sidebarTitle}>{data.title}</Text>

          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarSectionTitle}>{t.contact}</Text>
            {data.email && <Link href={`mailto:${data.email}`} style={styles.sidebarLink}><Text style={styles.sidebarLink}>{data.email}</Text></Link>}
            {data.phone && <Link href={`tel:${data.phone}`} style={styles.sidebarLink}><Text style={styles.sidebarLink}>{data.phone}</Text></Link>}
            {data.location && <Text style={styles.sidebarText}>{data.location}</Text>}
            {data.linkedin && <Link href={data.linkedin} style={styles.sidebarLink}><Text style={styles.sidebarLink}>LinkedIn</Text></Link>}
            {data.github && <Link href={data.github} style={styles.sidebarLink}><Text style={styles.sidebarLink}>GitHub</Text></Link>}
            <Link href="https://e2-barao.vercel.app/" style={styles.sidebarLink}><Text style={styles.sidebarLink}>Portfolio</Text></Link>
          </View>

          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarSectionTitle}>{t.skills}</Text>
            {data.skills.slice(0, 12).map((skill, i) => (
              <Text key={i} style={styles.sidebarSkill}>• {skill}</Text>
            ))}
          </View>

          {data.languages.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarSectionTitle}>{t.languages}</Text>
              {data.languages.map((lang, i) => (
                <Text key={i} style={styles.sidebarText}>{lang}</Text>
              ))}
            </View>
          )}

          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarSectionTitle}>{t.education}</Text>
            {data.education.slice(0, 2).map((edu, i) => (
              <View key={i} style={{ marginBottom: 6 }}>
                <Text style={{ fontSize: 8, fontWeight: 600, color: "#fff" }}>{edu.degree}</Text>
                <Text style={styles.sidebarText}>{edu.school}</Text>
                <Text style={{ fontSize: 7, color: "#94a3b8" }}>{edu.period}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.main}>
          {data.summary && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t.summary}</Text>
              <Text style={styles.summary}>{data.summary}</Text>
            </View>
          )}

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
              <Text style={styles.sectionTitle}>{t.projects}</Text>
              {data.projects.slice(0, 3).map((project, i) => (
                <View key={i} style={{ marginBottom: 6 }}>
                  <Text style={{ fontSize: 10, fontWeight: 600, color: "#1e293b" }}>{project.name}</Text>
                  <Text style={{ fontSize: 9, color: "#475569", lineHeight: 1.4 }}>{project.description}</Text>
                </View>
              ))}
            </View>
          )}

          {data.languages.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t.languages}</Text>
              <Text style={{ fontSize: 10, color: "#334155" }}>{data.languages.join(" • ")}</Text>
            </View>
          )}

          {(data.additionalData?.willingnessToTravel || data.additionalData?.willingnessToRelocate || data.additionalData?.driverLicense || data.additionalData?.vehicleType) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t.additionalData}</Text>
              <View style={{ fontSize: 9, color: "#334155", lineHeight: 1.6 }}>
                {data.additionalData.willingnessToTravel && <Text>• {t.willingnessToTravel}: {data.additionalData.willingnessToTravel}</Text>}
                {data.additionalData.willingnessToRelocate && <Text>• {t.willingnessToRelocate}: {data.additionalData.willingnessToRelocate}</Text>}
                {data.additionalData.driverLicense && <Text>• {t.driverLicense}: {data.additionalData.driverLicense}</Text>}
                {data.additionalData.vehicleType && <Text>• {t.vehicle}: {data.additionalData.vehicleType}</Text>}
              </View>
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}
