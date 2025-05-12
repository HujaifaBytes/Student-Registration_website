"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { generateId } from "@/lib/utils"
import { cookies } from "next/headers"

export async function registerStudent(formData: FormData) {
  try {
    console.log("Starting student registration process")

    // Extract form data
    const class_ = formData.get("class") as string
    const olympiadType = formData.get("olympiadType") as string
    const fullName = formData.get("fullName") as string
    const fatherName = formData.get("fatherName") as string
    const motherName = formData.get("motherName") as string
    const fatherMobile = formData.get("fatherMobile") as string
    const motherMobile = formData.get("motherMobile") as string
    const address = formData.get("address") as string
    const gender = formData.get("gender") as string
    const dateOfBirth = formData.get("dateOfBirth") as string
    const educationalInstitute = formData.get("educationalInstitute") as string
    const dreamUniversity = formData.get("dreamUniversity") as string
    const previousScholarship = formData.get("previousScholarship") as string
    const scholarshipDetails = formData.get("scholarshipDetails") as string
    const photo = formData.get("photo") as File | null
    const signature = formData.get("signature") as File | null

    console.log("Form data extracted:", {
      class: class_,
      olympiadType,
      fullName,
      fatherMobile,
      gender,
      dateOfBirth,
    })

    // Validate required fields
    if (
      !class_ ||
      !olympiadType ||
      !fullName ||
      !fatherName ||
      !motherName ||
      !fatherMobile ||
      !address ||
      !gender ||
      !dateOfBirth ||
      !educationalInstitute ||
      !dreamUniversity ||
      !previousScholarship
    ) {
      console.error("Missing required fields")
      return { success: false, error: "Missing required fields" }
    }

    // Check for duplicate registration
    try {
      const existingStudents = await db.student.findByNameAndMobile(fullName, fatherMobile)
      if (existingStudents && existingStudents.length > 0) {
        console.error("Duplicate registration found")
        return {
          success: false,
          error: "A student with this name and mobile number is already registered",
        }
      }
    } catch (error) {
      console.error("Error checking for duplicate registration:", error)
      // Continue with registration even if duplicate check fails
    }

    // Generate registration number
    const registrationNumber = `SSS-${new Date().getFullYear()}-${generateId(6)}`
    console.log("Generated registration number:", registrationNumber)

    // Handle photo upload (in a real app, you would upload to a storage service)
    let photoUrl = null
    if (photo && photo.size > 0) {
      // In a real implementation, upload the photo to a storage service
      // For now, we'll just pretend we have a URL
      photoUrl = `/placeholder.svg?height=200&width=150`
    }

    // Handle signature upload
    let signatureUrl = null
    if (signature && signature.size > 0) {
      // In a real implementation, upload the signature to a storage service
      signatureUrl = `/placeholder.svg?height=80&width=300`
    }

    console.log("Creating student record in database")
    // Create student record in database
    const studentId = await db.student.create({
      class: class_,
      olympiadType,
      fullName,
      fatherName,
      motherName,
      fatherMobile,
      motherMobile: motherMobile || null,
      address,
      gender,
      dateOfBirth,
      educationalInstitute,
      dreamUniversity,
      previousScholarship,
      scholarshipDetails: previousScholarship === "yes" ? scholarshipDetails : null,
      photoUrl,
      signatureUrl,
      registrationNumber,
      registrationDate: new Date().toISOString().split("T")[0],
      paymentStatus: "pending",
    })

    console.log("Student registered successfully with ID:", studentId)

    // Force revalidation of relevant paths
    revalidatePath("/")
    revalidatePath(`/student/${studentId}`)
    revalidatePath("/admin/dashboard")

    return {
      success: true,
      studentId,
      message: "Registration successful",
    }
  } catch (error) {
    console.error("Registration error:", error)
    return {
      success: false,
      error: "Failed to register student. Please try again.",
    }
  }
}

// Other functions remain the same...
export async function getStudentById(id: string) {
  try {
    const student = await db.student.findById(id)

    if (!student) {
      return { success: false, error: "Student not found" }
    }

    return { success: true, student }
  } catch (error) {
    console.error("Error fetching student:", error)
    return { success: false, error: "Failed to fetch student data" }
  }
}

export async function getAllStudents() {
  try {
    const students = await db.student.findAll()
    return { success: true, students }
  } catch (error) {
    console.error("Error fetching students:", error)
    return { success: false, error: "Failed to fetch students" }
  }
}

export async function updatePaymentStatus(id: string, status: string) {
  try {
    const result = await db.student.updatePaymentStatus(id, status)

    if (!result) {
      return { success: false, error: "Student not found" }
    }

    revalidatePath("/admin/dashboard")
    revalidatePath(`/student/${id}`)

    return { success: true, message: "Payment status updated successfully" }
  } catch (error) {
    console.error("Error updating payment status:", error)
    return { success: false, error: "Failed to update payment status" }
  }
}

export async function adminLogin(formData: FormData) {
  try {
    const username = formData.get("username") as string
    const password = formData.get("password") as string

    if (!username || !password) {
      return { success: false, error: "Username and password are required" }
    }

    // Use default admin credentials if database connection fails
    let admin = null

    try {
      admin = await db.admin.verify(username, password)
    } catch (error) {
      console.error("Database error during login:", error)
      // Fallback to hardcoded admin for emergency access
      if (username === "Science@1" && password === "Jackson.com@312") {
        admin = {
          username: "Science@1",
          name: "Admin (Emergency Access)",
        }
      }
    }

    if (!admin) {
      return { success: false, error: "Invalid username or password" }
    }

    // Set a cookie to maintain the session
    cookies().set(
      "admin_session",
      JSON.stringify({
        username: admin.username,
        name: admin.name,
        loggedIn: true,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 1 day
        path: "/",
      },
    )

    return { success: true, admin }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, error: "Login failed. Please try again." }
  }
}

export async function adminLogout() {
  try {
    cookies().delete("admin_session")
    return { success: true }
  } catch (error) {
    console.error("Logout error:", error)
    return { success: false, error: "Logout failed" }
  }
}

export async function getAdminSession() {
  try {
    const session = cookies().get("admin_session")

    if (!session) {
      return { success: false, loggedIn: false }
    }

    const sessionData = JSON.parse(session.value)

    return {
      success: true,
      loggedIn: sessionData.loggedIn,
      admin: {
        username: sessionData.username,
        name: sessionData.name,
      },
    }
  } catch (error) {
    console.error("Session error:", error)
    return { success: false, loggedIn: false }
  }
}

export async function getAdminStats() {
  try {
    const stats = await db.admin.getStats()
    return { success: true, stats }
  } catch (error) {
    console.error("Stats error:", error)
    return { success: false, error: "Failed to fetch stats" }
  }
}
