"use client"

import type { ReactNode } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, AlertTriangle } from "lucide-react"

interface RoleGuardProps {
  children: ReactNode
  allowedRoles: ("student" | "team" | "admin")[]
  currentUserRole?: "student" | "team" | "admin" | null
}

export function RoleGuard({ children, allowedRoles, currentUserRole = null }: RoleGuardProps) {
  // If no user is logged in
  if (!currentUserRole) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>You need to sign in to access this page</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full" size="lg">
              Sign In
            </Button>
            <div className="text-center">
              <Button variant="link" className="text-sm">
                Don't have an account? Register here
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // If user doesn't have the required role
  if (!allowedRoles.includes(currentUserRole)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access this page. Required role: {allowedRoles.join(" or ")}. Your current
              role: {currentUserRole}.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full bg-transparent" size="lg" variant="outline">
              Go Back
            </Button>
            <div className="text-center">
              <Button variant="link" className="text-sm">
                Need different access? Contact administrator
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // User has the required role, render the protected content
  return <>{children}</>
}
