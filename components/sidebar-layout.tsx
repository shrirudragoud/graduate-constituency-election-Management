"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Users, UserCheck, Settings, BarChart3, FileText, Shield, Menu, X } from "lucide-react"
import { useState } from "react"

interface SidebarLayoutProps {
  children: React.ReactNode
  currentRole?: "volunteer" | "manager" | "admin"
  onNewEnrollmentClick?: () => void
}

const navigation = [
  {
    name: "Team Management",
    href: "/team",
    icon: Users,
    description: "Manage volunteers",
    roles: ["volunteer", "manager", "admin"]
  },
  {
    name: "User Management",
    href: "/team/users",
    icon: Shield,
    description: "Manage users and roles",
    roles: ["admin"]
  },
  {
    name: "Manager Dashboard",
    href: "/manager",
    icon: BarChart3,
    description: "Manage volunteers",
    roles: ["manager"]
  },
  {
    name: "Manager Analytics",
    href: "/admin",
    icon: BarChart3,
    description: "Team analytics",
    roles: ["manager", "admin"]
  },
  {
    name: "Reports & Analytics",
    href: "/reports",
    icon: FileText,
    description: "Generate reports",
    roles: ["admin"]
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    description: "System configuration",
    roles: ["admin"]
  },
]

export function SidebarLayout({ children, currentRole, onNewEnrollmentClick }: SidebarLayoutProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [navigationOpen, setNavigationOpen] = useState(false)
  
  // Auto-detect role based on current URL if not provided
  const getRoleFromPath = (path: string): "volunteer" | "manager" | "admin" => {
    if (path === "/manager") return "manager"
    if (path === "/admin") return "manager" // Admin page shows manager analytics
    if (path === "/reports" || path === "/settings") return "admin"
    return "volunteer" // Default for dashboard, team, etc.
  }
  
  const detectedRole = currentRole || getRoleFromPath(pathname)
  
  // Filter navigation based on current role
  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(detectedRole)
  )

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

          {/* Sidebar */}
          <div
            className={cn(
              "fixed inset-y-0 left-0 z-50 w-64 sm:w-72 transform bg-sidebar/95 backdrop-blur-sm border-r border-sidebar-border/50 shadow-strong transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:shadow-none",
              sidebarOpen ? "translate-x-0" : "-translate-x-full",
            )}
          >
            <div className="flex h-full flex-col">
              {/* Navigation - Hidden by default */}
              {navigationOpen && (
                <ScrollArea className="flex-1 px-3 sm:px-4 py-4 sm:py-6">
                  <nav className="space-y-2">
                    {filteredNavigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                          "group flex items-center space-x-3 rounded-xl px-3 sm:px-4 py-3 sm:py-3.5 text-xs sm:text-sm font-medium transition-all duration-200 hover:bg-sidebar-accent/15 hover:shadow-soft focus-ring",
                          isActive
                            ? "bg-gradient-to-r from-sidebar-primary to-sidebar-primary/90 text-sidebar-primary-foreground shadow-medium ring-1 ring-sidebar-primary/20"
                            : "text-sidebar-foreground hover:text-sidebar-accent hover:scale-[1.02]",
                        )}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <div className={cn(
                          "flex-shrink-0 p-1.5 rounded-lg transition-all duration-200",
                          isActive 
                            ? "bg-sidebar-primary-foreground/20 text-sidebar-primary-foreground" 
                            : "text-sidebar-foreground/70 group-hover:text-sidebar-accent group-hover:bg-sidebar-accent/10"
                        )}>
                          <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold truncate">{item.name}</div>
                          <div
                            className={cn(
                              "text-[10px] sm:text-xs truncate mt-0.5",
                              isActive ? "text-sidebar-primary-foreground/80" : "text-sidebar-foreground/60 group-hover:text-sidebar-accent/80",
                            )}
                          >
                            {item.description}
                          </div>
                        </div>
                        {isActive && (
                          <div className="w-1.5 h-1.5 bg-sidebar-primary-foreground rounded-full animate-pulse" />
                        )}
                      </Link>
                    )
                    })}
                  </nav>
                </ScrollArea>
              )}

        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 sm:h-16 bg-background/95 backdrop-blur-sm border-b border-border/60 flex items-center justify-between px-4 sm:px-6 shadow-soft">
          <Button 
            variant="ghost" 
            size="sm" 
            className="lg:hidden h-9 w-9 p-0 hover:bg-muted/50 focus-ring" 
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>

          <div className="flex-1 lg:ml-0 ml-3 sm:ml-4">
            <h1 className="text-base sm:text-lg lg:text-xl font-bold text-foreground truncate tracking-tight">
              Padhvidhar Portal
            </h1>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden sm:flex text-xs sm:text-sm h-9 sm:h-10 px-3 sm:px-4 hover:bg-muted/50 focus-ring transition-all duration-200 hover:shadow-soft"
            >
              <FileText className="w-4 h-4 mr-2" />
              <span className="hidden lg:inline">Export Data</span>
            </Button>
            <Button 
              size="sm" 
              className="text-xs sm:text-sm h-8 sm:h-9"
              onClick={onNewEnrollmentClick}
            >
              <UserCheck className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">New Enrollment</span>
              <span className="sm:hidden">New</span>
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-gradient-to-br from-background via-background to-muted/20">
          <div className="p-4 sm:p-6 lg:p-8 animate-in">{children}</div>
        </main>
      </div>
    </div>
  )
}
