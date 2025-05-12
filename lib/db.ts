import clientPromise from "./mongodb"
import { ObjectId } from "mongodb"

export const db = {
  student: {
    async create(data: any) {
      try {
        const client = await clientPromise
        const db = client.db("olympiad")
        const collection = db.collection("students")

        const result = await collection.insertOne({
          ...data,
          registrationDate: new Date().toISOString().split("T")[0],
          createdAt: new Date(),
        })

        return result.insertedId.toString()
      } catch (error) {
        console.error("Error creating student:", error)
        throw error
      }
    },

    async findById(id: string) {
      try {
        const client = await clientPromise
        const db = client.db("olympiad")
        const collection = db.collection("students")

        const student = await collection.findOne({ _id: new ObjectId(id) })

        if (!student) return null

        return {
          ...student,
          id: student._id.toString(),
        }
      } catch (error) {
        console.error("Error finding student by ID:", error)
        return null
      }
    },

    async findByNameAndMobile(fullName: string, fatherMobile: string) {
      try {
        const client = await clientPromise
        const db = client.db("olympiad")
        const collection = db.collection("students")

        const students = await collection
          .find({
            fullName: fullName,
            fatherMobile: fatherMobile,
          })
          .toArray()

        return students.map((student) => ({
          ...student,
          id: student._id.toString(),
        }))
      } catch (error) {
        console.error("Error finding student by name and mobile:", error)
        return []
      }
    },

    async findAll() {
      try {
        const client = await clientPromise
        const db = client.db("olympiad")
        const collection = db.collection("students")

        const students = await collection.find({}).sort({ registrationDate: -1 }).toArray()

        return students.map((student) => ({
          ...student,
          id: student._id.toString(),
        }))
      } catch (error) {
        console.error("Error finding all students:", error)
        return []
      }
    },

    async updatePaymentStatus(id: string, status: string) {
      try {
        const client = await clientPromise
        const db = client.db("olympiad")
        const collection = db.collection("students")

        const result = await collection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { paymentStatus: status, updatedAt: new Date() } },
        )

        return result.modifiedCount > 0
      } catch (error) {
        console.error("Error updating payment status:", error)
        return false
      }
    },

    async getStats() {
      try {
        const client = await clientPromise
        const db = client.db("olympiad")
        const collection = db.collection("students")

        const totalRegistered = await collection.countDocuments({})
        const totalPaid = await collection.countDocuments({ paymentStatus: "paid" })
        const totalPending = await collection.countDocuments({ paymentStatus: "pending" })

        return {
          totalRegistered,
          totalPaid,
          totalPending,
        }
      } catch (error) {
        console.error("Error getting stats:", error)
        return {
          totalRegistered: 0,
          totalPaid: 0,
          totalPending: 0,
        }
      }
    },

    async exportToCSV() {
      try {
        const students = await this.findAll()

        if (students.length === 0) {
          return "No data to export"
        }

        // Get headers from first student (excluding some fields)
        const excludeFields = ["_id", "photoUrl", "signatureUrl", "createdAt", "updatedAt"]
        const headers = Object.keys(students[0]).filter((key) => !excludeFields.includes(key))

        // Create CSV header row
        let csv = headers.join(",") + "\n"

        // Add data rows
        students.forEach((student) => {
          const row = headers
            .map((header) => {
              const value = student[header]
              // Handle values that might contain commas
              if (typeof value === "string" && value.includes(",")) {
                return `"${value}"`
              }
              return value || ""
            })
            .join(",")

          csv += row + "\n"
        })

        return csv
      } catch (error) {
        console.error("Error exporting to CSV:", error)
        return "Error exporting data"
      }
    },
  },

  admin: {
    async verify(username: string, password: string) {
      try {
        const client = await clientPromise
        const db = client.db("olympiad")
        const collection = db.collection("admins")

        const admin = await collection.findOne({ username })

        if (admin && admin.password === password) {
          return {
            username: admin.username,
            name: admin.name,
          }
        }

        return null
      } catch (error) {
        console.error("Error verifying admin:", error)
        throw error
      }
    },

    async getStats() {
      return await db.student.getStats()
    },

    async exportToCSV() {
      return await db.student.exportToCSV()
    },

    async setupDefaultAdmin() {
      try {
        const client = await clientPromise
        const db = client.db("olympiad")
        const collection = db.collection("admins")

        // Check if admin already exists
        const adminExists = await collection.findOne({ username: "Science@1" })

        if (!adminExists) {
          // Create default admin
          await collection.insertOne({
            username: "Science@1",
            password: "Jackson.com@312", // In a real app, this would be hashed
            name: "Admin",
            createdAt: new Date(),
          })
          console.log("Default admin created")
        }
      } catch (error) {
        console.error("Error setting up default admin:", error)
      }
    },
  },
}

// Initialize the database with a default admin
export async function initDatabase() {
  try {
    await db.admin.setupDefaultAdmin()
    console.log("Database initialized with default admin")
    return true
  } catch (error) {
    console.error("Error initializing database:", error)
    return false
  }
}
