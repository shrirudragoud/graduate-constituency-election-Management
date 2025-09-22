"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LayoutDashboard, Users, UserCheck, Settings, BarChart3, FileText, Shield, LogOut, Menu, X } from "lucide-react"
import { useState } from "react"

interface SidebarLayoutProps {
  children: React.ReactNode
}

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    description: "Overview and analytics",
  },
  {
    name: "Student Portal",
    href: "/student",
    icon: UserCheck,
    description: "Registration and enrollment",
  },
  {
    name: "Team Management",
    href: "/team",
    icon: Users,
    description: "Manage enrollments",
  },
  {
    name: "Admin Analytics",
    href: "/admin",
    icon: BarChart3,
    description: "System analytics",
  },
  {
    name: "Reports",
    href: "/reports",
    icon: FileText,
    description: "Generate reports",
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    description: "System configuration",
  },
]

export function SidebarLayout({ children }: SidebarLayoutProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo and close button */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-sidebar-border">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-sidebar-foreground">ElectionEnroll</span>
            </div>
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-sidebar-accent/10",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                        : "text-sidebar-foreground hover:text-sidebar-accent",
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon
                      className={cn(
                        "w-5 h-5",
                        isActive ? "text-sidebar-primary-foreground" : "text-sidebar-foreground/70",
                      )}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div
                        className={cn(
                          "text-xs",
                          isActive ? "text-sidebar-primary-foreground/80" : "text-sidebar-foreground/60",
                        )}
                      >
                        {item.description}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </nav>
          </ScrollArea>

          {/* User section */}
          <div className="border-t border-sidebar-border p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">AD</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">Admin User</p>
                <p className="text-xs text-sidebar-foreground/60 truncate">admin@electionenroll.com</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-background border-b border-border flex items-center justify-between px-6">
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </Button>

          <div className="flex-1 lg:ml-0 ml-4">
            <h1 className="text-xl font-semibold text-foreground">Election Enrollment Platform</h1>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <FileText className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button size="sm">
              <UserCheck className="w-4 h-4 mr-2" />
              New Enrollment
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-muted/30">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
