// Comprehensive client-side validation utilities for student forms

export interface ValidationResult {
  isValid: boolean
  error?: string
}

export interface FieldValidation {
  [key: string]: ValidationResult
}

// Age validation utilities
export const validateAge = (ageYears: string, ageMonths: string): ValidationResult => {
  const years = parseInt(ageYears) || 0
  const months = parseInt(ageMonths) || 0
  
  if (!ageYears || !ageMonths) {
    return { isValid: false, error: "Age is required" }
  }
  
  if (isNaN(years) || isNaN(months)) {
    return { isValid: false, error: "Age must be a valid number" }
  }
  
  if (years < 0 || months < 0) {
    return { isValid: false, error: "Age cannot be negative" }
  }
  
  if (months >= 12) {
    return { isValid: false, error: "Months must be less than 12" }
  }
  
  // Check minimum age (18 years for voter registration)
  if (years < 18) {
    return { isValid: false, error: "Must be at least 18 years old to register" }
  }
  
  // Check maximum reasonable age (120 years)
  if (years > 120) {
    return { isValid: false, error: "Please enter a valid age" }
  }
  
  return { isValid: true }
}

// Date of birth validation
export const validateDateOfBirth = (dateOfBirth: string): ValidationResult => {
  if (!dateOfBirth) {
    return { isValid: false, error: "Date of birth is required" }
  }
  
  const birthDate = new Date(dateOfBirth)
  const today = new Date()
  
  if (isNaN(birthDate.getTime())) {
    return { isValid: false, error: "Please enter a valid date" }
  }
  
  if (birthDate > today) {
    return { isValid: false, error: "Date of birth cannot be in the future" }
  }
  
  // Check if person is at least 18 years old
  const ageInYears = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  
  if (ageInYears < 18 || (ageInYears === 18 && monthDiff < 0)) {
    return { isValid: false, error: "Must be at least 18 years old to register" }
  }
  
  // Check if age is not more than 120 years
  if (ageInYears > 120) {
    return { isValid: false, error: "Please enter a valid date of birth" }
  }
  
  return { isValid: true }
}

// Email validation
export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return { isValid: false, error: "Email is required" }
  }
  
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: "Please enter a valid email address" }
  }
  
  if (email.length > 254) {
    return { isValid: false, error: "Email address is too long" }
  }
  
  return { isValid: true }
}

// Mobile number validation (Indian format)
export const validateMobileNumber = (mobile: string): ValidationResult => {
  if (!mobile) {
    return { isValid: false, error: "Mobile number is required" }
  }
  
  // Remove any spaces, dashes, or other characters
  const cleanMobile = mobile.replace(/[\s\-\(\)]/g, '')
  
  // Check if it's all digits
  if (!/^\d+$/.test(cleanMobile)) {
    return { isValid: false, error: "Mobile number must contain only digits" }
  }
  
  // Check length (10 digits for Indian mobile)
  if (cleanMobile.length !== 10) {
    return { isValid: false, error: "Mobile number must be 10 digits" }
  }
  
  // Check if it starts with valid Indian mobile prefixes
  const validPrefixes = ['6', '7', '8', '9']
  if (!validPrefixes.includes(cleanMobile[0])) {
    return { isValid: false, error: "Please enter a valid Indian mobile number" }
  }
  
  return { isValid: true }
}

// Aadhaar number validation
export const validateAadhaarNumber = (aadhaar: string): ValidationResult => {
  if (!aadhaar) {
    return { isValid: false, error: "Aadhaar number is required" }
  }
  
  // Remove any spaces or dashes
  const cleanAadhaar = aadhaar.replace(/[\s\-]/g, '')
  
  // Check if it's all digits
  if (!/^\d+$/.test(cleanAadhaar)) {
    return { isValid: false, error: "Aadhaar number must contain only digits" }
  }
  
  // Check length (12 digits)
  if (cleanAadhaar.length !== 12) {
    return { isValid: false, error: "Aadhaar number must be 12 digits" }
  }
  
  // Basic checksum validation (Verhoeff algorithm simplified)
  if (!isValidAadhaarChecksum(cleanAadhaar)) {
    return { isValid: false, error: "Please enter a valid Aadhaar number" }
  }
  
  return { isValid: true }
}

