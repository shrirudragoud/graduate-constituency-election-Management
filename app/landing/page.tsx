"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Users, UserPlus, Vote, Shield, CheckCircle, Star } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <Vote className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300">Karykarta Portal </h1>
                <p className="text-sm text-gray-600">Voter Registration System</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/auth/login">
                <Button variant="outline" size="sm" className="hover:bg-gray-50 transition-all duration-200 hover:scale-105">
                  Sign In
                </Button>
              </Link>
              <Link href="/team-signup">
                <Button size="sm" className="bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl">
                  Join Team
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-6 bg-gradient-to-r from-orange-500 to-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in">
              <Star className="w-3 h-3 mr-1" />
              Official BJP Platform
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in-up">
              <span className="bg-gradient-to-r from-orange-500 via-green-600 to-gray-800 bg-clip-text text-transparent">
                Voter Registration
              </span>
              <br />
              <span className="animate-fade-in-up delay-200">Made Simple</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-300">
              Register for voter ID, manage election data, and be part of India's democratic process. 
              Join thousands of citizens who trust our secure platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-500">
              <Link href="/student">
                <Button size="lg" className="bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700 text-white px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
                  <Vote className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                  Register as Voter
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              </Link>
              <Link href="/team-signup">
                <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-2 hover:bg-gray-50 transition-all duration-300 hover:scale-105 group">
                  <Users className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                  Join Our Team
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-fade-in-up">Why Choose Our Platform?</h2>
            <p className="text-lg text-gray-600 animate-fade-in-up delay-200">Secure, fast, and user-friendly voter registration</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-xl transition-all duration-300 hover:scale-105 group border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl group-hover:text-blue-600 transition-colors duration-300">Secure & Private</CardTitle>
                <CardDescription className="text-gray-600">
                  Your personal data is protected with enterprise-grade security
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="text-sm text-gray-600 space-y-3">
                  <li className="flex items-center justify-center group-hover:translate-x-2 transition-transform duration-300">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    End-to-end encryption
                  </li>
                  <li className="flex items-center justify-center group-hover:translate-x-2 transition-transform duration-300 delay-100">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    GDPR compliant
                  </li>
                  <li className="flex items-center justify-center group-hover:translate-x-2 transition-transform duration-300 delay-200">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Regular security audits
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 hover:scale-105 group border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <Vote className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl group-hover:text-green-600 transition-colors duration-300">Easy Registration</CardTitle>
                <CardDescription className="text-gray-600">
                  Simple form that takes just a few minutes to complete
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="text-sm text-gray-600 space-y-3">
                  <li className="flex items-center justify-center group-hover:translate-x-2 transition-transform duration-300">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Mobile-friendly design
                  </li>
                  <li className="flex items-center justify-center group-hover:translate-x-2 transition-transform duration-300 delay-100">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Step-by-step guidance
                  </li>
                  <li className="flex items-center justify-center group-hover:translate-x-2 transition-transform duration-300 delay-200">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Instant confirmation
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 hover:scale-105 group border-0 shadow-lg bg-gradient-to-br from-orange-50 to-amber-50">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl group-hover:text-orange-600 transition-colors duration-300">Team Management</CardTitle>
                <CardDescription className="text-gray-600">
                  Join our team and help manage voter registrations
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="text-sm text-gray-600 space-y-3">
                  <li className="flex items-center justify-center group-hover:translate-x-2 transition-transform duration-300">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Role-based access
                  </li>
                  <li className="flex items-center justify-center group-hover:translate-x-2 transition-transform duration-300 delay-100">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Real-time analytics
                  </li>
                  <li className="flex items-center justify-center group-hover:translate-x-2 transition-transform duration-300 delay-200">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    WhatsApp notifications
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-green-600 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-orange-500/90 to-green-600/90"></div>
          <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl font-bold text-white mb-4 animate-fade-in-up">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-orange-100 mb-8 animate-fade-in-up delay-200">
            Choose your path and join thousands of citizens in building a stronger democracy
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-300">
            <Link href="/student">
              <Button size="lg" variant="secondary" className="px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group bg-white text-orange-600 hover:bg-orange-50">
                <Vote className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                Register as Voter
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </Link>
            <Link href="/team-signup">
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-2 border-white text-white hover:bg-white hover:text-orange-600 transition-all duration-300 hover:scale-105 group shadow-xl hover:shadow-2xl">
                <UserPlus className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                Join Our Team
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900/95 to-gray-800/95"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-500/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6 group">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <Vote className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold group-hover:text-orange-400 transition-colors duration-300">BJP Election Management</span>
            </div>
            <p className="text-gray-300 mb-8 text-lg animate-fade-in-up">
              Empowering democracy through technology
            </p>
            <div className="flex justify-center space-x-8 text-sm text-gray-400 mb-8">
              <Link href="/student" className="hover:text-white hover:scale-105 transition-all duration-200 font-medium">Voter Registration</Link>
              <Link href="/team-signup" className="hover:text-white hover:scale-105 transition-all duration-200 font-medium">Join Team</Link>
              <Link href="/auth/login" className="hover:text-white hover:scale-105 transition-all duration-200 font-medium">Sign In</Link>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-700 text-sm text-gray-400 animate-fade-in-up delay-200">
              © 2024 Bharatiya Janata Party. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
