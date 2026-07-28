import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { auth } from "@/auth"

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let session = null;
  try {
    session = await auth()
  } catch (e) {
    console.error("Auth session error:", e)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header session={session} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
