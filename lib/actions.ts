"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { supabaseServer } from "./supabase"

export async function registerStudent(formData: FormData) {
  try {
    console.log("Starting student registration process with Supabase")

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
      const { data: existingStudents, error: checkError } = await supabaseServer
        .from("students")
        .select("id")
        .eq("full_name", fullName)
        .eq("father_mobile", fatherMobile)

      if (checkError) {
        console.error("Error checking for duplicate registration:", checkError)
      } else if (existingStudents && existingStudents.length > 0) {
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

    // Generate registration number using the database function
    const { data: registrationData, error: registrationError } =
      await supabaseServer.rpc("generate_registration_number")

    if (registrationError) {
      console.error("Error generating registration number:", registrationError)
      return { success: false, error: "Failed to generate registration number" }
    }

    const registrationNumber = registrationData || `SSS-${new Date().getFullYear()}-0001`
    console.log("Generated registration number:", registrationNumber)

    // Handle photo upload (in a real app, you would upload to Supabase Storage)
    let photoUrl = null
    if (photo && photo.size > 0) {
      // For now, we'll just use a placeholder
      photoUrl = `/placeholder.svg?height=200&width=150`

      // In a production app, you would upload to Supabase Storage like this:
      /*
      const photoBuffer = await photo.arrayBuffer()
      const photoFileName = `${registrationNumber}-photo.${photo.name.split('.').pop()}`
      const { data: photoData, error: photoError } = await supabaseServer.storage
        .from('student-photos')
        .upload(photoFileName, photoBuffer, {
          contentType: photo.type,
        })
      
      if (photoError) {
        console.error("Error uploading photo:", photoError)
      } else if (photoData) {
        const { data: photoUrlData } = supabaseServer.storage
          .from('student-photos')
          .getPublicUrl(photoData.path)
        
        photoUrl = photoUrlData.publicUrl
      }
      */
    }

    // Handle signature upload
    let signatureUrl = null
    if (signature && signature.size > 0) {
      // For now, we'll just use a placeholder
      signatureUrl = `/placeholder.svg?height=80&width=300`

      // Similar code for signature upload would go here in production
    }

    console.log("Creating student record in Supabase")

    // Create student record in Supabase
    const { data: student, error: insertError } = await supabaseServer
      .from("students")
      .insert({
        class: class_,
        olympiad_type: olympiadType,
        full_name: fullName,
        father_name: fatherName,
        mother_name: motherName,
        father_mobile: fatherMobile,
        mother_mobile: motherMobile || null,
        address,
        gender,
        date_of_birth: dateOfBirth,
        educational_institute: educationalInstitute,
        dream_university: dreamUniversity,
        previous_scholarship: previousScholarship,
        scholarship_details: previousScholarship === "yes" ? scholarshipDetails : null,
        photo_url: photoUrl,
        signature_url: signatureUrl,
        registration_number: registrationNumber,
        payment_status: "pending",
      })
      .select("id")
      .single()

    if (insertError) {
      console.error("Error inserting student:", insertError)
      return { success: false, error: "Failed to register student. Please try again." }
    }

    console.log("Student registered successfully with ID:", student?.id)

    // Force revalidation of relevant paths
    revalidatePath("/")
    revalidatePath(`/student/${student?.id}`)
    revalidatePath("/admin/dashboard")

    return {
      success: true,
      studentId: student?.id,
      registrationNumber,
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

export async function getStudentById(id: string) {
  try {
    const { data: student, error } = await supabaseServer.from("students").select("*").eq("id", id).single()

    if (error || !student) {
      return { success: false, error: "Student not found" }
    }

    return {
      success: true,
      student: {
        ...student,
        id: student.id,
        class: student.class,
        olympiadType: student.olympiad_type,
        fullName: student.full_name,
        fatherName: student.father_name,
        motherName: student.mother_name,
        fatherMobile: student.father_mobile,
        motherMobile: student.mother_mobile,
        dateOfBirth: student.date_of_birth,
        educationalInstitute: student.educational_institute,
        dreamUniversity: student.dream_university,
        previousScholarship: student.previous_scholarship,
        scholarshipDetails: student.scholarship_details,
        photoUrl: student.photo_url,
        signatureUrl: student.signature_url,
        registrationNumber: student.registration_number,
        registrationDate: new Date(student.registration_date).toISOString().split("T")[0],
        paymentStatus: student.payment_status,
      },
    }
  } catch (error) {
    console.error("Error fetching student:", error)
    return { success: false, error: "Failed to fetch student data" }
  }
}

export async function getAllStudents() {
  try {
    const { data: students, error } = await supabaseServer
      .from("students")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      throw error
    }

    return {
      success: true,
      students: students.map((student) => ({
        id: student.id,
        fullName: student.full_name,
        class: student.class,
        olympiadType: student.olympiad_type,
        registrationNumber: student.registration_number,
        registrationDate: new Date(student.registration_date).toISOString().split("T")[0],
        paymentStatus: student.payment_status,
        fatherMobile: student.father_mobile,
        photoUrl: student.photo_url,
      })),
    }
  } catch (error) {
    console.error("Error fetching students:", error)
    return { success: false, error: "Failed to fetch students" }
  }
}

export async function updatePaymentStatus(id: string, status: string) {
  try {
    const { error } = await supabaseServer.from("students").update({ payment_status: status }).eq("id", id)

    if (error) {
      return { success: false, error: "Student not found or update failed" }
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

    // Verify admin credentials
    const { data: admin, error } = await supabaseServer
      .from("admins")
      .select("username, name")
      .eq("username", username)
      .eq("password", password)
      .single()

    if (error || !admin) {
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
    // Get total registered students
    const { count: totalRegistered, error: countError } = await supabaseServer
      .from("students")
      .select("*", { count: "exact", head: true })

    if (countError) throw countError

    // Get total paid students
    const { count: totalPaid, error: paidError } = await supabaseServer
      .from("students")
      .select("*", { count: "exact", head: true })
      .eq("payment_status", "paid")

    if (paidError) throw paidError

    // Get total pending students
    const { count: totalPending, error: pendingError } = await supabaseServer
      .from("students")
      .select("*", { count: "exact", head: true })
      .eq("payment_status", "pending")

    if (pendingError) throw pendingError

    return {
      success: true,
      stats: {
        totalRegistered: totalRegistered || 0,
        totalPaid: totalPaid || 0,
        totalPending: totalPending || 0,
      },
    }
  } catch (error) {
    console.error("Stats error:", error)
    return {
      success: false,
      error: "Failed to fetch stats",
      stats: {
        totalRegistered: 0,
        totalPaid: 0,
        totalPending: 0,
      },
    }
  }
}
