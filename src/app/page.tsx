import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"

export default async function RootPage() {
  const session = await auth()
  const role = (session?.user as { role?: string })?.role
  if (role === "customer") redirect("/portal")
  redirect("/dashboard")
}
