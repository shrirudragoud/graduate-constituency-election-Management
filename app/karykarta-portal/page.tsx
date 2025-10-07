"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Users, LogIn, UserPlus, Loader2 } from "lucide-react"
import Link from "next/link"

export default function KarykartaPortalPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingType, setLoadingType] = useState<string | null>(null)
  const router = useRouter()

  const handleNavigation = (path: string, type: string) => {
    setIsLoading(true)
    setLoadingType(type)
    
    // Small delay to show loading animation
    setTimeout(() => {
      router.push(path)
    }, 500)
  }
  return (
    <>
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-2xl text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-orange-500" />
            <p className="text-lg font-semibold text-gray-800">
              {loadingType === 'login' ? 'लॉगिन पेज लोड होत आहे...' : 
               loadingType === 'signup' ? 'साइनअप पेज लोड होत आहे...' : 
               loadingType === 'back' ? 'मागे जात आहे...' :
               'लोड होत आहे...'}
            </p>
          </div>
        </div>
      )}

      {/* Loading Progress Bar */}
      {isLoading && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-orange-500 z-50">
          <div className="h-full bg-gradient-to-r from-orange-500 to-green-500 animate-pulse"></div>
        </div>
      )}

      <div
        className="min-h-screen relative overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(135deg, #F37115 0%,rgb(240, 238, 238) 25%, #00A34E 50%, #FFFFFF 75%, #494849 100%)",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
      {/* Header with Logo and Back Button */}
      <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 z-20 flex items-center justify-between">
        {/* Logo */}
        <div className="bg-gradient-to-r from-orange-500/90 to-green-600/90 backdrop-blur-sm rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 border border-white/30 shadow-xl">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold leading-tight">
            <span className="block text-xs sm:text-sm font-medium text-white/95 mb-0.5 drop-shadow-lg">
              भारतीय जनता पार्टी
            </span>
            <span className="block font-black text-white drop-shadow-lg text-sm sm:text-base">
              BJP
            </span>
          </h1>
        </div>

        {/* Back Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleNavigation('/student', 'back')}
          disabled={isLoading}
          className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loadingType === 'back' ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : null}
          <span className="text-sm sm:text-base font-bold text-gray-700 drop-shadow-lg">
            ← Back
          </span>
        </Button>
      </div>

      {/* Main content positioned at center */}
      <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
        <div className="w-full max-w-md sm:max-w-lg lg:max-w-2xl xl:max-w-4xl">
          {/* Main Card Container */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 p-4 sm:p-6 lg:p-8">
            {/* Main heading */}
            <div className="text-center mb-6 sm:mb-8 lg:mb-10">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-gray-900 leading-tight mb-3 sm:mb-4">
                <span className="block bg-gradient-to-r from-orange-500 via-green-600 to-gray-800 bg-clip-text text-transparent">
                कार्यकर्ता साइन अप / लॉगिन
                </span>
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-4 sm:mb-6 leading-relaxed font-medium max-w-xl mx-auto">
              पदविधार पोर्टलमध्ये आपले स्वागत आहे. पुढे जाण्यासाठी खालील पर्याय निवडा.
              </p>
            </div>

            {/* Options Buttons - Mobile Optimized */}
            <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
              {/* Login Button */}
              <Button
                size="lg"
                onClick={() => handleNavigation('/team/login', 'login')}
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 sm:px-6 py-4 sm:py-5 text-sm sm:text-base font-bold rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] group w-full h-auto min-h-[60px] sm:min-h-[70px] flex items-center justify-between gap-3 border border-blue-400/30 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  {loadingType === 'login' ? (
                    <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 animate-spin" />
                  ) : (
                    <LogIn className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                  )}
                  <div className="text-left">
                    <div className="font-bold text-sm sm:text-base">आधीपासून सदस्य आहात?</div>
                    <div className="text-xs opacity-90 hidden sm:block">
                      तुमच्या खात्यात लॉगिन करा
                    </div>
                  </div>
                </div>
                {loadingType !== 'login' && (
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0" />
                )}
              </Button>

              {/* Join Button */}
              <Button
                size="lg"
                onClick={() => handleNavigation('/team-signup', 'signup')}
                disabled={isLoading}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 sm:px-6 py-4 sm:py-5 text-sm sm:text-base font-bold rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] group w-full h-auto min-h-[60px] sm:min-h-[70px] flex items-center justify-between gap-3 border border-green-400/30 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  {loadingType === 'signup' ? (
                    <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 animate-spin" />
                  ) : (
                    <UserPlus className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                  )}
                  <div className="text-left">
                    <div className="font-bold text-sm sm:text-base">नवीन सदस्य</div>
                    <div className="text-xs opacity-90 hidden sm:block">
                      नवीन खाते तयार करा
                    </div>
                  </div>
                </div>
                {loadingType !== 'signup' && (
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0" />
                )}
              </Button>
            </div>

            {/* Additional Info Card */}
            <div className="bg-gradient-to-r from-orange-50 to-green-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-orange-200/50 shadow-md">
              <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-orange-500 to-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                कार्यकर्ता बना
                </h3>
              </div>
              <p className="text-gray-700 text-xs sm:text-sm lg:text-base leading-relaxed text-center">
              आमच्या कार्यकर्त्यांच्या टीममध्ये सामील व्हा आणि राष्ट्राच्या विकासात आपला हातभार लावा. कार्यकर्ता म्हणून, तुम्हाला विशेष साधनसामग्री आणि समाजसेवेच्या संधी उपलब्ध होतील.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
