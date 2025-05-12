"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Check } from "lucide-react"

export default function AddMongoDB() {
  const [mongoUri, setMongoUri] = useState("")
  const [isConfigured, setIsConfigured] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSaveConfig = async () => {
    if (!mongoUri) {
      setError("Please enter your MongoDB URI")
      return
    }

    try {
      // In a real app, you would save this to .env.local or a configuration service
      // For this demo, we'll just simulate success
      console.log("MongoDB URI configured:", mongoUri)

      // Simulate a successful connection
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setIsConfigured(true)
      setError(null)
    } catch (err) {
      setError("Failed to connect to MongoDB. Please check your URI and try again.")
    }
  }

  if (isConfigured) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-4 rounded-full bg-green-100 p-3">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-xl font-semibold">MongoDB Connected</CardTitle>
            <CardDescription className="mt-2">
              Your MongoDB database is now connected. The application will use this database for storing student
              registrations.
            </CardDescription>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Connect MongoDB Database</CardTitle>
        <CardDescription>
          Enter your MongoDB connection string to enable database functionality for student registrations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mongodb-uri">MongoDB URI</Label>
            <Input
              id="mongodb-uri"
              placeholder="mongodb+srv://username:password@cluster.mongodb.net/database"
              value={mongoUri}
              onChange={(e) => setMongoUri(e.target.value)}
            />
            <p className="text-sm text-gray-500">You can get this from your MongoDB Atlas dashboard.</p>
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-red-600 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <Button onClick={handleSaveConfig} className="w-full">
            Connect Database
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
