import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, BarChart3, TrendingUp, TrendingDown, Activity } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  icon: React.ComponentType<{ className?: string }>
  description?: string
}

function StatsCard({ title, value, change, changeType = "neutral", icon: Icon, description }: StatsCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {change && (
          <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
            {changeType === "positive" && <TrendingUp className="h-3 w-3 text-chart-1" />}
            {changeType === "negative" && <TrendingDown className="h-3 w-3 text-destructive" />}
            {changeType === "neutral" && <Activity className="h-3 w-3" />}
            <span
              className={
                changeType === "positive"
                  ? "text-chart-1"
                  : changeType === "negative"
                    ? "text-destructive"
                    : "text-muted-foreground"
              }
            >
              {change}
            </span>
          </div>
        )}
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  )
}

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Registrations"
        value="1,247"
        change="+12.5% from last month"
        changeType="positive"
        icon={Users}
        description="Active student enrollments"
      />
      <StatsCard
        title="Pending Reviews"
        value="89"
        change="+4.2% from yesterday"
        changeType="positive"
        icon={UserCheck}
        description="Applications awaiting approval"
      />
      <StatsCard
        title="Team Members"
        value="24"
        change="2 new this week"
        changeType="positive"
        icon={BarChart3}
        description="Active team coordinators"
      />
      <StatsCard
        title="System Uptime"
        value="99.9%"
        change="No incidents this month"
        changeType="positive"
        icon={Activity}
        description="Platform reliability"
      />
    </div>
  )
}
