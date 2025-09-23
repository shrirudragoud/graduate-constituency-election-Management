import { SidebarLayout } from "@/components/sidebar-layout"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { EnrollmentChart } from "@/components/dashboard/enrollment-chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, AlertCircle, CheckCircle, Clock } from "lucide-react"

export default function DashboardPage() {
  return (
    <SidebarLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Welcome back! Here's what's happening with your election enrollment platform.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-chart-1/10 text-chart-1 border-chart-1/20 text-xs sm:text-sm">
              <CheckCircle className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">System Healthy</span>
              <span className="sm:hidden">Healthy</span>
            </Badge>
            <Button variant="outline" size="sm" className="text-xs sm:text-sm h-8 sm:h-9">
              <Bell className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Notifications</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <StatsCards />

        {/* Main Dashboard Grid */}
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          {/* Enrollment Chart - spans 2 columns on large screens */}
          <div className="lg:col-span-2">
            <EnrollmentChart />
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-1">
            <RecentActivity />
          </div>
        </div>

        {/* Secondary Grid */}
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          {/* Quick Actions */}
          <QuickActions />

          {/* System Status */}
          <Card className="hover:border-primary/20 transition-all duration-300 hover:shadow-medium bg-gradient-to-br from-card via-card to-card/95 border-border/60">
            <CardHeader className="pb-4 sm:pb-6">
              <CardTitle className="text-base sm:text-lg font-bold">System Status</CardTitle>
              <CardDescription className="text-xs sm:text-sm text-muted-foreground">Current platform health and performance metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-chart-1" />
                  <span className="text-xs sm:text-sm font-medium">Database</span>
                </div>
                <Badge variant="outline" className="bg-chart-1/10 text-chart-1 border-chart-1/20 text-xs">
                  Operational
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-chart-1" />
                  <span className="text-xs sm:text-sm font-medium">API Services</span>
                </div>
                <Badge variant="outline" className="bg-chart-1/10 text-chart-1 border-chart-1/20 text-xs">
                  Operational
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-chart-4" />
                  <span className="text-xs sm:text-sm font-medium">File Storage</span>
                </div>
                <Badge variant="outline" className="bg-chart-4/10 text-chart-4 border-chart-4/20 text-xs">
                  Maintenance
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-chart-1" />
                  <span className="text-xs sm:text-sm font-medium">Authentication</span>
                </div>
                <Badge variant="outline" className="bg-chart-1/10 text-chart-1 border-chart-1/20 text-xs">
                  Operational
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts Section */}
        <Card className="hover:border-primary/20 transition-all duration-300 hover:shadow-medium bg-gradient-to-br from-card via-card to-card/95 border-border/60">
          <CardHeader className="pb-4 sm:pb-6">
            <CardTitle className="flex items-center space-x-3 text-base sm:text-lg font-bold">
              <div className="w-8 h-8 bg-gradient-to-br from-chart-4/10 via-chart-4/5 to-chart-4/20 rounded-lg flex items-center justify-center shadow-soft">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-chart-4" />
              </div>
              <span>Important Notices</span>
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-muted-foreground font-medium">System alerts and important announcements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-2 sm:space-x-3 p-3 bg-chart-4/5 rounded-lg border border-chart-4/20">
                <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-chart-4 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium">Scheduled Maintenance</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">
                    File storage system will undergo maintenance on Sunday, 2:00 AM - 4:00 AM EST.
                  </p>
                </div>
                <Badge variant="outline" className="bg-chart-4/10 text-chart-4 border-chart-4/20 text-xs flex-shrink-0">
                  Scheduled
                </Badge>
              </div>
              <div className="flex items-start space-x-2 sm:space-x-3 p-3 bg-chart-1/5 rounded-lg border border-chart-1/20">
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-chart-1 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium">Security Update Completed</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">
                    Latest security patches have been successfully applied to all systems.
                  </p>
                </div>
                <Badge variant="outline" className="bg-chart-1/10 text-chart-1 border-chart-1/20 text-xs flex-shrink-0">
                  Completed
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarLayout>
  )
}
