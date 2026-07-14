import { Document, Page, Text, View, StyleSheet, Link } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica", fontSize: 10, color: "#000", minHeight: "100%", forcePageBreak: "no" },
  header: { marginBottom: 20, borderBottomWidth: 1, borderBottomColor: "#000", paddingBottom: 12 },
  name: { fontSize: 20, fontWeight: "bold", marginBottom: 4, letterSpacing: 0.5, wrap: false },
  contactRow: { flexDirection: "row", flexWrap: "wrap", gap: 16, fontSize: 9, color: "#333", wrap: false },
  contactLink: { color: "#0000ee", textDecoration: "none", wrap: false },
  section: { marginBottom: 20, wrap: false },
  sectionTitle: { fontSize: 11, fontWeight: "bold", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12, paddingBottom: 3, borderBottomWidth: 0.5, borderBottomColor: "#ccc", wrap: false },
  entry: { marginBottom: 8, wrap: false },
  entryHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  entryRole: { fontSize: 10, fontWeight: "bold", wrap: false },
  entryPeriod: { fontSize: 9, color: "#666", wrap: false },
  entryCompany: { fontSize: 9, color: "#444", fontStyle: "italic", marginBottom: 2, wrap: false },
  entryDesc: { fontSize: 9, color: "#333", lineHeight: 1.5, wrap: false },
  skillList: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
  skillItem: { fontSize: 9, color: "#333" },
  summary: { fontSize: 9, color: "#333", lineHeight: 1.6, marginBottom: 16, wrap: false },
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

export function MinimalCV({ data }: { data: CVData }) {
  const lang = data.language || "pt";
  const t = {
    objective: lang === "pt" ? "Objetivo" : lang === "en" ? "Objective" : "Objetivo",
    graduation: lang === "pt" ? "Graduação" : lang === "en" ? "Graduation" : "Graduación",
    complementaryCourses: lang === "pt" ? "Cursos Complementares" : lang === "en" ? "Complementary Courses" : "Cursos Complementarios",
    experience: lang === "pt" ? "Experiência Profissional" : lang === "en" ? "Work Experience" : "Experiencia Laboral",
    education: lang === "pt" ? "Educação" : lang === "en" ? "Education" : "Educación",
    skills: lang === "pt" ? "Habilidades" : lang === "en" ? "Skills" : "Habilidades",
    languages: lang === "pt" ? "Idiomas" : lang === "en" ? "Languages" : "Idiomas",
    additionalData: lang === "pt" ? "Dados Complementares" : lang === "en" ? "Additional Data" : "Datos Adicionales",
    willingnessToTravel: lang === "pt" ? "Disponibilidade para viajar" : lang === "en" ? "Willingness to travel" : "Disponibilidad para viajar",
    willingnessToRelocate: lang === "pt" ? "Disponibilidade para mudar" : lang === "en" ? "Willingness to relocate" : "Disponibilidad para mudarse",
    driverLicense: lang === "pt" ? "Carteira de Habilitação" : lang === "en" ? "Driver's License" : "Licencia de Conducir",
    vehicleType: lang === "pt" ? "Veículo" : lang === "en" ? "Vehicle" : "Vehículo",
  };
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{data.name}</Text>
          <Text style={{ fontSize: 10, color: "#444", marginBottom: 6 }}>{data.title}</Text>
          <View style={styles.contactRow}>
            {data.email && <Link href={`mailto:${data.email}`} style={styles.contactLink}><Text>{data.email}</Text></Link>}
            {data.phone && <Link href={`tel:${data.phone}`} style={styles.contactLink}><Text>{data.phone}</Text></Link>}
            {data.location && <Text>{data.location}</Text>}
            {data.linkedin && <Link href={data.linkedin} style={styles.contactLink}><Text>LinkedIn</Text></Link>}
            {data.github && <Link href={data.github} style={styles.contactLink}><Text>GitHub</Text></Link>}
            <Link href="https://e2-barao.vercel.app/" style={styles.contactLink}><Text>Portfolio</Text></Link>
          </View>
        </View>

        {data.summary && (
          <View style={styles.section}>
            <Text style={styles.summary}>{data.summary}</Text>
          </View>
        )}

        {data.objective && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.objective}</Text>
            <Text style={styles.summary}>{data.objective}</Text>
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

        <View style={styles.section}>
          {(() => {
            const graduations = data.education.filter(e => e.type === "graduation");
            const courses = data.education.filter(e => e.type !== "graduation");
            return (
              <>
                {graduations.length > 0 && (
                  <>
                    <Text style={styles.sectionTitle}>{t.graduation}</Text>
                    {graduations.map((edu, i) => (
                      <View key={i} style={styles.entry}>
                        <View style={styles.entryHeader}>
                          <Text style={styles.entryRole}>{edu.degree}</Text>
                          <Text style={styles.entryPeriod}>{edu.period}</Text>
                        </View>
                        <Text style={styles.entryCompany}>{edu.school}</Text>
                        {edu.description && <Text style={styles.entryDesc}>{edu.description}</Text>}
                      </View>
                    ))}
                  </>
                )}
                {courses.length > 0 && (
                  <>
                    <Text style={styles.sectionTitle}>{t.complementaryCourses}</Text>
                    {courses.map((edu, i) => (
                      <View key={i} style={styles.entry}>
                        <View style={styles.entryHeader}>
                          <Text style={styles.entryRole}>{edu.degree}</Text>
                          <Text style={styles.entryPeriod}>{edu.period}</Text>
                        </View>
                        <Text style={styles.entryCompany}>{edu.school}</Text>
                        {edu.description && <Text style={styles.entryDesc}>{edu.description}</Text>}
                      </View>
                    ))}
                  </>
                )}
              </>
            );
          })()}
        </View>

        {data.includeSkills && data.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.skills}</Text>
            <View style={styles.skillList}>
              {data.skills.map((skill, i) => (
                <Text key={i} style={styles.skillItem}>{skill}{i < data.skills.length - 1 ? " · " : ""}</Text>
              ))}
            </View>
          </View>
        )}

        {data.includeProjects && data.projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projetos</Text>
            {data.projects.map((project, i) => (
              <View key={i} style={{ marginBottom: 4 }}>
                <Text style={{ fontSize: 10, fontWeight: "bold" }}>{project.name}</Text>
                <Text style={{ fontSize: 9, color: "#333" }}>{project.description}</Text>
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

        {data.languages.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.languages}</Text>
            <Text style={{ fontSize: 9, color: "#333" }}>{data.languages.join(", ")}</Text>
          </View>
        )}

        {(data.additionalData?.willingnessToTravel || data.additionalData?.willingnessToRelocate || data.additionalData?.driverLicense || data.additionalData?.vehicleType) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.additionalData}</Text>
            <View style={{ fontSize: 9, color: "#333", lineHeight: 1.6 }}>
              {data.additionalData.willingnessToTravel && <Text>• {t.willingnessToTravel}: {data.additionalData.willingnessToTravel}</Text>}
              {data.additionalData.willingnessToRelocate && <Text>• {t.willingnessToRelocate}: {data.additionalData.willingnessToRelocate}</Text>}
              {data.additionalData.driverLicense && <Text>• {t.driverLicense}: {data.additionalData.driverLicense}</Text>}
              {data.additionalData.vehicleType && <Text>• {t.vehicleType}: {data.additionalData.vehicleType}</Text>}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
}
