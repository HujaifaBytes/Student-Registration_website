import clientPromise from "./mongodb"
import { ObjectId } from "mongodb"

export const db = {
  student: {
    async create(data: any) {
      try {
        console.log("Attempting to create student record:", data)
        const client = await clientPromise
        const db = client.db("olympiad")
        const collection = db.collection("students")

        // Ensure the collection exists
        const collections = await db.listCollections({ name: "students" }).toArray()
        if (collections.length === 0) {
          await db.createCollection("students")
          console.log("Created students collection")
        }

        const result = await collection.insertOne({
          ...data,
          registrationDate: new Date().toISOString().split("T")[0],
          createdAt: new Date(),
        })

        console.log("Student record created with ID:", result.insertedId.toString())
        return result.insertedId.toString()
      } catch (error) {
        console.error("Error creating student:", error)
        throw error
      }
    },

    async findById(id: string) {
      try {
        console.log("Finding student by ID:", id)
        const client = await clientPromise
        const db = client.db("olympiad")
        const collection = db.collection("students")

        let objectId
        try {
          objectId = new ObjectId(id)
        } catch (error) {
          console.error("Invalid ObjectId format:", id)
          return null
        }

        const student = await collection.findOne({ _id: objectId })

        if (!student) {
          console.log("No student found with ID:", id)
          return null
        }

        console.log("Found student:", student._id.toString())
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
        console.log("Finding student by name and mobile:", fullName, fatherMobile)
        const client = await clientPromise
        const db = client.db("olympiad")
        const collection = db.collection("students")

        const students = await collection
          .find({
            fullName: fullName,
            fatherMobile: fatherMobile,
          })
          .toArray()

        console.log(`Found ${students.length} students with name and mobile`)
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
        console.log("Finding all students")
        const client = await clientPromise
        const db = client.db("olympiad")
        const collection = db.collection("students")

        const students = await collection.find({}).sort({ registrationDate: -1 }).toArray()

        console.log(`Found ${students.length} students`)
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
        console.log("Updating payment status for student:", id, status)
        const client = await clientPromise
        const db = client.db("olympiad")
        const collection = db.collection("students")

        let objectId
        try {
          objectId = new ObjectId(id)
        } catch (error) {
          console.error("Invalid ObjectId format:", id)
          return false
        }

        const result = await collection.updateOne(
          { _id: objectId },
          { $set: { paymentStatus: status, updatedAt: new Date() } },
        )

        console.log("Update result:", result.modifiedCount > 0 ? "Success" : "Failed")
        return result.modifiedCount > 0
      } catch (error) {
        console.error("Error updating payment status:", error)
        return false
      }
    },

    async getStats() {
      try {
        console.log("Getting student stats")
        const client = await clientPromise
        const db = client.db("olympiad")
        const collection = db.collection("students")

        const totalRegistered = await collection.countDocuments({})
        const totalPaid = await collection.countDocuments({ paymentStatus: "paid" })
        const totalPending = await collection.countDocuments({ paymentStatus: "pending" })

        console.log("Stats:", { totalRegistered, totalPaid, totalPending })
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
        console.log("Verifying admin:", username)
        const client = await clientPromise
        const db = client.db("olympiad")
        const collection = db.collection("admins")

        // Ensure the collection exists
        const collections = await db.listCollections({ name: "admins" }).toArray()
        if (collections.length === 0) {
          await db.createCollection("admins")
          console.log("Created admins collection")
          // Create default admin if collection was just created
          await this.setupDefaultAdmin()
        }

        const admin = await collection.findOne({ username })

        if (admin && admin.password === password) {
          console.log("Admin verified successfully")
          return {
            username: admin.username,
            name: admin.name,
          }
        }

        console.log("Admin verification failed")
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
        console.log("Setting up default admin")
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
        } else {
          console.log("Default admin already exists")
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
    console.log("Initializing database")
    const client = await clientPromise
    const db = client.db("olympiad")

    // Ensure collections exist
    const collections = await db.listCollections().toArray()
    const collectionNames = collections.map((c) => c.name)

    if (!collectionNames.includes("students")) {
      await db.createCollection("students")
      console.log("Created students collection")
    }

    if (!collectionNames.includes("admins")) {
      await db.createCollection("admins")
      console.log("Created admins collection")
    }

    await db.admin.setupDefaultAdmin()
    console.log("Database initialized with default admin")
    return true
  } catch (error) {
    console.error("Error initializing database:", error)
    return false
  }
}
