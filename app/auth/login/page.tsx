"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Vote, User, UserCheck, Shield, Eye, EyeOff, ArrowRight } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Vote className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground font-[family-name:var(--font-montserrat)]">
            ElectionEnroll
          </h1>
          <p className="text-muted-foreground font-[family-name:var(--font-open-sans)]">
            Secure Election Registration Platform
          </p>
        </div>

        <Card className="border-2 border-primary/10 bg-gradient-to-br from-background to-card/30">
          <CardHeader className="text-center">
            <CardTitle className="font-[family-name:var(--font-montserrat)]">Sign In to Your Account</CardTitle>
            <CardDescription className="font-[family-name:var(--font-open-sans)]">
              Choose your role and enter your credentials to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="student" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 h-12">
                <TabsTrigger
                  value="student"
                  className="flex items-center gap-2 font-[family-name:var(--font-open-sans)]"
                >
                  <User className="w-4 h-4" />
                  Student
                </TabsTrigger>
                <TabsTrigger value="team" className="flex items-center gap-2 font-[family-name:var(--font-open-sans)]">
                  <UserCheck className="w-4 h-4" />
                  Team
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center gap-2 font-[family-name:var(--font-open-sans)]">
                  <Shield className="w-4 h-4" />
                  Admin
                </TabsTrigger>
              </TabsList>

              {/* Student Login */}
              <TabsContent value="student" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="student-email" className="font-[family-name:var(--font-montserrat)]">
                    Student Email
                  </Label>
                  <Input
                    id="student-email"
                    type="email"
                    placeholder="your.email@university.edu"
                    className="w-full font-[family-name:var(--font-open-sans)]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-password" className="font-[family-name:var(--font-montserrat)]">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="student-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="w-full pr-10 font-[family-name:var(--font-open-sans)]"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <Link href="/student">
                  <Button
                    className="w-full bg-primary hover:bg-primary/90 font-[family-name:var(--font-open-sans)]"
                    size="lg"
                  >
                    Sign In as Student
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <div className="text-center">
                  <Link href="/auth/register">
                    <Button variant="link" className="text-sm font-[family-name:var(--font-open-sans)]">
                      Don't have an account? Register here
                    </Button>
                  </Link>
                </div>
              </TabsContent>

              {/* Team Login */}
              <TabsContent value="team" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="team-email" className="font-[family-name:var(--font-montserrat)]">
                    Team Member Email
                  </Label>
                  <Input
                    id="team-email"
                    type="email"
                    placeholder="team.member@university.edu"
                    className="w-full font-[family-name:var(--font-open-sans)]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="team-password" className="font-[family-name:var(--font-montserrat)]">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="team-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="w-full pr-10 font-[family-name:var(--font-open-sans)]"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <Link href="/team">
                  <Button
                    className="w-full bg-accent hover:bg-accent/90 font-[family-name:var(--font-open-sans)]"
                    size="lg"
                  >
                    Sign In as Team Member
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <div className="text-center">
                  <Button variant="link" className="text-sm font-[family-name:var(--font-open-sans)]">
                    Need team access? Contact administrator
                  </Button>
                </div>
              </TabsContent>

              {/* Admin Login */}
              <TabsContent value="admin" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email" className="font-[family-name:var(--font-montserrat)]">
                    Administrator Email
                  </Label>
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@university.edu"
                    className="w-full font-[family-name:var(--font-open-sans)]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password" className="font-[family-name:var(--font-montserrat)]">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="admin-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="w-full pr-10 font-[family-name:var(--font-open-sans)]"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-2fa" className="font-[family-name:var(--font-montserrat)]">
                    Two-Factor Authentication Code
                  </Label>
                  <Input
                    id="admin-2fa"
                    type="text"
                    placeholder="Enter 6-digit code"
                    className="w-full font-[family-name:var(--font-open-sans)]"
                    maxLength={6}
                  />
                </div>
                <Link href="/admin">
                  <Button
                    className="w-full bg-primary hover:bg-primary/90 font-[family-name:var(--font-open-sans)]"
                    size="lg"
                  >
                    Sign In as Administrator
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <div className="text-center">
                  <Button variant="link" className="text-sm font-[family-name:var(--font-open-sans)]">
                    Lost access? Contact system administrator
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            {/* Security Notice */}
            <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm font-[family-name:var(--font-montserrat)]">Secure Access</h4>
                  <p className="text-xs text-muted-foreground font-[family-name:var(--font-open-sans)]">
                    Your login is protected with enterprise-grade security. All data is encrypted and access is logged
                    for audit purposes.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 space-y-2">
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground font-[family-name:var(--font-open-sans)]">
            <a href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <span>•</span>
            <a href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </a>
            <span>•</span>
            <a href="#" className="hover:text-primary transition-colors">
              Support
            </a>
          </div>
          <p className="text-xs text-muted-foreground font-[family-name:var(--font-open-sans)]">
            &copy; 2024 ElectionEnroll. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
