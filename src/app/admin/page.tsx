import { redirect } from "next/navigation";

export default function AdminRedirect() {
  redirect("/admin/v2/dashboard");
}
