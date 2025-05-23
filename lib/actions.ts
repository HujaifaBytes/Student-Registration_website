"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { supabaseServer } from "./supabase"
import { processImage } from "./image-processing"

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
      hasPhoto: !!photo,
      photoSize: photo ? photo.size : 0,
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

    // Handle photo upload
    let photoUrl = null
    if (photo && photo.size > 0) {
      try {
        console.log("Processing photo for upload...")
        // Process the image to ensure it's 600x600
        const { buffer: processedPhoto, contentType } = await processImage(photo, 600, 600)
        console.log("Photo processed successfully, size:", processedPhoto.length)

        // Create a safe filename
        const photoFileName = `${registrationNumber.replace(/[^a-zA-Z0-9]/g, "-")}-photo.jpg`
        console.log("Uploading photo with filename:", photoFileName)

        // Upload to Supabase Storage
        const { data: photoData, error: photoError } = await supabaseServer.storage
          .from("student-photos")
          .upload(photoFileName, processedPhoto, {
            contentType,
            upsert: true,
          })

        if (photoError) {
          console.error("Error uploading photo to Supabase storage:", photoError)
        } else if (photoData) {
          console.log("Photo uploaded successfully, path:", photoData.path)

          // Get the public URL
          const { data: photoUrlData } = supabaseServer.storage.from("student-photos").getPublicUrl(photoData.path)
          photoUrl = photoUrlData.publicUrl
          console.log("Photo public URL:", photoUrl)
        }
      } catch (error) {
        console.error("Error processing or uploading photo:", error)
        // If processing fails, we'll continue without a photo
        photoUrl = "/placeholder.svg?height=200&width=150"
      }
    } else {
      console.log("No photo provided or photo is empty")
      photoUrl = "/placeholder.svg?height=200&width=150"
    }

    // Handle signature upload (optional)
    let signatureUrl = null
    if (signature && signature.size > 0) {
      try {
        console.log("Processing signature for upload...")
        // Process the signature to ensure it's 300x80
        const { buffer: processedSignature, contentType } = await processImage(signature, 300, 80)
        console.log("Signature processed successfully, size:", processedSignature.length)

        // Create a safe filename
        const signatureFileName = `${registrationNumber.replace(/[^a-zA-Z0-9]/g, "-")}-signature.jpg`
        console.log("Uploading signature with filename:", signatureFileName)

        // Upload to Supabase Storage
        const { data: signatureData, error: signatureError } = await supabaseServer.storage
          .from("student-signatures")
          .upload(signatureFileName, processedSignature, {
            contentType,
            upsert: true,
          })

        if (signatureError) {
          console.error("Error uploading signature to Supabase storage:", signatureError)
        } else if (signatureData) {
          console.log("Signature uploaded successfully, path:", signatureData.path)

          // Get the public URL
          const { data: signatureUrlData } = supabaseServer.storage
            .from("student-signatures")
            .getPublicUrl(signatureData.path)
          signatureUrl = signatureUrlData.publicUrl
          console.log("Signature public URL:", signatureUrl)
        }
      } catch (error) {
        console.error("Error processing or uploading signature:", error)
        // If processing fails, we'll continue without a signature
        signatureUrl = "/placeholder.svg?height=80&width=300"
      }
    } else {
      console.log("No signature provided or signature is empty")
      signatureUrl = "/placeholder.svg?height=80&width=300"
    }

    console.log("Creating student record in Supabase with photo URL:", photoUrl)

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

export async function deleteStudent(id: string) {
  try {
    // First get the student to get file paths
    const { data: student, error: getError } = await supabaseServer
      .from("students")
      .select("registration_number, photo_url, signature_url")
      .eq("id", id)
      .single()

    if (getError) {
      console.error("Error fetching student for deletion:", getError)
    } else if (student) {
      // Delete files from storage if they exist
      if (student.photo_url && !student.photo_url.includes("placeholder")) {
        const photoPath = student.photo_url.split("/").pop() // Get filename from URL
        if (photoPath) {
          await supabaseServer.storage.from("student-photos").remove([photoPath])
        }
      }

      if (student.signature_url && !student.signature_url.includes("placeholder")) {
        const signaturePath = student.signature_url.split("/").pop() // Get filename from URL
        if (signaturePath) {
          await supabaseServer.storage.from("student-signatures").remove([signaturePath])
        }
      }
    }

    // Delete the student record
    const { error } = await supabaseServer.from("students").delete().eq("id", id)

    if (error) {
      return { success: false, error: "Failed to delete student" }
    }

    revalidatePath("/admin/dashboard")
    return { success: true, message: "Student deleted successfully" }
  } catch (error) {
    console.error("Error deleting student:", error)
    return { success: false, error: "Failed to delete student" }
  }
}

export async function addStudent(studentData: any) {
  try {
    // Generate registration number using the database function
    const { data: registrationData, error: registrationError } =
      await supabaseServer.rpc("generate_registration_number")

    if (registrationError) {
      console.error("Error generating registration number:", registrationError)
      return { success: false, error: "Failed to generate registration number" }
    }

    const registrationNumber = registrationData || `SSS-${new Date().getFullYear()}-0001`

    // Insert the student record
    const { data: student, error: insertError } = await supabaseServer
      .from("students")
      .insert({
        class: studentData.class,
        olympiad_type: studentData.olympiadType,
        full_name: studentData.fullName,
        father_name: studentData.fatherName,
        mother_name: studentData.motherName,
        father_mobile: studentData.fatherMobile,
        mother_mobile: studentData.motherMobile || null,
        address: studentData.address,
        gender: studentData.gender,
        date_of_birth: studentData.dateOfBirth,
        educational_institute: studentData.educationalInstitute,
        dream_university: studentData.dreamUniversity,
        previous_scholarship: studentData.previousScholarship,
        scholarship_details: studentData.previousScholarship === "yes" ? studentData.scholarshipDetails : null,
        photo_url: "/placeholder.svg?height=200&width=150", // Default placeholder
        signature_url: "/placeholder.svg?height=80&width=300", // Default placeholder
        registration_number: registrationNumber,
        payment_status: "pending",
      })
      .select("id")
      .single()

    if (insertError) {
      console.error("Error inserting student:", insertError)
      return { success: false, error: "Failed to add student. Please try again." }
    }

    revalidatePath("/admin/dashboard")
    return { success: true, studentId: student?.id, message: "Student added successfully" }
  } catch (error) {
    console.error("Error adding student:", error)
    return { success: false, error: "Failed to add student. Please try again." }
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
