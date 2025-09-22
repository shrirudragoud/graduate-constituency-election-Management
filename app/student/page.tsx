import { SidebarLayout } from "@/components/sidebar-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  User,
  FileText,
  Upload,
  Download,
  CheckCircle,
  Clock,
  Camera,
  Award as IdCard,
  ArrowRight,
  Edit,
  AlertCircle,
  TrendingUp,
} from "lucide-react"

export default function StudentPortal() {
  return (
    <SidebarLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Student Registration</h1>
            <p className="text-muted-foreground">Welcome back, John! Complete your election enrollment process.</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-chart-2/10 text-chart-2 border-chart-2/20">
              <Clock className="w-3 h-3 mr-1" />
              Under Review
            </Badge>
            <Badge variant="outline" className="bg-chart-1/10 text-chart-1 border-chart-1/20">
              <TrendingUp className="w-3 h-3 mr-1" />
              75% Complete
            </Badge>
          </div>
        </div>

        <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Registration Progress</CardTitle>
                <CardDescription>Complete all steps to finalize your election registration</CardDescription>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary">75%</div>
                <div className="text-sm text-muted-foreground">Complete</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={75} className="mb-4 h-3" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2 p-3 bg-chart-1/10 rounded-lg border border-chart-1/20">
                <CheckCircle className="w-5 h-5 text-chart-1" />
                <span className="text-sm font-medium">Profile Complete</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-chart-1/10 rounded-lg border border-chart-1/20">
                <CheckCircle className="w-5 h-5 text-chart-1" />
                <span className="text-sm font-medium">Form Submitted</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-chart-1/10 rounded-lg border border-chart-1/20">
                <CheckCircle className="w-5 h-5 text-chart-1" />
                <span className="text-sm font-medium">Documents Uploaded</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-chart-2/10 rounded-lg border border-chart-2/20">
                <Clock className="w-5 h-5 text-chart-2" />
                <span className="text-sm font-medium">Pending Review</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-12 bg-muted">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="form" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Registration Form
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="status" className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Status
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="hover:border-primary/20 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Personal Information
                </CardTitle>
                <CardDescription>Your basic profile information for election registration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <div className="p-3 bg-muted/50 rounded-lg border">John Michael Doe</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Student ID</label>
                    <div className="p-3 bg-muted/50 rounded-lg border">STU-2024-001247</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email Address</label>
                    <div className="p-3 bg-muted/50 rounded-lg border">john.doe@university.edu</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone Number</label>
                    <div className="p-3 bg-muted/50 rounded-lg border">+1 (555) 123-4567</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date of Birth</label>
                    <div className="p-3 bg-muted/50 rounded-lg border">March 15, 2002</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Academic Year</label>
                    <div className="p-3 bg-muted/50 rounded-lg border">Junior (3rd Year)</div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Registration Form Tab */}
          <TabsContent value="form" className="space-y-6">
            <Card className="hover:border-primary/20 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Election Registration Form
                </CardTitle>
                <CardDescription>Complete your election registration details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Preferred Voting Location</label>
                    <div className="p-3 bg-muted/50 rounded-lg border">Main Campus - Student Center</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Political Affiliation</label>
                    <div className="p-3 bg-muted/50 rounded-lg border">Independent</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Emergency Contact</label>
                    <div className="p-3 bg-muted/50 rounded-lg border">Jane Doe - Mother</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Emergency Phone</label>
                    <div className="p-3 bg-muted/50 rounded-lg border">+1 (555) 987-6543</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Address</label>
                  <div className="p-3 bg-muted/50 rounded-lg border">
                    123 University Ave, Apt 4B
                    <br />
                    College Town, ST 12345
                  </div>
                </div>
                <div className="flex items-center gap-2 p-4 bg-chart-1/10 border border-chart-1/20 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-chart-1" />
                  <span className="text-sm text-chart-1">Form submitted successfully on March 10, 2024</span>
                </div>
                <div className="flex justify-end">
                  <Button variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Form
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <Card className="hover:border-primary/20 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-primary" />
                  Required Documents
                </CardTitle>
                <CardDescription>Upload all required documents for verification</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  {/* Student ID Document */}
                  <div className="flex items-center justify-between p-4 border border-chart-1/20 rounded-lg bg-chart-1/5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-chart-1/20 rounded-lg flex items-center justify-center">
                        <IdCard className="w-5 h-5 text-chart-1" />
                      </div>
                      <div>
                        <h3 className="font-medium">Student ID Card</h3>
                        <p className="text-sm text-muted-foreground">student_id_john_doe.pdf • 2.4 MB</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-chart-1/10 text-chart-1 border-chart-1/20">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>

                  {/* Photo ID Document */}
                  <div className="flex items-center justify-between p-4 border border-chart-1/20 rounded-lg bg-chart-1/5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-chart-1/20 rounded-lg flex items-center justify-center">
                        <Camera className="w-5 h-5 text-chart-1" />
                      </div>
                      <div>
                        <h3 className="font-medium">Photo ID (Driver's License)</h3>
                        <p className="text-sm text-muted-foreground">drivers_license_john_doe.pdf • 1.8 MB</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-chart-1/10 text-chart-1 border-chart-1/20">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>

                  {/* Proof of Address */}
                  <div className="flex items-center justify-between p-4 border border-chart-1/20 rounded-lg bg-chart-1/5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-chart-1/20 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-chart-1" />
                      </div>
                      <div>
                        <h3 className="font-medium">Proof of Address</h3>
                        <p className="text-sm text-muted-foreground">utility_bill_march_2024.pdf • 1.2 MB</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-chart-1/10 text-chart-1 border-chart-1/20">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-4 bg-chart-1/10 border border-chart-1/20 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-chart-1" />
                  <span className="text-sm text-chart-1">All required documents have been uploaded and verified</span>
                </div>

                <div className="flex justify-center">
                  <Button>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Additional Document
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Status Tab */}
          <TabsContent value="status" className="space-y-6">
            <div className="grid gap-6">
              {/* Current Status */}
              <Card className="border-chart-2/20 bg-gradient-to-br from-background to-chart-2/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-chart-2" />
                    Registration Status
                  </CardTitle>
                  <CardDescription>Track your application progress and next steps</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 p-4 bg-chart-2/10 border border-chart-2/20 rounded-lg">
                    <div className="w-12 h-12 bg-chart-2/20 rounded-full flex items-center justify-center">
                      <Clock className="w-6 h-6 text-chart-2" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-chart-2">Under Review</h3>
                      <p className="text-sm text-muted-foreground">
                        Your application is being reviewed by our team. Expected completion: March 15, 2024
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card className="hover:border-primary/20 transition-colors">
                <CardHeader>
                  <CardTitle>Application Timeline</CardTitle>
                  <CardDescription>View the progress of your registration application</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-chart-1/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-chart-1" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">Application Submitted</h3>
                        <p className="text-sm text-muted-foreground">March 10, 2024 at 2:30 PM</p>
                        <p className="text-sm text-muted-foreground">
                          All required information and documents submitted successfully
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-chart-1/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-chart-1" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">Documents Verified</h3>
                        <p className="text-sm text-muted-foreground">March 11, 2024 at 10:15 AM</p>
                        <p className="text-sm text-muted-foreground">
                          All uploaded documents have been verified and approved
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-chart-2/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Clock className="w-4 h-4 text-chart-2" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">Under Review</h3>
                        <p className="text-sm text-muted-foreground">In Progress</p>
                        <p className="text-sm text-muted-foreground">
                          Application is being reviewed by the registration team
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                        <div className="w-4 h-4 border-2 border-muted-foreground rounded-full" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-muted-foreground">Final Approval</h3>
                        <p className="text-sm text-muted-foreground">Pending</p>
                        <p className="text-sm text-muted-foreground">Final approval and registration confirmation</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Download Section */}
              <Card className="hover:border-primary/20 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="w-5 h-5 text-primary" />
                    Download Documents
                  </CardTitle>
                  <CardDescription>Access your registration documents and certificates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full justify-start">
                      <Download className="w-4 h-4 mr-2" />
                      Download Registration Summary (PDF)
                      <ArrowRight className="w-4 h-4 ml-auto" />
                    </Button>
                    <Button className="w-full justify-start bg-transparent" variant="outline" disabled>
                      <Download className="w-4 h-4 mr-2" />
                      Download Registration Certificate (Available after approval)
                      <AlertCircle className="w-4 h-4 ml-auto text-muted-foreground" />
                    </Button>
                    <Button className="w-full justify-start" variant="secondary">
                      <Download className="w-4 h-4 mr-2" />
                      Download Submitted Documents (ZIP)
                      <ArrowRight className="w-4 h-4 ml-auto" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarLayout>
  )
}
