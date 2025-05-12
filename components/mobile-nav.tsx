"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, Home, UserPlus, Phone, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const navItems = [
    { href: "/", label: "Home", icon: Home, active: pathname === "/" },
    { href: "/register", label: "Register", icon: UserPlus, active: pathname === "/register" },
    { href: "/contact", label: "Contact", icon: Phone, active: pathname === "/contact" },
    { href: "/admin/login", label: "Admin", icon: ShieldCheck, active: pathname.startsWith("/admin") },
  ]

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
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 text-white p-2 rounded-md",
                  item.active ? "bg-emerald-700 dark:bg-emerald-800" : "hover:bg-emerald-700 dark:hover:bg-emerald-800",
                )}
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  )
}
