import { SidebarLayout } from "@/components/sidebar-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import {
  BarChart3,
  Users,
  UserCheck,
  Settings,
  Shield,
  TrendingUp,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  ArrowRight,
} from "lucide-react"

const registrationData = [
  { name: "Jan", students: 120, approved: 110 },
  { name: "Feb", students: 180, approved: 165 },
  { name: "Mar", students: 220, approved: 200 },
  { name: "Apr", students: 190, approved: 175 },
  { name: "May", students: 250, approved: 230 },
  { name: "Jun", students: 280, approved: 260 },
]

const statusData = [
  { name: "Approved", value: 1089, color: "hsl(var(--chart-1))" },
  { name: "Pending", value: 89, color: "hsl(var(--chart-2))" },
  { name: "Issues", value: 69, color: "hsl(var(--destructive))" },
]

const recentActivities = [
  {
    id: 1,
    type: "success",
    title: "System Backup Completed",
    description: "Daily backup process completed successfully",
    time: "2 minutes ago",
    icon: CheckCircle,
  },
  {
    id: 2,
    type: "warning",
    title: "High Memory Usage",
    description: "Server memory usage reached 85%",
    time: "15 minutes ago",
    icon: AlertTriangle,
  },
  {
    id: 3,
    type: "info",
    title: "New Registration",
    description: "Student John Doe completed registration",
    time: "1 hour ago",
    icon: UserCheck,
  },
  {
    id: 4,
    type: "success",
    title: "Security Update",
    description: "Latest security patches applied",
    time: "2 hours ago",
    icon: Shield,
  },
]

const systemMetrics = [
  { name: "CPU Usage", value: 45, max: 100, color: "hsl(var(--chart-1))" },
  { name: "Memory Usage", value: 72, max: 100, color: "hsl(var(--chart-2))" },
  { name: "Disk Usage", value: 38, max: 100, color: "hsl(var(--chart-3))" },
  { name: "Network I/O", value: 23, max: 100, color: "hsl(var(--chart-4))" },
]

const topStudents = [
  { id: 1, name: "Alice Johnson", email: "alice@university.edu", status: "Approved", score: 98 },
  { id: 2, name: "Bob Smith", email: "bob@university.edu", status: "Pending", score: 95 },
  { id: 3, name: "Carol Davis", email: "carol@university.edu", status: "Approved", score: 92 },
  { id: 4, name: "David Wilson", email: "david@university.edu", status: "Issues", score: 88 },
  { id: 5, name: "Eva Brown", email: "eva@university.edu", status: "Approved", score: 90 },
]

