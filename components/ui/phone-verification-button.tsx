"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, ExternalLink } from "lucide-react"

interface PhoneVerificationButtonProps {
  phoneNumber: string
  className?: string
}

export function PhoneVerificationButton({ phoneNumber, className = "" }: PhoneVerificationButtonProps) {
  const [isVerified, setIsVerified] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)

  const handleVerify = () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      alert("Please enter a valid 10-digit phone number first")
      return
    }

    setIsVerifying(true)
    
    // Open WhatsApp verification link in new tab
    const verificationUrl = "https://wa.link/1d22el"
    window.open(verificationUrl, "_blank")
    
    // Show verified status after 4 seconds
    setTimeout(() => {
      setIsVerified(true)
      setIsVerifying(false)
    }, 4000)
  }

  if (isVerified) {
    return (
      <div className={`flex items-center gap-2 text-green-600 ${className}`}>
        <CheckCircle className="w-4 h-4" />
        <span className="text-sm font-medium">Verified</span>
      </div>
    )
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleVerify}
      disabled={isVerifying || !phoneNumber || phoneNumber.length !== 10}
      className={`flex items-center gap-2 text-xs ${className}`}
    >
      <ExternalLink className="w-3 h-3" />
      {isVerifying ? "Verifying..." : "Verify"}
    </Button>
  )
}
