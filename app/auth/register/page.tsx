"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Vote, User, Eye, EyeOff, CheckCircle, ArrowRight } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Vote className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground font-[family-name:var(--font-montserrat)]">
            Create Student Account
          </h1>
          <p className="text-muted-foreground font-[family-name:var(--font-open-sans)]">
            Register for election participation
          </p>
        </div>

        <Card className="border-2 border-primary/10 bg-gradient-to-br from-background to-card/30">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 font-[family-name:var(--font-montserrat)]">
              <User className="w-5 h-5 text-primary" />
              Student Registration
            </CardTitle>
            <CardDescription className="font-[family-name:var(--font-open-sans)]">
              Complete your profile to begin the election registration process
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg font-[family-name:var(--font-montserrat)]">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="font-[family-name:var(--font-montserrat)]">
                    First Name
                  </Label>
                  <Input id="firstName" placeholder="John" className="font-[family-name:var(--font-open-sans)]" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="font-[family-name:var(--font-montserrat)]">
                    Last Name
                  </Label>
                  <Input id="lastName" placeholder="Doe" className="font-[family-name:var(--font-open-sans)]" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="font-[family-name:var(--font-montserrat)]">
                  University Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@university.edu"
                  className="font-[family-name:var(--font-open-sans)]"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="studentId" className="font-[family-name:var(--font-montserrat)]">
                    Student ID
                  </Label>
                  <Input
                    id="studentId"
                    placeholder="STU-2024-001247"
                    className="font-[family-name:var(--font-open-sans)]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="font-[family-name:var(--font-montserrat)]">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    className="font-[family-name:var(--font-open-sans)]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth" className="font-[family-name:var(--font-montserrat)]">
                    Date of Birth
                  </Label>
                  <Input id="dateOfBirth" type="date" className="font-[family-name:var(--font-open-sans)]" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="academicYear" className="font-[family-name:var(--font-montserrat)]">
                    Academic Year
                  </Label>
                  <Select>
                    <SelectTrigger className="font-[family-name:var(--font-open-sans)]">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="freshman">Freshman (1st Year)</SelectItem>
                      <SelectItem value="sophomore">Sophomore (2nd Year)</SelectItem>
                      <SelectItem value="junior">Junior (3rd Year)</SelectItem>
                      <SelectItem value="senior">Senior (4th Year)</SelectItem>
                      <SelectItem value="graduate">Graduate Student</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg font-[family-name:var(--font-montserrat)]">Address Information</h3>
              <div className="space-y-2">
                <Label htmlFor="address" className="font-[family-name:var(--font-montserrat)]">
                  Street Address
                </Label>
                <Input
                  id="address"
                  placeholder="123 University Ave, Apt 4B"
                  className="font-[family-name:var(--font-open-sans)]"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city" className="font-[family-name:var(--font-montserrat)]">
                    City
                  </Label>
                  <Input id="city" placeholder="College Town" className="font-[family-name:var(--font-open-sans)]" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state" className="font-[family-name:var(--font-montserrat)]">
                    State
                  </Label>
                  <Input id="state" placeholder="ST" className="font-[family-name:var(--font-open-sans)]" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode" className="font-[family-name:var(--font-montserrat)]">
                    ZIP Code
                  </Label>
                  <Input id="zipCode" placeholder="12345" className="font-[family-name:var(--font-open-sans)]" />
                </div>
              </div>
            </div>

            {/* Election Preferences */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg font-[family-name:var(--font-montserrat)]">Election Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="votingLocation" className="font-[family-name:var(--font-montserrat)]">
                    Preferred Voting Location
                  </Label>
                  <Select>
                    <SelectTrigger className="font-[family-name:var(--font-open-sans)]">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="main-campus">Main Campus - Student Center</SelectItem>
                      <SelectItem value="north-campus">North Campus - Library</SelectItem>
                      <SelectItem value="south-campus">South Campus - Recreation Center</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="politicalAffiliation" className="font-[family-name:var(--font-montserrat)]">
                    Political Affiliation (Optional)
                  </Label>
                  <Select>
                    <SelectTrigger className="font-[family-name:var(--font-open-sans)]">
                      <SelectValue placeholder="Select affiliation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="democrat">Democrat</SelectItem>
                      <SelectItem value="republican">Republican</SelectItem>
                      <SelectItem value="independent">Independent</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg font-[family-name:var(--font-montserrat)]">Emergency Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyName" className="font-[family-name:var(--font-montserrat)]">
                    Contact Name
                  </Label>
                  <Input
                    id="emergencyName"
                    placeholder="Jane Doe"
                    className="font-[family-name:var(--font-open-sans)]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyRelation" className="font-[family-name:var(--font-montserrat)]">
                    Relationship
                  </Label>
                  <Input
                    id="emergencyRelation"
                    placeholder="Mother"
                    className="font-[family-name:var(--font-open-sans)]"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyPhone" className="font-[family-name:var(--font-montserrat)]">
                  Emergency Phone
                </Label>
                <Input
                  id="emergencyPhone"
                  type="tel"
                  placeholder="+1 (555) 987-6543"
                  className="font-[family-name:var(--font-open-sans)]"
                />
              </div>
            </div>

            {/* Account Security */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg font-[family-name:var(--font-montserrat)]">Account Security</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="font-[family-name:var(--font-montserrat)]">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      className="pr-10 font-[family-name:var(--font-open-sans)]"
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
                  <Label htmlFor="confirmPassword" className="font-[family-name:var(--font-montserrat)]">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className="pr-10 font-[family-name:var(--font-open-sans)]"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground font-[family-name:var(--font-open-sans)]">
                Password must be at least 8 characters with uppercase, lowercase, number, and special character.
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox id="terms" />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-[family-name:var(--font-montserrat)]"
                  >
                    I agree to the Terms of Service and Privacy Policy
                  </Label>
                  <p className="text-xs text-muted-foreground font-[family-name:var(--font-open-sans)]">
                    By registering, you agree to our terms and acknowledge that your information will be used for
                    election registration purposes.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Checkbox id="notifications" />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="notifications"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-[family-name:var(--font-montserrat)]"
                  >
                    Send me election updates and notifications
                  </Label>
                  <p className="text-xs text-muted-foreground font-[family-name:var(--font-open-sans)]">
                    Receive important updates about your registration status and election information.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="space-y-4">
              <Button
                className="w-full bg-primary hover:bg-primary/90 font-[family-name:var(--font-open-sans)]"
                size="lg"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Create Account & Start Registration
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <div className="text-center">
                <Link href="/auth/login">
                  <Button variant="link" className="text-sm font-[family-name:var(--font-open-sans)]">
                    Already have an account? Sign in here
                  </Button>
                </Link>
              </div>
            </div>

            {/* Security Notice */}
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm font-[family-name:var(--font-montserrat)]">Secure Registration</h4>
                  <p className="text-xs text-muted-foreground font-[family-name:var(--font-open-sans)]">
                    Your personal information is encrypted and protected. After registration, you'll need to upload
                    required documents to complete your election registration.
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
