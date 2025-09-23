import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserPlus, FileText, Download, Settings, Users, BarChart3 } from "lucide-react"
import Link from "next/link"

const actions = [
  {
    title: "New Registration",
    description: "Add a new student enrollment",
    icon: UserPlus,
    href: "/student",
    variant: "default" as const,
  },
  {
    title: "Bulk Import",
    description: "Import multiple registrations",
    icon: Users,
    href: "/team",
    variant: "secondary" as const,
  },
  {
    title: "Generate Report",
    description: "Export enrollment data",
    icon: FileText,
    href: "/reports",
    variant: "outline" as const,
  },
  {
    title: "View Analytics",
    description: "Platform performance metrics",
    icon: BarChart3,
    href: "/admin",
    variant: "outline" as const,
  },
  {
    title: "Export Data",
    description: "Download CSV/PDF reports",
    icon: Download,
    href: "/reports",
    variant: "outline" as const,
  },
  {
    title: "System Settings",
    description: "Configure platform options",
    icon: Settings,
    href: "/settings",
    variant: "outline" as const,
  },
]

export function QuickActions() {
  return (
    <Card className="hover:border-primary/20 transition-all duration-300 hover:shadow-medium bg-gradient-to-br from-card via-card to-card/95 border-border/60">
      <CardHeader className="pb-4 sm:pb-6">
        <CardTitle className="text-base sm:text-lg font-bold">Quick Actions</CardTitle>
        <CardDescription className="text-xs sm:text-sm text-muted-foreground">Common tasks and shortcuts for efficient workflow</CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.title} href={action.href}>
                <Button 
                  variant={action.variant} 
                  className="group h-auto p-4 sm:p-5 flex flex-col items-start space-y-2 w-full text-left hover:shadow-soft focus-ring transition-all duration-200 hover:scale-[1.02]"
                >
                  <div className="flex items-center space-x-2 w-full">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-semibold text-sm truncate">{action.title}</span>
                  </div>
                  <span className="text-xs text-left opacity-70 line-clamp-2 group-hover:opacity-90 transition-opacity duration-200">{action.description}</span>
                </Button>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
