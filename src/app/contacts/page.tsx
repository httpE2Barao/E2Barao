import { V2ContactsPage } from "@/components/v2/contacts/page"
import { V2Footer } from "@/components/v2/shared/footer"

export default function V2Contacts() {
  return (
    <main className="bg-black text-white overflow-hidden">
      <V2ContactsPage />
      <V2Footer />
    </main>
  )
}