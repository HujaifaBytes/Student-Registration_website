import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { Phone, Facebook, Youtube } from "lucide-react"
import { MobileNav } from "@/components/mobile-nav"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <header className="bg-emerald-600 dark:bg-emerald-700 text-white py-4 border-b border-emerald-700 dark:border-emerald-800">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Savar Science Society Logo" width={50} height={50} className="rounded-full" />
            <h1 className="text-xl font-bold">Savar Science Society</h1>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex gap-6">
              <Link href="/" className="hover:text-white">
                Home
              </Link>
              <Link href="/register" className="hover:text-white">
                Register
              </Link>
              <Link href="/contact" className="hover:text-white">
                Contact
              </Link>
              <Link href="/admin/login" className="hover:text-white">
                Admin
              </Link>
            </nav>
            <ThemeToggle />
            <MobileNav />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-center text-emerald-700 dark:text-emerald-400 mb-12">Contact Us</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="border-emerald-200 dark:border-emerald-700 overflow-hidden dark:bg-gray-800">
            <CardHeader className="bg-emerald-600 dark:bg-emerald-700 text-white p-4">
              <div className="flex items-center gap-3">
                <Facebook className="h-6 w-6" />
                <h2 className="text-xl font-bold">Follow Us on Facebook</h2>
              </div>
            </CardHeader>
            <CardContent className="p-6 flex flex-col items-center">
              <p className="text-emerald-700 dark:text-emerald-400 mb-4 text-center">
                Follow our Facebook page to get the latest updates about the Olympiad and other events.
              </p>
              <div className="flex flex-col items-center">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/qrcode_www.facebook.com-5eHQehQgQurQ6wqlpiojCbKIK4Jc0q.png"
                  alt="Facebook QR Code"
                  width={200}
                  height={200}
                  className="bg-white p-2 border border-gray-200 dark:border-gray-700 rounded mb-1"
                />
                <p className="text-emerald-700 dark:text-emerald-400 text-sm mb-3">☝️Follow on Facebook</p>
              </div>
              <Button asChild className="bg-blue-600 hover:bg-blue-700 mt-2">
                <Link href="https://www.facebook.com/savarsciencesociety" target="_blank">
                  <Facebook className="mr-2 h-4 w-4" /> Join Our Page
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 dark:border-emerald-700 overflow-hidden dark:bg-gray-800">
            <CardHeader className="bg-emerald-600 dark:bg-emerald-700 text-white p-4">
              <div className="flex items-center gap-3">
                <Youtube className="h-6 w-6" />
                <h2 className="text-xl font-bold">Watch Our Videos</h2>
              </div>
            </CardHeader>
            <CardContent className="p-6 flex flex-col items-center">
              <p className="text-emerald-700 dark:text-emerald-400 mb-4 text-center">
                Subscribe to our YouTube channel for educational content and event highlights.
              </p>
              <div className="flex flex-col items-center">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/qrcode_www.youtube.com-s1tZ8a3uNNSEX3SZgkp1KJseQ8KeYx.png"
                  alt="YouTube QR Code"
                  width={200}
                  height={200}
                  className="bg-white p-2 border border-gray-200 dark:border-gray-700 rounded mb-1"
                />
                <p className="text-emerald-700 dark:text-emerald-400 text-sm mb-3">☝️Visit Our Channel</p>
              </div>
              <Button asChild className="bg-red-600 hover:bg-red-700 mt-2">
                <Link href="https://www.youtube.com/@SavarScienceSociety" target="_blank">
                  <Youtube className="mr-2 h-4 w-4" /> Visit Our Channel
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 max-w-4xl mx-auto">
          <Card className="border-emerald-200 dark:border-emerald-700 dark:bg-gray-800">
            <CardHeader className="bg-emerald-600 dark:bg-emerald-700 text-white p-4">
              <div className="flex items-center gap-3">
                <Phone className="h-6 w-6" />
                <h2 className="text-xl font-bold">Contact Coordinators</h2>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-emerald-50 dark:bg-emerald-900/30 p-4 rounded-lg border border-emerald-100 dark:border-emerald-800">
                  <h3 className="text-lg font-semibold text-emerald-700 dark:text-emerald-400 mb-2">
                    Abu Bakkar Siddique
                  </h3>
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-300">
                    <Phone className="h-4 w-4" />
                    <span>+8801518405600</span>
                  </div>
                  <Button asChild className="mt-4 bg-green-500 hover:bg-green-600 w-full">
                    <Link href="https://wa.me/8801518405600" target="_blank">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="white"
                        className="mr-2"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      Chat on WhatsApp
                    </Link>
                  </Button>
                </div>

                <div className="bg-emerald-50 dark:bg-emerald-900/30 p-4 rounded-lg border border-emerald-100 dark:border-emerald-800">
                  <h3 className="text-lg font-semibold text-emerald-700 dark:text-emerald-400 mb-2">Hujaifa Khan</h3>
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-300">
                    <Phone className="h-4 w-4" />
                    <span>+8801730903744</span>
                  </div>
                  <Button asChild className="mt-4 bg-green-500 hover:bg-green-600 w-full">
                    <Link href="https://wa.me/8801730903744" target="_blank">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="white"
                        className="mr-2"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      Chat on WhatsApp
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="bg-emerald-600 dark:bg-emerald-700 text-white py-8 border-t border-emerald-700 dark:border-emerald-800 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 Savar Science Society. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-4">
            <Link href="https://www.facebook.com/savarsciencesociety" className="text-white hover:text-white">
              Facebook
            </Link>
            <Link href="https://www.youtube.com/@SavarScienceSociety" className="text-white hover:text-white">
              YouTube
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
