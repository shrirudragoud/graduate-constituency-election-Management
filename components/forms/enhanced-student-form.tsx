"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  MapPin, 
  FileText, 
  GraduationCap, 
  Camera, 
  Upload, 
  Save, 
  CheckCircle,
  AlertCircle,
  Phone,
  Mail,
  Calendar,
  IdCard,
  Shield,
  ArrowRight,
  ArrowLeft
} from "lucide-react"
import { validateField, validateStudentForm, isFormValid, getErrorMessages, FieldValidation, validateFile } from "@/lib/validation"

export function EnhancedStudentForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationErrors, setValidationErrors] = useState<FieldValidation>({})
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set())
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    middleName: "",
    dateOfBirth: "",
    gender: "",
    maritalStatus: "",
    nationality: "",
    
    // Contact Information
    email: "",
    phone: "",
    alternatePhone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    
    // Academic Information
    studentId: "",
    university: "",
    course: "",
    yearOfStudy: "",
    gpa: "",
    expectedGraduation: "",
    
    // Document Information
    idType: "",
    idNumber: "",
    idExpiry: "",
    
    // Additional Information
    emergencyContact: "",
    emergencyPhone: "",
    specialNeeds: "",
    additionalInfo: "",
    
    // File Uploads
    profilePhoto: null as File | null,
    idDocument: null as File | null,
    academicDocument: null as File | null,
    
    // Terms and Conditions
    agreeToTerms: false,
    agreeToDataProcessing: false,
    agreeToMarketing: false
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const steps = [
    { id: 1, title: "Personal Info", icon: User },
    { id: 2, title: "Contact Details", icon: Phone },
    { id: 3, title: "Academic Info", icon: GraduationCap },
    { id: 4, title: "Documents", icon: FileText },
    { id: 5, title: "Review & Submit", icon: CheckCircle }
  ]

  const totalSteps = steps.length
  const progress = (currentStep / totalSteps) * 100

  const handleInputChange = (field: string, value: string | boolean | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Mark field as touched
    setTouchedFields(prev => new Set(prev).add(field))
    
    // Real-time validation for string values
    if (typeof value === 'string') {
      const fieldError = validateField(field, value, formData)
      setValidationErrors(prev => ({
        ...prev,
        [field]: fieldError
      }))
    }
    
    // Clear old errors
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {}
    
    if (step === 1) {
      if (!formData.firstName) newErrors.firstName = "First name is required"
      if (!formData.lastName) newErrors.lastName = "Last name is required"
      if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required"
      if (!formData.gender) newErrors.gender = "Gender is required"
    }
    
    if (step === 2) {
      if (!formData.email) newErrors.email = "Email is required"
      if (!formData.phone) newErrors.phone = "Phone number is required"
      if (!formData.address) newErrors.address = "Address is required"
    }
    
    if (step === 3) {
      if (!formData.studentId) newErrors.studentId = "Student ID is required"
      if (!formData.university) newErrors.university = "University is required"
      if (!formData.course) newErrors.course = "Course is required"
    }
    
    if (step === 4) {
      if (!formData.idType) newErrors.idType = "ID type is required"
      if (!formData.idNumber) newErrors.idNumber = "ID number is required"
    }
    
    if (step === 5) {
      if (!formData.agreeToTerms) newErrors.agreeToTerms = "You must agree to the terms"
      if (!formData.agreeToDataProcessing) newErrors.agreeToDataProcessing = "You must agree to data processing"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps))
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(5)) return
    
    setIsSubmitting(true)
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      alert("Registration submitted successfully!")
    }, 2000)
  }

  const handleFileUpload = (field: string, file: File | null) => {
    handleInputChange(field, file)
    
    // File validation
    if (file) {
      const maxSizeMB = field.includes('photo') || field.includes('signature') ? 5 : 5
      const fieldError = validateFile(file, field, maxSizeMB)
      setValidationErrors(prev => ({
        ...prev,
        [field]: fieldError
      }))
    } else {
      // Clear error if file is removed
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  // Helper component for validation error display
  const ValidationError = ({ field }: { field: string }) => {
    const error = validationErrors[field]
    const isTouched = touchedFields.has(field)
    
    if (!isTouched || !error || error.isValid) return null
    
    return (
      <div className="flex items-center gap-1 mt-1 text-red-600 text-xs">
        <AlertCircle className="w-3 h-3 flex-shrink-0" />
        <span>{error.error}</span>
      </div>
    )
  }

  // Helper component for validation success indicator
  const ValidationSuccess = ({ field }: { field: string }) => {
    const error = validationErrors[field]
    const isTouched = touchedFields.has(field)
    
    if (!isTouched || !error || !error.isValid) return null
    
    return (
      <div className="flex items-center gap-1 mt-1 text-green-600 text-xs">
        <CheckCircle className="w-3 h-3 flex-shrink-0" />
        <span>Valid</span>
      </div>
    )
  }

  // Helper function to get input className with validation state
  const getInputClassName = (field: string, baseClassName: string = "") => {
    const error = validationErrors[field]
    const isTouched = touchedFields.has(field)
    
    if (!isTouched) return baseClassName
    
    if (error && !error.isValid) {
      return `${baseClassName} border-red-500 focus:border-red-500 focus:ring-red-500`
    }
    
    if (error && error.isValid) {
      return `${baseClassName} border-green-500 focus:border-green-500 focus:ring-green-500`
    }
    
    return baseClassName
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-2xl">Student Registration Form</CardTitle>
            <Badge variant="outline" className="text-sm">
              Step {currentStep} of {totalSteps}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-4">
            {steps.map((step) => {
              const Icon = step.icon
              return (
                <div
                  key={step.id}
                  className={`flex flex-col items-center space-y-2 ${
                    currentStep >= step.id ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= step.id 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted"
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-medium">{step.title}</span>
                </div>
              )
            })}
          </div>
        </CardHeader>
      </Card>

      {/* Form Content */}
      <Card>
        <CardContent className="p-6">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <User className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold">Personal Information</h2>
                <p className="text-muted-foreground">Tell us about yourself</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className={getInputClassName("firstName", errors.firstName ? "border-destructive" : "")}
                  />
                  <ValidationError field="firstName" />
                  <ValidationSuccess field="firstName" />
                  {errors.firstName && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.firstName}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className={getInputClassName("lastName", errors.lastName ? "border-destructive" : "")}
                  />
                  <ValidationError field="lastName" />
                  <ValidationSuccess field="lastName" />
                  {errors.lastName && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.lastName}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="middleName">Middle Name</Label>
                  <Input
                    id="middleName"
                    value={formData.middleName}
                    onChange={(e) => handleInputChange("middleName", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                    className={getInputClassName("dateOfBirth", errors.dateOfBirth ? "border-destructive" : "")}
                  />
                  <ValidationError field="dateOfBirth" />
                  <ValidationSuccess field="dateOfBirth" />
                  {errors.dateOfBirth && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.dateOfBirth}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label>Gender *</Label>
                  <RadioGroup
                    value={formData.gender}
                    onValueChange={(value) => handleInputChange("gender", value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">Female</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other">Other</Label>
                    </div>
                  </RadioGroup>
                  {errors.gender && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.gender}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maritalStatus">Marital Status</Label>
                  <Select value={formData.maritalStatus} onValueChange={(value) => handleInputChange("maritalStatus", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="married">Married</SelectItem>
                      <SelectItem value="divorced">Divorced</SelectItem>
                      <SelectItem value="widowed">Widowed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Contact Information */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Phone className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold">Contact Information</h2>
                <p className="text-muted-foreground">How can we reach you?</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.email}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className={`pl-10 ${errors.phone ? "border-destructive" : ""}`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.phone}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="alternatePhone">Alternate Phone</Label>
                  <Input
                    id="alternatePhone"
                    type="tel"
                    value={formData.alternatePhone}
                    onChange={(e) => handleInputChange("alternatePhone", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className={errors.address ? "border-destructive" : ""}
                    rows={3}
                  />
                  {errors.address && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.address}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Academic Information */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <GraduationCap className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold">Academic Information</h2>
                <p className="text-muted-foreground">Tell us about your education</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="studentId">Student ID *</Label>
                  <Input
                    id="studentId"
                    value={formData.studentId}
                    onChange={(e) => handleInputChange("studentId", e.target.value)}
                    className={errors.studentId ? "border-destructive" : ""}
                  />
                  {errors.studentId && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.studentId}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="university">University *</Label>
                  <Input
                    id="university"
                    value={formData.university}
                    onChange={(e) => handleInputChange("university", e.target.value)}
                    className={errors.university ? "border-destructive" : ""}
                  />
                  {errors.university && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.university}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="course">Course/Program *</Label>
                  <Input
                    id="course"
                    value={formData.course}
                    onChange={(e) => handleInputChange("course", e.target.value)}
                    className={errors.course ? "border-destructive" : ""}
                  />
                  {errors.course && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.course}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="yearOfStudy">Year of Study</Label>
                  <Select value={formData.yearOfStudy} onValueChange={(value) => handleInputChange("yearOfStudy", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1st Year</SelectItem>
                      <SelectItem value="2">2nd Year</SelectItem>
                      <SelectItem value="3">3rd Year</SelectItem>
                      <SelectItem value="4">4th Year</SelectItem>
                      <SelectItem value="5">5th Year</SelectItem>
                      <SelectItem value="graduate">Graduate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gpa">GPA</Label>
                  <Input
                    id="gpa"
                    type="number"
                    step="0.01"
                    min="0"
                    max="4"
                    value={formData.gpa}
                    onChange={(e) => handleInputChange("gpa", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expectedGraduation">Expected Graduation</Label>
                  <Input
                    id="expectedGraduation"
                    type="date"
                    value={formData.expectedGraduation}
                    onChange={(e) => handleInputChange("expectedGraduation", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Documents */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <FileText className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold">Document Upload</h2>
                <p className="text-muted-foreground">Upload your required documents</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>ID Type *</Label>
                  <Select value={formData.idType} onValueChange={(value) => handleInputChange("idType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select ID type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="passport">Passport</SelectItem>
                      <SelectItem value="drivers-license">Driver's License</SelectItem>
                      <SelectItem value="national-id">National ID</SelectItem>
                      <SelectItem value="student-id">Student ID</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.idType && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.idType}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="idNumber">ID Number *</Label>
                  <Input
                    id="idNumber"
                    value={formData.idNumber}
                    onChange={(e) => handleInputChange("idNumber", e.target.value)}
                    className={errors.idNumber ? "border-destructive" : ""}
                  />
                  {errors.idNumber && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.idNumber}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="idExpiry">ID Expiry Date</Label>
                  <Input
                    id="idExpiry"
                    type="date"
                    value={formData.idExpiry}
                    onChange={(e) => handleInputChange("idExpiry", e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">File Uploads</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Profile Photo</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                      <Camera className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Upload photo</p>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload("profilePhoto", e.target.files?.[0] || null)}
                        className="mt-2"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>ID Document</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                      <IdCard className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Upload ID</p>
                      <Input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload("idDocument", e.target.files?.[0] || null)}
                        className="mt-2"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Academic Document</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                      <GraduationCap className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Upload certificate</p>
                      <Input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload("academicDocument", e.target.files?.[0] || null)}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Review & Submit */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold">Review & Submit</h2>
                <p className="text-muted-foreground">Please review your information before submitting</p>
              </div>
              
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Name:</span> {formData.firstName} {formData.lastName}
                      </div>
                      <div>
                        <span className="font-medium">Date of Birth:</span> {formData.dateOfBirth}
                      </div>
                      <div>
                        <span className="font-medium">Gender:</span> {formData.gender}
                      </div>
                      <div>
                        <span className="font-medium">Marital Status:</span> {formData.maritalStatus}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div><span className="font-medium">Email:</span> {formData.email}</div>
                      <div><span className="font-medium">Phone:</span> {formData.phone}</div>
                      <div><span className="font-medium">Address:</span> {formData.address}</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Academic Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Student ID:</span> {formData.studentId}
                      </div>
                      <div>
                        <span className="font-medium">University:</span> {formData.university}
                      </div>
                      <div>
                        <span className="font-medium">Course:</span> {formData.course}
                      </div>
                      <div>
                        <span className="font-medium">Year:</span> {formData.yearOfStudy}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Terms and Conditions</h3>
                
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                    />
                    <Label htmlFor="agreeToTerms" className="text-sm leading-relaxed">
                      I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                    </Label>
                  </div>
                  {errors.agreeToTerms && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.agreeToTerms}
                    </p>
                  )}
                  
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="agreeToDataProcessing"
                      checked={formData.agreeToDataProcessing}
                      onCheckedChange={(checked) => handleInputChange("agreeToDataProcessing", checked as boolean)}
                    />
                    <Label htmlFor="agreeToDataProcessing" className="text-sm leading-relaxed">
                      I consent to the processing of my personal data for registration purposes
                    </Label>
                  </div>
                  {errors.agreeToDataProcessing && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.agreeToDataProcessing}
                    </p>
                  )}
                  
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="agreeToMarketing"
                      checked={formData.agreeToMarketing}
                      onCheckedChange={(checked) => handleInputChange("agreeToMarketing", checked as boolean)}
                    />
                    <Label htmlFor="agreeToMarketing" className="text-sm leading-relaxed">
                      I would like to receive updates and notifications about the election process
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>
            
            {currentStep < totalSteps ? (
              <Button
                onClick={handleNext}
                className="flex items-center gap-2"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Submit Registration
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
