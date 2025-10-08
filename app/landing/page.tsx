"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Users, UserPlus, Vote, Shield, CheckCircle, Star, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingType, setLoadingType] = useState<'student' | 'karykarta' | null>(null)
  const router = useRouter()

  const handleNavigation = (path: string, type: 'student' | 'karykarta') => {
    setIsLoading(true)
    setLoadingType(type)
    
    // Add a small delay to show loading animation
    setTimeout(() => {
      router.push(path)
    }, 300)
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 relative">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-xl flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            <p className="text-sm font-medium text-gray-700">
              {loadingType === 'student' ? 'मतदार नोंदणी पेज लोड होत आहे...' : 'कार्यकर्ता पोर्टल लोड होत आहे...'}
            </p>
            <div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-orange-500 to-green-600 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      )}
      {/* Loading Progress Bar */}
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
          <div className="h-full bg-gradient-to-r from-orange-500 to-green-600 animate-pulse"></div>
        </div>
      )}

      {/* Header - Centered design with dual logos */}
      <header className="bg-gradient-to-r from-orange-500 via-orange-400 to-green-500 shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 sm:py-4">
            {/* Left Logo */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white rounded-full p-1 shadow-lg hover:shadow-xl transition-all duration-300">
                <img 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqEYFoHrT21y6Q0dYZABmBinmUi10cyJZvbg&s" 
                  alt="BJP Logo" 
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
            </div>
            
            {/* Center Text Section */}
            <div className="text-center flex-1 px-4">
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white drop-shadow-lg leading-tight">
              भारतीय जनता पार्टी
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-white/95 font-medium drop-shadow">
              मराठवाडा पदवीधर मतदार संघ निवडणूक
              </p>
            </div>
            
            {/* Right Logo */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white rounded-full p-1 shadow-lg hover:shadow-xl transition-all duration-300">
                <img 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqEYFoHrT21y6Q0dYZABmBinmUi10cyJZvbg&s" 
                  alt="BJP Logo" 
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Increased height */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 left-5 w-48 h-48 sm:w-72 sm:h-72 bg-orange-200/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-5 w-64 h-64 sm:w-96 sm:h-96 bg-green-200/20 rounded-full blur-3xl animate-pulse"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
           



           
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 sm:mb-8 px-2">
              <span className="bg-gradient-to-r from-orange-500 via-green-600 to-gray-800 bg-clip-text text-transparent">
                मतदार नोंदणी
              </span>
              <br />
              <span>अभियान</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-2">
              मतदार यादीत नोंदणी करा आणि लोकशाहीत भाग घ्या.
            </p>
            <div className="flex flex-col gap-2 sm:gap-3 justify-center px-2 max-w-sm sm:max-w-none mx-auto">
              <Button 
                size="lg" 
                onClick={() => handleNavigation('/karykarta-portal', 'karykarta')}
                disabled={isLoading}
                className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700 text-white px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading && loadingType === 'student' ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Vote className="w-4 h-4 mr-2" />
                )}
                कार्यकर्ता नोंदणी
                {!isLoading && <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />}
              </Button>
             
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Pushed lower */}
      <section className="py-8 sm:py-12 bg-white mt-8 sm:mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2 px-4">वैशिष्ट्ये</h2>
            <p className="text-xs sm:text-sm text-gray-600 px-4">सुरक्षित, जलद आणि सोपी मतदार नोंदणी</p>
          </div>
          
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-3">
            <Card className="text-center hover:shadow-lg transition-all duration-300 group border-0 shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader className="pb-1 pt-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-1 shadow-sm">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <CardTitle className="text-xs sm:text-sm font-medium">सुरक्षित आणि खाजगी</CardTitle>
                <CardDescription className="text-gray-600 text-xs px-1 leading-tight">
                  तुमची वैयक्तिक माहिती पूर्ण सुरक्षित आहे
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 pb-2">
                <ul className="text-xs text-gray-600 space-y-0.5">
                  <li className="flex items-center justify-center">
                    <CheckCircle className="w-2.5 h-2.5 text-green-500 mr-1 flex-shrink-0" />
                    <span className="text-xs">संपूर्ण डेटा सुरक्षा</span>
                  </li>
                  <li className="flex items-center justify-center">
                    <CheckCircle className="w-2.5 h-2.5 text-green-500 mr-1 flex-shrink-0" />
                    <span className="text-xs">माहितीची गोपनीयता</span>
                  </li>
                  <li className="flex items-center justify-center">
                    <CheckCircle className="w-2.5 h-2.5 text-green-500 mr-1 flex-shrink-0" />
                    <span className="text-xs">नियमित सुरक्षा तपासणी</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 group border-0 shadow-sm bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader className="pb-1 pt-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-1 shadow-sm">
                  <Vote className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <CardTitle className="text-xs sm:text-sm font-medium">सोपी नोंदणी</CardTitle>
                <CardDescription className="text-gray-600 text-xs px-1 leading-tight">
                  फक्त काही मिनिटांत फॉर्म भरा
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 pb-2">
                <ul className="text-xs text-gray-600 space-y-0.5">
                  <li className="flex items-center justify-center">
                    <CheckCircle className="w-2.5 h-2.5 text-green-500 mr-1 flex-shrink-0" />
                    <span className="text-xs">मोबाईल फ्रेंडली डिझाइन</span>
                  </li>
                  <li className="flex items-center justify-center">
                    <CheckCircle className="w-2.5 h-2.5 text-green-500 mr-1 flex-shrink-0" />
                    <span className="text-xs">पायरीपायरी मार्गदर्शन</span>
                  </li>
                  <li className="flex items-center justify-center">
                    <CheckCircle className="w-2.5 h-2.5 text-green-500 mr-1 flex-shrink-0" />
                    <span className="text-xs">त्वरित पुष्टीकरण</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 group border-0 shadow-sm bg-gradient-to-br from-orange-50 to-amber-50">
              <CardHeader className="pb-1 pt-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-1 shadow-sm">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <CardTitle className="text-xs sm:text-sm font-medium">टीम व्यवस्थापन</CardTitle>
                <CardDescription className="text-gray-600 text-xs px-1 leading-tight">
                  आमच्या टीममध्ये सामील व्हा आणि मदत करा
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 pb-2">
                <ul className="text-xs text-gray-600 space-y-0.5">
                  <li className="flex items-center justify-center">
                    <CheckCircle className="w-2.5 h-2.5 text-green-500 mr-1 flex-shrink-0" />
                    <span className="text-xs">भूमिका-आधारित प्रवेश</span>
                  </li>
                  <li className="flex items-center justify-center">
                    <CheckCircle className="w-2.5 h-2.5 text-green-500 mr-1 flex-shrink-0" />
                    <span className="text-xs">रिअल-टाइम अहवाल</span>
                  </li>
                  <li className="flex items-center justify-center">
                    <CheckCircle className="w-2.5 h-2.5 text-green-500 mr-1 flex-shrink-0" />
                    <span className="text-xs">व्हाट्सअॅप सूचना</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section - Compact mobile design */}
      <section className="py-8 sm:py-12 bg-gradient-to-r from-orange-500 to-green-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-orange-500/90 to-green-600/90"></div>
          <div className="absolute top-5 right-5 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-5 left-5 w-20 h-20 sm:w-24 sm:h-24 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">
            सुरुवात करण्यास तयार आहात?
          </h2>
          <p className="text-sm sm:text-base text-orange-100 mb-4 sm:mb-6 px-2">
            तुमचा मार्ग निवडा आणि मजबूत लोकशाही निर्माण करण्यात सहभागी व्हा
          </p>
          <div className="flex flex-col gap-2 sm:gap-3 justify-center max-w-sm sm:max-w-none mx-auto">
            <Button 
              size="lg" 
              variant="secondary" 
              onClick={() => handleNavigation('/student', 'student')}
              disabled={isLoading}
              className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 group bg-white text-orange-600 hover:bg-orange-50 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading && loadingType === 'student' ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Vote className="w-4 h-4 mr-2" />
              )}
              मतदार नोंदणी करा
              {!isLoading && <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />}
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => handleNavigation('/karykarta-portal', 'karykarta')}
              disabled={isLoading}
              className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base border-2 border-white text-white hover:bg-white hover:text-orange-600 transition-all duration-300 group shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading && loadingType === 'karykarta' ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <UserPlus className="w-4 h-4 mr-2" />
              )}
              <span className="hidden sm:inline">आमच्या टीममध्ये सामील व्हा</span>
              <span className="sm:hidden">टीममध्ये सामील व्हा</span>
              {!isLoading && <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />}
            </Button>
          </div>
        </div>
      </section>

      {/* Footer - Compact mobile design */}
      <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-6 sm:py-8 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900/95 to-gray-800/95"></div>
          <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-orange-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 bg-green-500/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-3 sm:mb-4 group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-green-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                <Vote className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="text-base sm:text-lg font-bold">भाजप निवडणूक व्यवस्थापन</span>
            </div>
            <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base px-4">
              तंत्रज्ञानाद्वारे लोकशाही सशक्त करत आहोत
            </p>
            
            <div className="mt-4 sm:mt-6 pt-4 border-t border-gray-700 text-xs text-gray-400 px-4">
              © 2024 भारतीय जनता पक्ष. सर्व हक्क राखीव.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}