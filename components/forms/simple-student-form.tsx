"use client"

import type React from "react"
import { useState, useMemo, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, CheckCircle, X } from "lucide-react"
import { validateField, validateStudentForm, isFormValid, getErrorMessages, FieldValidation, validateFile } from "@/lib/validation"

interface SimpleStudentFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmissionSuccess?: (submissionId: string) => void
}

export function SimpleStudentForm({ open, onOpenChange, onSubmissionSuccess }: SimpleStudentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationErrors, setValidationErrors] = useState<FieldValidation>({})
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set())
  const [formData, setFormData] = useState({
    // Personal Details
    surname: "",
    firstName: "",
    fathersHusbandName: "",
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
    aadhaarNumber: "",
    email: "",

    // Education Details
    yearOfPassing: "",
    degreeDiploma: "",
    nameOfUniversity: "",
    nameOfDiploma: "",

    // Additional Information
    haveChangedName: "",
    place: "",
    declarationDate: ""
  })

  const [files, setFiles] = useState({
    degreeCertificate: null as File | null,
    aadhaarCard: null as File | null,
    residentialProof: null as File | null,
    marriageCertificate: null as File | null,
    signaturePhoto: null as File | null
  })

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return { years: 0, months: 0 }
    
    const birthDate = new Date(dateOfBirth)
    const today = new Date()
    
    let years = today.getFullYear() - birthDate.getFullYear()
    let months = today.getMonth() - birthDate.getMonth()
    
    if (months < 0) {
      years--
      months += 12
    }
    
    return { years, months }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Auto-calculate age when date of birth changes
    if (field === "dateOfBirth") {
      const { years, months } = calculateAge(value)
      setFormData(prev => ({
        ...prev,
        dateOfBirth: value,
        ageYears: years.toString(),
        ageMonths: months.toString()
      }))
    }
    
    // Mark field as touched
    setTouchedFields(prev => new Set(prev).add(field))
    
    // Real-time validation
    const newFormData = { ...formData, [field]: value }
    if (field === "dateOfBirth") {
      newFormData.ageYears = calculateAge(value).years.toString()
      newFormData.ageMonths = calculateAge(value).months.toString()
    }
    
    const fieldError = validateField(field, value, newFormData)
    setValidationErrors(prev => ({
      ...prev,
      [field]: fieldError
    }))
  }

  const handleFileChange = (field: string, file: File | null) => {
    setFiles(prev => ({ ...prev, [field]: file }))
    
    // Mark field as touched
    setTouchedFields(prev => new Set(prev).add(field))
    
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

  // Calculate form completion percentage
  const formCompletion = useMemo(() => {
    const requiredFields = [
      'surname', 'firstName', 'fathersHusbandName', 
      'sex', 'dateOfBirth', 'district', 'taluka', 'villageName', 'houseNo', 
      'street', 'pinCode', 'mobileNumber', 'aadhaarNumber', 'email',
      'yearOfPassing', 'degreeDiploma', 'nameOfUniversity', 'place', 'declarationDate'
    ]
    
    const optionalFields = ['qualification', 'occupation', 'nameOfDiploma']
    
    const requiredFiles = ['degreeCertificate', 'aadhaarCard', 'residentialProof', 'signaturePhoto']
    const conditionalFiles = formData.haveChangedName === 'Yes' ? ['marriageCertificate'] : []
    
    const totalRequired = requiredFields.length + requiredFiles.length + conditionalFiles.length
    const totalOptional = optionalFields.length
    
    let completedRequired = 0
    let completedOptional = 0
    
    // Check required fields
    requiredFields.forEach(field => {
      if (formData[field as keyof typeof formData] && formData[field as keyof typeof formData].toString().trim() !== '') {
        completedRequired++
      }
    })
    
    // Check optional fields
    optionalFields.forEach(field => {
      if (formData[field as keyof typeof formData] && formData[field as keyof typeof formData].toString().trim() !== '') {
        completedOptional++
      }
    })
    
    // Check required files
    requiredFiles.forEach(field => {
      if (files[field as keyof typeof files]) {
        completedRequired++
      }
    })
    
    // Check conditional files
    conditionalFiles.forEach(field => {
      if (files[field as keyof typeof files]) {
        completedRequired++
      }
    })
    
    const totalPossible = totalRequired + totalOptional
    const totalCompleted = completedRequired + completedOptional
    
    return totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0
  }, [formData, files])

  // Check if form is valid
  const isFormValidState = useMemo(() => {
    const allErrors = validateStudentForm(formData, files)
    return isFormValid(allErrors)
  }, [formData, files])

  const handleSubmit = async () => {
    if (isSubmitting) return
    
    // Mark all fields as touched to show validation errors
    const allFields = [
      'surname', 'firstName', 'fathersHusbandName', 'sex', 'dateOfBirth',
      'district', 'taluka', 'villageName', 'houseNo', 'street', 'pinCode',
      'mobileNumber', 'aadhaarNumber', 'email', 'yearOfPassing', 'degreeDiploma',
      'nameOfUniversity', 'place', 'declarationDate'
    ]
    setTouchedFields(new Set(allFields))
    
    // Validate entire form
    const allErrors = validateStudentForm(formData, files)
    setValidationErrors(allErrors)
    
    if (!isFormValid(allErrors)) {
      const errorMessages = getErrorMessages(allErrors)
      alert(`Please fix the following errors:\n\n${errorMessages.join('\n')}`)
      return
    }
    
    // Show confirmation dialog
    const confirmMessage = formCompletion < 100 
      ? `Form is only ${formCompletion}% complete. Do you want to submit anyway?`
      : 'Are you sure you want to submit this registration?'
    
    const confirmSubmit = confirm(confirmMessage)
    if (!confirmSubmit) return
    
    setIsSubmitting(true)
    
    try {
      console.log('Form Data:', formData)
      console.log('Files:', files)
      
      const submitData = new FormData()
      
      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value.toString())
      })
      
      // Add files
      Object.entries(files).forEach(([key, file]) => {
        if (file) {
          submitData.append(key, file)
        }
      })
      
      const response = await fetch('/api/public/submit-form', {
        method: 'POST',
        body: submitData
      })
      
      if (response.ok) {
        const result = await response.json()
        
        // Notify parent window to refresh data
        if (typeof window !== 'undefined') {
          window.parent.postMessage({ type: 'FORM_SUBMITTED' }, '*')
        }
        
        // Close the form dialog first
        onOpenChange(false)
        
        // Call the success callback to show popup on parent page
        if (onSubmissionSuccess) {
          setTimeout(() => {
            onSubmissionSuccess(result.submissionId)
          }, 300)
        }
        
        // Reset form after successful submission
        resetForm()
      } else {
        const errorData = await response.json()
        console.error('Submission failed:', errorData)
        
        // Handle specific error cases
        if (response.status === 400) {
          // Validation error
          if (errorData.missingFields) {
            alert(`Please fill in all required fields: ${errorData.missingFields.join(', ')}`)
          } else {
            alert(`Validation Error: ${errorData.error}`)
          }
        } else {
          alert(`Submission Error: ${errorData.error || 'Please try again.'}`)
        }
        throw new Error('Submission failed')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Error submitting form. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      surname: "",
      firstName: "",
      fathersHusbandName: "",
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
      aadhaarNumber: "",
      email: "",
      yearOfPassing: "",
      degreeDiploma: "",
      nameOfUniversity: "",
      nameOfDiploma: "",
      haveChangedName: "",
      place: "",
      declarationDate: ""
    })
    setFiles({
      degreeCertificate: null,
      aadhaarCard: null,
      residentialProof: null,
      marriageCertificate: null,
      signaturePhoto: null
    })
    setValidationErrors({})
    setTouchedFields(new Set())
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false)
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
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-xl sm:text-2xl font-bold text-center">Student Registration Form</DialogTitle>
            <DialogDescription className="text-center text-sm sm:text-base">
              Please fill in all the required information below
            </DialogDescription>
          </DialogHeader>

        <div className="space-y-8">
          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-gray-700">Form Completion</span>
              <span className="text-blue-600">{formCompletion}%</span>
            </div>
            <Progress value={formCompletion} className="h-3 bg-gray-200" />
          </div>

          {/* Form Fields - Single Column Layout */}
          <div className="space-y-8">
            
            {/* Personal Information Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-blue-800 mb-4 sm:mb-6 border-b-2 border-blue-300 pb-2">Personal Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <Label htmlFor="surname" className="text-sm font-semibold text-gray-700">Surname *</Label>
                  <Input
                    id="surname"
                    value={formData.surname}
                    onChange={(e) => handleInputChange("surname", e.target.value)}
                    placeholder="Enter surname"
                    className={getInputClassName("surname", "mt-1 border-2 border-gray-300 focus:border-blue-500 rounded-lg")}
                  />
                  <ValidationError field="surname" />
                  <ValidationSuccess field="surname" />
                </div>
                <div>
                  <Label htmlFor="firstName" className="text-sm font-semibold text-gray-700">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    placeholder="Enter first name"
                    className={getInputClassName("firstName", "mt-1 border-2 border-gray-300 focus:border-blue-500 rounded-lg")}
                  />
                  <ValidationError field="firstName" />
                  <ValidationSuccess field="firstName" />
                </div>
                <div>
                  <Label htmlFor="fathersHusbandName" className="text-sm font-semibold text-gray-700">Father's/Husband Name *</Label>
                  <Input
                    id="fathersHusbandName"
                    value={formData.fathersHusbandName}
                    onChange={(e) => handleInputChange("fathersHusbandName", e.target.value)}
                    placeholder="Enter father's/husband name"
                    className={getInputClassName("fathersHusbandName", "mt-1 border-2 border-gray-300 focus:border-blue-500 rounded-lg")}
                  />
                  <ValidationError field="fathersHusbandName" />
                  <ValidationSuccess field="fathersHusbandName" />
                </div>
                <div>
                  <Label className="text-sm font-semibold text-gray-700">Sex *</Label>
                  <RadioGroup
                    value={formData.sex}
                    onValueChange={(value) => handleInputChange("sex", value)}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="M" id="male" className="border-2" />
                        <Label htmlFor="male" className="font-medium">M</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="F" id="female" className="border-2" />
                        <Label htmlFor="female" className="font-medium">F</Label>
                      </div>
                    </div>
                  </RadioGroup>
                  <ValidationError field="sex" />
                  <ValidationSuccess field="sex" />
                </div>
                <div>
                  <Label htmlFor="qualification" className="text-sm font-semibold text-gray-700">Qualifications</Label>
                  <Input
                    id="qualification"
                    value={formData.qualification}
                    onChange={(e) => handleInputChange("qualification", e.target.value)}
                    placeholder="Enter qualifications"
                    className="mt-1 border-2 border-gray-300 focus:border-blue-500 rounded-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="occupation" className="text-sm font-semibold text-gray-700">Occupation</Label>
                  <Input
                    id="occupation"
                    value={formData.occupation}
                    onChange={(e) => handleInputChange("occupation", e.target.value)}
                    placeholder="Enter occupation"
                    className="mt-1 border-2 border-gray-300 focus:border-blue-500 rounded-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="dateOfBirth" className="text-sm font-semibold text-gray-700">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                    className={getInputClassName("dateOfBirth", "mt-1 border-2 border-gray-300 focus:border-blue-500 rounded-lg")}
                  />
                  <ValidationError field="dateOfBirth" />
                  <ValidationSuccess field="dateOfBirth" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="ageYears" className="text-sm font-semibold text-gray-700">Age (Years) *</Label>
                    <Input
                      id="ageYears"
                      value={formData.ageYears}
                      placeholder="Years"
                      readOnly
                      className={getInputClassName("ageYears", "mt-1 border-2 border-gray-300 bg-gray-100 rounded-lg")}
                    />
                    <ValidationError field="ageYears" />
                  </div>
                  <div>
                    <Label htmlFor="ageMonths" className="text-sm font-semibold text-gray-700">Age (Months) *</Label>
                    <Input
                      id="ageMonths"
                      value={formData.ageMonths}
                      placeholder="Months"
                      readOnly
                      className={getInputClassName("ageMonths", "mt-1 border-2 border-gray-300 bg-gray-100 rounded-lg")}
                    />
                    <ValidationError field="ageMonths" />
                  </div>
                </div>
              </div>
            </div>

            {/* Address Information Section */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-green-800 mb-4 sm:mb-6 border-b-2 border-green-300 pb-2">Address Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <Label htmlFor="district" className="text-sm font-semibold text-gray-700">District *</Label>
                  <Input
                    id="district"
                    value={formData.district}
                    onChange={(e) => handleInputChange("district", e.target.value)}
                    placeholder="Enter district"
                    className="mt-1 border-2 border-gray-300 focus:border-green-500 rounded-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="taluka" className="text-sm font-semibold text-gray-700">Taluka *</Label>
                  <Input
                    id="taluka"
                    value={formData.taluka}
                    onChange={(e) => handleInputChange("taluka", e.target.value)}
                    placeholder="Enter taluka"
                    className="mt-1 border-2 border-gray-300 focus:border-green-500 rounded-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="villageName" className="text-sm font-semibold text-gray-700">Village Name *</Label>
                  <Input
                    id="villageName"
                    value={formData.villageName}
                    onChange={(e) => handleInputChange("villageName", e.target.value)}
                    placeholder="Enter village name"
                    className="mt-1 border-2 border-gray-300 focus:border-green-500 rounded-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="houseNo" className="text-sm font-semibold text-gray-700">House No. *</Label>
                  <Input
                    id="houseNo"
                    value={formData.houseNo}
                    onChange={(e) => handleInputChange("houseNo", e.target.value)}
                    placeholder="Enter house number"
                    className="mt-1 border-2 border-gray-300 focus:border-green-500 rounded-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="street" className="text-sm font-semibold text-gray-700">Street *</Label>
                  <Input
                    id="street"
                    value={formData.street}
                    onChange={(e) => handleInputChange("street", e.target.value)}
                    placeholder="Enter street"
                    className="mt-1 border-2 border-gray-300 focus:border-green-500 rounded-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="pinCode" className="text-sm font-semibold text-gray-700">Pin Code *</Label>
                  <Input
                    id="pinCode"
                    value={formData.pinCode}
                    onChange={(e) => handleInputChange("pinCode", e.target.value)}
                    placeholder="Enter pin code"
                    className="mt-1 border-2 border-gray-300 focus:border-green-500 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-purple-800 mb-4 sm:mb-6 border-b-2 border-purple-300 pb-2">Contact Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <Label htmlFor="mobileNumber" className="text-sm font-semibold text-gray-700">Mobile Number *</Label>
                  <Input
                    id="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={(e) => handleInputChange("mobileNumber", e.target.value)}
                    placeholder="Enter mobile number"
                    className={getInputClassName("mobileNumber", "mt-1 border-2 border-gray-300 focus:border-purple-500 rounded-lg")}
                  />
                  <ValidationError field="mobileNumber" />
                  <ValidationSuccess field="mobileNumber" />
                </div>
                <div>
                  <Label htmlFor="aadhaarNumber" className="text-sm font-semibold text-gray-700">Aadhaar No. *</Label>
                  <Input
                    id="aadhaarNumber"
                    value={formData.aadhaarNumber}
                    onChange={(e) => handleInputChange("aadhaarNumber", e.target.value)}
                    placeholder="Enter Aadhaar number"
                    className={getInputClassName("aadhaarNumber", "mt-1 border-2 border-gray-300 focus:border-purple-500 rounded-lg")}
                  />
                  <ValidationError field="aadhaarNumber" />
                  <ValidationSuccess field="aadhaarNumber" />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter email address"
                    className={getInputClassName("email", "mt-1 border-2 border-gray-300 focus:border-purple-500 rounded-lg")}
                  />
                  <ValidationError field="email" />
                  <ValidationSuccess field="email" />
                </div>
              </div>
            </div>

            {/* Education Information Section */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-orange-800 mb-4 sm:mb-6 border-b-2 border-orange-300 pb-2">Education Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <Label htmlFor="yearOfPassing" className="text-sm font-semibold text-gray-700">Year of Passing *</Label>
                  <Input
                    id="yearOfPassing"
                    value={formData.yearOfPassing}
                    onChange={(e) => handleInputChange("yearOfPassing", e.target.value)}
                    placeholder="Enter year"
                    className="mt-1 border-2 border-gray-300 focus:border-orange-500 rounded-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="degreeDiploma" className="text-sm font-semibold text-gray-700">Degree/Diploma *</Label>
                  <Input
                    id="degreeDiploma"
                    value={formData.degreeDiploma}
                    onChange={(e) => handleInputChange("degreeDiploma", e.target.value)}
                    placeholder="Enter degree/diploma"
                    className="mt-1 border-2 border-gray-300 focus:border-orange-500 rounded-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="nameOfUniversity" className="text-sm font-semibold text-gray-700">Name of University *</Label>
                  <Input
                    id="nameOfUniversity"
                    value={formData.nameOfUniversity}
                    onChange={(e) => handleInputChange("nameOfUniversity", e.target.value)}
                    placeholder="Enter university name"
                    className="mt-1 border-2 border-gray-300 focus:border-orange-500 rounded-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="nameOfDiploma" className="text-sm font-semibold text-gray-700">Name of Diploma</Label>
                  <Input
                    id="nameOfDiploma"
                    value={formData.nameOfDiploma}
                    onChange={(e) => handleInputChange("nameOfDiploma", e.target.value)}
                    placeholder="Enter diploma name"
                    className="mt-1 border-2 border-gray-300 focus:border-orange-500 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Additional Information Section */}
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-200 rounded-xl p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-yellow-800 mb-4 sm:mb-6 border-b-2 border-yellow-300 pb-2">Additional Information</h3>
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <Label className="text-sm font-semibold text-gray-700">Have you changed your name? *</Label>
                  <RadioGroup
                    value={formData.haveChangedName}
                    onValueChange={(value) => handleInputChange("haveChangedName", value)}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Yes" id="nameChangedYes" className="border-2" />
                        <Label htmlFor="nameChangedYes" className="font-medium">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="nameChangedNo" className="border-2" />
                        <Label htmlFor="nameChangedNo" className="font-medium">No</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <Label htmlFor="place" className="text-sm font-semibold text-gray-700">Place *</Label>
                    <Input
                      id="place"
                      value={formData.place}
                      onChange={(e) => handleInputChange("place", e.target.value)}
                      placeholder="Enter place"
                      className="mt-1 border-2 border-gray-300 focus:border-yellow-500 rounded-lg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="declarationDate" className="text-sm font-semibold text-gray-700">Declaration Date *</Label>
                    <Input
                      id="declarationDate"
                      type="date"
                      value={formData.declarationDate}
                      onChange={(e) => handleInputChange("declarationDate", e.target.value)}
                      className="mt-1 border-2 border-gray-300 focus:border-yellow-500 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* File Uploads Section */}
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-200 rounded-xl p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 border-b-2 border-gray-300 pb-2">Required Documents</h3>
              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <Label htmlFor="degreeCertificate" className="text-sm font-semibold text-gray-700">1. Degree/Diploma Certificate/Mark Memo *</Label>
                    <Input
                      id="degreeCertificate"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange("degreeCertificate", e.target.files?.[0] || null)}
                      className="mt-1 border-2 border-gray-300 focus:border-gray-500 rounded-lg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="aadhaarCard" className="text-sm font-semibold text-gray-700">2. Aadhaar Card *</Label>
                    <Input
                      id="aadhaarCard"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange("aadhaarCard", e.target.files?.[0] || null)}
                      className="mt-1 border-2 border-gray-300 focus:border-gray-500 rounded-lg"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <Label htmlFor="residentialProof" className="text-sm font-semibold text-gray-700">3. Residential Proof *</Label>
                    <Input
                      id="residentialProof"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange("residentialProof", e.target.files?.[0] || null)}
                      className="mt-1 border-2 border-gray-300 focus:border-gray-500 rounded-lg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="signaturePhoto" className="text-sm font-semibold text-gray-700">4. Signature Photo *</Label>
                    <Input
                      id="signaturePhoto"
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange("signaturePhoto", e.target.files?.[0] || null)}
                      className="mt-1 border-2 border-gray-300 focus:border-gray-500 rounded-lg"
                    />
                  </div>
                </div>
                {formData.haveChangedName === 'Yes' && (
                  <div>
                    <Label htmlFor="marriageCertificate" className="text-sm font-semibold text-gray-700">5. Marriage Certificate/Gazette Notification/PAN Card *</Label>
                    <Input
                      id="marriageCertificate"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange("marriageCertificate", e.target.files?.[0] || null)}
                      className="mt-1 border-2 border-gray-300 focus:border-gray-500 rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4 sm:pt-6">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold w-full sm:w-auto min-w-[200px] ${
                isFormValidState 
                  ? "bg-green-600 hover:bg-green-700 text-white" 
                  : "bg-gray-400 hover:bg-gray-500 text-white cursor-not-allowed"
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Submitting...</span>
                </div>
              ) : isFormValidState ? (
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Submit Registration</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <X className="w-4 h-4" />
                  <span>Fix Errors to Submit</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    </>
  )
}
