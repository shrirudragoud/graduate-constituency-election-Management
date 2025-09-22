import { SidebarLayout } from "@/components/sidebar-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
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

const dailyActivity = [
  { date: "2024-03-07", registrations: 12, approvals: 8 },
  { date: "2024-03-08", registrations: 18, approvals: 15 },
  { date: "2024-03-09", registrations: 24, approvals: 20 },
  { date: "2024-03-10", registrations: 15, approvals: 12 },
  { date: "2024-03-11", registrations: 21, approvals: 18 },
  { date: "2024-03-12", registrations: 19, approvals: 16 },
  { date: "2024-03-13", registrations: 16, approvals: 14 },
]

export default function AdminDashboard() {
  return (
    <SidebarLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Analytics</h1>
            <p className="text-muted-foreground">
              Monitor platform performance, view analytics, and manage system settings.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-chart-1/10 text-chart-1 border-chart-1/20">
              <Shield className="w-3 h-3 mr-1" />
              System Healthy
            </Badge>
            <Badge variant="outline" className="bg-chart-2/10 text-chart-2 border-chart-2/20">
              <TrendingUp className="w-3 h-3 mr-1" />
              99.9% Uptime
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-chart-1/20 bg-gradient-to-br from-background to-chart-1/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Registrations</p>
                  <p className="text-3xl font-bold text-chart-1">1,247</p>
                </div>
                <div className="w-12 h-12 bg-chart-1/20 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-chart-1" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-3 h-3 text-chart-1" />
                <span className="text-xs text-chart-1">+15.2%</span>
                <span className="text-xs text-muted-foreground">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-chart-1/20 bg-gradient-to-br from-background to-chart-1/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Approval Rate</p>
                  <p className="text-3xl font-bold text-chart-1">87.3%</p>
                </div>
                <div className="w-12 h-12 bg-chart-1/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-chart-1" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-3 h-3 text-chart-1" />
                <span className="text-xs text-chart-1">+2.1%</span>
                <span className="text-xs text-muted-foreground">improvement</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-chart-2/20 bg-gradient-to-br from-background to-chart-2/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Team Members</p>
                  <p className="text-3xl font-bold text-chart-2">24</p>
                </div>
                <div className="w-12 h-12 bg-chart-2/20 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-chart-2" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <span className="text-xs text-chart-2">3 online now</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-chart-1/20 bg-gradient-to-br from-background to-chart-1/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">System Uptime</p>
                  <p className="text-3xl font-bold text-chart-1">99.9%</p>
                </div>
                <div className="w-12 h-12 bg-chart-1/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-chart-1" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <span className="text-xs text-chart-1">All systems operational</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 h-12 bg-muted">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              Team Management
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              System Health
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Reports
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Registration Trends */}
              <Card className="hover:border-primary/20 transition-colors">
                <CardHeader>
                  <CardTitle>Registration Trends</CardTitle>
                  <CardDescription>Monthly registration and approval statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={registrationData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="name" className="text-muted-foreground" fontSize={12} />
                      <YAxis className="text-muted-foreground" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "6px",
                        }}
                      />
                      <Bar dataKey="students" fill="hsl(var(--chart-1))" name="Registrations" />
                      <Bar dataKey="approved" fill="hsl(var(--chart-2))" name="Approved" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Status Distribution */}
              <Card className="hover:border-primary/20 transition-colors">
                <CardHeader>
                  <CardTitle>Application Status</CardTitle>
                  <CardDescription>Current distribution of application statuses</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-4 mt-4">
                    {statusData.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm">
                          {item.name}: {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="hover:border-primary/20 transition-colors">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest system activities and notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-chart-1/10 border border-chart-1/20 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-chart-1 mt-0.5" />
                    <div>
                      <p className="font-medium text-chart-1">Bulk approval completed</p>
                      <p className="text-sm text-muted-foreground">
                        45 applications approved by Team Member Sarah Johnson
                      </p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-chart-2/10 border border-chart-2/20 rounded-lg">
                    <Users className="w-5 h-5 text-chart-2 mt-0.5" />
                    <div>
                      <p className="font-medium text-chart-2">New team member added</p>
                      <p className="text-sm text-muted-foreground">
                        Michael Chen joined as Team Member with review permissions
                      </p>
                      <p className="text-xs text-muted-foreground">4 hours ago</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-chart-4/10 border border-chart-4/20 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-chart-4 mt-0.5" />
                    <div>
                      <p className="font-medium text-chart-4">System maintenance scheduled</p>
                      <p className="text-sm text-muted-foreground">
                        Planned maintenance window: March 15, 2024 2:00-4:00 AM
                      </p>
                      <p className="text-xs text-muted-foreground">6 hours ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="hover:border-primary/20 transition-colors">
              <CardHeader>
                <CardTitle>Daily Activity Trends</CardTitle>
                <CardDescription>Registration and approval activity over the past week</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={dailyActivity}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-muted-foreground" fontSize={12} />
                    <YAxis className="text-muted-foreground" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "6px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="registrations"
                      stroke="hsl(var(--chart-1))"
                      strokeWidth={3}
                      name="Registrations"
                    />
                    <Line
                      type="monotone"
                      dataKey="approvals"
                      stroke="hsl(var(--chart-2))"
                      strokeWidth={3}
                      name="Approvals"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="hover:border-primary/20 transition-colors">
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>Key performance indicators</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Average Processing Time</span>
                      <span className="font-medium">2.3 days</span>
                    </div>
                    <Progress value={85} className="h-3" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Document Verification Rate</span>
                      <span className="font-medium">94.2%</span>
                    </div>
                    <Progress value={94} className="h-3" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>User Satisfaction</span>
                      <span className="font-medium">4.7/5.0</span>
                    </div>
                    <Progress value={94} className="h-3" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:border-primary/20 transition-colors">
                <CardHeader>
                  <CardTitle>Geographic Distribution</CardTitle>
                  <CardDescription>Registrations by campus location</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Main Campus</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-muted rounded-full h-3">
                          <div className="bg-chart-1 h-3 rounded-full" style={{ width: "65%" }} />
                        </div>
                        <span className="text-sm font-medium">812</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">North Campus</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-muted rounded-full h-3">
                          <div className="bg-chart-2 h-3 rounded-full" style={{ width: "25%" }} />
                        </div>
                        <span className="text-sm font-medium">312</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">South Campus</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-muted rounded-full h-3">
                          <div className="bg-chart-1/60 h-3 rounded-full" style={{ width: "10%" }} />
                        </div>
                        <span className="text-sm font-medium">123</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Team Management Tab */}
          <TabsContent value="team" className="space-y-6">
            <Card className="hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Team Members</CardTitle>
                    <CardDescription>Manage team member access and permissions</CardDescription>
                  </div>
                  <Button>
                    <UserCheck className="w-4 h-4 mr-2" />
                    Add Team Member
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border border-border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Active</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="hover:bg-muted/30">
                        <TableCell>
                          <div>
                            <div className="font-medium">Sarah Johnson</div>
                            <div className="text-sm text-muted-foreground">sarah.johnson@university.edu</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-chart-2/20 text-chart-2">
                            Team Lead
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-chart-1/10 text-chart-1 border-chart-1/20">
                            <div className="w-2 h-2 bg-chart-1 rounded-full mr-1" />
                            Online
                          </Badge>
                        </TableCell>
                        <TableCell>2 minutes ago</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <Settings className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow className="hover:bg-muted/30">
                        <TableCell>
                          <div>
                            <div className="font-medium">Michael Chen</div>
                            <div className="text-sm text-muted-foreground">m.chen@university.edu</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">Team Member</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-chart-1/10 text-chart-1 border-chart-1/20">
                            <div className="w-2 h-2 bg-chart-1 rounded-full mr-1" />
                            Online
                          </Badge>
                        </TableCell>
                        <TableCell>15 minutes ago</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <Settings className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow className="hover:bg-muted/30">
                        <TableCell>
                          <div>
                            <div className="font-medium">Emily Rodriguez</div>
                            <div className="text-sm text-muted-foreground">emily.r@university.edu</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">Team Member</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-muted text-muted-foreground">
                            <div className="w-2 h-2 bg-muted-foreground rounded-full mr-1" />
                            Offline
                          </Badge>
                        </TableCell>
                        <TableCell>2 hours ago</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <Settings className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Health Tab */}
          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="hover:border-primary/20 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    System Status
                  </CardTitle>
                  <CardDescription>Current system health and performance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Database</span>
                    <Badge variant="outline" className="bg-chart-1/10 text-chart-1 border-chart-1/20">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Healthy
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">File Storage</span>
                    <Badge variant="outline" className="bg-chart-1/10 text-chart-1 border-chart-1/20">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Healthy
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Authentication</span>
                    <Badge variant="outline" className="bg-chart-1/10 text-chart-1 border-chart-1/20">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Healthy
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">PDF Generation</span>
                    <Badge variant="outline" className="bg-chart-4/10 text-chart-4 border-chart-4/20">
                      <Clock className="w-3 h-3 mr-1" />
                      Slow Response
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:border-primary/20 transition-colors">
                <CardHeader>
                  <CardTitle>Resource Usage</CardTitle>
                  <CardDescription>Current system resource utilization</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>CPU Usage</span>
                      <span className="font-medium">23%</span>
                    </div>
                    <Progress value={23} className="h-3" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Memory Usage</span>
                      <span className="font-medium">67%</span>
                    </div>
                    <Progress value={67} className="h-3" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Storage Usage</span>
                      <span className="font-medium">45%</span>
                    </div>
                    <Progress value={45} className="h-3" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Bandwidth</span>
                      <span className="font-medium">12%</span>
                    </div>
                    <Progress value={12} className="h-3" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="hover:border-primary/20 transition-colors">
              <CardHeader>
                <CardTitle>Security Monitoring</CardTitle>
                <CardDescription>Security events and access logs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-chart-1/10 border border-chart-1/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-chart-1" />
                      <div>
                        <p className="font-medium text-chart-1">All security checks passed</p>
                        <p className="text-sm text-muted-foreground">Last scan: 5 minutes ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-chart-2/10 border border-chart-2/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-chart-2" />
                      <div>
                        <p className="font-medium text-chart-2">SSL Certificate valid</p>
                        <p className="text-sm text-muted-foreground">Expires: December 15, 2024</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card className="hover:border-primary/20 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  System Reports
                </CardTitle>
                <CardDescription>Generate comprehensive system and analytics reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Administrative Reports</h3>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Download className="w-4 h-4 mr-2" />
                        Complete System Analytics
                        <ArrowRight className="w-4 h-4 ml-auto" />
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Download className="w-4 h-4 mr-2" />
                        Team Performance Report
                        <ArrowRight className="w-4 h-4 ml-auto" />
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Download className="w-4 h-4 mr-2" />
                        Security Audit Log
                        <ArrowRight className="w-4 h-4 ml-auto" />
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Download className="w-4 h-4 mr-2" />
                        System Health Report
                        <ArrowRight className="w-4 h-4 ml-auto" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Registration Reports</h3>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Download className="w-4 h-4 mr-2" />
                        All Student Registrations
                        <ArrowRight className="w-4 h-4 ml-auto" />
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Download className="w-4 h-4 mr-2" />
                        Approval Statistics
                        <ArrowRight className="w-4 h-4 ml-auto" />
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Download className="w-4 h-4 mr-2" />
                        Document Verification Report
                        <ArrowRight className="w-4 h-4 ml-auto" />
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Download className="w-4 h-4 mr-2" />
                        Geographic Analysis
                        <ArrowRight className="w-4 h-4 ml-auto" />
                      </Button>
                    </div>
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
