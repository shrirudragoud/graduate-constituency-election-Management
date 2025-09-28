"use client"

import { useState, useEffect } from "react"
import { SidebarLayout } from "@/components/sidebar-layout"
import { apiRequest, getCurrentUser, logout } from "@/lib/auth-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { SimpleStudentForm } from "@/components/forms/simple-student-form"
import { generateSimpleStudentPDF, generateSimpleAllStudentsPDF } from "@/lib/simple-pdf-generator"
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
  X
} from "lucide-react"

interface Submission {
  id: string
  submittedAt: string
  surname: string
  firstName: string
  fathersHusbandName: string
  fathersHusbandFullName: string
  sex: string
  qualification: string
  occupation: string
  dateOfBirth: string
  ageYears: string
  ageMonths: string
  district: string
  taluka: string
  villageName: string
  houseNo: string
  street: string
  pinCode: string
  mobileNumber: string
  aadhaarNumber: string
  yearOfPassing: string
  degreeDiploma: string
  nameOfUniversity: string
  nameOfDiploma: string
  haveChangedName: string
  place: string
  declarationDate: string
  files: Record<string, any>
  filledByUserId?: number
  filledByName?: string
  filledByPhone?: string
  formSource?: 'public' | 'team'
  filledForSelf?: boolean
}

