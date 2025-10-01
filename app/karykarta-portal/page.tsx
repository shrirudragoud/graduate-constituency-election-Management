"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Users, LogIn, UserPlus } from "lucide-react"
import Link from "next/link"

export default function KarykartaPortalPage() {
  return (
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
      {/* Logo text at the top */}
      <div className="absolute top-4 sm:top-6 left-4 sm:left-8 z-20">
        <div className="bg-gradient-to-r from-orange-500/90 to-green-600/90 backdrop-blur-sm rounded-2xl px-4 sm:px-6 py-3 sm:py-4 border border-white/30 shadow-2xl">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
            <span className="block text-sm sm:text-base font-medium text-white/95 mb-1 drop-shadow-lg">
              भारतीय जनता पार्टी
            </span>
            <span className="block font-black text-white drop-shadow-lg">
              Bharatiya Janata Party
            </span>
          </h1>
        </div>
      </div>

      {/* Back Button */}
      <div className="absolute top-4 sm:top-6 right-4 sm:right-8 z-20">
        <Link href="/student">
          <Button
            variant="outline"
            className="bg-white/90 backdrop-blur-sm rounded-2xl px-4 sm:px-6 py-3 sm:py-4 border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
          >
            <span className="text-sm sm:text-base font-bold text-gray-700 drop-shadow-lg">
              ← Back
            </span>
          </Button>
        </Link>
      </div>

      {/* Main content positioned at center */}
      <div className="flex items-start justify-center min-h-screen px-4 sm:px-8 pt-32 sm:pt-36 lg:pt-40 pb-16">
        <div className="max-w-6xl mx-auto w-full">
          {/* Main Card Container */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-10 lg:p-16">
            {/* Main heading */}
            <div className="text-center mb-8 sm:mb-12">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-gray-900 leading-tight mb-4 sm:mb-6">
                <span className="block bg-gradient-to-r from-orange-500 via-green-600 to-gray-800 bg-clip-text text-transparent">
                  Karykarta Portal
                </span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed font-medium max-w-2xl mx-auto">
                Welcome to the BJP Karykarta Portal. Choose your option below to continue.
              </p>
            </div>

            {/* Options Buttons - Mobile Friendly */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 max-w-4xl mx-auto mb-8 sm:mb-12">
              {/* Login Button */}
              <div className="flex-1">
                <Link href="/team/login">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group w-full h-20 sm:h-24 flex items-center justify-center gap-3 sm:gap-4 border border-blue-400/30"
                  >
                    <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
                    <div className="text-center">
                      <div className="font-bold">आधीपासून सदस्य आहात?</div>
                      <div className="text-xs opacity-90 hidden sm:block">
                        तुमच्या खात्यात लॉगिन करा आणि तुमचं प्रोफाइल वर जा
                      </div>
                    </div>
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </Link>
              </div>

              {/* Join Button */}
              <div className="flex-1">
                <Link href="/team-signup">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group w-full h-20 sm:h-24 flex items-center justify-center gap-3 sm:gap-4 border border-green-400/30"
                  >
                    <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                    <div className="text-center">
                      <div className="font-bold">नवीन सदस्य</div>
                      <div className="text-xs opacity-90 hidden sm:block">
                        नवीन खाते तयार करा आणि आमच्या कम्युनिटीचा भाग बना. नोंदणी सुरू करा.
                      </div>
                    </div>
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Additional Info Card */}
            <div className="bg-gradient-to-r from-orange-50 to-green-50 rounded-2xl p-6 sm:p-8 border border-orange-200/50 shadow-lg">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-green-500 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Become a Karykarta
                </h3>
              </div>
              <p className="text-gray-700 text-sm sm:text-base lg:text-lg leading-relaxed text-center max-w-3xl mx-auto">
                Join our dedicated team of volunteers and contribute to the development of our nation.
                As a Karykarta, you'll have access to exclusive resources and opportunities to serve the
                community.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
