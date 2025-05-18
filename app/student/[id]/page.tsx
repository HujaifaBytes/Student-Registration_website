"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { getStudentById, updatePaymentStatus } from "@/lib/actions"
import { Loader2, Phone, CheckCircle } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useToast } from "@/components/ui/use-toast"
import { MobileNav } from "@/components/mobile-nav"
import { IMAGES, SOCIAL_LINKS } from "@/lib/image-paths"
import { MainNav } from "@/components/main-nav"

interface StudentData {
  id: string
  class: string
  olympiadType: string
  fullName: string
  fatherName: string
  motherName: string
  fatherMobile: string
  motherMobile: string
  address: string
  gender: string
  dateOfBirth: string
  educationalInstitute: string
  dreamUniversity: string
  previousScholarship: string
  scholarshipDetails: string
  photoUrl: string
  signatureUrl: string
  registrationDate: string
  registrationNumber: string
  paymentStatus: string
}

export default function StudentProfile({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const [student, setStudent] = useState<StudentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processingPayment, setProcessingPayment] = useState(false)
  const [photoError, setPhotoError] = useState(false)

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const data = await getStudentById(params.id)
        if (data.success) {
          setStudent(data.student)
        } else {
          setError(data.error || "Failed to fetch student data")
        }
      } catch (err) {
        setError("An unexpected error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchStudentData()
  }, [params.id])

  const handlePayment = async () => {
    if (!student) return

    setProcessingPayment(true)

    try {
      // In a real app, this would integrate with a payment gateway
      // For now, we'll simulate a payment process with a timeout
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Update the payment status in the database
      const result = await updatePaymentStatus(student.id, "paid")

      if (result.success) {
        setStudent({
          ...student,
          paymentStatus: "paid",
        })

        toast({
          title: "Payment Successful",
          description: "Your payment has been processed successfully.",
        })
      } else {
        throw new Error(result.error || "Payment failed")
      }
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setProcessingPayment(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500 mx-auto" />
          <p className="text-emerald-700 mt-4">Loading student information...</p>
        </div>
      </div>
    )
  }

  if (error || !student) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Card className="max-w-md w-full border-emerald-200">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold text-emerald-700 mb-4">Error</h2>
            <p className="text-emerald-600 mb-6">{error || "Student not found"}</p>
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
              <Link href="/">Return to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

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
        <Card className="max-w-4xl mx-auto border-0 shadow-none">
          <CardHeader className="bg-emerald-600 dark:bg-emerald-700 p-4 flex flex-col md:flex-row items-center justify-between rounded-t-lg">
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-white">SAVAR SCIENCE SOCIETY</h1>
              <p className="text-yellow-300 font-semibold">PRESENTS</p>
              <h2 className="text-xl md:text-2xl font-bold text-white mt-2">MATH & SCIENCE OLYMPIAD</h2>
            </div>
            <div className="mt-4 md:mt-0">
              <Image
                src={IMAGES.LOGO || "/placeholder.svg"}
                alt="Savar Science Society Logo"
                width={80}
                height={80}
                className="rounded-full"
              />
            </div>
          </CardHeader>

          <CardContent className="p-6 border border-gray-200 dark:border-gray-700 rounded-b-lg dark:bg-gray-800">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-400 mb-2">
                  Registration Information
                </h3>
                <p className="text-emerald-600 dark:text-emerald-300">
                  Registration Number: {student.registrationNumber}
                </p>
                <p className="text-gray-700 dark:text-gray-300">Registered on: {student.registrationDate}</p>
              </div>
              <div className="w-32 h-40 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 relative overflow-hidden">
                {student.photoUrl && !photoError ? (
                  <Image
                    src={student.photoUrl || "/placeholder.svg"}
                    alt="Student Photo"
                    fill
                    style={{ objectFit: "cover" }}
                    onError={() => setPhotoError(true)}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-400 dark:text-gray-500 text-xs text-center">No Photo</p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-emerald-700 dark:text-emerald-400">Class</h4>
                <p className="text-emerald-600 dark:text-emerald-300">{student.class}</p>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-emerald-700 dark:text-emerald-400">Olympiad Type</h4>
                <p className="text-emerald-600 dark:text-emerald-300">{student.olympiadType}</p>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 border-b border-emerald-600 dark:border-emerald-400 pb-1">
                PERSONAL INFORMATION
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-emerald-600 dark:text-emerald-300">Full Name</p>
                  <p className="text-gray-700 dark:text-gray-300 font-medium">{student.fullName}</p>
                </div>

                <div>
                  <p className="text-emerald-600 dark:text-emerald-300">Gender</p>
                  <p className="text-gray-700 dark:text-gray-300 font-medium">{student.gender}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-emerald-600 dark:text-emerald-300">Father's Name</p>
                  <p className="text-gray-700 dark:text-gray-300 font-medium">{student.fatherName}</p>
                </div>

                <div>
                  <p className="text-emerald-600 dark:text-emerald-300">Father's Mobile</p>
                  <p className="text-gray-700 dark:text-gray-300 font-medium">{student.fatherMobile}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-emerald-600 dark:text-emerald-300">Mother's Name</p>
                  <p className="text-gray-700 dark:text-gray-300 font-medium">{student.motherName}</p>
                </div>

                <div>
                  <p className="text-emerald-600 dark:text-emerald-300">Mother's Mobile</p>
                  <p className="text-gray-700 dark:text-gray-300 font-medium">{student.motherMobile || "N/A"}</p>
                </div>
              </div>

              <div>
                <p className="text-emerald-600 dark:text-emerald-300">Present Address</p>
                <p className="text-gray-700 dark:text-gray-300 font-medium">{student.address}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-emerald-600 dark:text-emerald-300">Date of Birth</p>
                  <p className="text-gray-700 dark:text-gray-300 font-medium">{student.dateOfBirth}</p>
                </div>

                <div>
                  <p className="text-emerald-600 dark:text-emerald-300">Educational Institute</p>
                  <p className="text-gray-700 dark:text-gray-300 font-medium">{student.educationalInstitute}</p>
                </div>
              </div>

              <div>
                <p className="text-emerald-600 dark:text-emerald-300">Dream University</p>
                <p className="text-gray-700 dark:text-gray-300 font-medium">{student.dreamUniversity}</p>
              </div>

              <div>
                <p className="text-emerald-600 dark:text-emerald-300">Previous Scholarship</p>
                <p className="text-gray-700 dark:text-gray-300 font-medium">
                  {student.previousScholarship === "yes" ? `Yes - ${student.scholarshipDetails}` : "No"}
                </p>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-300 dark:border-gray-700">
              <h4 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mb-4">Payment Status</h4>
              <div className="bg-white dark:bg-gray-700 p-4 rounded-md border border-gray-200 dark:border-gray-600">
                {student.paymentStatus === "paid" ? (
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <CheckCircle className="h-8 w-8 text-green-500 dark:text-green-400" />
                    </div>
                    <p className="text-green-600 dark:text-green-400 font-semibold mb-2">Payment Completed</p>
                    <p className="text-gray-700 dark:text-gray-300">
                      Your registration is confirmed. Please bring your registration details on the exam day.
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                      Status: <span className="text-yellow-600 dark:text-yellow-400">Pending</span>
                    </p>
                    <p className="text-emerald-600 dark:text-emerald-300 mb-4">
                      Please complete your payment to confirm your registration.
                    </p>
                    <Button
                      className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                      onClick={handlePayment}
                      disabled={processingPayment}
                    >
                      {processingPayment ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Proceed to Payment"
                      )}
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-red-500 dark:text-red-400 font-bold">EXAM DATE: 26 JULY 2025</p>
              <p className="text-emerald-600 dark:text-emerald-300 mt-2">
                Please bring your registration details on the exam day
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="flex flex-col items-center">
                <Image
                  src={IMAGES.FACEBOOK_QR || "/placeholder.svg"}
                  alt="Facebook QR Code"
                  width={100}
                  height={100}
                  className="bg-white p-1 rounded"
                />
                <p className="text-gray-700 dark:text-gray-300 text-xs mt-1">☝️Follow on Facebook</p>
              </div>
              <div className="flex flex-col items-center">
                <Image
                  src={IMAGES.YOUTUBE_QR || "/placeholder.svg"}
                  alt="YouTube QR Code"
                  width={100}
                  height={100}
                  className="bg-white p-1 rounded"
                />
                <p className="text-gray-700 dark:text-gray-300 text-xs mt-1">☝️Visit Our Channel</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="bg-emerald-600 dark:bg-emerald-700 text-white py-8 border-t border-emerald-700 dark:border-emerald-800 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 Savar Science Society. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-4">
            <Link href={SOCIAL_LINKS.FACEBOOK} className="text-white hover:text-white">
              Facebook
            </Link>
            <Link href={SOCIAL_LINKS.YOUTUBE} className="text-white hover:text-white">
              YouTube
            </Link>
          </div>
          <div className="mt-4 flex justify-center gap-8">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <p>Abu Bakkar Siddique: +8801518405600</p>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <p>Hujaifa Khan: +8801730903744</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
