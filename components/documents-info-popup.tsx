"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Camera, CreditCard, GraduationCap, FileImage, CheckCircle, X, Clock } from "lucide-react"

interface DocumentsInfoPopupProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onProceed: () => void
}

export function DocumentsInfoPopup({ open, onOpenChange, onProceed }: DocumentsInfoPopupProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false)
  const [countdown, setCountdown] = useState(4)
  const [isAutoProceeding, setIsAutoProceeding] = useState(false)

  // Load user preference on mount
  useEffect(() => {
    const savedPreference = localStorage.getItem('hideDocumentsInfo')
    if (savedPreference === 'true') {
      setDontShowAgain(true)
    }
  }, [])

  // Auto-proceed countdown
  useEffect(() => {
    if (!open) return

    setIsAutoProceeding(true)
    setCountdown(4)

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleProceed()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [open])

  const handleProceed = () => {
    if (dontShowAgain) {
      localStorage.setItem('hideDocumentsInfo', 'true')
    } else {
      localStorage.removeItem('hideDocumentsInfo')
    }
    onProceed()
    onOpenChange(false)
  }

  const documents = [
    { icon: Camera, title: "पासपोर्ट साईज फोटो" },
    { icon: FileText, title: "पत्त्याचा पुरावा" },
    { icon: CreditCard, title: "आधार कार्ड" },
    { icon: GraduationCap, title: "पदवी प्रमाणपत्र" },
    { icon: FileImage, title: "नाव बदलले असल्यास पुरावा" }
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm sm:max-w-md mx-4 max-h-[85vh] overflow-y-auto">
        <DialogHeader className="relative pb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="absolute right-0 top-0 h-6 w-6 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
          <DialogTitle className="text-center text-lg font-bold text-orange-600 pr-6">
            आवश्यक दस्तऐवज
          </DialogTitle>
          <p className="text-center text-gray-600 text-xs">
            फाइल 5MB पेक्षा जास्त नसावी
          </p>
        </DialogHeader>

        <div className="space-y-3">
          {/* Compact documents list */}
          <div className="bg-gradient-to-r from-orange-50 to-green-50 p-3 rounded-lg border border-orange-200">
            <div className="space-y-2">
              {documents.map((doc, index) => {
                const Icon = doc.icon
                return (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon className="w-3 h-3 text-orange-600" />
                    </div>
                    <span className="text-orange-600 font-semibold">{index + 1}.</span>
                    <span className="text-gray-700 flex-1">{doc.title}</span>
                    <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                  </div>
                )
              })}
            </div>
          </div>

          {/* Compact info box */}
          <div className="bg-blue-50 p-2 rounded-lg border border-blue-200">
            <div className="flex items-start gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">i</span>
              </div>
              <div className="text-xs text-blue-700">
                <p className="font-medium mb-1">JPG, PNG, PDF फॉरमॅट</p>
                <p>स्पष्ट आणि वैध दस्तऐवज</p>
              </div>
            </div>
          </div>

          {/* Don't show again checkbox */}
          <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
            <Checkbox
              id="dontShowAgain"
              checked={dontShowAgain}
              onCheckedChange={(checked) => setDontShowAgain(checked as boolean)}
              className="h-4 w-4"
            />
            <label
              htmlFor="dontShowAgain"
              className="text-xs text-gray-700 cursor-pointer"
            >
              पुढील वेळी दाखवू नकोस
            </label>
          </div>
        </div>

        <div className="flex gap-2 pt-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 h-8 text-xs"
          >
            रद्द करा
          </Button>
          <Button
            onClick={handleProceed}
            className="flex-1 h-8 text-xs bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700 text-white relative"
          >
            {isAutoProceeding ? (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{countdown}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                <span>पुढे जा</span>
              </div>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
