"use client"

import { SidebarLayout } from "@/components/sidebar-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  RefreshCw,
  Lock,
} from "lucide-react"
import { useState, useEffect } from "react"

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

interface Submission {
  id: string
  surname: string
  first_name: string
  mobile_number: string
  email?: string
  district: string
  taluka: string
  status: string
  created_at: string
  filled_by_user_id?: number
}

interface User {
  id: number
  email: string
  role: string
  firstName?: string
  lastName?: string
  district?: string
  taluka?: string
  isActive: boolean
  lastLogin?: string
  createdAt: string
}

interface UserStats {
  totalUsers: number
  activeUsers: number
  usersByRole: Record<string, number>
  usersByDistrict: Record<string, number>
}

export default function AdminDashboard() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [authError, setAuthError] = useState("")

  // Data state
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Admin credentials
  const ADMIN_CREDENTIALS = {
    phone: "8700546080",
    email: "Shridhar.Rudragoud@hivetech.in",
    password: "!23456Seven"
  }

  // Handle authentication
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError("")

    if (phone === ADMIN_CREDENTIALS.phone && 
        email === ADMIN_CREDENTIALS.email && 
        password === ADMIN_CREDENTIALS.password) {
      setIsAuthenticated(true)
      fetchData()
    } else {
      setAuthError("Invalid credentials. Please check your phone, email, and password.")
    }
  }

  // Fetch data function
  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch submissions
      const submissionsResponse = await fetch('/api/admin/submissions?limit=20')
      const submissionsData = await submissionsResponse.json()

      // Fetch users
      const usersResponse = await fetch('/api/admin/users?limit=50')
      const usersData = await usersResponse.json()

      // Fetch user stats
      const statsResponse = await fetch('/api/admin/users/stats')
      const statsData = await statsResponse.json()

      console.log('Submissions data:', submissionsData)
      console.log('Users data:', usersData)
      console.log('Stats data:', statsData)

      if (submissionsData.success) {
        setSubmissions(submissionsData.submissions || [])
        console.log('Submissions loaded:', submissionsData.submissions?.length || 0)
      } else {
        console.error('Submissions API error:', submissionsData.error)
      }

      if (usersData.success) {
        setUsers(usersData.users || [])
        console.log('Users loaded:', usersData.users?.length || 0)
      } else {
        console.error('Users API error:', usersData.error)
      }

      if (statsData.success) {
        setUserStats(statsData)
        console.log('Stats loaded:', statsData)
      } else {
        console.error('Stats API error:', statsData.error)
      }
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  // Calculate submission stats
  const submissionStats = {
    total: submissions.length,
    approved: submissions.filter(s => s.status === 'approved').length,
    pending: submissions.filter(s => s.status === 'pending').length,
    rejected: submissions.filter(s => s.status === 'rejected').length,
  }

  // Calculate team activity
  const teamActivity = users.map(user => {
    const userSubmissions = submissions.filter(s => s.filled_by_user_id === user.id)
    return {
      ...user,
      submissionCount: userSubmissions.length,
      recentActivity: userSubmissions.length > 0 ? 'Active' : 'Inactive'
    }
  }).sort((a, b) => b.submissionCount - a.submissionCount)

  // Show authentication form if not authenticated
  if (!isAuthenticated) {
    return (
      <SidebarLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Admin Access</CardTitle>
              <CardDescription>
                Enter your credentials to access the admin dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="8700546080"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {authError && (
                  <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
                    {authError}
                  </div>
                )}
                <Button type="submit" className="w-full">
                  Access Admin Dashboard
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </SidebarLayout>
    )
  }

  // Show loading state
  if (loading) {
    return (
      <SidebarLayout>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Loading admin data...</span>
          </div>
        </div>
      </SidebarLayout>
    )
  }

  // Show error state
  if (error) {
    return (
      <SidebarLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-2" />
            <p className="text-destructive">{error}</p>
            <Button onClick={fetchData} className="mt-2">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </SidebarLayout>
    )
  }

  return (
    <SidebarLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Real-time view of submissions and team activity.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-chart-1/10 text-chart-1 border-chart-1/20 text-xs sm:text-sm">
              Live Data
            </Badge>
            <Button onClick={fetchData} size="sm" variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <Card className="border-chart-1/20 bg-gradient-to-br from-background to-chart-1/5">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Total Submissions</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-chart-1">{submissionStats.total}</p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-chart-1/20 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-chart-1" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-1 sm:mt-2">
                <span className="text-[10px] sm:text-xs text-muted-foreground">All time submissions</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-chart-1/20 bg-gradient-to-br from-background to-chart-1/5">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Approved</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600">{submissionStats.approved}</p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-chart-1/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-600" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-1 sm:mt-2">
                <span className="text-[10px] sm:text-xs text-muted-foreground">Successfully approved</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-chart-2/20 bg-gradient-to-br from-background to-chart-2/5">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Pending</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-yellow-600">{submissionStats.pending}</p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-chart-2/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-yellow-600" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-1 sm:mt-2">
                <span className="text-[10px] sm:text-xs text-muted-foreground">Awaiting review</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-chart-3/20 bg-gradient-to-br from-background to-chart-3/5">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Team Members</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-chart-3">{users.length}</p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-chart-3/20 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-chart-3" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-1 sm:mt-2">
                <span className="text-[10px] sm:text-xs text-muted-foreground">{userStats?.activeUsers || 0} active</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-chart-4/20 bg-gradient-to-br from-background to-chart-4/5">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Rejected</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-red-600">{submissionStats.rejected}</p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-chart-4/20 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-red-600" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-1 sm:mt-2">
                <span className="text-[10px] sm:text-xs text-muted-foreground">Requires attention</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-12 bg-muted">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="voters" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Voters</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Reports</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
              {/* Recent Submissions */}
              <Card>
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-base sm:text-lg">Recent Submissions</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Latest voter registration submissions</CardDescription>
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
                                  {item.students} Voters
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
                      <span className="text-xs sm:text-sm text-muted-foreground">Voters</span>
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
                  <CardDescription className="text-xs sm:text-sm"> highest scores</CardDescription>
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
                <CardTitle className="text-base sm:text-lg">Voter Management</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Manage Voter registrations and applications</CardDescription>
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
                        <span className="text-xs text-muted-foreground">View all Voter registrations</span>
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
                      <span className="font-medium text-sm">Voter Report</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Complete Voter enrollment data</span>
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