"use client"

import { useState } from "react"
import { SidebarLayout } from "@/components/sidebar-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Users, 
  UserPlus, 
  BarChart3, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Download,
  Filter,
  Search,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  FileText,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Shield
} from "lucide-react"

const managerStats = [
  {
    title: "Total Volunteers",
    value: "47",
    change: "+15%",
    changeType: "positive",
    icon: Users
  },
  {
    title: "Active Volunteers",
    value: "38",
    change: "+8%",
    changeType: "positive", 
    icon: CheckCircle
  },
  {
    title: "Pending Approvals",
    value: "12",
    change: "+3",
    changeType: "neutral",
    icon: Clock
  },
  {
    title: "Team Performance",
    value: "94%",
    change: "+5%",
    changeType: "positive",
    icon: TrendingUp
  }
]

const volunteerData = [
  {
    id: 1,
    name: "Rajesh Kumar",
    email: "rajesh@bjp.org",
    phone: "+91 98765 43210",
    location: "Delhi Central",
    status: "Active",
    tasksCompleted: 24,
    votersContacted: 156,
    performance: 95,
    joinDate: "2024-01-15",
    lastActive: "2 hours ago",
    role: "Senior Volunteer"
  },
  {
    id: 2,
    name: "Priya Sharma",
    email: "priya@bjp.org", 
    phone: "+91 98765 43211",
    location: "Mumbai North",
    status: "Active",
    tasksCompleted: 18,
    votersContacted: 142,
    performance: 88,
    joinDate: "2024-02-10",
    lastActive: "1 hour ago",
    role: "Team Lead"
  },
  {
    id: 3,
    name: "Amit Singh",
    email: "amit@bjp.org",
    phone: "+91 98765 43212", 
    location: "Bangalore South",
    status: "Inactive",
    tasksCompleted: 8,
    votersContacted: 45,
    performance: 72,
    joinDate: "2024-01-20",
    lastActive: "3 days ago",
    role: "Volunteer"
  },
  {
    id: 4,
    name: "Sneha Patel",
    email: "sneha@bjp.org",
    phone: "+91 98765 43213",
    location: "Ahmedabad East", 
    status: "Active",
    tasksCompleted: 31,
    votersContacted: 203,
    performance: 98,
    joinDate: "2024-01-05",
    lastActive: "30 minutes ago",
    role: "Senior Volunteer"
  },
  {
    id: 5,
    name: "Vikram Joshi",
    email: "vikram@bjp.org",
    phone: "+91 98765 43214",
    location: "Pune West",
    status: "Active",
    tasksCompleted: 22,
    votersContacted: 178,
    performance: 91,
    joinDate: "2024-02-15",
    lastActive: "4 hours ago",
    role: "Volunteer"
  }
]

const candidateData = [
  {
    id: 1,
    name: "Arjun Mehta",
    email: "arjun.mehta@gmail.com",
    phone: "+91 98765 43220",
    location: "Delhi",
    experience: "2 years",
    skills: ["Public Speaking", "Social Media", "Community Outreach"],
    status: "Pending",
    appliedDate: "2024-03-15",
    references: "Rajesh Kumar"
  },
  {
    id: 2,
    name: "Kavya Reddy",
    email: "kavya.reddy@gmail.com",
    phone: "+91 98765 43221",
    location: "Hyderabad",
    experience: "1 year",
    skills: ["Data Analysis", "Event Management"],
    status: "Approved",
    appliedDate: "2024-03-10",
    references: "Priya Sharma"
  },
  {
    id: 3,
    name: "Rohit Agarwal",
    email: "rohit.agarwal@gmail.com",
    phone: "+91 98765 43222",
    location: "Kolkata",
    experience: "3 years",
    skills: ["Leadership", "Volunteer Management", "Campaign Strategy"],
    status: "Under Review",
    appliedDate: "2024-03-12",
    references: "Amit Singh"
  },
  {
    id: 4,
    name: "Deepika Nair",
    email: "deepika.nair@gmail.com",
    phone: "+91 98765 43223",
    location: "Chennai",
    experience: "1.5 years",
    skills: ["Digital Marketing", "Content Creation"],
    status: "Rejected",
    appliedDate: "2024-03-08",
    references: "Sneha Patel"
  }
]

