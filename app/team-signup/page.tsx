"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, UserPlus, Phone, MapPin, Lock, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function TeamSignupPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    padvidhar: "",
    address: "",
    district: "",
    pin: ""
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})

  const districts = [
    "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Ahmedabad",
    "Jaipur", "Surat", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal",
    "Visakhapatnam", "Pimpri-Chinchwad", "Patna", "Vadodara", "Ghaziabad", "Ludhiana",
    "Agra", "Nashik", "Faridabad", "Meerut", "Rajkot", "Kalyan-Dombivali", "Vasai-Virar",
    "Sangli", "Kolhapur", "Satara", "Solapur", "Aurangabad", "Nashik", "Parbhani", "Nanded"
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number"
    }
    if (!formData.password.trim()) newErrors.password = "Password is required"
    else if (formData.password.length < 4) {
      newErrors.password = "Password must be at least 4 characters"
    }
    if (!formData.padvidhar.trim()) newErrors.padvidhar = "Padvidhar is required"
    if (!formData.address.trim()) newErrors.address = "Address is required"
    if (!formData.district) newErrors.district = "Please select a district"
    if (!formData.pin.trim()) newErrors.pin = "PIN code is required"
    else if (!/^[0-9]{6}$/.test(formData.pin)) {
      newErrors.pin = "Please enter a valid 6-digit PIN code"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/team-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        // Store token and redirect
        localStorage.setItem('authToken', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        
        // Redirect to team page
        window.location.href = '/team'
      } else {
        alert(data.error || 'Registration failed. Please try again.')
      }
    } catch (error) {
      console.error('Registration error:', error)
      alert('Registration failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Join BJP Team</h1>
          <p className="text-gray-600 text-sm">Become part of our election management team</p>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" />
              Team Registration
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-6 space-y-4">
            {/* Name Field */}
            <div>
              <Label htmlFor="name" className="text-sm font-medium">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={errors.name ? "border-red-500" : ""}
                placeholder="Enter your full name"
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            {/* Phone Field */}
            <div>
              <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number *
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className={errors.phone ? "border-red-500" : ""}
                placeholder="9876543210"
              />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>

            {/* Password Field */}
            <div>
              <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password * (Min 4 chars)
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={errors.password ? "border-red-500" : ""}
                placeholder="Enter password"
              />
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            {/* Padvidhar Field */}
            <div>
              <Label htmlFor="padvidhar" className="text-sm font-medium">Padvidhar *</Label>
              <Input
                id="padvidhar"
                value={formData.padvidhar}
                onChange={(e) => handleInputChange("padvidhar", e.target.value)}
                className={errors.padvidhar ? "border-red-500" : ""}
                placeholder="Enter padvidhar details"
              />
              {errors.padvidhar && <p className="text-xs text-red-500 mt-1">{errors.padvidhar}</p>}
            </div>

            {/* Address Field */}
            <div>
              <Label htmlFor="address" className="text-sm font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Address *
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className={errors.address ? "border-red-500" : ""}
                placeholder="Enter your address"
              />
              {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
            </div>

            {/* District Field */}
            <div>
              <Label htmlFor="district" className="text-sm font-medium">District *</Label>
              <Select value={formData.district} onValueChange={(value) => handleInputChange("district", value)}>
                <SelectTrigger className={errors.district ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select district" />
                </SelectTrigger>
                <SelectContent>
                  {districts.map((district) => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.district && <p className="text-xs text-red-500 mt-1">{errors.district}</p>}
            </div>

            {/* PIN Code Field */}
            <div>
              <Label htmlFor="pin" className="text-sm font-medium">PIN Code *</Label>
              <Input
                id="pin"
                value={formData.pin}
                onChange={(e) => handleInputChange("pin", e.target.value)}
                className={errors.pin ? "border-red-500" : ""}
                placeholder="123456"
              />
              {errors.pin && <p className="text-xs text-red-500 mt-1">{errors.pin}</p>}
            </div>

            {/* Submit Button */}
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700 text-white font-semibold py-3 mt-6"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>Create Account</span>
                  <CheckCircle className="w-4 h-4" />
                </div>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/team/login" className="text-primary hover:underline font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