export default function AdminDashboard() {
  return (
    <SidebarLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Manager Analytics</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Monitor team performance, view analytics, and manage volunteer activities.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-chart-1/10 text-chart-1 border-chart-1/20 text-xs sm:text-sm">
              <Shield className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">System Healthy</span>
              <span className="sm:hidden">Healthy</span>
            </Badge>
            <Badge variant="outline" className="bg-chart-2/10 text-chart-2 border-chart-2/20 text-xs sm:text-sm">
              <TrendingUp className="w-3 h-3 mr-1" />
              99.9% Uptime
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <Card className="border-chart-1/20 bg-gradient-to-br from-background to-chart-1/5">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Total Registrations</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-chart-1">1,247</p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-chart-1/20 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-chart-1" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-1 sm:mt-2">
                <TrendingUp className="w-2 h-2 sm:w-3 sm:h-3 text-chart-1" />
                <span className="text-[10px] sm:text-xs text-chart-1">+15.2%</span>
                <span className="text-[10px] sm:text-xs text-muted-foreground hidden sm:inline">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-chart-1/20 bg-gradient-to-br from-background to-chart-1/5">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Approval Rate</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-chart-1">87.3%</p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-chart-1/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-chart-1" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-1 sm:mt-2">
                <TrendingUp className="w-2 h-2 sm:w-3 sm:h-3 text-chart-1" />
                <span className="text-[10px] sm:text-xs text-chart-1">+2.1%</span>
                <span className="text-[10px] sm:text-xs text-muted-foreground hidden sm:inline">improvement</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-chart-2/20 bg-gradient-to-br from-background to-chart-2/5">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Active Team Members</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-chart-2">24</p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-chart-2/20 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-chart-2" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-1 sm:mt-2">
                <span className="text-[10px] sm:text-xs text-chart-2">3 online now</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-chart-1/20 bg-gradient-to-br from-background to-chart-1/5">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">System Uptime</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-chart-1">99.9%</p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-chart-1/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-chart-1" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-1 sm:mt-2">
                <span className="text-[10px] sm:text-xs text-chart-1 hidden sm:inline">All systems operational</span>
                <span className="text-[10px] sm:text-xs text-chart-1 sm:hidden">Operational</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 h-12 bg-muted">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Students</span>
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">System</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Reports</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
              {/* Registration Trends */}
              <Card>
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-base sm:text-lg">Registration Trends</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Monthly registration and approval statistics</CardDescription>
                </CardHeader>
                <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
                  {/* Chart Container */}
                  <div className="relative">
                    {/* Y-axis labels */}
                    <div className="absolute left-0 top-0 h-48 sm:h-56 flex flex-col justify-between text-xs text-muted-foreground -ml-8 sm:-ml-10">
                      {[0, 25, 50, 75, 100].map((value) => (
                        <div key={value} className="h-0 flex items-center">
                          <span className="text-[10px] sm:text-xs">{Math.round((300 * value) / 100)}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Chart Area */}
                    <div className="ml-6 sm:ml-8 h-48 sm:h-56 flex items-end justify-between gap-1 sm:gap-2">
                      {registrationData.map((item, index) => (
                        <div key={item.name} className="flex-1 flex flex-col items-center group">
                          {/* Bars Container */}
                          <div className="relative w-full h-full flex items-end justify-center gap-0.5 sm:gap-1">
                            {/* Students Bar */}
                            <div className="relative flex flex-col items-center">
                              <div 
                                className="w-3 sm:w-4 bg-gradient-to-t from-chart-1 to-chart-1/80 rounded-t-sm transition-all duration-300 hover:from-chart-1/90 hover:to-chart-1/70 group-hover:shadow-lg"
                                style={{ 
                                  height: `${(item.students / 300) * 100}%`,
                                  minHeight: item.students > 0 ? '4px' : '0px'
                                }}
                              >
                                {/* Tooltip on hover */}
                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                                  {item.students} students
                                </div>
                              </div>
                            </div>
                            
                            {/* Approved Bar */}
                            <div className="relative flex flex-col items-center">
                              <div 
                                className="w-3 sm:w-4 bg-gradient-to-t from-chart-2 to-chart-2/80 rounded-t-sm transition-all duration-300 hover:from-chart-2/90 hover:to-chart-2/70 group-hover:shadow-lg"
                                style={{ 
                                  height: `${(item.approved / 300) * 100}%`,
                                  minHeight: item.approved > 0 ? '4px' : '0px'
                                }}
                              >
                                {/* Tooltip on hover */}
                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                                  {item.approved} approved
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* X-axis label */}
                          <div className="mt-2 text-[10px] sm:text-xs text-muted-foreground font-medium">
                            {item.name}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Grid lines */}
                    <div className="absolute inset-0 ml-6 sm:ml-8 h-48 sm:h-56">
                      {[0, 25, 50, 75, 100].map((value, index) => (
                        <div 
                          key={index}
                          className="absolute w-full border-t border-muted/30"
                          style={{ top: `${value}%` }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Legend */}
                  <div className="flex items-center justify-center gap-4 sm:gap-6 mt-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-chart-1 rounded-sm"></div>
                      <span className="text-xs sm:text-sm text-muted-foreground">Students</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-chart-2 rounded-sm"></div>
                      <span className="text-xs sm:text-sm text-muted-foreground">Approved</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Status Distribution */}
              <Card>
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-base sm:text-lg">Application Status</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Current distribution of application statuses</CardDescription>
                </CardHeader>
                <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
                  <div className="space-y-4">
                    {statusData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-sm font-medium">{item.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">{item.value}</div>
                          <div className="text-xs text-muted-foreground">
                            {Math.round((item.value / (statusData.reduce((sum, d) => sum + d.value, 0))) * 100)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg">Recent Activity</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Latest system activities and notifications</CardDescription>
              </CardHeader>
              <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
                <div className="space-y-3 sm:space-y-4">
                  {recentActivities.map((activity) => {
                    const Icon = activity.icon
                    return (
                      <div key={activity.id} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-foreground">{activity.title}</p>
                            <Badge 
                              variant={activity.type === "success" ? "default" : activity.type === "warning" ? "secondary" : "outline"}
                              className="text-xs"
                            >
                              {activity.type}
                            </Badge>
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground mt-1">{activity.description}</p>
                          <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">{activity.time}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-base sm:text-lg">Performance Metrics</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">System performance indicators</CardDescription>
                </CardHeader>
                <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
                  <div className="space-y-4">
                    {systemMetrics.map((metric, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{metric.name}</span>
                          <span className="text-muted-foreground">{metric.value}%</span>
                        </div>
                        <Progress value={metric.value} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-base sm:text-lg">Top Performers</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Students with highest scores</CardDescription>
                </CardHeader>
                <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
                  <div className="space-y-3">
                    {topStudents.slice(0, 5).map((student, index) => (
                      <div key={student.id} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-primary">{index + 1}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">{student.name}</p>
                            <p className="text-xs text-muted-foreground">{student.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant={student.status === "Approved" ? "default" : student.status === "Pending" ? "secondary" : "destructive"}
                            className="text-xs"
                          >
                            {student.status}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">Score: {student.score}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg">Student Management</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Manage student registrations and applications</CardDescription>
              </CardHeader>
              <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs sm:text-sm">Name</TableHead>
                        <TableHead className="text-xs sm:text-sm">Email</TableHead>
                        <TableHead className="text-xs sm:text-sm">Status</TableHead>
                        <TableHead className="text-xs sm:text-sm">Score</TableHead>
                        <TableHead className="text-xs sm:text-sm">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="text-xs sm:text-sm font-medium">{student.name}</TableCell>
                          <TableCell className="text-xs sm:text-sm text-muted-foreground">{student.email}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={student.status === "Approved" ? "default" : student.status === "Pending" ? "secondary" : "destructive"}
                              className="text-xs"
                            >
                              {student.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm">{student.score}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-base sm:text-lg">System Health</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Current system status and health metrics</CardDescription>
                </CardHeader>
                <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-chart-1/10 border border-chart-1/20 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-chart-1" />
                        <span className="text-sm font-medium">Database</span>
                      </div>
                      <Badge variant="outline" className="bg-chart-1/10 text-chart-1 border-chart-1/20 text-xs">
                        Operational
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-chart-1/10 border border-chart-1/20 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-chart-1" />
                        <span className="text-sm font-medium">API Services</span>
                      </div>
                      <Badge variant="outline" className="bg-chart-1/10 text-chart-1 border-chart-1/20 text-xs">
                        Operational
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-chart-2/10 border border-chart-2/20 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-chart-2" />
                        <span className="text-sm font-medium">File Storage</span>
                      </div>
                      <Badge variant="outline" className="bg-chart-2/10 text-chart-2 border-chart-2/20 text-xs">
                        Maintenance
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-chart-1/10 border border-chart-1/20 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-chart-1" />
                        <span className="text-sm font-medium">Authentication</span>
                      </div>
                      <Badge variant="outline" className="bg-chart-1/10 text-chart-1 border-chart-1/20 text-xs">
                        Operational
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-start space-y-2">
                      <div className="flex items-center space-x-2">
                        <Download className="w-4 h-4" />
                        <span className="font-medium text-sm">Export Data</span>
                      </div>
                      <span className="text-xs text-muted-foreground">Download reports and analytics</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-start space-y-2">
                      <div className="flex items-center space-x-2">
                        <Settings className="w-4 h-4" />
                        <span className="font-medium text-sm">System Settings</span>
                      </div>
                      <span className="text-xs text-muted-foreground">Configure platform settings</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-start space-y-2">
                      <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4" />
                        <span className="font-medium text-sm">Security Audit</span>
                      </div>
                      <span className="text-xs text-muted-foreground">Review security settings</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-start space-y-2" asChild>
                      <a href="/admin/submissions">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4" />
                          <span className="font-medium text-sm">View Submissions</span>
                        </div>
                        <span className="text-xs text-muted-foreground">View all student registrations</span>
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg">Report Generation</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Generate and download various reports</CardDescription>
              </CardHeader>
              <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-start space-y-2">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span className="font-medium text-sm">Student Report</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Complete student enrollment data</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-start space-y-2">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4" />
                      <span className="font-medium text-sm">Analytics Report</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Performance and usage analytics</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-start space-y-2">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4" />
                      <span className="font-medium text-sm">Audit Report</span>
                    </div>
                    <span className="text-xs text-muted-foreground">System activity and changes</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarLayout>
  )
}