const campaignData = [
  {
    id: 1,
    name: "Digital Outreach Campaign",
    volunteers: 15,
    progress: 85,
    status: "Active",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    votersReached: 1250
  },
  {
    id: 2,
    name: "Voter Registration Drive",
    volunteers: 22,
    progress: 67,
    status: "Active", 
    startDate: "2024-02-01",
    endDate: "2024-04-30",
    votersReached: 890
  },
  {
    id: 3,
    name: "Community Engagement",
    volunteers: 12,
    progress: 95,
    status: "Near Completion",
    startDate: "2024-01-15",
    endDate: "2024-02-28",
    votersReached: 2100
  }
]

// Chart Data
const registrationTrendsData = [
  { month: "Jan", registrations: 45, approvals: 38, rejections: 7 },
  { month: "Feb", registrations: 62, approvals: 52, rejections: 10 },
  { month: "Mar", registrations: 78, approvals: 65, rejections: 13 },
  { month: "Apr", registrations: 89, approvals: 74, rejections: 15 },
  { month: "May", registrations: 95, approvals: 82, rejections: 13 },
  { month: "Jun", registrations: 112, approvals: 98, rejections: 14 }
]

const applicationStatusData = [
  { status: "Verified", count: 1247, percentage: 87.3, color: "bg-green-500" },
  { status: "Pending Verification", count: 89, percentage: 6.2, color: "bg-yellow-500" },
  { status: "Follow-up Required", count: 69, percentage: 4.8, color: "bg-red-500" },
  { status: "Under Review", count: 25, percentage: 1.7, color: "bg-blue-500" }
]

const enrollmentTrendsData = [
  { month: "Jan", newVoters: 1250, verifiedVoters: 1100, totalVoters: 1100 },
  { month: "Feb", newVoters: 1890, verifiedVoters: 1650, totalVoters: 2750 },
  { month: "Mar", newVoters: 2100, verifiedVoters: 1850, totalVoters: 4600 },
  { month: "Apr", newVoters: 2450, verifiedVoters: 2200, totalVoters: 6800 },
  { month: "May", newVoters: 2780, verifiedVoters: 2500, totalVoters: 9300 },
  { month: "Jun", newVoters: 3200, verifiedVoters: 2900, totalVoters: 12200 }
]

