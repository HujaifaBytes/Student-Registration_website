import AddMongoDB from "@/app/add-mongodb"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SetupPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              Olympiad Registration System Setup
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Configure your MongoDB database to enable student registrations
            </p>
          </div>

          <AddMongoDB />

          <div className="mt-8 text-center">
            <Button asChild variant="outline">
              <Link href="/">Return to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
