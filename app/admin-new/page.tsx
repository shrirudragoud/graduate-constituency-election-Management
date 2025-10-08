"use client"

import { SidebarLayout } from "@/components/sidebar-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  BarChart3,
  Users,
  UserCheck,
  TrendingUp,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  RefreshCw,
  Lock,
  Calendar,
} from "lucide-react"
import { useState, useEffect } from "react"

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

  // Filter states
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")

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
      const submissionsResponse = await fetch('/api/admin/submissions?limit=100')
      const submissionsData = await submissionsResponse.json()

      // Fetch users
      const usersResponse = await fetch('/api/admin/users?limit=100')
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

  // Calculate team performance
  const teamPerformance = users.map(user => {
    const userSubmissions = submissions.filter(s => s.filled_by_user_id === user.id)
    return {
      ...user,
      submissionCount: userSubmissions.length,
      recentActivity: userSubmissions.length > 0 ? 'Active' : 'Inactive'
    }
  }).sort((a, b) => b.submissionCount - a.submissionCount)

  // Filter submissions by date
  const filteredSubmissions = submissions.filter(submission => {
    if (!dateFrom && !dateTo) return true
    const submissionDate = new Date(submission.created_at)
    const fromDate = dateFrom ? new Date(dateFrom) : null
    const toDate = dateTo ? new Date(dateTo) : null
    
    if (fromDate && submissionDate < fromDate) return false
    if (toDate && submissionDate > toDate) return false
    return true
  })

  // Export submissions to CSV
  const exportSubmissions = () => {
    const csvContent = [
      ['Name', 'Phone', 'Email', 'District', 'Taluka', 'Status', 'Date'].join(','),
      ...filteredSubmissions.map(sub => [
        `"${sub.first_name} ${sub.surname}"`,
        sub.mobile_number,
        sub.email || '',
        sub.district,
        sub.taluka,
        sub.status,
        new Date(sub.created_at).toLocaleDateString()
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `submissions-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

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

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{submissionStats.total}</div>
              <p className="text-xs text-muted-foreground">
                All time submissions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{submissionStats.approved}</div>
              <p className="text-xs text-muted-foreground">
                Successfully approved
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{submissionStats.pending}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting review
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">
                {userStats?.activeUsers || 0} active
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="voters">Voters</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Submissions</CardTitle>
                  <CardDescription>
                    Latest voter registration submissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {submissions.slice(0, 5).map((submission) => (
                      <div key={submission.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium text-sm">
                            {submission.first_name} {submission.surname}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {submission.district}, {submission.taluka}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={submission.status === 'approved' ? 'default' : 
                                   submission.status === 'pending' ? 'secondary' : 'destructive'}
                            className="text-xs"
                          >
                            {submission.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(submission.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                    {submissions.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No submissions found
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Submission Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Approved</span>
                      <span className="text-sm font-medium">{submissionStats.approved}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${submissionStats.total > 0 ? (submissionStats.approved / submissionStats.total) * 100 : 0}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Pending</span>
                      <span className="text-sm font-medium">{submissionStats.pending}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-yellow-600 h-2 rounded-full" 
                        style={{ width: `${submissionStats.total > 0 ? (submissionStats.pending / submissionStats.total) * 100 : 0}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Rejected</span>
                      <span className="text-sm font-medium">{submissionStats.rejected}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-red-600 h-2 rounded-full" 
                        style={{ width: `${submissionStats.total > 0 ? (submissionStats.rejected / submissionStats.total) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Team Performance</CardTitle>
                <CardDescription>
                  Top performing team members by submission count
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Team Member</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Submissions</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teamPerformance.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div>{member.firstName} {member.lastName}</div>
                            <div className="text-sm text-muted-foreground">{member.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{member.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {member.district && <div>{member.district}</div>}
                            {member.taluka && <div className="text-muted-foreground">{member.taluka}</div>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-2xl font-bold">{member.submissionCount}</div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={member.isActive ? 'default' : 'secondary'}
                          >
                            {member.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Voters Tab */}
          <TabsContent value="voters" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Submissions</CardTitle>
                <CardDescription>
                  Complete list of voter registration submissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell className="font-medium">
                          {submission.first_name} {submission.surname}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{submission.mobile_number}</div>
                            {submission.email && (
                              <div className="text-muted-foreground">{submission.email}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{submission.district}</div>
                            <div className="text-muted-foreground">{submission.taluka}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={submission.status === 'approved' ? 'default' : 
                                   submission.status === 'pending' ? 'secondary' : 'destructive'}
                          >
                            {submission.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(submission.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Export Data</CardTitle>
                <CardDescription>
                  Download submission data with date filters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dateFrom">From Date</Label>
                      <Input
                        id="dateFrom"
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateTo">To Date</Label>
                      <Input
                        id="dateTo"
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <div className="font-medium">Filtered Submissions</div>
                      <div className="text-sm text-muted-foreground">
                        {filteredSubmissions.length} submissions found
                      </div>
                    </div>
                    <Button onClick={exportSubmissions} disabled={filteredSubmissions.length === 0}>
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarLayout>
  )
}