// Simple Aadhaar checksum validation
const isValidAadhaarChecksum = (aadhaar: string): boolean => {
  // This is a simplified validation. In production, you might want to use a more robust checksum
  const digits = aadhaar.split('').map(Number)
  
  // Check if all digits are the same (invalid)
  if (digits.every(digit => digit === digits[0])) {
    return false
  }
  
  // Basic pattern validation
  return true
}

// PIN code validation (Indian format)
export const validatePinCode = (pinCode: string): ValidationResult => {
  if (!pinCode) {
    return { isValid: false, error: "PIN code is required" }
  }
  
  // Remove any spaces
  const cleanPinCode = pinCode.replace(/\s/g, '')
  
  // Check if it's all digits
  if (!/^\d+$/.test(cleanPinCode)) {
    return { isValid: false, error: "PIN code must contain only digits" }
  }
  
  // Check length (6 digits for Indian PIN)
  if (cleanPinCode.length !== 6) {
    return { isValid: false, error: "PIN code must be 6 digits" }
  }
  
  return { isValid: true }
}

// Name validation
export const validateName = (name: string, fieldName: string = "Name"): ValidationResult => {
  if (!name) {
    return { isValid: false, error: `${fieldName} is required` }
  }
  
  const trimmedName = name.trim()
  
  if (trimmedName.length < 2) {
    return { isValid: false, error: `${fieldName} must be at least 2 characters long` }
  }
  
  if (trimmedName.length > 50) {
    return { isValid: false, error: `${fieldName} must be less than 50 characters` }
  }
  
  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  if (!/^[a-zA-Z\s\-']+$/.test(trimmedName)) {
    return { isValid: false, error: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes` }
  }
  
  return { isValid: true }
}

// Year validation
export const validateYear = (year: string, fieldName: string = "Year"): ValidationResult => {
  if (!year) {
    return { isValid: false, error: `${fieldName} is required` }
  }
  
  const yearNum = parseInt(year)
  const currentYear = new Date().getFullYear()
  
  if (isNaN(yearNum)) {
    return { isValid: false, error: `${fieldName} must be a valid number` }
  }
  
  if (yearNum < 1950) {
    return { isValid: false, error: `${fieldName} cannot be before 1950` }
  }
  
  if (yearNum > currentYear) {
    return { isValid: false, error: `${fieldName} cannot be in the future` }
  }
  
  return { isValid: true }
}

// Required field validation
export const validateRequired = (value: string, fieldName: string): ValidationResult => {
  if (!value || value.trim() === '') {
    return { isValid: false, error: `${fieldName} is required` }
  }
  
  return { isValid: true }
}

// File validation
export const validateFile = (file: File | null, fieldName: string, maxSizeMB: number = 5): ValidationResult => {
  if (!file) {
    return { isValid: false, error: `${fieldName} is required` }
  }
  
  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  if (file.size > maxSizeBytes) {
    return { isValid: false, error: `${fieldName} must be less than ${maxSizeMB}MB` }
  }
  
  // Check file type for images
  if (fieldName.toLowerCase().includes('photo') || fieldName.toLowerCase().includes('signature')) {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: `${fieldName} must be a JPG or PNG image` }
    }
  }
  
  // Check file type for documents
  if (fieldName.toLowerCase().includes('certificate') || fieldName.toLowerCase().includes('card') || fieldName.toLowerCase().includes('proof')) {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: `${fieldName} must be a JPG, PNG, or PDF file` }
    }
  }
  
  return { isValid: true }
}

// Comprehensive form validation
export const validateStudentForm = (formData: any, files: any = {}): FieldValidation => {
  const errors: FieldValidation = {}
  
  // Personal information validation
  errors.surname = validateName(formData.surname, "Surname")
  errors.firstName = validateName(formData.firstName, "First Name")
  errors.fathersHusbandName = validateName(formData.fathersHusbandName, "Father's/Husband Name")
  errors.sex = validateRequired(formData.sex, "Sex")
  errors.dateOfBirth = validateDateOfBirth(formData.dateOfBirth)
  errors.ageYears = validateAge(formData.ageYears, formData.ageMonths)
  errors.ageMonths = validateAge(formData.ageYears, formData.ageMonths)
  
  // Address validation
  errors.district = validateRequired(formData.district, "District")
  errors.taluka = validateRequired(formData.taluka, "Taluka")
  errors.villageName = validateRequired(formData.villageName, "Village Name")
  errors.houseNo = validateRequired(formData.houseNo, "House Number")
  errors.street = validateRequired(formData.street, "Street")
  errors.pinCode = validatePinCode(formData.pinCode)
  
  // Contact validation
  errors.mobileNumber = validateMobileNumber(formData.mobileNumber)
  errors.aadhaarNumber = validateAadhaarNumber(formData.aadhaarNumber)
  errors.email = validateEmail(formData.email)
  
  // Education validation
  errors.yearOfPassing = validateYear(formData.yearOfPassing, "Year of Passing")
  errors.degreeDiploma = validateRequired(formData.degreeDiploma, "Degree/Diploma")
  errors.nameOfUniversity = validateRequired(formData.nameOfUniversity, "Name of University")
  
  // Additional validation
  errors.place = validateRequired(formData.place, "Place")
  errors.declarationDate = validateRequired(formData.declarationDate, "Declaration Date")
  
  // File validation
  if (files.degreeCertificate) {
    errors.degreeCertificate = validateFile(files.degreeCertificate, "Degree Certificate")
  }
  if (files.aadhaarCard) {
    errors.aadhaarCard = validateFile(files.aadhaarCard, "Aadhaar Card")
  }
  if (files.residentialProof) {
    errors.residentialProof = validateFile(files.residentialProof, "Residential Proof")
  }
  if (files.signaturePhoto) {
    errors.signaturePhoto = validateFile(files.signaturePhoto, "Signature Photo")
  }
  if (formData.haveChangedName === 'Yes' && files.marriageCertificate) {
    errors.marriageCertificate = validateFile(files.marriageCertificate, "Marriage Certificate")
  }
  
  return errors
}

// Check if form is valid
export const isFormValid = (errors: FieldValidation): boolean => {
  return Object.values(errors).every(error => error.isValid)
}

// Get all error messages
export const getErrorMessages = (errors: FieldValidation): string[] => {
  return Object.values(errors)
    .filter(error => !error.isValid)
    .map(error => error.error)
    .filter(Boolean) as string[]
}

// Real-time validation for specific field
export const validateField = (fieldName: string, value: string, formData?: any): ValidationResult => {
  switch (fieldName) {
    case 'surname':
      return validateName(value, "Surname")
    case 'firstName':
      return validateName(value, "First Name")
    case 'fathersHusbandName':
      return validateName(value, "Father's/Husband Name")
    case 'sex':
      return validateRequired(value, "Sex")
    case 'dateOfBirth':
      return validateDateOfBirth(value)
    case 'ageYears':
    case 'ageMonths':
      if (formData) {
        return validateAge(formData.ageYears || '', formData.ageMonths || '')
      }
      return { isValid: true }
    case 'district':
      return validateRequired(value, "District")
    case 'taluka':
      return validateRequired(value, "Taluka")
    case 'villageName':
      return validateRequired(value, "Village Name")
    case 'houseNo':
      return validateRequired(value, "House Number")
    case 'street':
      return validateRequired(value, "Street")
    case 'pinCode':
      return validatePinCode(value)
    case 'mobileNumber':
      return validateMobileNumber(value)
    case 'aadhaarNumber':
      return validateAadhaarNumber(value)
    case 'email':
      return validateEmail(value)
    case 'yearOfPassing':
      return validateYear(value, "Year of Passing")
    case 'degreeDiploma':
      return validateRequired(value, "Degree/Diploma")
    case 'nameOfUniversity':
      return validateRequired(value, "Name of University")
    case 'place':
      return validateRequired(value, "Place")
    case 'declarationDate':
      return validateRequired(value, "Declaration Date")
    default:
      return { isValid: true }
  }
}
