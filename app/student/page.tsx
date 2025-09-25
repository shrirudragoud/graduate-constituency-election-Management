"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { SimpleStudentForm } from "@/components/forms/simple-student-form"

export default function StudentOnboardingPage() {
  const [showAddStudentForm, setShowAddStudentForm] = useState(false)
  const [showThankYou, setShowThankYou] = useState(false)
  const [submissionId, setSubmissionId] = useState("")

  return (
    <>
      <div className="min-h-screen relative overflow-hidden" style={{backgroundImage: 'linear-gradient(135deg, #F37115 0%,rgb(240, 238, 238) 25%, #00A34E 50%, #FFFFFF 75%, #494849 100%)', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed'}}>
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
      <SimpleStudentForm 
        open={showAddStudentForm} 
        onOpenChange={setShowAddStudentForm}
        onSubmissionSuccess={(id) => {
          setSubmissionId(id)
          setShowThankYou(true)
        }}
      />

      {/* Thank You Modal - Positioned on Student Page */}
      {showThankYou && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-green-600 mb-4">Registration Successful!</h2>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">
              Your registration has been submitted successfully.
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mb-6 font-mono bg-gray-100 p-2 rounded break-all">
              Registration ID: {submissionId}
            </p>
            <Button 
              onClick={() => {
                setShowThankYou(false)
                setSubmissionId("")
              }} 
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </>
  )
}