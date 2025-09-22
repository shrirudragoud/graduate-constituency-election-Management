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
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks and shortcuts for efficient workflow</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.title} href={action.href}>
                <Button variant={action.variant} className="h-auto p-4 flex flex-col items-start space-y-2 w-full">
                  <div className="flex items-center space-x-2">
                    <Icon className="w-4 h-4" />
                    <span className="font-medium text-sm">{action.title}</span>
                  </div>
                  <span className="text-xs text-left opacity-70">{action.description}</span>
                </Button>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