export default function ManagerDashboard() {
  const [showAddVolunteerForm, setShowAddVolunteerForm] = useState(false)
  const [selectedVolunteer, setSelectedVolunteer] = useState(null)
  const [showCandidateApproval, setShowCandidateApproval] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState(null)

  return (
    <SidebarLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Manager Dashboard</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Manage volunteers, track performance, approve candidates, and oversee team operations.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" className="text-xs sm:text-sm h-8 sm:h-9">
              <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Export Report</span>
            </Button>
            <Button 
              onClick={() => setShowAddVolunteerForm(true)}
              className="text-xs sm:text-sm h-8 sm:h-9"
            >
              <UserPlus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Add Volunteer</span>
            </Button>
            <Button 
              onClick={() => setShowCandidateApproval(true)}
              variant="outline"
              className="text-xs sm:text-sm h-8 sm:h-9"
            >
              <Shield className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Approve Candidates</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {managerStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="border-chart-1/20 bg-gradient-to-br from-background to-chart-1/5">
                <CardContent className="p-3 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-chart-1">{stat.value}</p>
                    </div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-chart-1/20 rounded-lg flex items-center justify-center">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-chart-1" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-1 sm:mt-2">
                    <TrendingUp className="w-2 h-2 sm:w-3 sm:h-3 text-chart-1" />
                    <span className="text-[10px] sm:text-xs text-chart-1">{stat.change}</span>
                    <span className="text-[10px] sm:text-xs text-muted-foreground hidden sm:inline">vs last month</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Tabs defaultValue="volunteers" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-12 bg-muted">
            <TabsTrigger value="volunteers" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Volunteers</span>
            </TabsTrigger>
            <TabsTrigger value="candidates" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Candidates</span>
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Campaigns</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
          </TabsList>

          {/* Volunteers Tab */}
          <TabsContent value="volunteers" className="space-y-6">
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg">Volunteer Management</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Manage your volunteer team members</CardDescription>
              </CardHeader>
              <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs sm:text-sm">Name</TableHead>
                        <TableHead className="text-xs sm:text-sm">Contact</TableHead>
                        <TableHead className="text-xs sm:text-sm">Location</TableHead>
                        <TableHead className="text-xs sm:text-sm">Status</TableHead>
                        <TableHead className="text-xs sm:text-sm">Performance</TableHead>
                        <TableHead className="text-xs sm:text-sm">Voters Contacted</TableHead>
                        <TableHead className="text-xs sm:text-sm">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {volunteerData.map((volunteer) => (
                        <TableRow key={volunteer.id}>
                          <TableCell className="text-xs sm:text-sm font-medium">{volunteer.name}</TableCell>
                          <TableCell className="text-xs sm:text-sm text-muted-foreground">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {volunteer.email}
                              </div>
                              <div className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {volunteer.phone}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {volunteer.location}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={volunteer.status === "Active" ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {volunteer.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-muted rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    volunteer.performance >= 90 ? 'bg-green-500' : 
                                    volunteer.performance >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${volunteer.performance}%` }}
                                />
                              </div>
                              <span className="text-xs font-medium">{volunteer.performance}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm">{volunteer.votersContacted}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Candidates Tab */}
          <TabsContent value="candidates" className="space-y-6">
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg">Volunteer Candidate Approval</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Review and approve new volunteer applications</CardDescription>
              </CardHeader>
              <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs sm:text-sm">Candidate</TableHead>
                        <TableHead className="text-xs sm:text-sm">Experience</TableHead>
                        <TableHead className="text-xs sm:text-sm">Skills</TableHead>
                        <TableHead className="text-xs sm:text-sm">Status</TableHead>
                        <TableHead className="text-xs sm:text-sm">Applied</TableHead>
                        <TableHead className="text-xs sm:text-sm">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {candidateData.map((candidate) => (
                        <TableRow key={candidate.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium text-sm">{candidate.name}</div>
                              <div className="text-xs text-muted-foreground">{candidate.email}</div>
                              <div className="text-xs text-muted-foreground">{candidate.phone}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm">{candidate.experience}</TableCell>
                          <TableCell className="text-xs sm:text-sm">
                            <div className="flex flex-wrap gap-1">
                              {candidate.skills.slice(0, 2).map((skill, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {candidate.skills.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{candidate.skills.length - 2}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                candidate.status === "Approved" ? "default" :
                                candidate.status === "Pending" ? "secondary" :
                                candidate.status === "Under Review" ? "outline" : "destructive"
                              }
                              className="text-xs"
                            >
                              {candidate.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm">{candidate.appliedDate}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0"
                                onClick={() => setSelectedCandidate(candidate)}
                              >
                                <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                              {candidate.status === "Pending" && (
                                <>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-green-600">
                                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600">
                                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-6">
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg">Campaign Management</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Track and manage campaign activities</CardDescription>
              </CardHeader>
              <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
                <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
                  {campaignData.map((campaign) => (
                    <Card key={campaign.id} className="border-chart-1/20">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-sm sm:text-base">{campaign.name}</h3>
                            <p className="text-xs text-muted-foreground">
                              {campaign.volunteers} volunteers • {campaign.votersReached} voters reached
                            </p>
                          </div>
                          <Badge 
                            variant={campaign.status === "Active" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {campaign.status}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs sm:text-sm">
                            <span>Progress</span>
                            <span>{campaign.progress}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-chart-1 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${campaign.progress}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Start: {campaign.startDate}</span>
                            <span>End: {campaign.endDate}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            {/* Registration Trends Chart */}
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg">Registration Trends</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Monthly registration and approval statistics</CardDescription>
              </CardHeader>
              <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
                <div className="h-64 flex items-end justify-between gap-2">
                  {registrationTrendsData.map((data, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div className="w-full flex flex-col items-center gap-1 mb-2">
                        <div 
                          className="w-full bg-green-500 rounded-t-sm"
                          style={{ height: `${(data.registrations / 120) * 200}px` }}
                        />
                        <div 
                          className="w-full bg-blue-500 rounded-t-sm"
                          style={{ height: `${(data.approvals / 120) * 200}px` }}
                        />
                        <div 
                          className="w-full bg-red-500 rounded-t-sm"
                          style={{ height: `${(data.rejections / 120) * 200}px` }}
                        />
                      </div>
                      <div className="text-xs text-center">
                        <div className="font-medium">{data.month}</div>
                        <div className="text-muted-foreground">{data.registrations}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-xs">Registrations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span className="text-xs">Approvals</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span className="text-xs">Rejections</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
              {/* Application Status Chart */}
              <Card>
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-base sm:text-lg">Application Status</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Current distribution of application statuses</CardDescription>
                </CardHeader>
                <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
                  <div className="space-y-4">
                    {applicationStatusData.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{item.status}</span>
                          <span className="text-muted-foreground">{item.count} ({item.percentage}%)</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-3">
                          <div 
                            className={`${item.color} h-3 rounded-full transition-all duration-300`}
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Enrollment Trends Chart */}
              <Card>
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-base sm:text-lg">Enrollment Trends</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Monthly voter enrollment and verification trends</CardDescription>
                </CardHeader>
                <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
                  <div className="h-48 flex items-end justify-between gap-1">
                    {enrollmentTrendsData.map((data, index) => (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div className="w-full flex flex-col items-center gap-0.5 mb-2">
                          <div 
                            className="w-full bg-orange-500 rounded-t-sm"
                            style={{ height: `${(data.totalVoters / 13000) * 150}px` }}
                          />
                          <div 
                            className="w-full bg-green-500 rounded-t-sm"
                            style={{ height: `${(data.verifiedVoters / 13000) * 150}px` }}
                          />
                        </div>
                        <div className="text-xs text-center">
                          <div className="font-medium">{data.month}</div>
                          <div className="text-muted-foreground">{data.totalVoters.toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center gap-6 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-500 rounded"></div>
                      <span className="text-xs">Total Voters</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      <span className="text-xs">Verified</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Performers */}
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg">Top Performers</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Best performing volunteers this month</CardDescription>
              </CardHeader>
              <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
                <div className="space-y-3">
                  {volunteerData
                    .sort((a, b) => b.performance - a.performance)
                    .slice(0, 5)
                    .map((volunteer, index) => (
                    <div key={volunteer.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">{index + 1}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{volunteer.name}</p>
                          <p className="text-xs text-muted-foreground">{volunteer.location} • {volunteer.role}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-16 bg-muted rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                volunteer.performance >= 90 ? 'bg-green-500' : 
                                volunteer.performance >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${volunteer.performance}%` }}
                            />
                          </div>
                          <span className="text-sm font-bold">{volunteer.performance}%</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{volunteer.votersContacted} voters</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add Volunteer Dialog */}
        <Dialog open={showAddVolunteerForm} onOpenChange={setShowAddVolunteerForm}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Volunteer</DialogTitle>
              <DialogDescription>
                Add a new volunteer to your team.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Enter full name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter email address" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="Enter phone number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="delhi">Delhi</SelectItem>
                    <SelectItem value="mumbai">Mumbai</SelectItem>
                    <SelectItem value="bangalore">Bangalore</SelectItem>
                    <SelectItem value="ahmedabad">Ahmedabad</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddVolunteerForm(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowAddVolunteerForm(false)}>
                  Add Volunteer
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Candidate Approval Dialog */}
        <Dialog open={showCandidateApproval} onOpenChange={setShowCandidateApproval}>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Volunteer Candidate Approval</DialogTitle>
              <DialogDescription>
                Review and approve new volunteer applications
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid gap-4">
                {candidateData.filter(c => c.status === "Pending" || c.status === "Under Review").map((candidate) => (
                  <Card key={candidate.id} className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">{candidate.name}</h3>
                        <p className="text-sm text-muted-foreground">{candidate.email} • {candidate.phone}</p>
                        <p className="text-sm text-muted-foreground">Location: {candidate.location}</p>
                      </div>
                      <Badge variant={candidate.status === "Pending" ? "secondary" : "outline"}>
                        {candidate.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-medium text-sm mb-2">Experience & Skills</h4>
                        <p className="text-sm text-muted-foreground mb-2">Experience: {candidate.experience}</p>
                        <div className="flex flex-wrap gap-1">
                          {candidate.skills.map((skill, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-2">Reference</h4>
                        <p className="text-sm text-muted-foreground">Referred by: {candidate.references}</p>
                        <p className="text-sm text-muted-foreground">Applied: {candidate.appliedDate}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button variant="destructive" size="sm" className="flex-1">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </SidebarLayout>
  )
}
