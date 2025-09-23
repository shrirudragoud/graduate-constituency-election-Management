"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, User, MapPin, FileText, GraduationCap, Camera, Save, X, ChevronLeft, ChevronRight } from "lucide-react"

interface AddStudentFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddStudentForm({ open, onOpenChange }: AddStudentFormProps) {
  const [activeTab, setActiveTab] = useState("personal")
  const [formData, setFormData] = useState({
    // Personal Details
    fullName: "",
    fatherMotherHusbandName: "",
    qualification: "",
    occupation: "",
    sex: "",
    ageYears: "",
    ageMonths: "",
    dateOfBirth: "",
    disability: "",
    disabilityType: "",

    // Contact and Identification
    houseAddress: "",
    aadhaarNumber: "",
    noAadhaar: false,
    mobileNumber: "",
    landlineNumber: "",
    emailId: "",

    // Elector Registration Details
    registeredElector: "",
    assemblyConstituency: "",
    pollingStationNo: "",
    epicNumber: "",

    // Educational Qualification
    university: "",
    yearOfPassing: "",
    diplomaCertificateName: "",

    // Declaration
    previousElectoralRollStatus: "",
    place: "",
    declarationDate: "",
  })

  const [files, setFiles] = useState({
    photograph: null as File | null,
    aadhaarCard: null as File | null,
    panCard: null as File | null,
  })

