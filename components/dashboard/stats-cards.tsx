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
    <Card className="group relative overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-medium bg-gradient-to-br from-card via-card to-card/95 border-border/60">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3 px-4 sm:px-6 pt-4 sm:pt-6 relative z-10">
        <CardTitle className="text-xs sm:text-sm font-semibold text-muted-foreground truncate">{title}</CardTitle>
        <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-primary/10 via-primary/5 to-primary/20 rounded-lg flex items-center justify-center shadow-soft group-hover:shadow-medium transition-all duration-300 group-hover:scale-105">
          <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 relative z-10">
        <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight mb-2">{value}</div>
        {change && (
          <div className="flex items-center space-x-1.5 p-2 bg-muted/30 rounded-lg">
            {changeType === "positive" && <TrendingUp className="h-3 w-3 text-chart-1 flex-shrink-0" />}
            {changeType === "negative" && <TrendingDown className="h-3 w-3 text-destructive flex-shrink-0" />}
            {changeType === "neutral" && <Activity className="h-3 w-3 text-muted-foreground flex-shrink-0" />}
            <span
              className={`text-[10px] sm:text-xs font-medium ${
                changeType === "positive"
                  ? "text-chart-1"
                  : changeType === "negative"
                    ? "text-destructive"
                    : "text-muted-foreground"
              }`}
            >
              {change}
            </span>
          </div>
        )}
        {description && <p className="text-[10px] sm:text-xs text-muted-foreground mt-2 truncate font-medium">{description}</p>}
      </CardContent>
    </Card>
  )
}

export function StatsCards() {
  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
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
