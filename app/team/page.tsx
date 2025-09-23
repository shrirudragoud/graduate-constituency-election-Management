"use client"

import { useState } from "react"
import { SidebarLayout } from "@/components/sidebar-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AddStudentForm } from "@/components/forms/add-student-form"
import {
  Users,
  FileText,
  Search,
  Filter,
  Plus,
  Edit,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Upload,
  TrendingUp,
  ArrowRight,
} from "lucide-react"

export default function TeamDashboard() {
  const [showAddStudentForm, setShowAddStudentForm] = useState(false)

  return (
    <SidebarLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Team Management</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Manage student registrations, review applications, and coordinate team efforts.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-chart-4/10 text-chart-4 border-chart-4/20 text-xs sm:text-sm">
              <AlertCircle className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">89 Pending</span>
              <span className="sm:hidden">89</span>
            </Badge>
            <Button onClick={() => setShowAddStudentForm(true)} className="text-xs sm:text-sm h-8 sm:h-9">
              <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Add Student</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              <Card className="group hover:border-chart-1/30 transition-all duration-300 hover:shadow-medium bg-gradient-to-br from-card via-card to-chart-1/5 border-chart-1/20">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground font-medium">Total Students</p>
                      <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-chart-1 tracking-tight">1,247</p>
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-chart-1/20 via-chart-1/10 to-chart-1/30 rounded-xl flex items-center justify-center shadow-soft group-hover:shadow-medium transition-all duration-300 group-hover:scale-105">
                      <Users className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-chart-1" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 bg-chart-1/10 rounded-lg">
                    <TrendingUp className="w-3 h-3 text-chart-1 flex-shrink-0" />
                    <span className="text-[10px] sm:text-xs text-chart-1 font-medium">+12%</span>
                    <span className="text-[10px] sm:text-xs text-muted-foreground hidden sm:inline font-medium">from last week</span>
                  </div>
                </CardContent>
              </Card>

          <Card className="border-chart-2/20 bg-gradient-to-br from-background to-chart-2/5">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Pending Review</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-chart-2">89</p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-chart-2/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-chart-2" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-1 sm:mt-2">
                <span className="text-[10px] sm:text-xs text-chart-2">Needs attention</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-chart-1/20 bg-gradient-to-br from-background to-chart-1/5">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Approved</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-chart-1">1,089</p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-chart-1/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-chart-1" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-1 sm:mt-2">
                <span className="text-[10px] sm:text-xs text-chart-1">87.3%</span>
                <span className="text-[10px] sm:text-xs text-muted-foreground hidden sm:inline">approval rate</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/20 bg-gradient-to-br from-background to-destructive/5">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Issues</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-destructive">69</p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-destructive/20 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-destructive" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-1 sm:mt-2">
                <span className="text-[10px] sm:text-xs text-destructive">Requires action</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="students" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-10 sm:h-12 bg-muted">
            <TabsTrigger value="students" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-1 sm:px-3">
              <Users className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Student Management</span>
              <span className="sm:hidden">Students</span>
            </TabsTrigger>
            <TabsTrigger value="review" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-1 sm:px-3">
              <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Application Review</span>
              <span className="sm:hidden">Review</span>
            </TabsTrigger>
            <TabsTrigger value="bulk" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-1 sm:px-3">
              <Upload className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Bulk Operations</span>
              <span className="sm:hidden">Bulk</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-1 sm:px-3">
              <Download className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Reports</span>
            </TabsTrigger>
          </TabsList>

          {/* Student Management Tab */}
          <TabsContent value="students" className="space-y-6">
            <Card className="hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      Student Registry
                    </CardTitle>
                    <CardDescription>Manage student registrations and profiles</CardDescription>
                  </div>
                  <Button onClick={() => setShowAddStudentForm(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Student
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search students..." className="pl-10" />
                  </div>
                  <Select>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Students</SelectItem>
                      <SelectItem value="pending">Pending Review</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    More Filters
                  </Button>
                </div>

                {/* Students Table */}
                <div className="border border-border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Student</TableHead>
                        <TableHead>Student ID</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="hover:bg-muted/30">
                        <TableCell>
                          <div>
                            <div className="font-medium">John Michael Doe</div>
                            <div className="text-sm text-muted-foreground">john.doe@university.edu</div>
                          </div>
                        </TableCell>
                        <TableCell>STU-2024-001247</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-chart-2/10 text-chart-2 border-chart-2/20">
                            <Clock className="w-3 h-3 mr-1" />
                            Under Review
                          </Badge>
                        </TableCell>
                        <TableCell>Mar 10, 2024</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow className="hover:bg-muted/30">
                        <TableCell>
                          <div>
                            <div className="font-medium">Sarah Johnson</div>
                            <div className="text-sm text-muted-foreground">sarah.j@university.edu</div>
                          </div>
                        </TableCell>
                        <TableCell>STU-2024-001248</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-chart-1/10 text-chart-1 border-chart-1/20">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Approved
                          </Badge>
                        </TableCell>
                        <TableCell>Mar 9, 2024</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow className="hover:bg-muted/30">
                        <TableCell>
                          <div>
                            <div className="font-medium">Michael Chen</div>
                            <div className="text-sm text-muted-foreground">m.chen@university.edu</div>
                          </div>
                        </TableCell>
                        <TableCell>STU-2024-001249</TableCell>
                        <TableCell>
                          <Badge variant="destructive">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Needs Documents
                          </Badge>
                        </TableCell>
                        <TableCell>Mar 8, 2024</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Application Review Tab */}
          <TabsContent value="review" className="space-y-6">
            <Card className="hover:border-primary/20 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Pending Applications
                </CardTitle>
                <CardDescription>Review and approve student registration applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Application Item */}
                  <div className="border border-chart-1/20 rounded-lg p-6 bg-gradient-to-br from-background to-chart-1/5">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">John Michael Doe</h3>
                        <p className="text-muted-foreground">STU-2024-001247 • john.doe@university.edu</p>
                        <p className="text-sm text-muted-foreground">Submitted: March 10, 2024</p>
                      </div>
                      <Badge variant="outline" className="bg-chart-2/10 text-chart-2 border-chart-2/20">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending Review
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Personal Information</h4>
                        <div className="text-sm text-muted-foreground">
                          <p>DOB: March 15, 2002</p>
                          <p>Phone: +1 (555) 123-4567</p>
                          <p>Year: Junior (3rd Year)</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Registration Details</h4>
                        <div className="text-sm text-muted-foreground">
                          <p>Location: Main Campus</p>
                          <p>Affiliation: Independent</p>
                          <p>Emergency: Jane Doe</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Documents</h4>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-3 h-3 text-chart-1" />
                            <span>Student ID</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-3 h-3 text-chart-1" />
                            <span>Photo ID</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-3 h-3 text-chart-1" />
                            <span>Proof of Address</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Button>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve Application
                      </Button>
                      <Button variant="destructive">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Request Changes
                      </Button>
                      <Button variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>

                  {/* Another Application Item */}
                  <div className="border border-destructive/20 rounded-lg p-6 bg-gradient-to-br from-background to-destructive/5">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">Emily Rodriguez</h3>
                        <p className="text-muted-foreground">STU-2024-001250 • emily.r@university.edu</p>
                        <p className="text-sm text-muted-foreground">Submitted: March 11, 2024</p>
                      </div>
                      <Badge variant="destructive">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Missing Documents
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Personal Information</h4>
                        <div className="text-sm text-muted-foreground">
                          <p>DOB: July 22, 2001</p>
                          <p>Phone: +1 (555) 987-6543</p>
                          <p>Year: Senior (4th Year)</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Registration Details</h4>
                        <div className="text-sm text-muted-foreground">
                          <p>Location: North Campus</p>
                          <p>Affiliation: Democrat</p>
                          <p>Emergency: Carlos Rodriguez</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Documents</h4>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-3 h-3 text-chart-1" />
                            <span>Student ID</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <AlertCircle className="w-3 h-3 text-destructive" />
                            <span>Photo ID (Missing)</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-3 h-3 text-chart-1" />
                            <span>Proof of Address</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Button variant="destructive">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Request Missing Documents
                      </Button>
                      <Button variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bulk Operations Tab */}
          <TabsContent value="bulk" className="space-y-6">
            <Card className="hover:border-primary/20 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-primary" />
                  Bulk Student Management
                </CardTitle>
                <CardDescription>Import, export, and manage multiple student registrations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Bulk Import */}
                  <div className="border border-chart-1/20 rounded-lg p-6 bg-gradient-to-br from-background to-chart-1/5">
                    <h3 className="font-semibold mb-3">Bulk Import Students</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload a CSV file to register multiple students at once
                    </p>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full bg-transparent">
                        <Upload className="w-4 h-4 mr-2" />
                        Choose CSV File
                        <ArrowRight className="w-4 h-4 ml-auto" />
                      </Button>
                      <Button variant="outline" className="w-full bg-transparent">
                        <Download className="w-4 h-4 mr-2" />
                        Download Template
                        <ArrowRight className="w-4 h-4 ml-auto" />
                      </Button>
                    </div>
                  </div>

                  {/* Bulk Export */}
                  <div className="border border-chart-2/20 rounded-lg p-6 bg-gradient-to-br from-background to-chart-2/5">
                    <h3 className="font-semibold mb-3">Export Student Data</h3>
                    <p className="text-sm text-muted-foreground mb-4">Export student registration data for reporting</p>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full bg-transparent">
                        <Download className="w-4 h-4 mr-2" />
                        Export All Students
                        <ArrowRight className="w-4 h-4 ml-auto" />
                      </Button>
                      <Button variant="outline" className="w-full bg-transparent">
                        <Download className="w-4 h-4 mr-2" />
                        Export Pending Only
                        <ArrowRight className="w-4 h-4 ml-auto" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Bulk Actions */}
                <div className="border border-border rounded-lg p-6 bg-gradient-to-br from-background to-muted/30">
                  <h3 className="font-semibold mb-3">Bulk Actions</h3>
                  <p className="text-sm text-muted-foreground mb-4">Perform actions on multiple selected students</p>
                  <div className="flex flex-wrap gap-3">
                    <Button>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve Selected
                    </Button>
                    <Button variant="secondary">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Request Documents
                    </Button>
                    <Button variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      Send Notifications
                    </Button>
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
                  <Download className="w-5 h-5 text-primary" />
                  Reports & Analytics
                </CardTitle>
                <CardDescription>Generate reports and view registration analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Registration Reports</h3>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Download className="w-4 h-4 mr-2" />
                        Daily Registration Summary
                        <ArrowRight className="w-4 h-4 ml-auto" />
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Download className="w-4 h-4 mr-2" />
                        Weekly Progress Report
                        <ArrowRight className="w-4 h-4 ml-auto" />
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Download className="w-4 h-4 mr-2" />
                        Monthly Analytics
                        <ArrowRight className="w-4 h-4 ml-auto" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Status Reports</h3>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Download className="w-4 h-4 mr-2" />
                        Pending Applications
                        <ArrowRight className="w-4 h-4 ml-auto" />
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Download className="w-4 h-4 mr-2" />
                        Document Issues
                        <ArrowRight className="w-4 h-4 ml-auto" />
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Download className="w-4 h-4 mr-2" />
                        Approval Statistics
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

      <AddStudentForm open={showAddStudentForm} onOpenChange={setShowAddStudentForm} />
    </SidebarLayout>
  )
}
