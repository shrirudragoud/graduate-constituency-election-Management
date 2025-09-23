"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Vote, Eye, EyeOff, ArrowRight, Mail, Lock, AlertCircle } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState("student")
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    twoFA: ""
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const roles = [
    { id: "student", name: "Student", href: "/student" },
    { id: "team", name: "Team Member", href: "/team" },
    { id: "manager", name: "Manager", href: "/team" },
    { id: "admin", name: "Admin", href: "/admin" }
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const handleLogin = async () => {
    // Simple validation
    if (!formData.email || !formData.password) {
      setErrors({ email: !formData.email ? "Email required" : "", password: !formData.password ? "Password required" : "" })
      return
    }
    
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      const role = roles.find(r => r.id === selectedRole)
      if (role) {
        window.location.href = role.href
      }
    }, 1000)
  }

  const quickLogin = () => {
    setFormData({
      email: "demo@university.edu",
      password: "demo123",
      twoFA: selectedRole === "admin" ? "123456" : ""
    })
    setErrors({})
    setTimeout(() => handleLogin(), 100)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary via-primary/90 to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Vote className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">ElectionEnroll</h1>
          <p className="text-muted-foreground mt-2">Sign in to your account</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">Welcome Back</CardTitle>
            <CardDescription>Choose your role and sign in</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Role Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Select Role</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="your.email@university.edu"
                  className={`pl-10 h-12 ${errors.email ? "border-destructive" : ""}`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email}
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
                  className={`pl-10 pr-10 h-12 ${errors.password ? "border-destructive" : ""}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
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
                  className="h-12"
                  maxLength={6}
                />
              </div>
            )}

            {/* Login Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full h-12 text-base font-semibold"
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
              
              <Button
                onClick={quickLogin}
                variant="outline"
                disabled={isLoading}
                className="w-full h-12 text-base"
              >
                🚀 Quick Demo Login
              </Button>
            </div>

            {/* Links */}
            <div className="text-center space-y-2">
              <Link href="/auth/register" className="text-sm text-primary hover:underline">
                Don't have an account? Register here
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Demo Info */}
        <Card className="mt-6 bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="text-center">
              <h3 className="font-semibold text-sm mb-2">Demo Credentials</h3>
              <p className="text-xs text-muted-foreground mb-2">
                Email: <code className="bg-muted px-1 rounded">demo@university.edu</code>
              </p>
              <p className="text-xs text-muted-foreground">
                Password: <code className="bg-muted px-1 rounded">demo123</code>
                {selectedRole === "admin" && (
                  <span> | 2FA: <code className="bg-muted px-1 rounded">123456</code></span>
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-muted-foreground">
          &copy; 2024 ElectionEnroll. All rights reserved.
        </div>
      </div>
    </div>
  )
}