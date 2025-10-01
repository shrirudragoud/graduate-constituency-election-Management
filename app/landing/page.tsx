"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Users, UserPlus, Vote, Shield, CheckCircle, Star } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Header - Optimized for mobile */}
      <header className="bg-gradient-to-r from-orange-500 via-orange-400 to-green-500 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-center items-center py-3 sm:py-4 md:py-5">
            <div className="flex items-center gap-3 sm:gap-4 md:gap-6 group">
              {/* Logo Image - Better mobile sizing */}
              <div className="relative flex-shrink-0">
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-white rounded-full p-1 shadow-2xl group-hover:shadow-3xl transition-all duration-300 group-hover:scale-105">
                  <img 
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqEYFoHrT21y6Q0dYZABmBinmUi10cyJZvbg&s" 
                    alt="BJP Logo" 
                    className="w-full h-full object-contain rounded-full"
                  />
                </div>
              </div>
              
              {/* Text Section - Better mobile typography */}
              <div className="text-left">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg leading-tight">
                  कार्यकर्ता पोर्टल
                </h1>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/95 font-medium drop-shadow mt-0.5 sm:mt-1">
                  मतदार नोंदणी प्रणाली
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Mobile optimized spacing */}
      <section className="py-12 sm:py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-200/20 rounded-full blur-3xl animate-pulse"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 sm:mb-6 bg-gradient-to-r from-orange-500 to-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-xs sm:text-sm">
              <Star className="w-3 h-3 mr-1" />
              अधिकृत भाजप प्लॅटफॉर्म
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 px-2">
              <span className="bg-gradient-to-r from-orange-500 via-green-600 to-gray-800 bg-clip-text text-transparent">
                मतदार नोंदणी
              </span>
              <br />
              <span>सोपी आणि सुलभ</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-4">
              मतदार ओळखपत्रासाठी नोंदणी करा आणि भारताच्या लोकशाही प्रक्रियेचा भाग व्हा.
              आमच्या सुरक्षित प्लॅटफॉर्मवर हजारो नागरिकांनी विश्वास ठेवला आहे.
            </p>
            <div className="flex flex-col gap-3 sm:gap-4 justify-center px-4 max-w-md sm:max-w-none mx-auto">
              <Link href="/student" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700 text-white px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
                  <Vote className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  मतदार म्हणून नोंदणी करा
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/karykarta-portal" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg border-2 hover:bg-gray-50 transition-all duration-300 hover:scale-105 group">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  आमच्या टीममध्ये सामील व्हा
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Mobile optimized cards */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">आमची सेवा का निवडावी?</h2>
            <p className="text-base sm:text-lg text-gray-600 px-4">सुरक्षित, जलद आणि सोपी मतदार नोंदणी</p>
          </div>
          
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="text-center hover:shadow-xl transition-all duration-300 hover:scale-105 group border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader className="pb-3 sm:pb-4 pt-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                  <Shield className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <CardTitle className="text-lg sm:text-xl">सुरक्षित आणि खाजगी</CardTitle>
                <CardDescription className="text-gray-600 text-sm sm:text-base px-2">
                  तुमची वैयक्तिक माहिती पूर्ण सुरक्षित आहे
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 pb-6">
                <ul className="text-sm text-gray-600 space-y-2 sm:space-y-3">
                  <li className="flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    संपूर्ण डेटा सुरक्षा
                  </li>
                  <li className="flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    माहितीची गोपनीयता
                  </li>
                  <li className="flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    नियमित सुरक्षा तपासणी
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 hover:scale-105 group border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader className="pb-3 sm:pb-4 pt-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                  <Vote className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <CardTitle className="text-lg sm:text-xl">सोपी नोंदणी</CardTitle>
                <CardDescription className="text-gray-600 text-sm sm:text-base px-2">
                  फक्त काही मिनिटांत फॉर्म भरा
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 pb-6">
                <ul className="text-sm text-gray-600 space-y-2 sm:space-y-3">
                  <li className="flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    मोबाईल फ्रेंडली डिझाइन
                  </li>
                  <li className="flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    पायरीपायरी मार्गदर्शन
                  </li>
                  <li className="flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    त्वरित पुष्टीकरण
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 hover:scale-105 group border-0 shadow-lg bg-gradient-to-br from-orange-50 to-amber-50 md:col-span-2 lg:col-span-1">
              <CardHeader className="pb-3 sm:pb-4 pt-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                  <Users className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <CardTitle className="text-lg sm:text-xl">टीम व्यवस्थापन</CardTitle>
                <CardDescription className="text-gray-600 text-sm sm:text-base px-2">
                  आमच्या टीममध्ये सामील व्हा आणि मदत करा
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 pb-6">
                <ul className="text-sm text-gray-600 space-y-2 sm:space-y-3">
                  <li className="flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    भूमिका-आधारित प्रवेश
                  </li>
                  <li className="flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    रिअल-टाइम अहवाल
                  </li>
                  <li className="flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    व्हाट्सअॅप सूचना
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section - Mobile optimized */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-orange-500 to-green-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-orange-500/90 to-green-600/90"></div>
          <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
            सुरुवात करण्यास तयार आहात?
          </h2>
          <p className="text-base sm:text-xl text-orange-100 mb-6 sm:mb-8 px-2">
            तुमचा मार्ग निवडा आणि मजबूत लोकशाही निर्माण करण्यात सहभागी व्हा
          </p>
          <div className="flex flex-col gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
            <Link href="/student" className="w-full sm:w-auto">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group bg-white text-orange-600 hover:bg-orange-50">
                <Vote className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                मतदार म्हणून नोंदणी करा
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/karykarta-portal" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg border-2 border-white text-white hover:bg-white hover:text-orange-600 transition-all duration-300 hover:scale-105 group shadow-xl hover:shadow-2xl">
                <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                आमच्या टीममध्ये सामील व्हा
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer - Mobile optimized */}
      <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-10 sm:py-12 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900/95 to-gray-800/95"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-500/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4 sm:mb-6 group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <Vote className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-lg sm:text-2xl font-bold">भाजप निवडणूक व्यवस्थापन</span>
            </div>
            <p className="text-gray-300 mb-6 sm:mb-8 text-base sm:text-lg px-4">
              तंत्रज्ञानाद्वारे लोकशाही सशक्त करत आहोत
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 text-sm text-gray-400 mb-6 sm:mb-8">
              <Link href="/student" className="hover:text-white hover:scale-105 transition-all duration-200 font-medium">मतदार नोंदणी</Link>
              <Link href="/karykarta-portal" className="hover:text-white hover:scale-105 transition-all duration-200 font-medium">टीममध्ये सामील व्हा</Link>
              <Link href="/auth/login" className="hover:text-white hover:scale-105 transition-all duration-200 font-medium">साइन इन</Link>
            </div>
            <div className="mt-6 sm:mt-8 pt-6 border-t border-gray-700 text-xs sm:text-sm text-gray-400 px-4">
              © 2024 भारतीय जनता पक्ष. सर्व हक्क राखीव.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}