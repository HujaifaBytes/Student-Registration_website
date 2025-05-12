"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Home, UserPlus, Phone, ShieldCheck } from "lucide-react"

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        className="text-white hover:bg-emerald-700"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-emerald-600 dark:bg-emerald-700 z-50 border-b border-emerald-700 dark:border-emerald-800">
          <nav className="flex flex-col p-4 space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-white hover:bg-emerald-700 p-2 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              <Home className="h-5 w-5" />
              Home
            </Link>
            <Link
              href="/register"
              className="flex items-center gap-2 text-white hover:bg-emerald-700 p-2 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              <UserPlus className="h-5 w-5" />
              Register
            </Link>
            <Link
              href="/contact"
              className="flex items-center gap-2 text-white hover:bg-emerald-700 p-2 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              <Phone className="h-5 w-5" />
              Contact
            </Link>
            <Link
              href="/admin/login"
              className="flex items-center gap-2 text-white hover:bg-emerald-700 p-2 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              <ShieldCheck className="h-5 w-5" />
              Admin
            </Link>
          </nav>
        </div>
      )}
    </div>
  )
}
