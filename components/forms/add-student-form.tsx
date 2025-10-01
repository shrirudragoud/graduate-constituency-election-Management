"use client"

import type React from "react"
import { useState, useMemo, useEffect } from "react"
import { SimpleStudentForm } from "./simple-student-form"
import { validateField, validateStudentForm, isFormValid, getErrorMessages, FieldValidation, validateFile } from "@/lib/validation"
import { PhoneVerificationButton } from "@/components/ui/phone-verification-button"
import { AlertCircle, CheckCircle, X } from "lucide-react"

interface AddStudentFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddStudentForm({ open, onOpenChange }: AddStudentFormProps) {
  const [activeTab, setActiveTab] = useState("personal")
  const [showThankYou, setShowThankYou] = useState(false)
  const [submissionId, setSubmissionId] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    // Personal Details
    surname: "",
    firstName: "",
    fathersHusbandName: "",
    fathersHusbandFullName: "",
    sex: "",
    qualification: "",
    occupation: "",
    dateOfBirth: "",
    ageYears: "",
    ageMonths: "",

    // Address Details
    district: "",
    taluka: "",
    villageName: "",
    houseNo: "",
    street: "",
    pinCode: "",

    // Contact and Identification
    mobileNumber: "",
    email: "",
    aadhaarNumber: "",

    // Educational Details
    yearOfPassing: "",
    degreeDiploma: "",
    nameOfUniversity: "",
    nameOfDiploma: "",

    // Name Change Details
    haveChangedName: "",
    marriageCertificate: null as File | null,
    gazetteNotification: null as File | null,
    panCard: null as File | null,

