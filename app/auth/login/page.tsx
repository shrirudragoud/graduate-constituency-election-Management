"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, ArrowRight, Mail, Lock, AlertCircle, Phone } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState("volunteer")
  const [loginType, setLoginType] = useState<"email" | "number">("number")
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    phoneNumber: "",
    password: "",
    twoFA: ""
  } as {
    email: string
    phoneNumber: string
    password: string
    twoFA: string
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const roles = [
    { id: "volunteer", name: "Volunteer", href: "/team" },
    { id: "manager", name: "Manager", href: "/manager" },
    { id: "admin", name: "Admin", href: "/admin" }
  ]

  // Pre-filled demo values
  const demoCredentials = {
    email: "demo@bjp.org",
    phoneNumber: "9876543210",
    password: "demo123",
    twoFA: "123456"
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const handleLogin = async () => {
    // Clear previous errors
    setErrors({})
    
    // Simple validation
    const loginField = loginType === "email" ? "email" : "phoneNumber"
    const loginValue = loginType === "email" ? formData.email : formData.phoneNumber
    
    if (!loginValue || !formData.password) {
      setErrors({ 
        [loginField]: !loginValue ? `${loginType === "email" ? "Email" : "Phone number"} required` : "", 
        password: !formData.password ? "Password required" : "" 
      })
      return
    }
    
    // Additional validation for admin 2FA
    if (selectedRole === "admin" && !formData.twoFA) {
      setErrors({ twoFA: "2FA code required for admin login" })
      return
    }
    
    setIsLoading(true)
    
    try {
      // Call the authentication API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          loginField: loginValue,
          password: formData.password,
          loginType: loginType,
          action: 'login'
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Store token in localStorage
        localStorage.setItem('authToken', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        
        // Redirect based on role
        const role = roles.find(r => r.id === selectedRole)
        if (role) {
          window.location.href = role.href
        }
      } else {
        setErrors({ 
          [loginField]: data.error || 'Login failed' 
        })
      }
    } catch (error) {
      console.error('Login error:', error)
      setErrors({ 
        [loginField]: 'Network error. Please try again.' 
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Pre-fill demo values on component mount
  useEffect(() => {
    setFormData({
      email: demoCredentials.email,
      phoneNumber: demoCredentials.phoneNumber,
      password: demoCredentials.password,
      twoFA: selectedRole === "admin" ? demoCredentials.twoFA : ""
    })
  }, [selectedRole])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg border-2 border-orange-200">
            <img 
              src="/logo.png" 
              alt="BJP Logo" 
              className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
            />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Bharatiya Janata Party</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2">Sign in to your account</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">Welcome </CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Role Selection Buttons */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Select Role</Label>
              <div className="flex gap-2">
                {roles.map((role) => (
                  <Button
                    key={role.id}
                    variant={selectedRole === role.id ? "default" : "outline"}
                    onClick={() => setSelectedRole(role.id)}
                    className="flex-1 h-10 text-xs sm:text-sm px-2"
                  >
                    {role.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Login Type Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Login with</Label>
              <div className="flex gap-2">
                <Button
                  variant={loginType === "number" ? "default" : "outline"}
                  onClick={() => setLoginType("number")}
                  className="flex-1 h-10 text-xs sm:text-sm"
                >
                  <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Phone Number</span>
                  <span className="sm:hidden">Phone</span>
                </Button>
                <Button
                  variant={loginType === "email" ? "default" : "outline"}
                  onClick={() => setLoginType("email")}
                  className="flex-1 h-10 text-xs sm:text-sm"
                >
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Email
                </Button>
              </div>
            </div>

            {/* Email or Phone Number */}
            <div className="space-y-2">
              <Label htmlFor={loginType} className="text-sm font-medium">
                {loginType === "email" ? "Email" : "Phone Number"}
              </Label>
              <div className="relative">
                {loginType === "email" ? (
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                ) : (
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                )}
                <Input
                  id={loginType}
                  type={loginType === "email" ? "email" : "tel"}
                  value={loginType === "email" ? formData.email : formData.phoneNumber}
                  onChange={(e) => handleInputChange(loginType === "email" ? "email" : "phoneNumber", e.target.value)}
                  placeholder={loginType === "email" ? "your.email@bjp.org" : "9876543210"}
                  className={`pl-10 h-11 sm:h-12 text-sm ${errors[loginType === "email" ? "email" : "phoneNumber"] ? "border-destructive" : ""}`}
                />
              </div>
              {errors[loginType === "email" ? "email" : "phoneNumber"] && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors[loginType === "email" ? "email" : "phoneNumber"]}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="Enter your password"
                  className={`pl-10 pr-10 h-11 sm:h-12 text-sm ${errors.password ? "border-destructive" : ""}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-2 sm:px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* 2FA for Admin */}
            {selectedRole === "admin" && (
              <div className="space-y-2">
                <Label htmlFor="2fa" className="text-sm font-medium">2FA Code</Label>
                <Input
                  id="2fa"
                  type="text"
                  value={formData.twoFA}
                  onChange={(e) => handleInputChange("twoFA", e.target.value)}
                  placeholder="Enter 6-digit code"
                  className={`h-11 sm:h-12 text-sm ${errors.twoFA ? "border-destructive" : ""}`}
                  maxLength={6}
                />
                {errors.twoFA && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.twoFA}
                  </p>
                )}
              </div>
            )}

            {/* Login Button */}
            <div className="space-y-3">
              <Button
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full h-11 sm:h-12 text-sm sm:text-base font-semibold"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </div>

            {/* Links */}
            <div className="text-center space-y-2">
              <Link href="/auth/register" className="text-sm text-primary hover:underline">
                Don't have an account? Register here
              </Link>
              <div className="text-xs text-muted-foreground">
                or{" "}
                <Link href="/team-signup" className="text-primary hover:underline font-medium">
                  Join as Team Member
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo Info */}
        <Card className="mt-4 sm:mt-6 bg-primary/5 border-primary/20">
          <CardContent className="p-3 sm:p-4">
            <div className="text-center">
              <h3 className="font-semibold text-xs sm:text-sm mb-2">Demo Credentials (Pre-filled)</h3>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">
                  Email: <code className="bg-muted px-1 rounded text-xs">demo@bjp.org</code>
                </p>
                <p className="text-xs text-muted-foreground">
                  Phone: <code className="bg-muted px-1 rounded text-xs">9876543210</code>
                </p>
                <p className="text-xs text-muted-foreground">
                  Password: <code className="bg-muted px-1 rounded text-xs">demo123</code>
                  {selectedRole === "admin" && (
                    <span> | 2FA: <code className="bg-muted px-1 rounded text-xs">123456</code></span>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-muted-foreground">
          &copy; 2024 Bharatiya Janata Party. All rights reserved.
        </div>
      </div>
    </div>
  )
}