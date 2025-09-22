import { SidebarLayout } from "@/components/sidebar-layout"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { EnrollmentChart } from "@/components/dashboard/enrollment-chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, AlertCircle, CheckCircle, Clock } from "lucide-react"

export default function HomePage() {
  return (
    <SidebarLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's what's happening with your election enrollment platform.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-chart-1/10 text-chart-1 border-chart-1/20">
              <CheckCircle className="w-3 h-3 mr-1" />
              System Healthy
            </Badge>
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <StatsCards />

        {/* Main Dashboard Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Enrollment Chart - spans 2 columns */}
          <EnrollmentChart />

          {/* Recent Activity */}
          <RecentActivity />
        </div>

        {/* Secondary Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Quick Actions */}
          <QuickActions />

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Current platform health and performance metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-chart-1" />
                  <span className="text-sm font-medium">Database</span>
                </div>
                <Badge variant="outline" className="bg-chart-1/10 text-chart-1 border-chart-1/20">
                  Operational
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-chart-1" />
                  <span className="text-sm font-medium">API Services</span>
                </div>
                <Badge variant="outline" className="bg-chart-1/10 text-chart-1 border-chart-1/20">
                  Operational
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-chart-4" />
                  <span className="text-sm font-medium">File Storage</span>
                </div>
                <Badge variant="outline" className="bg-chart-4/10 text-chart-4 border-chart-4/20">
                  Maintenance
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-chart-1" />
                  <span className="text-sm font-medium">Authentication</span>
                </div>
                <Badge variant="outline" className="bg-chart-1/10 text-chart-1 border-chart-1/20">
                  Operational
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-chart-4" />
              <span>Important Notices</span>
            </CardTitle>
            <CardDescription>System alerts and important announcements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-chart-4/5 rounded-lg border border-chart-4/20">
                <AlertCircle className="w-4 h-4 text-chart-4 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Scheduled Maintenance</p>
                  <p className="text-xs text-muted-foreground">
                    File storage system will undergo maintenance on Sunday, 2:00 AM - 4:00 AM EST.
                  </p>
                </div>
                <Badge variant="outline" className="bg-chart-4/10 text-chart-4 border-chart-4/20">
                  Scheduled
                </Badge>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-chart-1/5 rounded-lg border border-chart-1/20">
                <CheckCircle className="w-4 h-4 text-chart-1 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Security Update Completed</p>
                  <p className="text-xs text-muted-foreground">
                    Latest security patches have been successfully applied to all systems.
                  </p>
                </div>
                <Badge variant="outline" className="bg-chart-1/10 text-chart-1 border-chart-1/20">
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
