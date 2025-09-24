"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import Script from "next/script"

export default function StudentOnboardingPage() {
  const lottieRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Create the Lottie element after the script loads
    const createLottieElement = () => {
      if (lottieRef.current && typeof window !== 'undefined') {
        const dotlottieElement = document.createElement('dotlottie-wc')
        dotlottieElement.setAttribute('src', 'https://lottie.host/03f1347f-1812-4089-85fb-d31db9016bd4/h6tyzip8Zw.lottie')
        dotlottieElement.setAttribute('style', 'width: 300px; height: 300px')
        dotlottieElement.setAttribute('autoplay', '')
        dotlottieElement.setAttribute('loop', '')
        
        lottieRef.current.appendChild(dotlottieElement)
      }
    }

    // Wait for the script to load
    const timer = setTimeout(createLottieElement, 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <Script 
        src="https://unpkg.com/@lottiefiles/dotlottie-wc@0.8.1/dist/dotlottie-wc.js" 
        type="module" 
      />
      <div className="min-h-screen relative overflow-hidden" style={{backgroundImage: 'linear-gradient(-225deg, #5D9FFF 0%, #B8DCFF 30%,rgb(103, 117, 128) 60%,rgb(155, 144, 144) 80%, #E0E0E0 100%)', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed'}}>
        {/* Lottie animation positioned in the middle */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-32 flex items-center justify-center px-8">
          <div className="relative w-full max-w-sm h-24 flex items-center justify-center">
            <div ref={lottieRef} className="flex items-center justify-center" />
          </div>
        </div>

        {/* Main content positioned at bottom */}
        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 pb-8 sm:pb-12 lg:pb-16">
          <div className="max-w-2xl mx-auto">
            {/* Gradient background behind text container */}
            <div className="relative">
              {/* Subtle gradient behind text container */}
              <div className="absolute inset-x-0 bottom-0 h-32 sm:h-40 lg:h-48 bg-gradient-to-t from-white/40 via-white/20 to-transparent rounded-b-3xl -z-10 backdrop-blur-sm"></div>
              
              {/* Lottie animation positioned above text container */}
              <div className="flex items-center justify-center mb-8 sm:mb-12">
                <div className="relative w-full max-w-sm h-24 flex items-center justify-center">
                  <div ref={lottieRef} className="flex items-center justify-center" />
                </div>
              </div>
              
              {/* Card container */}
              <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-12 border border-gray-100 relative z-10">
              {/* Main heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-gray-900 leading-tight mb-6 sm:mb-8 text-center">
                <span className="block bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  Get Your ID Created
                </span>
              </h1>
              
              {/* Subtitle */}
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 sm:mb-12 leading-relaxed text-center font-medium max-w-3xl mx-auto">
                Fill out the form below to register and receive your official ID. Make sure your details are accurate for a smooth verification process.
              </p>
              
              {/* Registration button */}
              <div className="text-center">
                <Link href="/team#registration-form">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-8 sm:px-12 py-4 sm:py-5 text-lg sm:text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group w-full sm:w-auto min-w-[250px] sm:min-w-[300px]"
                  >
                    <span className="flex items-center justify-center gap-3">
                      Start Registration
                      <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </Button>
                </Link>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}