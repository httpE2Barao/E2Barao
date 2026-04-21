import { Document, Page, Text, View, StyleSheet, Link } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica", fontSize: 10, color: "#000" },
  header: { marginBottom: 20, borderBottomWidth: 1, borderBottomColor: "#000", paddingBottom: 12 },
  name: { fontSize: 20, fontWeight: "bold", marginBottom: 4, letterSpacing: 0.5 },
  contactRow: { flexDirection: "row", flexWrap: "wrap", gap: 16, fontSize: 9, color: "#333" },
  contactLink: { color: "#0000ee", textDecoration: "none" },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 11, fontWeight: "bold", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8, paddingBottom: 3, borderBottomWidth: 0.5, borderBottomColor: "#ccc" },
  entry: { marginBottom: 8 },
  entryHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  entryRole: { fontSize: 10, fontWeight: "bold" },
  entryPeriod: { fontSize: 9, color: "#666" },
  entryCompany: { fontSize: 9, color: "#444", fontStyle: "italic", marginBottom: 2 },
  entryDesc: { fontSize: 9, color: "#333", lineHeight: 1.5 },
  skillList: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
  skillItem: { fontSize: 9, color: "#333" },
  summary: { fontSize: 9, color: "#333", lineHeight: 1.6, marginBottom: 16 },
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
          </View>
        </View>

        {data.summary && (
          <View style={styles.section}>
            <Text style={styles.summary}>{data.summary}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experience</Text>
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <View style={styles.skillList}>
            {data.skills.map((skill, i) => (
              <Text key={i} style={styles.skillItem}>{skill}{i < data.skills.length - 1 ? " · " : ""}</Text>
            ))}
          </View>
        </View>

        {data.languages.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Languages</Text>
            <Text style={{ fontSize: 9, color: "#333" }}>{data.languages.join(", ")}</Text>
          </View>
        )}

        {(data.additionalData?.willingnessToTravel || data.additionalData?.willingnessToRelocate || data.additionalData?.driverLicense || data.additionalData?.vehicleType) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Data</Text>
            <View style={{ fontSize: 9, color: "#333", lineHeight: 1.6 }}>
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