    // Declaration
    place: "",
    declarationDate: "",
  })

  const [files, setFiles] = useState({
    degreeDiplomaCertificate: null as File | null,
    aadhaarCard: null as File | null,
    residentialProof: null as File | null,
    marriageCertificate: null as File | null,
    gazetteNotification: null as File | null,
    panCard: null as File | null,
    signaturePhoto: null as File | null,
  })

  const tabs = [
    { id: "personal", label: "Personal", icon: User },
    { id: "address", label: "Address", icon: MapPin },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "documents", label: "Documents", icon: Camera },
    { id: "namechange", label: "Name Change", icon: FileText },
  ]

  const currentTabIndex = tabs.findIndex((tab) => tab.id === activeTab)

  const formCompletion = useMemo(() => {
    const requiredFields = [
      "surname",
      "firstName",
      "fathersHusbandName",
      "fathersHusbandFullName",
      "sex",
      "dateOfBirth",
      "ageYears",
      "district",
      "taluka",
      "villageName",
      "houseNo",
      "street",
      "pinCode",
      "mobileNumber",
      "email",
      "aadhaarNumber",
      "yearOfPassing",
      "degreeDiploma",
      "nameOfUniversity",
      "place",
      "declarationDate",
    ]

    const optionalFields = [
      "qualification",
      "occupation",
      "ageMonths",
      "nameOfDiploma",
    ]

    // Required file fields
    const requiredFileFields = [
      "degreeDiplomaCertificate",
      "aadhaarCard", 
      "residentialProof",
      "signaturePhoto"
    ]

    // Conditional file fields (only if name changed)
    const conditionalFileFields = formData.haveChangedName === "yes" ? [
      "marriageCertificate", 
      "gazetteNotification", 
      "panCard"
    ] : []

    const allRequiredFields = [...requiredFields, ...requiredFileFields]
    const allOptionalFields = [...optionalFields, ...conditionalFileFields]
    
    // Count filled required fields
    const filledRequiredFields = allRequiredFields.filter((field) => {
      if (requiredFileFields.includes(field)) {
        return files[field as keyof typeof files] !== null
      }
      const value = formData[field as keyof typeof formData]
      return value !== "" && value !== false
    })

    // Count filled optional fields
    const filledOptionalFields = allOptionalFields.filter((field) => {
      if (conditionalFileFields.includes(field)) {
        return files[field as keyof typeof files] !== null
      }
      const value = formData[field as keyof typeof formData]
      return value !== "" && value !== false
    })

    // Calculate completion based on required fields only
    const requiredCompletion = (filledRequiredFields.length / allRequiredFields.length) * 100
    const optionalCompletion = filledOptionalFields.length > 0 ? (filledOptionalFields.length / allOptionalFields.length) * 10 : 0
    
    return Math.round(Math.min(requiredCompletion + optionalCompletion, 100))
  }, [formData, files])

  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return { years: "", months: "" }
    
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    
    let years = today.getFullYear() - birthDate.getFullYear()
    let months = today.getMonth() - birthDate.getMonth()
    
    if (months < 0) {
      years--
      months += 12
    }
    
    return { years: years.toString(), months: months.toString() }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value }
      
      // Auto-calculate age when date of birth changes
      if (field === "dateOfBirth" && typeof value === "string") {
        const age = calculateAge(value)
        newData.ageYears = age.years
        newData.ageMonths = age.months
      }
      
      return newData
    })
  }

  const handleFileChange = (field: string, file: File | null) => {
    setFiles((prev) => ({ ...prev, [field]: file }))
  }

  const resetForm = () => {
    setIsSubmitting(false)
    setFormData({
      surname: "",
      firstName: "",
      fathersHusbandName: "",
      fathersHusbandFullName: "",
      sex: "",
      qualification: "",
      occupation: "",
      dateOfBirth: "",
      ageYears: "",
      ageMonths: "",
      district: "",
      taluka: "",
      villageName: "",
      houseNo: "",
      street: "",
      pinCode: "",
      mobileNumber: "",
      email: "",
      aadhaarNumber: "",
      yearOfPassing: "",
      degreeDiploma: "",
      nameOfUniversity: "",
      nameOfDiploma: "",
      haveChangedName: "",
      place: "",
      declarationDate: "",
    })
    setFiles({
      degreeDiplomaCertificate: null,
      aadhaarCard: null,
      residentialProof: null,
      marriageCertificate: null,
      gazetteNotification: null,
      panCard: null,
      signaturePhoto: null,
    })
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    
    // Prevent multiple submissions
    if (isSubmitting) {
      console.log('⚠️ Form is already submitting, ignoring...')
      return
    }
    setIsSubmitting(true)
    
    // Add timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      console.log('⏰ Form submission timeout, resetting state')
      setIsSubmitting(false)
    }, 30000) // 30 second timeout
    
    // Debug: Log current form data before submission
    console.log('🔍 Current form data before submission:', formData)
    console.log('🔍 Form completion:', formCompletion)
    console.log('🔍 Files state:', files)
    
    // Show warning if form is not complete
    if (formCompletion < 100) {
      const proceed = confirm(`Form is only ${formCompletion}% complete. Some required fields or files may be missing. Do you want to submit anyway?`)
      if (!proceed) {
        return
      }
    }
    
    try {
      console.log('🚀 Form submission started')
      console.log('📝 Form data:', formData)
      console.log('📁 Files:', files)
      
      // Create FormData for file uploads
      const submitData = new FormData()
      
      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value ? value.toString() : '')
        console.log(`📝 Adding field: ${key} = ${value}`)
      })
      
      // Add files
      Object.entries(files).forEach(([key, file]) => {
        if (file) {
          submitData.append(key, file)
          console.log(`📁 Adding file: ${key} = ${file.name} (${file.size} bytes)`)
        } else {
          console.log(`⚠️ No file for ${key}`)
        }
      })
      
      console.log('📤 Sending data to API...')
      console.log('📋 FormData entries:', Array.from(submitData.entries()))
      
      // Send as FormData to handle files properly
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        body: submitData,
      })
      
      const result = await response.json()
      console.log('📥 API Response:', result)
      
      if (result.success) {
        console.log('✅ Form submitted successfully:', result)
        setSubmissionId(result.submissionId)
        setShowThankYou(true)
        
        // Notify parent window to refresh data (if in team page)
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({ type: 'FORM_SUBMITTED' }, '*')
        }
        
        // Reset form
        resetForm()
      } else {
        console.error('❌ Form submission failed:', result.error)
        alert(`Form submission failed: ${result.error || 'Unknown error'}. Please try again.`)
      }
    } catch (error) {
      console.error('❌ Error submitting form:', error)
      alert(`An error occurred: ${error.message || 'Unknown error'}. Please try again.`)
    } finally {
      clearTimeout(timeout)
      setIsSubmitting(false)
    }
  }

  const handleCompletionClick = () => {
    if (formCompletion === 100) {
      setShowThankYou(true)
    }
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
    <>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[100vw] sm:w-[95vw] max-w-md sm:max-w-4xl h-[100vh] sm:h-[95vh] max-h-[100vh] sm:max-h-[95vh] p-0 gap-0 overflow-hidden sm:rounded-lg rounded-none flex flex-col">
        <DialogHeader className="px-3 sm:px-4 py-3 sm:py-4 border-b border-border/60 bg-gradient-to-r from-background via-background to-primary/5 shrink-0">
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg font-semibold">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary/10 via-primary/5 to-primary/20">
              <User className="w-4 h-4 text-primary" />
            </div>
            <span>Add New Student</span>
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground mt-1">
            Complete the electoral registration form based on Form-18 requirements
          </DialogDescription>
        </DialogHeader>

        <div className="border-b bg-muted/30 shrink-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full h-12 sm:h-10 p-1 bg-transparent grid grid-cols-5 gap-0.5 rounded-none">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="flex flex-col items-center justify-center gap-0.5 py-1.5 px-1 text-[9px] sm:text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm h-10 sm:h-8 rounded-md"
                  >
                    <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                    <span className="leading-tight text-center font-medium">{tab.label}</span>
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </Tabs>
        </div>

        <div className="flex-1 overflow-hidden">
          <form className="h-full flex flex-col">
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
                          Basic personal information
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3 sm:space-y-4 md:space-y-6 px-3 sm:px-6 pb-3 sm:pb-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                          <div className="space-y-1.5 sm:space-y-2">
                            <Label htmlFor="surname" className="text-xs sm:text-sm font-medium">
                              Surname <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="surname"
                              name="surname"
                              value={formData.surname}
                              onChange={(e) => handleInputChange("surname", e.target.value)}
                              placeholder="Enter surname"
                              className="h-11 sm:h-10 text-sm sm:text-base"
                              required
                            />
                          </div>
                          <div className="space-y-1.5 sm:space-y-2">
                            <Label htmlFor="firstName" className="text-xs sm:text-sm font-medium">
                              First Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="firstName"
                              name="firstName"
                              value={formData.firstName}
                              onChange={(e) => handleInputChange("firstName", e.target.value)}
                              placeholder="Enter first name"
                              className="h-11 sm:h-10 text-sm sm:text-base"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                          <div className="space-y-1.5 sm:space-y-2">
                            <Label htmlFor="fathersHusbandName" className="text-xs sm:text-sm font-medium">
                              Father's/Husband Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="fathersHusbandName"
                              value={formData.fathersHusbandName}
                              onChange={(e) => handleInputChange("fathersHusbandName", e.target.value)}
                              placeholder="Enter father's/husband's name"
                              className="h-11 sm:h-10 text-sm sm:text-base"
                              required
                            />
                          </div>
                          <div className="space-y-1.5 sm:space-y-2">
                            <Label htmlFor="fathersHusbandFullName" className="text-xs sm:text-sm font-medium">
                              Father's/Husband Full Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="fathersHusbandFullName"
                              value={formData.fathersHusbandFullName}
                              onChange={(e) => handleInputChange("fathersHusbandFullName", e.target.value)}
                              placeholder="Enter full name"
                              className="h-11 sm:h-10 text-sm sm:text-base"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                          <div className="space-y-1.5 sm:space-y-2">
                            <Label className="text-xs sm:text-sm font-medium">
                              Sex: M/F <span className="text-destructive">*</span>
                            </Label>
                            <Select value={formData.sex} onValueChange={(value) => handleInputChange("sex", value)}>
                              <SelectTrigger className="h-11 sm:h-10 text-sm sm:text-base">
                                <SelectValue placeholder="Select sex" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="M">Male (M)</SelectItem>
                                <SelectItem value="F">Female (F)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1.5 sm:space-y-2">
                            <Label htmlFor="qualification" className="text-xs sm:text-sm font-medium">
                              Qualifications
                            </Label>
                            <Input
                              id="qualification"
                              value={formData.qualification}
                              onChange={(e) => handleInputChange("qualification", e.target.value)}
                              placeholder="Educational qualifications"
                              className="h-11 sm:h-10 text-sm sm:text-base"
                            />
                          </div>
                          <div className="space-y-1.5 sm:space-y-2 sm:col-span-2 lg:col-span-1">
                            <Label htmlFor="occupation" className="text-xs sm:text-sm font-medium">
                              Occupation
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

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                          <div className="space-y-1.5 sm:space-y-2">
                            <Label htmlFor="dateOfBirth" className="text-xs sm:text-sm font-medium">
                              Date of Birth <span className="text-destructive">*</span>
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
                            <Label className="text-xs sm:text-sm font-medium">
                              Age (Automatic calculation) <span className="text-destructive">*</span>
                            </Label>
                            <div className="flex gap-2">
                              <Input
                                id="ageYears"
                                type="number"
                                value={formData.ageYears}
                                placeholder="Years"
                                className="h-11 sm:h-10 text-sm sm:text-base"
                                readOnly
                              />
                              <span className="flex items-center text-sm text-muted-foreground">years</span>
                              <Input
                                id="ageMonths"
                                type="number"
                                value={formData.ageMonths}
                                placeholder="Months"
                                className="h-11 sm:h-10 text-sm sm:text-base"
                                readOnly
                              />
                              <span className="flex items-center text-sm text-muted-foreground">months</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Address Tab */}
                  <TabsContent value="address" className="mt-0 space-y-4 sm:space-y-6">
                    <Card className="border-0 shadow-sm">
                      <CardHeader className="pb-3 sm:pb-4 px-3 sm:px-6 pt-3 sm:pt-6">
                        <CardTitle className="text-sm sm:text-base md:text-lg flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                          Address Details
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm">
                          Complete address information
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3 sm:space-y-4 md:space-y-6 px-3 sm:px-6 pb-3 sm:pb-6">
                        <div className="space-y-2">
                          <Label className="text-xs sm:text-sm font-medium">
                            Address: <span className="text-destructive">*</span>
                          </Label>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                          <div className="space-y-1.5 sm:space-y-2">
                            <Label htmlFor="district" className="text-xs sm:text-sm font-medium">
                              District <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="district"
                              value={formData.district}
                              onChange={(e) => handleInputChange("district", e.target.value)}
                              placeholder="Enter district"
                              className="h-11 sm:h-10 text-sm sm:text-base"
                              required
                            />
                          </div>
                          <div className="space-y-1.5 sm:space-y-2">
                            <Label htmlFor="taluka" className="text-xs sm:text-sm font-medium">
                              Taluka <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="taluka"
                              value={formData.taluka}
                              onChange={(e) => handleInputChange("taluka", e.target.value)}
                              placeholder="Enter taluka"
                              className="h-11 sm:h-10 text-sm sm:text-base"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                          <div className="space-y-1.5 sm:space-y-2">
                            <Label htmlFor="villageName" className="text-xs sm:text-sm font-medium">
                              Village Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="villageName"
                              value={formData.villageName}
                              onChange={(e) => handleInputChange("villageName", e.target.value)}
                              placeholder="Enter village name"
                              className="h-11 sm:h-10 text-sm sm:text-base"
                              required
                            />
                          </div>
                          <div className="space-y-1.5 sm:space-y-2">
                            <Label htmlFor="houseNo" className="text-xs sm:text-sm font-medium">
                              House No. <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="houseNo"
                              value={formData.houseNo}
                              onChange={(e) => handleInputChange("houseNo", e.target.value)}
                              placeholder="Enter house number"
                              className="h-11 sm:h-10 text-sm sm:text-base"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                          <div className="space-y-1.5 sm:space-y-2">
                            <Label htmlFor="street" className="text-xs sm:text-sm font-medium">
                              Street <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="street"
                              value={formData.street}
                              onChange={(e) => handleInputChange("street", e.target.value)}
                              placeholder="Enter street name"
                              className="h-11 sm:h-10 text-sm sm:text-base"
                              required
                            />
                          </div>
                          <div className="space-y-1.5 sm:space-y-2">
                            <Label htmlFor="pinCode" className="text-xs sm:text-sm font-medium">
                              Pin Code <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="pinCode"
                              value={formData.pinCode}
                              onChange={(e) => handleInputChange("pinCode", e.target.value)}
                              placeholder="Enter pin code"
                              className="h-11 sm:h-10 text-sm sm:text-base"
                              maxLength={6}
                              pattern="[0-9]{6}"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                          <div className="space-y-1.5 sm:space-y-2">
                            <Label htmlFor="mobileNumber" className="text-xs sm:text-sm font-medium">
                              Mobile Number <span className="text-destructive">*</span>
                            </Label>
                            <div className="flex gap-2">
                              <Input
                                id="mobileNumber"
                                type="tel"
                                value={formData.mobileNumber}
                                onChange={(e) => handleInputChange("mobileNumber", e.target.value)}
                                placeholder="Enter mobile number"
                                className="flex-1 h-11 sm:h-10 text-sm sm:text-base"
                                required
                              />
                              <PhoneVerificationButton phoneNumber={formData.mobileNumber} />
                            </div>
                          </div>
                          <div className="space-y-1.5 sm:space-y-2">
                            <Label htmlFor="email" className="text-xs sm:text-sm font-medium">
                              Email Address <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => handleInputChange("email", e.target.value)}
                              placeholder="Enter email address"
                              className="h-11 sm:h-10 text-sm sm:text-base"
                              required
                            />
                          </div>
                          <div className="space-y-1.5 sm:space-y-2">
                            <Label htmlFor="aadhaarNumber" className="text-xs sm:text-sm font-medium">
                              Aadhar No. <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="aadhaarNumber"
                              value={formData.aadhaarNumber}
                              onChange={(e) => handleInputChange("aadhaarNumber", e.target.value)}
                              placeholder="Enter 12-digit Aadhaar number"
                              className="h-11 sm:h-10 text-sm sm:text-base"
                              maxLength={12}
                              pattern="[0-9]{12}"
                              required
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Name Change Tab */}
                  <TabsContent value="namechange" className="mt-0 space-y-4 sm:space-y-6">
                    <Card className="border-0 shadow-sm">
                      <CardHeader className="pb-3 sm:pb-4 px-3 sm:px-6 pt-3 sm:pt-6">
                        <CardTitle className="text-sm sm:text-base md:text-lg flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                          Name Change Details
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm">
                          Information about name changes and supporting documents
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3 sm:space-y-4 md:space-y-6 px-3 sm:px-6 pb-3 sm:pb-6">
                        <div className="space-y-2">
                          <Label className="text-xs sm:text-sm font-medium">
                            Have you changed your name? <span className="text-destructive">*</span>
                          </Label>
                          <RadioGroup
                            value={formData.haveChangedName}
                            onValueChange={(value) => handleInputChange("haveChangedName", value)}
                            className="flex flex-col sm:flex-row gap-3 sm:gap-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="yes" id="namechange-yes" />
                              <Label htmlFor="namechange-yes" className="text-xs sm:text-sm">
                                Yes
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="no" id="namechange-no" />
                              <Label htmlFor="namechange-no" className="text-xs sm:text-sm">
                                No
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>

                        {formData.haveChangedName === "yes" && (
                          <div className="space-y-4 p-3 sm:p-4 border border-primary/20 rounded-lg bg-primary/5">
                            <h4 className="text-sm font-medium text-muted-foreground">Attachments for Name Change:</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                              <div className="space-y-1.5 sm:space-y-2">
                                <Label className="text-xs sm:text-sm font-medium">
                                  Marriage certificate
                                </Label>
                                <div className="border-2 border-dashed border-primary/20 rounded-lg p-3 sm:p-4 text-center hover:border-primary/40 transition-colors min-h-[100px] sm:min-h-[120px] flex flex-col items-center justify-center">
                                  <FileText className="w-6 h-6 sm:w-8 sm:h-8 mx-auto text-muted-foreground mb-1 sm:mb-2" />
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    asChild
                                    className="text-xs sm:text-sm h-8 sm:h-9 bg-transparent"
                                  >
                                    <label htmlFor="marriageCertificate" className="cursor-pointer">
                                      <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                      Upload Certificate
                                    </label>
                                  </Button>
                                  <input
                                    id="marriageCertificate"
                                    type="file"
                                    accept="image/*,.pdf"
                                    className="hidden"
                                    onChange={(e) => handleFileChange("marriageCertificate", e.target.files?.[0] || null)}
                                  />
                                  {files.marriageCertificate && (
                                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 sm:mt-2 break-all px-1">
                                      {files.marriageCertificate.name}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="space-y-1.5 sm:space-y-2">
                                <Label className="text-xs sm:text-sm font-medium">
                                  Gazette notification
                                </Label>
                                <div className="border-2 border-dashed border-secondary/20 rounded-lg p-3 sm:p-4 text-center hover:border-secondary/40 transition-colors min-h-[100px] sm:min-h-[120px] flex flex-col items-center justify-center">
                                  <FileText className="w-6 h-6 sm:w-8 sm:h-8 mx-auto text-muted-foreground mb-1 sm:mb-2" />
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    asChild
                                    className="text-xs sm:text-sm h-8 sm:h-9 bg-transparent"
                                  >
                                    <label htmlFor="gazetteNotification" className="cursor-pointer">
                                      <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                      Upload Notification
                                    </label>
                                  </Button>
                                  <input
                                    id="gazetteNotification"
                                    type="file"
                                    accept="image/*,.pdf"
                                    className="hidden"
                                    onChange={(e) => handleFileChange("gazetteNotification", e.target.files?.[0] || null)}
                                  />
                                  {files.gazetteNotification && (
                                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 sm:mt-2 break-all px-1">
                                      {files.gazetteNotification.name}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="space-y-1.5 sm:space-y-2 sm:col-span-2 lg:col-span-1">
                                <Label className="text-xs sm:text-sm font-medium">
                                  PAN card
                                </Label>
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
                          Educational Details
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm">
                          Academic background information
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3 sm:space-y-4 md:space-y-6 px-3 sm:px-6 pb-3 sm:pb-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                          <div className="space-y-1.5 sm:space-y-2">
                            <Label htmlFor="yearOfPassing" className="text-xs sm:text-sm font-medium">
                              Year of Passing <span className="text-destructive">*</span>
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
                              required
                            />
                          </div>
                          <div className="space-y-1.5 sm:space-y-2">
                            <Label htmlFor="degreeDiploma" className="text-xs sm:text-sm font-medium">
                              Degree / Diploma <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="degreeDiploma"
                              value={formData.degreeDiploma}
                              onChange={(e) => handleInputChange("degreeDiploma", e.target.value)}
                              placeholder="Enter degree/diploma"
                              className="h-11 sm:h-10 text-sm sm:text-base"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                          <div className="space-y-1.5 sm:space-y-2">
                            <Label htmlFor="nameOfUniversity" className="text-xs sm:text-sm font-medium">
                              Name of University <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="nameOfUniversity"
                              value={formData.nameOfUniversity}
                              onChange={(e) => handleInputChange("nameOfUniversity", e.target.value)}
                              placeholder="Enter university name"
                              className="h-11 sm:h-10 text-sm sm:text-base"
                              required
                            />
                          </div>
                          <div className="space-y-1.5 sm:space-y-2">
                            <Label htmlFor="nameOfDiploma" className="text-xs sm:text-sm font-medium">
                              Name of Diploma
                            </Label>
                            <Input
                              id="nameOfDiploma"
                              value={formData.nameOfDiploma}
                              onChange={(e) => handleInputChange("nameOfDiploma", e.target.value)}
                              placeholder="Enter diploma name"
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
                          Attachments
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm">
                          Upload required documents (PNG, JPG, PDF - Max 5MB each)
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4 sm:space-y-6 px-3 sm:px-6 pb-3 sm:pb-6">
                        <div className="space-y-4">
                          <h4 className="text-sm font-medium text-muted-foreground">Required Attachments:</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                            <div className="space-y-1.5 sm:space-y-2">
                              <Label className="text-xs sm:text-sm font-medium">
                                1. Degree Diploma certificate/ markmemo <span className="text-destructive">*</span>
                              </Label>
                              <div className="border-2 border-dashed border-primary/20 rounded-lg p-3 sm:p-4 text-center hover:border-primary/40 transition-colors min-h-[100px] sm:min-h-[120px] flex flex-col items-center justify-center">
                                <FileText className="w-6 h-6 sm:w-8 sm:h-8 mx-auto text-muted-foreground mb-1 sm:mb-2" />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  asChild
                                  className="text-xs sm:text-sm h-8 sm:h-9 bg-transparent"
                                >
                                  <label htmlFor="degreeDiplomaCertificate" className="cursor-pointer">
                                    <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                    Upload Certificate
                                  </label>
                                </Button>
                                <input
                                  id="degreeDiplomaCertificate"
                                  type="file"
                                  accept="image/*,.pdf"
                                  className="hidden"
                                  onChange={(e) => handleFileChange("degreeDiplomaCertificate", e.target.files?.[0] || null)}
                                />
                                {files.degreeDiplomaCertificate && (
                                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 sm:mt-2 break-all px-1">
                                    {files.degreeDiplomaCertificate.name}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="space-y-1.5 sm:space-y-2">
                              <Label className="text-xs sm:text-sm font-medium">
                                2. Aadhar card <span className="text-destructive">*</span>
                              </Label>
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
                              <Label className="text-xs sm:text-sm font-medium">
                                3. Residential proof <span className="text-destructive">*</span>
                              </Label>
                              <div className="border-2 border-dashed border-accent/20 rounded-lg p-3 sm:p-4 text-center hover:border-accent/40 transition-colors min-h-[100px] sm:min-h-[120px] flex flex-col items-center justify-center">
                                <FileText className="w-6 h-6 sm:w-8 sm:h-8 mx-auto text-muted-foreground mb-1 sm:mb-2" />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  asChild
                                  className="text-xs sm:text-sm h-8 sm:h-9 bg-transparent"
                                >
                                  <label htmlFor="residentialProof" className="cursor-pointer">
                                    <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                    Upload Proof
                                  </label>
                                </Button>
                                <input
                                  id="residentialProof"
                                  type="file"
                                  accept="image/*,.pdf"
                                  className="hidden"
                                  onChange={(e) => handleFileChange("residentialProof", e.target.files?.[0] || null)}
                                />
                                {files.residentialProof && (
                                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 sm:mt-2 break-all px-1">
                                    {files.residentialProof.name}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="text-sm font-medium text-muted-foreground">Signature Photo:</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                            <div className="space-y-1.5 sm:space-y-2">
                              <Label className="text-xs sm:text-sm font-medium">
                                Signature photo <span className="text-destructive">*</span>
                              </Label>
                              <div className="border-2 border-dashed border-primary/20 rounded-lg p-3 sm:p-4 text-center hover:border-primary/40 transition-colors min-h-[100px] sm:min-h-[120px] flex flex-col items-center justify-center">
                                <Camera className="w-6 h-6 sm:w-8 sm:h-8 mx-auto text-muted-foreground mb-1 sm:mb-2" />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  asChild
                                  className="text-xs sm:text-sm h-8 sm:h-9 bg-transparent"
                                >
                                  <label htmlFor="signaturePhoto" className="cursor-pointer">
                                    <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                    Upload Signature
                                  </label>
                                </Button>
                                <input
                                  id="signaturePhoto"
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleFileChange("signaturePhoto", e.target.files?.[0] || null)}
                                />
                                {files.signaturePhoto && (
                                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 sm:mt-2 break-all px-1">
                                    {files.signaturePhoto.name}
                                  </p>
                                )}
                              </div>
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
                onClick={() => {
                  resetForm()
                  onOpenChange(false)
                }}
                className="w-full sm:w-auto order-2 sm:order-1 h-11 sm:h-10 text-sm bg-background/90 hover:bg-background focus-ring transition-all duration-200 hover:shadow-soft"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full sm:w-auto order-1 sm:order-2 h-11 sm:h-10 text-sm relative overflow-hidden group shadow-lg border-2 border-primary/20"
                style={{
                  background: formCompletion === 100 ? "hsl(var(--primary))" : "hsl(var(--muted))",
                  color: formCompletion === 100 ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))",
                }}
              >
                <div
                  className="absolute left-0 top-0 h-full transition-all duration-700 ease-out border-r-2 border-green-500/50 pointer-events-none"
                  style={{
                    width: `${formCompletion}%`,
                    background:
                      formCompletion === 100
                        ? "linear-gradient(135deg, #10b981, #059669)"
                        : formCompletion > 70
                          ? "linear-gradient(135deg, #10b981, #34d399)"
                          : formCompletion > 30
                            ? "linear-gradient(135deg, #34d399, #6ee7b7)"
                            : "linear-gradient(135deg, #6ee7b7, #a7f3d0)",
                    boxShadow:
                      formCompletion > 0 ? "inset 0 1px 0 rgba(255,255,255,0.3), 0 0 10px rgba(16, 185, 129, 0.3)" : "none",
                  }}
                />

                <div
                  className="absolute inset-0 bg-gradient-to-r from-muted/50 to-muted/30 pointer-events-none"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px)",
                  }}
                />

                {formCompletion === 100 && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse duration-1000 pointer-events-none" />
                )}

                <div
                  className="relative z-10 flex items-center font-medium transition-colors duration-300 pointer-events-none"
                  style={{
                    color: formCompletion > 30 ? "#ffffff" : "hsl(var(--muted-foreground))",
                    textShadow: formCompletion > 30 ? "0 1px 2px rgba(0,0,0,0.5)" : "none",
                  }}
                >
                  <Save className="w-4 h-4 mr-2" />
                  <span>
                    {isSubmitting 
                      ? "Submitting..." 
                      : formCompletion === 100 
                        ? "Complete Registration" 
                        : `Submit Form (${formCompletion}%)`
                    }
                  </span>
                </div>

                <div className="absolute bottom-1 left-2 right-2 flex justify-between z-10 pointer-events-none">
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
                  <div className="absolute inset-0 bg-primary/10 animate-pulse rounded-md border border-primary/20 pointer-events-none" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    {/* Thank You Modal */}
    <Dialog open={showThankYou} onOpenChange={setShowThankYou}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-green-600">
            Thank You! 🎉
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            Your student registration form has been successfully submitted.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Registration Complete!</h3>
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="text-sm font-medium text-blue-800">Registration ID: {submissionId}</p>
            </div>
            <p className="text-gray-600 mb-4">
              You will receive an Email  confirmation shortly with your registration details and next steps.
            </p>
            <p className="text-sm text-gray-500">
              Please keep your Registration ID safe for future reference.
            </p>
          </div>
          <div className="flex justify-center pt-4">
            <Button 
              onClick={() => {
                setShowThankYou(false)
                onOpenChange(false)
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-2"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  )
}