export default function TeamDashboard() {
  const [showAddStudentForm, setShowAddStudentForm] = useState(false)
  const [showPdfPreview, setShowPdfPreview] = useState(false)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedSubmission, setEditedSubmission] = useState<Submission | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Check authentication first
    checkAuthentication()
    
    // Listen for form submission events
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'FORM_SUBMITTED') {
        console.log('🔄 Form submitted, refreshing data...')
        fetchSubmissions()
      }
    }
    
    window.addEventListener('message', handleMessage)
    
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  const checkAuthentication = () => {
    const token = localStorage.getItem('authToken')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      // Redirect to login if not authenticated
      window.location.href = '/team/login'
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      setIsAuthenticated(true)
      fetchSubmissions()
    } catch (error) {
      console.error('Error parsing user data:', error)
      window.location.href = '/team/login'
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    window.location.href = '/team/login'
  }

  const fetchSubmissions = async () => {
    try {
      console.log('🔄 Fetching submissions from team page...')
      const token = localStorage.getItem('authToken')
      
      if (!token) {
        console.error('❌ No auth token found')
        setLoading(false)
        return
      }

      const response = await fetch('/api/team/submit-form', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        console.error('❌ API response not ok:', response.status, response.statusText)
        const errorData = await response.json()
        console.error('❌ Error data:', errorData)
        setLoading(false)
        return
      }

      const data = await response.json()
      console.log('📊 Team API response:', data)
      setSubmissions(data.submissions || [])
      console.log('✅ Team submissions set:', data.submissions?.length || 0)
    } catch (error) {
      console.error('❌ Error fetching team submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleEdit = (submission: Submission) => {
    setSelectedSubmission(submission)
    setEditedSubmission({ ...submission })
    setIsEditing(true)
  }

  const handleSave = async () => {
    if (!editedSubmission) return
    
    try {
      // Update the submission in the local state
      setSubmissions(prev => 
        prev.map(sub => 
          sub.id === editedSubmission.id ? editedSubmission : sub
        )
      )
      
      // Here you would typically send the update to your API
      // For now, we'll just update the local state
      console.log('Saving submission:', editedSubmission)
      
      setIsEditing(false)
      setEditedSubmission(null)
    } catch (error) {
      console.error('Error saving submission:', error)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedSubmission(null)
  }

  const convertToSimpleSubmissionData = (submission: Submission) => {
    return {
      id: submission.id,
      firstName: submission.firstName,
      surname: submission.surname,
      fathersHusbandName: submission.fathersHusbandName,
      fathersHusbandFullName: submission.fathersHusbandFullName || '',
      sex: submission.sex,
      qualification: submission.qualification || '',
      occupation: submission.occupation || '',
      dateOfBirth: submission.dateOfBirth,
      ageYears: parseInt(submission.ageYears.toString()),
      ageMonths: parseInt(submission.ageMonths.toString()),
      address: {
        district: submission.district,
        taluka: submission.taluka,
        villageName: submission.villageName,
        houseNo: submission.houseNo,
        street: submission.street,
        pinCode: submission.pinCode
      },
      mobileNumber: submission.mobileNumber,
      aadhaarNumber: submission.aadhaarNumber,
      yearOfPassing: submission.yearOfPassing || '',
      degreeDiploma: submission.degreeDiploma || '',
      nameOfUniversity: submission.nameOfUniversity || '',
      nameOfDiploma: submission.nameOfDiploma || '',
      haveChangedName: submission.haveChangedName || '',
      place: submission.place,
      declarationDate: submission.declarationDate,
      email: (submission as any).email || '',
      files: submission.files,
      submittedAt: submission.submittedAt
    }
  }

  const handleDownloadStudentPDF = (submission: Submission) => {
    try {
      const simpleData = convertToSimpleSubmissionData(submission)
      generateSimpleStudentPDF(simpleData)
    } catch (error) {
      console.error('PDF generation failed:', error)
      alert('Error generating PDF. Please try again.')
    }
  }

  const handleDownloadAllStudentsPDF = () => {
    try {
      const simpleData = submissions.map(convertToSimpleSubmissionData)
      generateSimpleAllStudentsPDF(simpleData)
    } catch (error) {
      console.error('PDF generation failed:', error)
      alert('Error generating PDF. Please try again.')
    }
  }

  const filteredSubmissions = submissions
    .filter(submission => {
      const matchesSearch = 
        submission.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.mobileNumber.includes(searchTerm) ||
        submission.aadhaarNumber.includes(searchTerm)
      
      // For now, all submissions are "pending" - you can add status logic later
      const matchesStatus = statusFilter === "all" || statusFilter === "pending"
      
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      // Sort by submittedAt in descending order (newest first)
      return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    })

  const totalSubmissions = submissions.length
  const pendingSubmissions = submissions.length // All are pending for now
  const verifiedSubmissions = 0 // You can add verification logic later
  const followUpRequired = 0 // You can add follow-up logic later
  
  // Calculate form source breakdown
  const publicSubmissions = submissions.filter(sub => sub.formSource === 'public').length
  const teamSubmissions = submissions.filter(sub => sub.formSource === 'team').length
  const selfRegisteredSubmissions = submissions.filter(sub => !sub.filledByName).length

  // Show loading while checking authentication
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <SidebarLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Volunteer Portal</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Welcome back, {user?.firstName}! Reach out to voters, collect voter information, and coordinate constituency outreach efforts.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-chart-4/10 text-chart-4 border-chart-4/20 text-xs sm:text-sm">
              <AlertCircle className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">{pendingSubmissions} Pending</span>
              <span className="sm:hidden">{pendingSubmissions}</span>
            </Badge>
            <Button onClick={() => setShowAddStudentForm(true)} className="text-xs sm:text-sm h-8 sm:h-9">
              <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Add Student</span>
              <span className="sm:hidden">Add</span>
            </Button>
            <Button onClick={handleLogout} variant="outline" className="text-xs sm:text-sm h-8 sm:h-9">
              <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Logout</span>
              <span className="sm:hidden">Exit</span>
            </Button>
          </div>
        </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              <Card className="group hover:border-chart-1/30 transition-all duration-300 hover:shadow-medium bg-gradient-to-br from-card via-card to-chart-1/5 border-chart-1/20">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground font-medium">Total Students Registered</p>
                      <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-chart-1 tracking-tight">{totalSubmissions}</p>
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
                  <p className="text-xs sm:text-sm text-muted-foreground">Pending Verification</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-chart-2">{pendingSubmissions}</p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-chart-2/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-chart-2" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-1 sm:mt-2">
                <span className="text-[10px] sm:text-xs text-chart-2">Needs verification</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-chart-1/20 bg-gradient-to-br from-background to-chart-1/5">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Verified Students</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-chart-1">{verifiedSubmissions}</p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-chart-1/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-chart-1" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-1 sm:mt-2">
                <span className="text-[10px] sm:text-xs text-chart-1">87.3%</span>
                <span className="text-[10px] sm:text-xs text-muted-foreground hidden sm:inline">verification rate</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/20 bg-gradient-to-br from-background to-destructive/5">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Follow-up Required</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-destructive">{followUpRequired}</p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-destructive/20 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-destructive" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-1 sm:mt-2">
                <span className="text-[10px] sm:text-xs text-destructive">Needs follow-up</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Form Source Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-800">Public Registrations</p>
                  <p className="text-2xl font-bold text-blue-900">{publicSubmissions}</p>
                </div>
                <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-700" />
                </div>
              </div>
              <p className="text-xs text-blue-600 mt-1">Self-registered by citizens</p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-800">Team Registrations</p>
                  <p className="text-2xl font-bold text-green-900">{teamSubmissions}</p>
                </div>
                <div className="w-10 h-10 bg-green-200 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-green-700" />
                </div>
              </div>
              <p className="text-xs text-green-600 mt-1">Filled by team members</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-800">Your Team's Work</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {submissions.filter(sub => sub.filledByUserId === user?.id).length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-purple-200 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-purple-700" />
                </div>
              </div>
              <p className="text-xs text-purple-600 mt-1">Registrations you filled</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="students" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-10 sm:h-12 bg-muted">
            <TabsTrigger value="students" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-1 sm:px-3">
              <Users className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Voter Management</span>
              <span className="sm:hidden">Voters</span>
            </TabsTrigger>
            <TabsTrigger value="review" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-1 sm:px-3">
              <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Voter Verification</span>
              <span className="sm:hidden">Verify</span>
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
                      Voter Registry
                    </CardTitle>
                    <CardDescription>Manage voter information and constituency data</CardDescription>
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
                    <Input 
                      placeholder="Search students..." 
                      className="pl-10" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Students</SelectItem>
                      <SelectItem value="pending">Pending Verification</SelectItem>
                      <SelectItem value="approved">Verified</SelectItem>
                      <SelectItem value="rejected">Follow-up Required</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={fetchSubmissions}>
                    <Filter className="w-4 h-4 mr-2" />
                    Refresh Data
                  </Button>
                  <div className="text-xs text-muted-foreground bg-yellow-50 px-2 py-1 rounded">
                    🧪 Testing Mode: Showing all submissions
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={async () => {
                      try {
                        const response = await fetch('/api/test-submission', { method: 'POST' })
                        const result = await response.json()
                        if (result.success) {
                          alert('Test submission created!')
                          fetchSubmissions()
                        }
                      } catch (error) {
                        console.error('Test submission failed:', error)
                      }
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Test Data
                  </Button>
                </div>

                {/* Students Table - Mobile Friendly */}
                <div className="border border-border rounded-lg overflow-hidden">
                  {/* Desktop Table */}
                  <div className="hidden sm:block">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                          <TableHead>Student</TableHead>
                          <TableHead>Registration ID</TableHead>
                        <TableHead>Status</TableHead>
                          <TableHead>Form Source</TableHead>
                          <TableHead>Filled By</TableHead>
                          <TableHead>Submitted</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-8">
                              Loading submissions...
                            </TableCell>
                          </TableRow>
                        ) : filteredSubmissions.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-8">
                              <div className="flex flex-col items-center gap-2">
                                <Users className="w-8 h-8 text-muted-foreground" />
                                <p className="text-muted-foreground">No student registrations found</p>
                                <p className="text-sm text-muted-foreground">Students will appear here once they start registering</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredSubmissions.map((submission) => (
                            <TableRow key={submission.id} className="hover:bg-muted/30">
                        <TableCell>
                          <div>
                                  <div className="font-medium">{submission.firstName} {submission.surname}</div>
                                  <div className="text-sm text-muted-foreground">{submission.mobileNumber}</div>
                          </div>
                        </TableCell>
                              <TableCell className="font-mono text-sm">{submission.id}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-chart-2/10 text-chart-2 border-chart-2/20">
                            <Clock className="w-3 h-3 mr-1" />
                                  Pending
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={submission.formSource === 'team' ? 'default' : 'secondary'}>
                            {submission.formSource === 'team' ? 'Team' : 'Public'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {submission.filledByName ? (
                              <div>
                                <div className="font-medium">{submission.filledByName}</div>
                                {submission.filledByPhone && (
                                  <div className="text-muted-foreground text-xs">{submission.filledByPhone}</div>
                                )}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">Self-registered</span>
                            )}
                          </div>
                        </TableCell>
                              <TableCell className="text-sm">{formatDate(submission.submittedAt)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                                    onClick={() => setSelectedSubmission(submission)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleEdit(submission)}
                                  >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Mobile Cards */}
                  <div className="sm:hidden">
                    {loading ? (
                      <div className="text-center py-8">
                        Loading submissions...
                      </div>
                    ) : filteredSubmissions.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <Users className="w-8 h-8 text-muted-foreground" />
                          <p className="text-muted-foreground">No student registrations found</p>
                          <p className="text-sm text-muted-foreground">Students will appear here once they start registering</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3 p-3">
                        {filteredSubmissions.map((submission) => (
                          <div key={submission.id} className="border rounded-lg p-4 bg-card hover:bg-muted/30 transition-colors">
                            <div className="space-y-3">
                          <div>
                                <div className="font-medium text-lg">{submission.firstName} {submission.surname}</div>
                                <div className="text-sm text-muted-foreground">{submission.mobileNumber}</div>
                          </div>
                              
                              <div className="flex items-center justify-between">
                                <div className="text-xs text-muted-foreground font-mono">
                                  ID: {submission.id}
                                </div>
                                <div className="flex gap-2">
                                  <Badge variant="outline" className="bg-chart-2/10 text-chart-2 border-chart-2/20 text-xs">
                                    <Clock className="w-3 h-3 mr-1" />
                                    Pending
                                  </Badge>
                                  <Badge variant={submission.formSource === 'team' ? 'default' : 'secondary'} className="text-xs">
                                    {submission.formSource === 'team' ? 'Team' : 'Public'}
                                  </Badge>
                                </div>
                              </div>
                              
                              <div className="text-xs text-muted-foreground">
                                Submitted: {formatDate(submission.submittedAt)}
                              </div>
                              
                              {submission.filledByName && (
                                <div className="text-xs text-muted-foreground">
                                  Filled by: {submission.filledByName}
                                  {submission.filledByPhone && ` (${submission.filledByPhone})`}
                                </div>
                              )}
                              
                              <div className="flex gap-2 pt-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                                  onClick={() => setSelectedSubmission(submission)}
                                  className="flex-1"
                            >
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                                  onClick={() => handleEdit(submission)}
                                  className="flex-1"
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                            </Button>
                          </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
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
                  Pending Voter Verifications
                </CardTitle>
                <CardDescription>Review and verify voter information and constituency data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Application Item */}
                  <div className="border border-chart-1/20 rounded-lg p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-background to-chart-1/5">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3 sm:mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-base sm:text-lg">Rajesh Kumar Sharma</h3>
                        <p className="text-sm text-muted-foreground break-all">VOT-2024-001247 • rajesh.sharma@gmail.com</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">Contacted: March 10, 2024</p>
                      </div>
                      <Badge variant="outline" className="bg-chart-2/10 text-chart-2 border-chart-2/20 w-fit">
                        <Clock className="w-3 h-3 mr-1" />
                        <span className="text-xs sm:text-sm">Pending Verification</span>
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                      <div className="space-y-1 sm:space-y-2">
                        <h4 className="font-medium text-xs sm:text-sm">Personal Information</h4>
                        <div className="text-xs sm:text-sm text-muted-foreground space-y-1">
                          <p>DOB: March 15, 1985</p>
                          <p>Phone: +91 98765 43210</p>
                          <p>Age: 39 years</p>
                        </div>
                      </div>
                      <div className="space-y-1 sm:space-y-2">
                        <h4 className="font-medium text-xs sm:text-sm">Constituency Details</h4>
                        <div className="text-xs sm:text-sm text-muted-foreground space-y-1">
                          <p>Location: Delhi Central</p>
                          <p>Ward: 45</p>
                          <p>Emergency Contact: Sunita Sharma</p>
                        </div>
                      </div>
                      <div className="space-y-1 sm:space-y-2 sm:col-span-2 lg:col-span-1">
                        <h4 className="font-medium text-xs sm:text-sm">Documents</h4>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs sm:text-sm">
                            <CheckCircle className="w-3 h-3 text-chart-1 flex-shrink-0" />
                            <span>Voter ID</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs sm:text-sm">
                            <CheckCircle className="w-3 h-3 text-chart-1 flex-shrink-0" />
                            <span>Aadhaar Card</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs sm:text-sm">
                            <CheckCircle className="w-3 h-3 text-chart-1 flex-shrink-0" />
                            <span>Address Proof</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                      <Button variant="outline" size="sm" className="text-xs sm:text-sm h-8 sm:h-9">
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">View Details</span>
                        <span className="sm:hidden">View</span>
                      </Button>
                    </div>
                  </div>

                  {/* Another Application Item */}
                  <div className="border border-destructive/20 rounded-lg p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-background to-destructive/5">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3 sm:mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-base sm:text-lg">Sneha Gupta</h3>
                        <p className="text-sm text-muted-foreground break-all">VOT-2024-001250 • sneha.gupta@gmail.com</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">Contacted: March 11, 2024</p>
                      </div>
                      <Badge variant="destructive" className="w-fit">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        <span className="text-xs sm:text-sm">Follow-up Required</span>
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                      <div className="space-y-1 sm:space-y-2">
                        <h4 className="font-medium text-xs sm:text-sm">Personal Information</h4>
                        <div className="text-xs sm:text-sm text-muted-foreground space-y-1">
                          <p>DOB: July 22, 1990</p>
                          <p>Phone: +91 98765 43211</p>
                          <p>Age: 34 years</p>
                        </div>
                      </div>
                      <div className="space-y-1 sm:space-y-2">
                        <h4 className="font-medium text-xs sm:text-sm">Constituency Details</h4>
                        <div className="text-xs sm:text-sm text-muted-foreground space-y-1">
                          <p>Location: Mumbai North</p>
                          <p>Ward: 12</p>
                          <p>Emergency Contact: Ravi Gupta</p>
                        </div>
                      </div>
                      <div className="space-y-1 sm:space-y-2 sm:col-span-2 lg:col-span-1">
                        <h4 className="font-medium text-xs sm:text-sm">Documents</h4>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs sm:text-sm">
                            <CheckCircle className="w-3 h-3 text-chart-1 flex-shrink-0" />
                            <span>Voter ID</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs sm:text-sm">
                            <AlertCircle className="w-3 h-3 text-destructive flex-shrink-0" />
                            <span>Aadhaar Card (Missing)</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs sm:text-sm">
                            <CheckCircle className="w-3 h-3 text-chart-1 flex-shrink-0" />
                            <span>Proof of Address</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                      <Button variant="outline" size="sm" className="text-xs sm:text-sm h-8 sm:h-9">
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">View Details</span>
                        <span className="sm:hidden">View</span>
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
                  Bulk Voter Management
                </CardTitle>
                <CardDescription>Import, export, and manage multiple voter registrations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Bulk Import */}
                  <div className="border border-chart-1/20 rounded-lg p-6 bg-gradient-to-br from-background to-chart-1/5">
                    <h3 className="font-semibold mb-3">Bulk Import Voters</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload a CSV file to register multiple voters at once
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
                    <h3 className="font-semibold mb-3">Export Voter Data</h3>
                    <p className="text-sm text-muted-foreground mb-4">Export voter registration data for reporting</p>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full bg-transparent">
                        <Download className="w-4 h-4 mr-2" />
                        Export All Voters
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
                  <p className="text-sm text-muted-foreground mb-4">Perform actions on multiple selected voters</p>
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      variant="outline"
                      onClick={handleDownloadAllStudentsPDF}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download All Students PDF
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
                <CardDescription>Generate reports and view voter outreach analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Voter Outreach Reports</h3>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Download className="w-4 h-4 mr-2" />
                        Daily Outreach Summary
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
                        Pending Verifications
                        <ArrowRight className="w-4 h-4 ml-auto" />
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Download className="w-4 h-4 mr-2" />
                        Follow-up Required
                        <ArrowRight className="w-4 h-4 ml-auto" />
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Download className="w-4 h-4 mr-2" />
                        Verification Statistics
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

      <SimpleStudentForm 
        open={showAddStudentForm} 
        onOpenChange={setShowAddStudentForm}
        apiEndpoint="/api/team/submit-form"
        isTeamForm={true}
        onSubmissionSuccess={(id) => {
          console.log('Team form submitted successfully:', id)
          fetchSubmissions() // Refresh the list
        }}
      />

      {/* Student Details Dialog - Mobile Friendly */}
      <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto p-0 sm:p-6">
          <DialogHeader className="p-4 sm:p-6 pb-2">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg sm:text-xl font-bold">
                Student Registration Details
              </DialogTitle>
              <div className="flex items-center gap-2">
                {!isEditing ? (
                  <Button onClick={() => handleEdit(selectedSubmission!)} size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={handleSave} size="sm">
                      Save
                    </Button>
                    <Button onClick={handleCancel} variant="outline" size="sm">
                      Cancel
                    </Button>
                  </div>
                )}
                <Button 
                  onClick={() => setSelectedSubmission(null)} 
                  variant="ghost" 
                  size="sm"
                  className="p-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 pt-0">
              {/* Personal Details */}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-muted-foreground border-b pb-1">Personal Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                      <span className="font-medium text-muted-foreground min-w-[120px]">Name:</span>
                      {isEditing && editedSubmission ? (
                        <div className="flex gap-2">
                          <Input
                            value={editedSubmission.firstName}
                            onChange={(e) => setEditedSubmission({...editedSubmission, firstName: e.target.value})}
                            className="h-8 text-sm"
                            placeholder="First Name"
                          />
                          <Input
                            value={editedSubmission.surname}
                            onChange={(e) => setEditedSubmission({...editedSubmission, surname: e.target.value})}
                            className="h-8 text-sm"
                            placeholder="Surname"
                          />
                        </div>
                      ) : (
                        <span>{selectedSubmission.firstName} {selectedSubmission.surname}</span>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                      <span className="font-medium text-muted-foreground min-w-[120px]">Father's/Husband:</span>
                      {isEditing && editedSubmission ? (
                        <Input
                          value={editedSubmission.fathersHusbandName}
                          onChange={(e) => setEditedSubmission({...editedSubmission, fathersHusbandName: e.target.value})}
                          className="h-8 text-sm"
                          placeholder="Father's/Husband Name"
                        />
                      ) : (
                        <span>{selectedSubmission.fathersHusbandName}</span>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                      <span className="font-medium text-muted-foreground min-w-[120px]">Sex:</span>
                      {isEditing && editedSubmission ? (
                        <Select
                          value={editedSubmission.sex}
                          onValueChange={(value) => setEditedSubmission({...editedSubmission, sex: value})}
                        >
                          <SelectTrigger className="h-8 text-sm w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="M">Male</SelectItem>
                            <SelectItem value="F">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <span>{selectedSubmission.sex}</span>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                      <span className="font-medium text-muted-foreground min-w-[120px]">DOB:</span>
                      {isEditing && editedSubmission ? (
                        <Input
                          type="date"
                          value={editedSubmission.dateOfBirth}
                          onChange={(e) => setEditedSubmission({...editedSubmission, dateOfBirth: e.target.value})}
                          className="h-8 text-sm"
                        />
                      ) : (
                        <span>{selectedSubmission.dateOfBirth}</span>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                      <span className="font-medium text-muted-foreground min-w-[120px]">Age:</span>
                      <span>{selectedSubmission.ageYears} years {selectedSubmission.ageMonths} months</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                      <span className="font-medium text-muted-foreground min-w-[120px]">Qualification:</span>
                      {isEditing && editedSubmission ? (
                        <Input
                          value={editedSubmission.qualification || ''}
                          onChange={(e) => setEditedSubmission({...editedSubmission, qualification: e.target.value})}
                          className="h-8 text-sm"
                          placeholder="Qualification"
                        />
                      ) : (
                        <span>{selectedSubmission.qualification || 'Not specified'}</span>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                      <span className="font-medium text-muted-foreground min-w-[120px]">Occupation:</span>
                      {isEditing && editedSubmission ? (
                        <Input
                          value={editedSubmission.occupation || ''}
                          onChange={(e) => setEditedSubmission({...editedSubmission, occupation: e.target.value})}
                          className="h-8 text-sm"
                          placeholder="Occupation"
                        />
                      ) : (
                        <span>{selectedSubmission.occupation || 'Not specified'}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-muted-foreground border-b pb-1">Address</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                      <span className="font-medium text-muted-foreground min-w-[120px]">District:</span>
                      <span>{selectedSubmission.district}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                      <span className="font-medium text-muted-foreground min-w-[120px]">Taluka:</span>
                      <span>{selectedSubmission.taluka}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                      <span className="font-medium text-muted-foreground min-w-[120px]">Village:</span>
                      <span>{selectedSubmission.villageName}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                      <span className="font-medium text-muted-foreground min-w-[120px]">House No:</span>
                      <span>{selectedSubmission.houseNo}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                      <span className="font-medium text-muted-foreground min-w-[120px]">Street:</span>
                      <span>{selectedSubmission.street}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                      <span className="font-medium text-muted-foreground min-w-[120px]">Pin Code:</span>
                      <span>{selectedSubmission.pinCode}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact & Education */}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-muted-foreground border-b pb-1">Contact Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                      <span className="font-medium text-muted-foreground min-w-[120px]">Mobile:</span>
                      <span className="font-mono">{selectedSubmission.mobileNumber}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                      <span className="font-medium text-muted-foreground min-w-[120px]">Aadhaar:</span>
                      <span className="font-mono">{selectedSubmission.aadhaarNumber}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-muted-foreground border-b pb-1">Education</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                      <span className="font-medium text-muted-foreground min-w-[120px]">Year of Passing:</span>
                      <span>{selectedSubmission.yearOfPassing}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                      <span className="font-medium text-muted-foreground min-w-[120px]">Degree/Diploma:</span>
                      <span>{selectedSubmission.degreeDiploma}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                      <span className="font-medium text-muted-foreground min-w-[120px]">University:</span>
                      <span>{selectedSubmission.nameOfUniversity}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                      <span className="font-medium text-muted-foreground min-w-[120px]">Diploma Name:</span>
                      <span>{selectedSubmission.nameOfDiploma || 'Not specified'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Files - Mobile Friendly */}
              {selectedSubmission.files && Object.keys(selectedSubmission.files).length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-muted-foreground border-b pb-1">Uploaded Documents</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(selectedSubmission.files).map(([key, file]) => {
                      // Skip if file is null, undefined, or empty object
                      if (!file || typeof file !== 'object' || !file.fileName) {
                        return null
                      }
                      
                      return (
                        <div key={key} className="p-3 border rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-sm font-medium truncate">{file.fileName}</div>
                            <div className="text-xs text-muted-foreground">
                              {file.size ? `${(file.size / 1024).toFixed(1)} KB` : 'Unknown size'}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => window.open(`/api/files/${file.savedAs}`, '_blank')}
                              className="text-xs h-8"
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              View
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                const link = document.createElement('a')
                                link.href = `/api/files/${file.savedAs}`
                                link.download = file.fileName
                                link.click()
                              }}
                              className="text-xs h-8"
                            >
                              <Download className="w-3 h-3 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Name Change Info */}
              {selectedSubmission.haveChangedName === 'yes' && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-muted-foreground border-b pb-1">Name Change Information</h4>
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      This student has indicated they changed their name and provided supporting documents.
                    </p>
                  </div>
                </div>
              )}

              {/* Registration Info */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-muted-foreground border-b pb-1">Registration Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                    <span className="font-medium text-muted-foreground min-w-[120px]">Registration ID:</span>
                    <span className="font-mono text-xs bg-muted px-2 py-1 rounded">{selectedSubmission.id}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                    <span className="font-medium text-muted-foreground min-w-[120px]">Submitted:</span>
                    <span>{formatDate(selectedSubmission.submittedAt)}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                    <span className="font-medium text-muted-foreground min-w-[120px]">Place:</span>
                    <span>{selectedSubmission.place}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                    <span className="font-medium text-muted-foreground min-w-[120px]">Declaration Date:</span>
                    <span>{selectedSubmission.declarationDate}</span>
                  </div>
                </div>
              </div>

              {/* Actions - Mobile Friendly */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 border-t">
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto"
                  onClick={() => handleDownloadStudentPDF(selectedSubmission)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Student PDF
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* PDF Preview Dialog */}
      <Dialog open={showPdfPreview} onOpenChange={setShowPdfPreview}>
        <DialogContent className="max-w-7xl h-[98vh] p-0 sm:max-w-5xl">
          <DialogHeader className="px-2 py-1 sm:px-3 sm:py-2 border-b bg-gray-50">
            <DialogTitle className="text-xs sm:text-sm font-medium">Voter Registration Form Preview</DialogTitle>
          </DialogHeader>
          <div className="flex-1 p-0 overflow-hidden">
            {/* Mobile PDF Viewer */}
            <div className="w-full h-full">
              <iframe
                src={`https://docs.google.com/gview?url=${encodeURIComponent('https://e5850872-baaa-4597-87ce-9befbc15af1e.usrfiles.com/ugd/e58508_3380a0454eec4527bff63f8b4dede599.pdf')}&embedded=true`}
                className="w-full h-full border-0"
                title="Student Registration Form"
                style={{ minHeight: 'calc(100vh - 60px)' }}
                allowFullScreen
              />
            </div>
            
            {/* Fallback for mobile - Direct PDF link */}
            <div className="absolute bottom-4 right-4 sm:hidden">
              <Button
                size="sm"
                onClick={() => window.open('https://e5850872-baaa-4597-87ce-9befbc15af1e.usrfiles.com/ugd/e58508_3380a0454eec4527bff63f8b4dede599.pdf', '_blank')}
                className="bg-primary text-primary-foreground shadow-lg"
              >
                <Download className="w-4 h-4 mr-2" />
                Open PDF
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarLayout>
  )
}
