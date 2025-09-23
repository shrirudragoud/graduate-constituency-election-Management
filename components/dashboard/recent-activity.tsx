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
    <Card className="hover:border-primary/20 transition-all duration-300 hover:shadow-medium bg-gradient-to-br from-card via-card to-card/95 border-border/60">
      <CardHeader className="pb-4 sm:pb-6">
        <CardTitle className="text-base sm:text-lg font-bold">Recent Activity</CardTitle>
        <CardDescription className="text-xs sm:text-sm text-muted-foreground">Latest actions and updates across the platform</CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activity.icon
            return (
              <div key={activity.id} className="group flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/30 transition-all duration-200">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-primary/10 via-primary/5 to-primary/20 rounded-xl flex items-center justify-center shadow-soft group-hover:shadow-medium transition-all duration-200 group-hover:scale-105">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-foreground truncate">{activity.user}</p>
                    <Badge
                      variant={
                        activity.status === "success"
                          ? "default"
                          : activity.status === "pending"
                            ? "secondary"
                            : "outline"
                      }
                      className="text-[10px] sm:text-xs font-medium"
                    >
                      {activity.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground truncate mb-1">{activity.action}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground font-medium">{activity.time}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
