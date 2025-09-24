"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { AddStudentForm } from "@/components/forms/add-student-form"

export default function StudentOnboardingPage() {
  const [showAddStudentForm, setShowAddStudentForm] = useState(false)

  return (
    <>
      <div className="min-h-screen relative overflow-hidden" style={{backgroundImage: 'linear-gradient(135deg, #F37115 0%,rgb(240, 238, 238) 25%, #00A34E 50%, #FFFFFF 75%, #494849 100%)', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed'}}>
        {/* Logo text at the top */}
        <div className="absolute top-8 left-8 z-20">
          <h1 className="text-3xl sm:text-4xl font-black text-white drop-shadow-2xl" style={{fontFamily: 'Arial Black, sans-serif', textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>
          Bharatiya Janata Party
          </h1>
        </div>

        {/* Main content positioned at bottom */}
        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 pb-8 sm:pb-12 lg:pb-16">
          <div className="max-w-2xl mx-auto">
            {/* SVG Animation positioned above text card */}
            <div className="flex items-center justify-center mb-8 sm:mb-12">
              <div className="relative w-full max-w-lg h-32 sm:h-35 flex items-center justify-center">
                <img 
                  src="https://static.wixstatic.com/shapes/e58508_1d4ceb05d3aa44909cee00ba4f910f30.svg" 
                  alt="Student Registration Animation"
                  className="w-full h-full object-contain filter drop-shadow-lg"
                />
              </div>
            </div>

            {/* Gradient background behind text container */}
            <div className="relative">
              {/* Subtle gradient behind text container */}
              <div className="absolute inset-x-0 bottom-0 h-32 sm:h-40 lg:h-48 bg-gradient-to-t from-white/40 via-white/20 to-transparent rounded-b-3xl -z-10 backdrop-blur-sm"></div>
              
              {/* Card container */}
              <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-12 border border-gray-100 relative z-10">
              {/* Main heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-gray-900 leading-tight mb-6 sm:mb-8 text-center">
                <span className="block bg-gradient-to-r from-orange-500 via-green-600 to-gray-800 bg-clip-text text-transparent">
                Voter ID Register
                </span>
              </h1>
              
              {/* Subtitle */}
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 sm:mb-12 leading-relaxed text-center font-medium max-w-3xl mx-auto">
              </p>
              
              {/* Registration button */}
              <div className="text-center">
                <Button 
                  onClick={() => setShowAddStudentForm(true)}
                  size="lg" 
                  className="bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700 text-white px-8 sm:px-12 py-4 sm:py-5 text-lg sm:text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group w-full sm:w-auto min-w-[250px] sm:min-w-[300px]"
                >
                  <span className="flex items-center justify-center gap-3">
                    Start Registration
                    <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Button>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Student Form Dialog */}
      <AddStudentForm 
        open={showAddStudentForm} 
        onOpenChange={setShowAddStudentForm} 
      />
    </>
  )
}