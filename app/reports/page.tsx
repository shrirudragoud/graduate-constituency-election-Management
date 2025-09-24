"use client"

import { SidebarLayout } from "@/components/sidebar-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Download, FileText, BarChart3, TrendingUp, Users, CheckCircle, Clock, AlertCircle, Filter, Search, Calendar as CalendarIcon2, RefreshCw } from "lucide-react"
import { format } from "date-fns"
import { useState } from "react"

const reportTypes = [
  {
    id: "registration",
    title: "Registration Reports",
    description: "Student enrollment and registration statistics",
    icon: Users,
    color: "chart-1",
    reports: [
      { name: "Daily Registration Summary", type: "PDF", size: "2.4 MB", lastGenerated: "2 hours ago" },
      { name: "Weekly Progress Report", type: "Excel", size: "1.8 MB", lastGenerated: "1 day ago" },
      { name: "Monthly Analytics", type: "PDF", size: "4.2 MB", lastGenerated: "3 days ago" },
      { name: "Yearly Overview", type: "PDF", size: "8.1 MB", lastGenerated: "1 week ago" },
    ]
  },
  {
    id: "approval",
    title: "Approval Reports",
    description: "Application approval and rejection statistics",
    icon: CheckCircle,
    color: "chart-2",
    reports: [
      { name: "Pending Applications", type: "Excel", size: "1.2 MB", lastGenerated: "1 hour ago" },
      { name: "Approval Statistics", type: "PDF", size: "3.1 MB", lastGenerated: "4 hours ago" },
      { name: "Rejection Analysis", type: "PDF", size: "2.8 MB", lastGenerated: "6 hours ago" },
      { name: "Processing Times", type: "Excel", size: "1.5 MB", lastGenerated: "1 day ago" },
    ]
  },
  {
    id: "system",
    title: "System Reports",
    description: "Platform performance and system health reports",
    icon: BarChart3,
    color: "chart-3",
    reports: [
      { name: "System Performance", type: "PDF", size: "2.1 MB", lastGenerated: "30 minutes ago" },
      { name: "User Activity Log", type: "CSV", size: "5.3 MB", lastGenerated: "2 hours ago" },
      { name: "Security Audit", type: "PDF", size: "3.7 MB", lastGenerated: "1 day ago" },
      { name: "Error Logs", type: "TXT", size: "1.9 MB", lastGenerated: "3 hours ago" },
    ]
  },
  {
    id: "team",
    title: "Team Reports",
    description: "Team member performance and activity reports",
    icon: TrendingUp,
    color: "chart-4",
    reports: [
      { name: "Team Performance", type: "PDF", size: "2.6 MB", lastGenerated: "1 hour ago" },
      { name: "Workload Distribution", type: "Excel", size: "1.4 MB", lastGenerated: "5 hours ago" },
      { name: "Productivity Metrics", type: "PDF", size: "3.2 MB", lastGenerated: "1 day ago" },
      { name: "Training Progress", type: "Excel", size: "1.1 MB", lastGenerated: "2 days ago" },
    ]
  }
]

const recentReports = [
  {
    id: 1,
    name: "Daily Registration Summary",
    type: "PDF",
    size: "2.4 MB",
    generatedBy: "Sarah Johnson",
    generatedAt: "2 hours ago",
    status: "completed"
  },
  {
    id: 2,
    name: "Weekly Progress Report",
    type: "Excel",
    size: "1.8 MB",
    generatedBy: "Michael Chen",
    generatedAt: "1 day ago",
    status: "completed"
  },
  {
    id: 3,
    name: "System Performance Report",
    type: "PDF",
    size: "2.1 MB",
    generatedBy: "Admin System",
    generatedAt: "30 minutes ago",
    status: "completed"
  },
  {
    id: 4,
    name: "Monthly Analytics",
    type: "PDF",
    size: "4.2 MB",
    generatedBy: "Emily Rodriguez",
    generatedAt: "3 days ago",
    status: "completed"
  },
  {
    id: 5,
    name: "Security Audit Report",
    type: "PDF",
    size: "3.7 MB",
    generatedBy: "Admin System",
    generatedAt: "1 day ago",
    status: "completed"
  }
]