  const tabs = [
    { id: "personal", label: "Personal", icon: User },
    { id: "contact", label: "Contact", icon: MapPin },
    { id: "elector", label: "Elector", icon: FileText },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "documents", label: "Documents", icon: Camera },
  ]

  const currentTabIndex = tabs.findIndex((tab) => tab.id === activeTab)

  const formCompletion = useMemo(() => {
    const requiredFields = [
      "fullName",
      "fatherMotherHusbandName",
      "sex",
      "ageYears",
      "dateOfBirth",
      "houseAddress",
      "place",
      "declarationDate",
    ]

    const optionalFields = [
      "qualification",
      "occupation",
      "ageMonths",
      "disability",
      "mobileNumber",
      "landlineNumber",
      "emailId",
      "university",
      "yearOfPassing",
      "diplomaCertificateName",
    ]

    const conditionalFields = formData.noAadhaar ? [] : ["aadhaarNumber"]
    const electorFields = formData.registeredElector === "yes" ? ["assemblyConstituency"] : []

    const allFields = [...requiredFields, ...optionalFields, ...conditionalFields, ...electorFields]
    const filledFields = allFields.filter((field) => {
      const value = formData[field as keyof typeof formData]
      return value !== "" && value !== false
    })

    // Add file uploads to completion
    const fileFields = Object.values(files).filter((file) => file !== null)
    const totalPossibleFields = allFields.length + 3 // 3 file uploads
    const totalFilledFields = filledFields.length + fileFields.length

    return Math.round((totalFilledFields / totalPossibleFields) * 100)
  }, [formData, files])

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (field: string, file: File | null) => {
    setFiles((prev) => ({ ...prev, [field]: file }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Form submitted:", { formData, files })
    // Handle form submission here
    onOpenChange(false)
  }

  const nextTab = () => {
    if (currentTabIndex < tabs.length - 1) {
      setActiveTab(tabs[currentTabIndex + 1].id)
    }
  }

  const prevTab = () => {
    if (currentTabIndex > 0) {
      setActiveTab(tabs[currentTabIndex - 1].id)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[100vw] sm:w-[95vw] max-w-md sm:max-w-4xl h-[100vh] sm:h-[95vh] max-h-[100vh] sm:max-h-[95vh] p-0 gap-0 overflow-hidden sm:rounded-lg rounded-none flex flex-col">
        <DialogHeader className="px-4 sm:px-6 md:px-8 py-4 sm:py-6 border-b border-border/60 bg-gradient-to-r from-background via-background to-primary/5 shrink-0 shadow-soft">
          <DialogTitle className="flex items-center gap-3 text-lg sm:text-xl md:text-2xl font-bold tracking-tight">
            <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-primary/20 shadow-soft">
              <User className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-primary" />
            </div>
            <span className="font-bold">Add New Student</span>
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground font-medium">
            Complete the electoral registration form based on Form-18 requirements
          </DialogDescription>
        </DialogHeader>

        <div className="border-b bg-muted/30 shrink-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full h-16 sm:h-14 p-1 bg-transparent grid grid-cols-5 gap-0.5 sm:gap-1 rounded-none">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="flex flex-col items-center justify-center gap-0.5 sm:gap-1 py-2 px-1 sm:px-3 text-[10px] sm:text-xs md:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm h-14 sm:h-12 rounded-md"
                  >
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                    <span className="leading-tight text-center font-medium">{tab.label}</span>
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </Tabs>
        </div>

        <div className="flex-1 overflow-hidden">
          <form onSubmit={handleSubmit} className="h-full flex flex-col">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <div className="flex-1 overflow-y-auto overscroll-contain">
                <div className="p-3 sm:p-4 md:p-6 pb-6">
                  {/* Personal Details Tab */}
                  <TabsContent value="personal" className="mt-0 space-y-4 sm:space-y-6">
                    <Card className="border-0 shadow-sm">
                      <CardHeader className="pb-3 sm:pb-4 px-3 sm:px-6 pt-3 sm:pt-6">
                        <CardTitle className="text-sm sm:text-base md:text-lg flex items-center gap-2">
                          <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-primary" />
                          Personal Details
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm">
                          Basic personal information as per Form-18
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3 sm:space-y-4 md:space-y-6 px-3 sm:px-6 pb-3 sm:pb-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                          <div className="space-y-1.5 sm:space-y-2">
                            <Label htmlFor="fullName" className="text-xs sm:text-sm font-medium">
                              Full Name (पूर्ण नाव) <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="fullName"
                              value={formData.fullName}
                              onChange={(e) => handleInputChange("fullName", e.target.value)}
                              placeholder="Enter full name"
                              className="h-11 sm:h-10 text-sm sm:text-base"
                              required
                            />
                          </div>
                          <div className="space-y-1.5 sm:space-y-2">
                            <Label htmlFor="fatherMotherHusbandName" className="text-xs sm:text-sm font-medium">
                              Father's/Mother's/Husband's Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="fatherMotherHusbandName"
                              value={formData.fatherMotherHusbandName}
                              onChange={(e) => handleInputChange("fatherMotherHusbandName", e.target.value)}
                              placeholder="Enter parent/spouse name"
                              className="h-11 sm:h-10 text-sm sm:text-base"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                          <div className="space-y-1.5 sm:space-y-2">
                            <Label htmlFor="qualification" className="text-xs sm:text-sm font-medium">
                              Qualification (अर्हता)
                            </Label>
                            <Input
                              id="qualification"
                              value={formData.qualification}
                              onChange={(e) => handleInputChange("qualification", e.target.value)}
                              placeholder="Educational qualification"
                              className="h-11 sm:h-10 text-sm sm:text-base"
                            />
                          </div>
                          <div className="space-y-1.5 sm:space-y-2">
                            <Label htmlFor="occupation" className="text-xs sm:text-sm font-medium">
                              Occupation (व्यवसाय)
                            </Label>
                            <Input
                              id="occupation"
                              value={formData.occupation}
                              onChange={(e) => handleInputChange("occupation", e.target.value)}
                              placeholder="Current occupation"
                              className="h-11 sm:h-10 text-sm sm:text-base"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                          <div className="space-y-1.5 sm:space-y-2">
                            <Label className="text-xs sm:text-sm font-medium">
                              Sex (लिंग) <span className="text-destructive">*</span>
                            </Label>
                            <Select value={formData.sex} onValueChange={(value) => handleInputChange("sex", value)}>
                              <SelectTrigger className="h-11 sm:h-10 text-sm sm:text-base">
                                <SelectValue placeholder="Select sex" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1.5 sm:space-y-2">
                            <Label htmlFor="ageYears" className="text-xs sm:text-sm font-medium">
                              Age - Years <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="ageYears"
                              type="number"
                              value={formData.ageYears}
                              onChange={(e) => handleInputChange("ageYears", e.target.value)}
                              placeholder="Years"
                              className="h-11 sm:h-10 text-sm sm:text-base"
                              min="18"
                              max="120"
                              required
                            />
                          </div>
                          <div className="space-y-1.5 sm:space-y-2 sm:col-span-2 lg:col-span-1">
                            <Label htmlFor="ageMonths" className="text-xs sm:text-sm font-medium">
                              Age - Months
                            </Label>
                            <Input
                              id="ageMonths"
                              type="number"
                              value={formData.ageMonths}
                              onChange={(e) => handleInputChange("ageMonths", e.target.value)}
                              placeholder="Months"
                              className="h-11 sm:h-10 text-sm sm:text-base"
                              min="0"
                              max="11"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                          <div className="space-y-1.5 sm:space-y-2">
                            <Label htmlFor="dateOfBirth" className="text-xs sm:text-sm font-medium">
                              Date of Birth (जन्मतारीख) <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="dateOfBirth"
                              type="date"
                              value={formData.dateOfBirth}
                              onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                              className="h-11 sm:h-10 text-sm sm:text-base"
                              required
                            />
                          </div>
                          <div className="space-y-1.5 sm:space-y-2">
                            <Label className="text-xs sm:text-sm font-medium">Disability (दिव्यांगत्व)</Label>
                            <Select
                              value={formData.disability}
                              onValueChange={(value) => handleInputChange("disability", value)}
                            >
                              <SelectTrigger className="h-11 sm:h-10 text-sm sm:text-base">
                                <SelectValue placeholder="Select if applicable" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">No Disability</SelectItem>
                                <SelectItem value="visual">Visual Impairment</SelectItem>
                                <SelectItem value="hearing">Speech & Hearing Disability</SelectItem>
                                <SelectItem value="locomotor">Locomotor Disability</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Contact and Identification Tab */}
                  <TabsContent value="contact" className="mt-0 space-y-4 sm:space-y-6">
                    <Card className="border-0 shadow-sm">
                      <CardHeader className="pb-3 sm:pb-4 px-3 sm:px-6 pt-3 sm:pt-6">
                        <CardTitle className="text-sm sm:text-base md:text-lg flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                          Contact & Identification
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm">
                          Address and identification information
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3 sm:space-y-4 md:space-y-6 px-3 sm:px-6 pb-3 sm:pb-6">
                        <div className="space-y-2">
                          <Label htmlFor="houseAddress" className="text-xs sm:text-sm font-medium">
                            House Address (घरचा पत्ता) <span className="text-destructive">*</span>
                          </Label>
                          <Textarea
                            id="houseAddress"
                            value={formData.houseAddress}
                            onChange={(e) => handleInputChange("houseAddress", e.target.value)}
                            placeholder="Enter complete address"
                            rows={3}
                            className="resize-none text-sm sm:text-base"
                            required
                          />
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="noAadhaar"
                              checked={formData.noAadhaar}
                              onCheckedChange={(checked) => handleInputChange("noAadhaar", checked as boolean)}
                            />
                            <Label htmlFor="noAadhaar" className="text-xs sm:text-sm">
                              I do not have an Aadhaar number
                            </Label>
                          </div>

                          {!formData.noAadhaar && (
                            <div className="space-y-1.5 sm:space-y-2">
                              <Label htmlFor="aadhaarNumber" className="text-xs sm:text-sm font-medium">
                                Aadhaar Number (आधार क्रमांक)
                              </Label>
                              <Input
                                id="aadhaarNumber"
                                value={formData.aadhaarNumber}
                                onChange={(e) => handleInputChange("aadhaarNumber", e.target.value)}
                                placeholder="Enter 12-digit Aadhaar number"
                                className="h-11 sm:h-10 text-sm sm:text-base"
                                maxLength={12}
                                pattern="[0-9]{12}"
                              />
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                          <div className="space-y-1.5 sm:space-y-2">
                            <Label htmlFor="mobileNumber" className="text-xs sm:text-sm font-medium">
                              Mobile Number (मोबाईल क्रमांक)
                            </Label>
                            <Input
                              id="mobileNumber"
                              type="tel"
                              value={formData.mobileNumber}
                              onChange={(e) => handleInputChange("mobileNumber", e.target.value)}
                              placeholder="Enter mobile number"
                              className="h-11 sm:h-10 text-sm sm:text-base"
                            />
                          </div>
                          <div className="space-y-1.5 sm:space-y-2">
                            <Label htmlFor="landlineNumber" className="text-xs sm:text-sm font-medium">
                              Landline (दूरध्वनी क्रमांक)
                            </Label>
                            <Input
                              id="landlineNumber"
                              type="tel"
                              value={formData.landlineNumber}
                              onChange={(e) => handleInputChange("landlineNumber", e.target.value)}
                              placeholder="Enter landline number"
                              className="h-11 sm:h-10 text-sm sm:text-base"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5 sm:space-y-2">
                          <Label htmlFor="emailId" className="text-xs sm:text-sm font-medium">
                            Email ID (ई मेल पत्ता)
                          </Label>
                          <Input
                            id="emailId"
                            type="email"
                            value={formData.emailId}
                            onChange={(e) => handleInputChange("emailId", e.target.value)}
                            placeholder="Enter email address"
                            className="h-11 sm:h-10 text-sm sm:text-base"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Elector Registration Tab */}
                  <TabsContent value="elector" className="mt-0 space-y-4 sm:space-y-6">
                    <Card className="border-0 shadow-sm">
                      <CardHeader className="pb-3 sm:pb-4 px-3 sm:px-6 pt-3 sm:pt-6">
                        <CardTitle className="text-sm sm:text-base md:text-lg flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                          Elector Registration
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm">
                          Previous electoral registration information
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3 sm:space-y-4 md:space-y-6 px-3 sm:px-6 pb-3 sm:pb-6">
                        <div className="space-y-2">
                          <Label className="text-xs sm:text-sm font-medium">
                            Whether registered as an Elector for any assembly constituency?
                          </Label>
                          <RadioGroup
                            value={formData.registeredElector}
                            onValueChange={(value) => handleInputChange("registeredElector", value)}
                            className="flex flex-col sm:flex-row gap-3 sm:gap-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="yes" id="elector-yes" />
                              <Label htmlFor="elector-yes" className="text-xs sm:text-sm">
                                Yes
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="no" id="elector-no" />
                              <Label htmlFor="elector-no" className="text-xs sm:text-sm">
                                No
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>

                        {formData.registeredElector === "yes" && (
                          <div className="space-y-3 p-3 sm:p-4 border border-primary/20 rounded-lg bg-primary/5">
                            <div className="space-y-1.5 sm:space-y-2">
                              <Label htmlFor="assemblyConstituency" className="text-xs sm:text-sm font-medium">
                                Number and Name of the Assembly Constituency
                              </Label>
                              <Input
                                id="assemblyConstituency"
                                value={formData.assemblyConstituency}
                                onChange={(e) => handleInputChange("assemblyConstituency", e.target.value)}
                                placeholder="Enter constituency details"
                                className="h-11 sm:h-10 text-sm sm:text-base"
                              />
                            </div>
                            <div className="space-y-1.5 sm:space-y-2">
                              <Label htmlFor="pollingStationNo" className="text-xs sm:text-sm font-medium">
                                Part/Polling Station No. (if known)
                              </Label>
                              <Input
                                id="pollingStationNo"
                                value={formData.pollingStationNo}
                                onChange={(e) => handleInputChange("pollingStationNo", e.target.value)}
                                placeholder="Enter polling station number"
                                className="h-11 sm:h-10 text-sm sm:text-base"
                              />
                            </div>
                            <div className="space-y-1.5 sm:space-y-2">
                              <Label htmlFor="epicNumber" className="text-xs sm:text-sm font-medium">
                                EPIC Number (if any)
                              </Label>
                              <Input
                                id="epicNumber"
                                value={formData.epicNumber}
                                onChange={(e) => handleInputChange("epicNumber", e.target.value)}
                                placeholder="Enter EPIC number"
                                className="h-11 sm:h-10 text-sm sm:text-base"
                              />
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Educational Qualification Tab */}
                  <TabsContent value="education" className="mt-0 space-y-4 sm:space-y-6">
                    <Card className="border-0 shadow-sm">
                      <CardHeader className="pb-3 sm:pb-4 px-3 sm:px-6 pt-3 sm:pt-6">
                        <CardTitle className="text-sm sm:text-base md:text-lg flex items-center gap-2">
                          <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-primary" />
                          Educational Qualification
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm">
                          Academic background information
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3 sm:space-y-4 md:space-y-6 px-3 sm:px-6 pb-3 sm:pb-6">
                        <div className="space-y-1.5 sm:space-y-2">
                          <Label htmlFor="university" className="text-xs sm:text-sm font-medium">
                            University (विद्यापीठाचे नाव)
                          </Label>
                          <Input
                            id="university"
                            value={formData.university}
                            onChange={(e) => handleInputChange("university", e.target.value)}
                            placeholder="Enter university name"
                            className="h-11 sm:h-10 text-sm sm:text-base"
                          />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                          <div className="space-y-1.5 sm:space-y-2">
                            <Label htmlFor="yearOfPassing" className="text-xs sm:text-sm font-medium">
                              Year of Passing (उत्तीर्ण झाल्याचे वर्ष)
                            </Label>
                            <Input
                              id="yearOfPassing"
                              type="number"
                              value={formData.yearOfPassing}
                              onChange={(e) => handleInputChange("yearOfPassing", e.target.value)}
                              placeholder="Enter year"
                              className="h-11 sm:h-10 text-sm sm:text-base"
                              min="1950"
                              max={new Date().getFullYear()}
                            />
                          </div>
                          <div className="space-y-1.5 sm:space-y-2">
                            <Label htmlFor="diplomaCertificateName" className="text-xs sm:text-sm font-medium">
                              Diploma/Certificate Name
                            </Label>
                            <Input
                              id="diplomaCertificateName"
                              value={formData.diplomaCertificateName}
                              onChange={(e) => handleInputChange("diplomaCertificateName", e.target.value)}
                              placeholder="Enter diploma/certificate name"
                              className="h-11 sm:h-10 text-sm sm:text-base"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Documents Tab */}
                  <TabsContent value="documents" className="mt-0 space-y-4 sm:space-y-6">
                    <Card className="border-0 shadow-sm">
                      <CardHeader className="pb-3 sm:pb-4 px-3 sm:px-6 pt-3 sm:pt-6">
                        <CardTitle className="text-sm sm:text-base md:text-lg flex items-center gap-2">
                          <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-primary" />
                          Document Upload
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm">
                          Upload required documents (PNG, JPG, PDF - Max 5MB each)
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4 sm:space-y-6 px-3 sm:px-6 pb-3 sm:pb-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                          <div className="space-y-1.5 sm:space-y-2">
                            <Label className="text-xs sm:text-sm font-medium">
                              Recent Passport Size Photograph <span className="text-destructive">*</span>
                            </Label>
                            <div className="border-2 border-dashed border-primary/20 rounded-lg p-3 sm:p-4 text-center hover:border-primary/40 transition-colors min-h-[100px] sm:min-h-[120px] flex flex-col items-center justify-center">
                              <Camera className="w-6 h-6 sm:w-8 sm:h-8 mx-auto text-muted-foreground mb-1 sm:mb-2" />
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="text-xs sm:text-sm h-8 sm:h-9 bg-transparent"
                              >
                                <label htmlFor="photograph" className="cursor-pointer">
                                  <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                  Upload Photo
                                </label>
                              </Button>
                              <input
                                id="photograph"
                                type="file"
                                accept="image/*,.pdf"
                                className="hidden"
                                onChange={(e) => handleFileChange("photograph", e.target.files?.[0] || null)}
                              />
                              {files.photograph && (
                                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 sm:mt-2 break-all px-1">
                                  {files.photograph.name}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="space-y-1.5 sm:space-y-2">
                            <Label className="text-xs sm:text-sm font-medium">Aadhaar Card</Label>
                            <div className="border-2 border-dashed border-secondary/20 rounded-lg p-3 sm:p-4 text-center hover:border-secondary/40 transition-colors min-h-[100px] sm:min-h-[120px] flex flex-col items-center justify-center">
                              <FileText className="w-6 h-6 sm:w-8 sm:h-8 mx-auto text-muted-foreground mb-1 sm:mb-2" />
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="text-xs sm:text-sm h-8 sm:h-9 bg-transparent"
                              >
                                <label htmlFor="aadhaarCard" className="cursor-pointer">
                                  <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                  Upload Aadhaar
                                </label>
                              </Button>
                              <input
                                id="aadhaarCard"
                                type="file"
                                accept="image/*,.pdf"
                                className="hidden"
                                onChange={(e) => handleFileChange("aadhaarCard", e.target.files?.[0] || null)}
                              />
                              {files.aadhaarCard && (
                                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 sm:mt-2 break-all px-1">
                                  {files.aadhaarCard.name}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="space-y-1.5 sm:space-y-2 sm:col-span-2 lg:col-span-1">
                            <Label className="text-xs sm:text-sm font-medium">PAN Card</Label>
                            <div className="border-2 border-dashed border-accent/20 rounded-lg p-3 sm:p-4 text-center hover:border-accent/40 transition-colors min-h-[100px] sm:min-h-[120px] flex flex-col items-center justify-center">
                              <FileText className="w-6 h-6 sm:w-8 sm:h-8 mx-auto text-muted-foreground mb-1 sm:mb-2" />
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="text-xs sm:text-sm h-8 sm:h-9 bg-transparent"
                              >
                                <label htmlFor="panCard" className="cursor-pointer">
                                  <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                  Upload PAN
                                </label>
                              </Button>
                              <input
                                id="panCard"
                                type="file"
                                accept="image/*,.pdf"
                                className="hidden"
                                onChange={(e) => handleFileChange("panCard", e.target.files?.[0] || null)}
                              />
                              {files.panCard && (
                                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 sm:mt-2 break-all px-1">
                                  {files.panCard.name}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Declaration Section */}
                        <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
                          <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6 pt-3 sm:pt-6">
                            <CardTitle className="text-sm sm:text-base">Declaration</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-6 pb-3 sm:pb-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                              <div className="space-y-1.5 sm:space-y-2">
                                <Label htmlFor="place" className="text-xs sm:text-sm font-medium">
                                  Place (ठिकाण) <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                  id="place"
                                  value={formData.place}
                                  onChange={(e) => handleInputChange("place", e.target.value)}
                                  placeholder="Enter place"
                                  className="h-11 sm:h-10 text-sm sm:text-base"
                                  required
                                />
                              </div>
                              <div className="space-y-1.5 sm:space-y-2">
                                <Label htmlFor="declarationDate" className="text-xs sm:text-sm font-medium">
                                  Date (तारीख) <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                  id="declarationDate"
                                  type="date"
                                  value={formData.declarationDate}
                                  onChange={(e) => handleInputChange("declarationDate", e.target.value)}
                                  className="h-11 sm:h-10 text-sm sm:text-base"
                                  required
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </div>
              </div>
            </Tabs>
          </form>
        </div>

        <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shrink-0">
          <div className="p-3 sm:p-4 md:p-6">
            {/* Mobile Navigation */}
            <div className="flex items-center justify-between mb-3 sm:mb-4 sm:hidden">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={prevTab}
                disabled={currentTabIndex === 0}
                className="h-9 text-xs bg-background/90"
              >
                <ChevronLeft className="w-3 h-3 mr-1" />
                Previous
              </Button>
              <span className="text-xs text-muted-foreground font-medium">
                {currentTabIndex + 1} of {tabs.length}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={nextTab}
                disabled={currentTabIndex === tabs.length - 1}
                className="h-9 text-xs bg-background/90 hover:bg-background"
              >
                Next
                <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="w-full sm:w-auto order-2 sm:order-1 h-11 sm:h-10 text-sm bg-background/90 hover:bg-background focus-ring transition-all duration-200 hover:shadow-soft"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-full sm:w-auto order-1 sm:order-2 h-11 sm:h-10 text-sm relative overflow-hidden group shadow-lg border-2 border-primary/20"
                style={{
                  background: "hsl(var(--muted))",
                  color: "hsl(var(--muted-foreground))",
                }}
              >
                <div
                  className="absolute left-0 top-0 h-full transition-all duration-700 ease-out border-r-2 border-primary/30"
                  style={{
                    width: `${formCompletion}%`,
                    background:
                      formCompletion === 100
                        ? "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary)/0.9))"
                        : formCompletion > 70
                          ? "linear-gradient(135deg, hsl(var(--primary)/0.8), hsl(var(--primary)/0.6))"
                          : formCompletion > 30
                            ? "linear-gradient(135deg, hsl(var(--primary)/0.6), hsl(var(--primary)/0.4))"
                            : "linear-gradient(135deg, hsl(var(--muted-foreground)/0.3), hsl(var(--muted-foreground)/0.2))",
                    boxShadow:
                      formCompletion > 0 ? "inset 0 1px 0 rgba(255,255,255,0.3), 0 0 10px rgba(0,0,0,0.1)" : "none",
                  }}
                />

                <div
                  className="absolute inset-0 bg-gradient-to-r from-muted/50 to-muted/30"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px)",
                  }}
                />

                {formCompletion === 100 && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse duration-1000" />
                )}

                <div
                  className="relative z-10 flex items-center font-medium transition-colors duration-300"
                  style={{
                    color: formCompletion > 50 ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))",
                  }}
                >
                  <Save className="w-4 h-4 mr-2" />
                  <span>{formCompletion === 100 ? "Complete Registration" : `${formCompletion}% Complete`}</span>
                </div>

                <div className="absolute bottom-1 left-2 right-2 flex justify-between z-10">
                  {[20, 40, 60, 80, 100].map((threshold) => (
                    <div
                      key={threshold}
                      className={`w-1 h-1 rounded-full transition-all duration-300 ${
                        formCompletion >= threshold
                          ? "bg-primary-foreground/80 scale-110"
                          : "bg-muted-foreground/30 scale-75"
                      }`}
                    />
                  ))}
                </div>

                {formCompletion > 80 && formCompletion < 100 && (
                  <div className="absolute inset-0 bg-primary/10 animate-pulse rounded-md border border-primary/20" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
