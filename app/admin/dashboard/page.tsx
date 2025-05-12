"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { ThemeToggle } from "@/components/theme-toggle"
import { getAllStudents, updatePaymentStatus, adminLogout, getAdminSession, getAdminStats } from "@/lib/actions"
import { Users, CreditCard, Clock, LogOut, Search, CheckCircle, XCircle } from "lucide-react"
import { IMAGES } from "@/lib/image-paths"

interface Student {
  id: string
  fullName: string
  class: string
  olympiadType: string
  registrationNumber: string
  registrationDate: string
  paymentStatus: string
  fatherMobile: string
  photoUrl?: string
}

interface Stats {
  totalRegistered: number
  totalPaid: number
  totalPending: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<Stats>({
    totalRegistered: 0,
    totalPaid: 0,
    totalPending: 0,
  })
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [adminName, setAdminName] = useState("")

  useEffect(() => {
    const checkSession = async () => {
      const session = await getAdminSession()
      if (session.success && session.loggedIn) {
        setAdminName(session.admin?.name || "Admin")
      } else {
        router.push("/admin/login")
      }
    }

    const fetchData = async () => {
      try {
        const [studentsResult, statsResult] = await Promise.all([getAllStudents(), getAdminStats()])

        if (studentsResult.success) {
          setStudents(studentsResult.students)
          setFilteredStudents(studentsResult.students)
        }

        if (statsResult.success) {
          setStats(statsResult.stats)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to fetch data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    checkSession()
    fetchData()
  }, [router, toast])

  useEffect(() => {
    // Apply filters and search
    let result = [...students]

    // Filter by payment status
    if (filter === "paid") {
      result = result.filter((student) => student.paymentStatus === "paid")
    } else if (filter === "pending") {
      result = result.filter((student) => student.paymentStatus === "pending")
    }

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (student) =>
          student.fullName.toLowerCase().includes(term) ||
          student.registrationNumber.toLowerCase().includes(term) ||
          student.fatherMobile.includes(term),
      )
    }

    setFilteredStudents(result)
  }, [filter, searchTerm, students])

  const handlePaymentStatusChange = async (studentId: string, status: string) => {
    try {
      const result = await updatePaymentStatus(studentId, status)

      if (result.success) {
        // Update the local state
        setStudents((prevStudents) =>
          prevStudents.map((student) => (student.id === studentId ? { ...student, paymentStatus: status } : student)),
        )

        // Update stats
        const newStats = { ...stats }
        if (status === "paid") {
          newStats.totalPaid += 1
          newStats.totalPending -= 1
        } else {
          newStats.totalPaid -= 1
          newStats.totalPending += 1
        }
        setStats(newStats)

        toast({
          title: "Success",
          description: `Payment status updated to ${status}`,
        })
      } else {
        throw new Error(result.error || "Failed to update payment status")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update payment status",
        variant: "destructive",
      })
    }
  }

  const handleLogout = async () => {
    try {
      const result = await adminLogout()

      if (result.success) {
        toast({
          title: "Logout Successful",
          description: "You have been logged out successfully.",
        })
        router.push("/admin/login")
      } else {
        throw new Error(result.error || "Logout failed")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to logout",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-emerald-600 dark:text-emerald-400">Loading dashboard...</p>
        </div>
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
              <div>
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-emerald-100">Savar Science Society</p>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-sm hidden md:block">Welcome, {adminName}</p>
            <ThemeToggle />
            <Button
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-emerald-700 hover:text-white"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-emerald-200 dark:border-emerald-700 dark:bg-gray-800">
            <CardContent className="p-6 flex items-center">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 p-4 rounded-full mr-4">
                <Users className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Total Registrations</p>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{stats.totalRegistered}</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 dark:border-emerald-700 dark:bg-gray-800">
            <CardContent className="p-6 flex items-center">
              <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full mr-4">
                <CreditCard className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Payment Completed</p>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{stats.totalPaid}</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 dark:border-emerald-700 dark:bg-gray-800">
            <CardContent className="p-6 flex items-center">
              <div className="bg-yellow-100 dark:bg-yellow-900/30 p-4 rounded-full mr-4">
                <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Payment Pending</p>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{stats.totalPending}</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Students Table */}
        <Card className="border-emerald-200 dark:border-emerald-700 dark:bg-gray-800">
          <CardHeader className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Student Registrations</h2>

              <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, ID, phone..."
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-full md:w-40 border-gray-300 dark:border-gray-600 dark:bg-gray-700">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Students</SelectItem>
                    <SelectItem value="paid">Payment Completed</SelectItem>
                    <SelectItem value="pending">Payment Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>

          {/* Students Table */}
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-800">
                    <TableHead className="font-semibold">Photo</TableHead>
                    <TableHead className="font-semibold">Name</TableHead>
                    <TableHead className="font-semibold">Registration No.</TableHead>
                    <TableHead className="font-semibold">Class</TableHead>
                    <TableHead className="font-semibold">Olympiad</TableHead>
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold">Father's Mobile</TableHead>
                    <TableHead className="font-semibold">Payment Status</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <TableRow key={student.id} className="border-t border-gray-200 dark:border-gray-700">
                        <TableCell>
                          <div className="w-10 h-10 relative overflow-hidden rounded-full">
                            {student.photoUrl ? (
                              <Image
                                src={student.photoUrl || "/placeholder.svg"}
                                alt={student.fullName}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                <span className="text-gray-500 dark:text-gray-400 text-xs">No img</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{student.fullName}</TableCell>
                        <TableCell>{student.registrationNumber}</TableCell>
                        <TableCell>{student.class}</TableCell>
                        <TableCell>{student.olympiadType}</TableCell>
                        <TableCell>{student.registrationDate}</TableCell>
                        <TableCell>{student.fatherMobile}</TableCell>
                        <TableCell>
                          <Badge
                            variant={student.paymentStatus === "paid" ? "default" : "secondary"}
                            className={
                              student.paymentStatus === "paid"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                            }
                          >
                            {student.paymentStatus === "paid" ? (
                              <CheckCircle className="h-3.5 w-3.5 mr-1" />
                            ) : (
                              <Clock className="h-3.5 w-3.5 mr-1" />
                            )}
                            {student.paymentStatus === "paid" ? "Paid" : "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-900/30"
                              onClick={() => router.push(`/student/${student.id}`)}
                            >
                              View
                            </Button>

                            {student.paymentStatus === "pending" ? (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/30"
                                onClick={() => handlePaymentStatusChange(student.id, "paid")}
                              >
                                <CheckCircle className="h-3.5 w-3.5 mr-1" />
                                Mark Paid
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 border-yellow-200 text-yellow-700 hover:bg-yellow-50 dark:border-yellow-800 dark:text-yellow-400 dark:hover:bg-yellow-900/30"
                                onClick={() => handlePaymentStatusChange(student.id, "pending")}
                              >
                                <XCircle className="h-3.5 w-3.5 mr-1" />
                                Mark Pending
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-gray-500 dark:text-gray-400">
                        {searchTerm || filter !== "all"
                          ? "No students match your search criteria"
                          : "No students registered yet"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="bg-emerald-600 dark:bg-emerald-700 text-white py-4 border-t border-emerald-700 dark:border-emerald-800 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 Savar Science Society. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