export default function ReportsPage() {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedReportType, setSelectedReportType] = useState("all")

  return (
    <SidebarLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Reports & Analytics</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Generate, download, and manage comprehensive reports for your election enrollment platform. (Admin Only)
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" className="text-xs sm:text-sm h-8 sm:h-9">
              <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Refresh All</span>
            </Button>
            <Button className="text-xs sm:text-sm h-8 sm:h-9">
              <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Generate Report</span>
              <span className="sm:hidden">Generate</span>
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <Card className="border-chart-1/20 bg-gradient-to-br from-background to-chart-1/5">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Total Reports</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-chart-1">47</p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-chart-1/20 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-chart-1" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-1 sm:mt-2">
                <span className="text-[10px] sm:text-xs text-chart-1">+3 this week</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-chart-2/20 bg-gradient-to-br from-background to-chart-2/5">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Generated Today</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-chart-2">12</p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-chart-2/20 rounded-lg flex items-center justify-center">
                  <Download className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-chart-2" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-1 sm:mt-2">
                <span className="text-[10px] sm:text-xs text-chart-2">Active generation</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-chart-3/20 bg-gradient-to-br from-background to-chart-3/5">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Storage Used</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-chart-3">2.1 GB</p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-chart-3/20 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-chart-3" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-1 sm:mt-2">
                <span className="text-[10px] sm:text-xs text-chart-3">65% of quota</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-chart-4/20 bg-gradient-to-br from-background to-chart-4/5">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Auto Reports</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-chart-4">8</p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-chart-4/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-chart-4" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-1 sm:mt-2">
                <span className="text-[10px] sm:text-xs text-chart-4">Scheduled</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="reports" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-10 sm:h-12 bg-muted">
            <TabsTrigger value="reports" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-1 sm:px-3">
              <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">All Reports</span>
              <span className="sm:hidden">Reports</span>
            </TabsTrigger>
            <TabsTrigger value="generate" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-1 sm:px-3">
              <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Generate New</span>
              <span className="sm:hidden">Generate</span>
            </TabsTrigger>
            <TabsTrigger value="scheduled" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-1 sm:px-3">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Scheduled</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-1 sm:px-3">
              <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* All Reports Tab */}
          <TabsContent value="reports" className="space-y-4 sm:space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-3 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search reports..." className="pl-10 text-sm" />
                  </div>
                  <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                    <SelectTrigger className="w-full sm:w-48 text-sm">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="registration">Registration</SelectItem>
                      <SelectItem value="approval">Approval</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                      <SelectItem value="team">Team</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" className="text-sm">
                    <Filter className="w-4 h-4 mr-2" />
                    More Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Report Categories */}
            <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
              {reportTypes.map((category) => {
                const Icon = category.icon
                return (
                  <Card key={category.id} className="hover:border-primary/20 transition-colors">
                    <CardHeader className="pb-3 sm:pb-4">
                      <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 bg-${category.color}/20 rounded-lg flex items-center justify-center`}>
                          <Icon className={`w-4 h-4 sm:w-5 sm:h-5 text-${category.color}`} />
                        </div>
                        <div>
                          <div>{category.title}</div>
                          <div className="text-xs sm:text-sm text-muted-foreground font-normal">
                            {category.description}
                          </div>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {category.reports.map((report, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{report.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {report.type} • {report.size} • {report.lastGenerated}
                            </p>
                          </div>
                          <Button variant="outline" size="sm" className="ml-2 text-xs">
                            <Download className="w-3 h-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Generate New Tab */}
          <TabsContent value="generate" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg">Generate New Report</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Create custom reports with specific parameters and date ranges
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Report Type</label>
                    <Select>
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="registration">Registration Report</SelectItem>
                        <SelectItem value="approval">Approval Report</SelectItem>
                        <SelectItem value="system">System Report</SelectItem>
                        <SelectItem value="team">Team Report</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Format</label>
                    <Select>
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="excel">Excel</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date Range</label>
                  <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="flex-1 justify-start text-sm">
                          <CalendarIcon2 className="w-4 h-4 mr-2" />
                          {selectedDate ? format(selectedDate, "PPP") : "Select start date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="flex-1 justify-start text-sm">
                          <CalendarIcon2 className="w-4 h-4 mr-2" />
                          Select end date
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="text-sm">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Scheduled Tab */}
          <TabsContent value="scheduled" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg">Scheduled Reports</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Manage automatically generated reports and their schedules
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "Daily Registration Summary", schedule: "Every day at 6:00 AM", nextRun: "Tomorrow at 6:00 AM", status: "active" },
                    { name: "Weekly Progress Report", schedule: "Every Monday at 8:00 AM", nextRun: "Next Monday at 8:00 AM", status: "active" },
                    { name: "Monthly Analytics", schedule: "1st of every month at 9:00 AM", nextRun: "Next month at 9:00 AM", status: "active" },
                    { name: "System Health Report", schedule: "Every 6 hours", nextRun: "In 2 hours", status: "active" },
                  ].map((report, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{report.name}</p>
                        <p className="text-xs text-muted-foreground">{report.schedule}</p>
                        <p className="text-xs text-muted-foreground">Next run: {report.nextRun}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-chart-1/10 text-chart-1 border-chart-1/20 text-xs">
                          {report.status}
                        </Badge>
                        <Button variant="outline" size="sm" className="text-xs">
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg">Report Settings</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Configure report generation, storage, and notification settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Auto-cleanup old reports</p>
                      <p className="text-xs text-muted-foreground">Automatically delete reports older than 90 days</p>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs">
                      Enable
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Email notifications</p>
                      <p className="text-xs text-muted-foreground">Send email when reports are generated</p>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs">
                      Configure
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Storage quota</p>
                      <p className="text-xs text-muted-foreground">Current usage: 2.1 GB / 5 GB</p>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs">
                      Manage
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
