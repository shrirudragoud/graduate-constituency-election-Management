import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UserCheck, FileText, Users, Settings } from "lucide-react"

const activities = [
  {
    id: 1,
    type: "registration",
    user: "Sarah Johnson",
    action: "completed registration",
    time: "2 minutes ago",
    status: "success",
    icon: UserCheck,
  },
  {
    id: 2,
    type: "document",
    user: "Mike Chen",
    action: "uploaded ID document",
    time: "5 minutes ago",
    status: "pending",
    icon: FileText,
  },
  {
    id: 3,
    type: "team",
    user: "Admin Team",
    action: "approved 12 applications",
    time: "15 minutes ago",
    status: "success",
    icon: Users,
  },
  {
    id: 4,
    type: "system",
    user: "System",
    action: "backup completed successfully",
    time: "1 hour ago",
    status: "info",
    icon: Settings,
  },
  {
    id: 5,
    type: "registration",
    user: "Emma Davis",
    action: "started registration process",
    time: "2 hours ago",
    status: "pending",
    icon: UserCheck,
  },
]

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest actions and updates across the platform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activity.icon
            return (
              <div key={activity.id} className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground truncate">{activity.user}</p>
                    <Badge
                      variant={
                        activity.status === "success"
                          ? "default"
                          : activity.status === "pending"
                            ? "secondary"
                            : "outline"
                      }
                      className="ml-2 text-xs"
                    >
                      {activity.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
