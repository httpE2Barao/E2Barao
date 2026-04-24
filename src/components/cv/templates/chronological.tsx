import { Document, Page, Text, View, StyleSheet, Link } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: "Helvetica", fontSize: 10, color: "#1a1a1a" },
  header: { marginBottom: 16 },
  name: { fontSize: 22, fontWeight: 700, color: "#0f172a", marginBottom: 2 },
  title: { fontSize: 11, color: "#64748b", marginBottom: 8 },
  contactRow: { flexDirection: "row", flexWrap: "wrap", gap: 12, fontSize: 9, color: "#475569" },
  contactItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  contactLink: { color: "#2563eb", textDecoration: "none" },
  section: { marginBottom: 14 },
  sectionTitle: { fontSize: 12, fontWeight: 700, color: "#0f172a", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, borderBottomWidth: 1, borderBottomColor: "#e2e8f0", paddingBottom: 4 },
  entry: { marginBottom: 10 },
  entryHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  entryRole: { fontSize: 11, fontWeight: 600, color: "#1e293b" },
  entryPeriod: { fontSize: 9, color: "#64748b" },
  entryCompany: { fontSize: 10, color: "#475569", marginBottom: 3 },
  entryDesc: { fontSize: 9, color: "#334155", lineHeight: 1.5 },
  skillRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  skillTag: { fontSize: 9, backgroundColor: "#f1f5f9", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, color: "#334155" },
  twoCol: { flexDirection: "row", gap: 20 },
  col: { flex: 1 },
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

export function ChronologicalCV({ data }: { data: CVData }) {
  const lang = data.language || "pt";
  const t = {
    professionalSummary: lang === "pt" ? "Resumo Profissional" : lang === "en" ? "Professional Summary" : "Resumen Profesional",
    workExperience: lang === "pt" ? "Experiência Profissional" : lang === "en" ? "Work Experience" : "Experiencia Laboral",
    education: lang === "pt" ? "Educação" : lang === "en" ? "Education" : "Educación",
    skills: lang === "pt" ? "Habilidades" : lang === "en" ? "Skills" : "Habilidades",
    keyProjects: lang === "pt" ? "Projetos Principais" : lang === "en" ? "Key Projects" : "Proyectos Principales",
    languages: lang === "pt" ? "Idiomas" : lang === "en" ? "Languages" : "Idiomas",
    additionalInfo: lang === "pt" ? "Informações Adicionais" : lang === "en" ? "Additional Information" : "Información Adicional",
    additionalData: lang === "pt" ? "Dados Complementares" : lang === "en" ? "Additional Data" : "Datos Adicionales",
    willingnessToTravel: lang === "pt" ? "Disponibilidade para viajar" : lang === "en" ? "Willingness to travel" : "Disponibilidad para viajar",
    willingnessToRelocate: lang === "pt" ? "Disponibilidade para mudar de residência" : lang === "en" ? "Willingness to relocate" : "Disponibilidad para mudarse",
    driverLicense: lang === "pt" ? "Carteira de Habilitação" : lang === "en" ? "Driver's License" : "Licencia de Conducir",
    vehicle: lang === "pt" ? "Veículo" : lang === "en" ? "Vehicle" : "Vehículo",
  };

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

        {data.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.professionalSummary}</Text>
            <Text style={{ fontSize: 10, color: "#334155", lineHeight: 1.6 }}>{data.summary}</Text>
          </View>
        )}

        {data.includeExperience && data.experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.workExperience}</Text>
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
        )}

        {data.includeEducation && data.education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.education}</Text>
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
        )}

        {data.includeSkills && data.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.skills}</Text>
            <View style={styles.skillRow}>
              {data.skills.map((skill, i) => (
                <Text key={i} style={styles.skillTag}>{skill}</Text>
              ))}
            </View>
          </View>
        )}

        {data.includeProjects && data.projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.keyProjects}</Text>
            {data.projects.map((project, i) => (
              <View key={i} style={{ marginBottom: 4 }}>
                <Text style={{ fontSize: 10, fontWeight: 600, color: "#1e293b" }}>{project.name}</Text>
                <Text style={{ fontSize: 9, color: "#475569" }}>{project.description}</Text>
              </View>
            ))}
          </View>
        )}

        {data.includeLanguages && data.languages.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.languages}</Text>
            <Text style={{ fontSize: 10, color: "#334155" }}>{data.languages.join(" • ")}</Text>
          </View>
        )}

        {data.additionalInfo && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.additionalInfo}</Text>
            <Text style={{ fontSize: 10, color: "#334155", lineHeight: 1.6 }}>{data.additionalInfo}</Text>
          </View>
        )}

        {(data.additionalData?.willingnessToTravel || data.additionalData?.willingnessToRelocate || data.additionalData?.driverLicense || data.additionalData?.vehicleType) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.additionalData}</Text>
            <View style={{ fontSize: 10, color: "#334155", lineHeight: 1.6 }}>
              {data.additionalData.willingnessToTravel && <Text>• {t.willingnessToTravel}: {data.additionalData.willingnessToTravel}</Text>}
              {data.additionalData.willingnessToRelocate && <Text>• {t.willingnessToRelocate}: {data.additionalData.willingnessToRelocate}</Text>}
              {data.additionalData.driverLicense && <Text>• {t.driverLicense}: {data.additionalData.driverLicense}</Text>}
              {data.additionalData.vehicleType && <Text>• {t.vehicle}: {data.additionalData.vehicleType}</Text>}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
}
