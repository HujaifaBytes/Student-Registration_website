import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { ThemeToggle } from "@/components/theme-toggle"
import { Phone } from "lucide-react"
import { MobileNav } from "@/components/mobile-nav"
import { IMAGES, SOCIAL_LINKS } from "@/lib/image-paths"
import { MainNav } from "@/components/main-nav"

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <header className="bg-emerald-600 dark:bg-emerald-700 text-white py-4 border-b border-emerald-700 dark:border-emerald-800">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
              <Image
                src={IMAGES.LOGO || "/placeholder.svg"}
                alt="Savar Science Society Logo"
                width={50}
                height={50}
                className="rounded-full"
              />
              <h1 className="text-xl font-bold">Savar Science Society</h1>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <MainNav />
            <ThemeToggle />
            <MobileNav />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg border border-emerald-200 dark:border-emerald-700 shadow-lg mb-12">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-emerald-700 dark:text-emerald-400 mb-4">
                MATH & SCIENCE <span className="text-emerald-600 dark:text-emerald-300">OLYMPIAD</span> 2025
              </h1>
              <p className="text-gray-700 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                Join the prestigious competition to showcase your talent and win exciting prizes and scholarships.
              </p>
              <div className="mt-6">
                <Button
                  asChild
                  className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white px-8 py-6 text-lg rounded-md"
                >
                  <Link href="/register">Register Now</Link>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <Card className="bg-white dark:bg-gray-800 border-emerald-200 dark:border-emerald-700 hover:border-emerald-600 dark:hover:border-emerald-500 transition duration-300">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-400 mb-2">Science Olympiad</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    For classes 5-10. Test your scientific knowledge and problem-solving skills.
                  </p>
                  <p className="text-emerald-600 dark:text-emerald-400 font-semibold">Classes 5-10</p>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 border-emerald-200 dark:border-emerald-700 hover:border-emerald-600 dark:hover:border-emerald-500 transition duration-300">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-400 mb-2">Math Olympiad</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Challenge yourself with complex mathematical problems and puzzles.
                  </p>
                  <p className="text-emerald-600 dark:text-emerald-400 font-semibold">Classes 5-10</p>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 border-emerald-200 dark:border-emerald-700 hover:border-emerald-600 dark:hover:border-emerald-500 transition duration-300">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-400 mb-2">Physics Olympiad</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Explore the laws of physics through challenging problems and experiments.
                  </p>
                  <p className="text-emerald-600 dark:text-emerald-400 font-semibold">Classes 8-10</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="text-center text-emerald-700 dark:text-emerald-400 mb-12">
            <h2 className="text-3xl font-bold mb-6">Important Dates</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-emerald-200 dark:border-emerald-700">
                <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-300 mb-2">Registration Deadline</h3>
                <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">20 July 2025</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-emerald-200 dark:border-emerald-700">
                <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-300 mb-2">Exam Date</h3>
                <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">26 July 2025</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-emerald-200 dark:border-emerald-700">
                <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-300 mb-2">Results</h3>
                <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">10 August 2025</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-emerald-600 dark:bg-emerald-700 text-white py-8 border-t border-emerald-700 dark:border-emerald-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Savar Science Society</h3>
              <p className="text-white">Promoting excellence in science and mathematics education.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contact</h3>
              <div className="flex items-center gap-2 mb-2">
                <Phone className="h-4 w-4" />
                <p className="text-white">Abu Bakkar Siddique: +8801518405600</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <p className="text-white">Hujaifa Khan: +8801730903744</p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Follow Us</h3>
              <div className="flex gap-4 items-center">
                <Link href={SOCIAL_LINKS.FACEBOOK} className="text-white hover:text-white">
                  Facebook
                </Link>
                <Link href={SOCIAL_LINKS.YOUTUBE} className="text-white hover:text-white">
                  YouTube
                </Link>
              </div>
              <div className="flex gap-4 mt-4">
                <div className="flex flex-col items-center">
                  <Image
                    src={IMAGES.FACEBOOK_QR || "/placeholder.svg"}
                    alt="Facebook QR Code"
                    width={80}
                    height={80}
                    className="bg-white p-1 rounded"
                  />
                  <p className="text-white text-xs mt-1">☝️Follow on Facebook</p>
                </div>
                <div className="flex flex-col items-center">
                  <Image
                    src={IMAGES.YOUTUBE_QR || "/placeholder.svg"}
                    alt="YouTube QR Code"
                    width={80}
                    height={80}
                    className="bg-white p-1 rounded"
                  />
                  <p className="text-white text-xs mt-1">☝️Visit Our Channel</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white text-center text-white">
            <p>© 2025 Savar Science Society. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
