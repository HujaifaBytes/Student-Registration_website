"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { adminLogin } from "@/lib/actions"
import { ThemeToggle } from "@/components/theme-toggle"
import { LockKeyhole, User } from "lucide-react"

export default function AdminLoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formDataToSubmit = new FormData()
      formDataToSubmit.append("username", formData.username)
      formDataToSubmit.append("password", formData.password)

      const result = await adminLogin(formDataToSubmit)

      if (result.success) {
        toast({
          title: "Login Successful",
          description: "You have been logged in successfully.",
        })

        // Redirect to the admin dashboard
        router.push("/admin/dashboard")
      } else {
        throw new Error(result.error || "Login failed")
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Invalid username or password",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md border-emerald-200 dark:border-emerald-700 shadow-lg dark:bg-gray-800">
        <CardHeader className="bg-emerald-600 dark:bg-emerald-700 text-white p-6 flex flex-col items-center">
          <div className="flex items-center justify-center mb-4">
            <Image src="/logo.png" alt="Savar Science Society Logo" width={80} height={80} className="rounded-full" />
          </div>
          <h1 className="text-2xl font-bold text-center">Admin Login</h1>
          <p className="text-emerald-100 text-center mt-2">Savar Science Society Olympiad</p>
        </CardHeader>

        <CardContent className="p-6 pt-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-700 dark:text-gray-300">
                Username
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  className="pl-10 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                Password
              </Label>
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="pl-10 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="bg-gray-50 dark:bg-gray-800 p-4 flex flex-col justify-center border-t border-gray-200 dark:border-gray-700 gap-2">
          <Link href="/" className="text-emerald-600 dark:text-emerald-400 hover:underline text-sm">
            Return to Home Page
          </Link>
          <Link href="/setup" className="text-emerald-600 dark:text-emerald-400 hover:underline text-sm">
            Database Setup
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
