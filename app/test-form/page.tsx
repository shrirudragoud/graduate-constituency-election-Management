"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestFormPage() {
  const [mobileNumber, setMobileNumber] = useState("")
  const [aadhaarNumber, setAadhaarNumber] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const checkDuplicates = async () => {
    if (!mobileNumber || !aadhaarNumber) {
      alert("Please enter both mobile number and Aadhaar number")
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/public/test-duplicates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber, aadhaarNumber })
      })
      
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Error checking duplicates:', error)
      alert('Error checking duplicates')
    } finally {
      setLoading(false)
    }
  }

  const testSubmission = async () => {
    const formData = new FormData()
    formData.append('surname', 'Test')
    formData.append('firstName', 'User')
    formData.append('fathersHusbandName', 'Test Father')
    formData.append('sex', 'M')
    formData.append('dateOfBirth', '1990-01-01')
    formData.append('ageYears', '34')
    formData.append('ageMonths', '0')
    formData.append('district', 'Test District')
    formData.append('taluka', 'Test Taluka')
    formData.append('villageName', 'Test Village')
    formData.append('houseNo', '123')
    formData.append('street', 'Test Street')
    formData.append('pinCode', '123456')
    formData.append('mobileNumber', mobileNumber || '9876543210')
    formData.append('aadhaarNumber', aadhaarNumber || '123456789012')
    formData.append('yearOfPassing', '2020')
    formData.append('degreeDiploma', 'B.Tech')
    formData.append('nameOfUniversity', 'Test University')
    formData.append('place', 'Test Place')
    formData.append('declarationDate', '2024-01-01')

    setLoading(true)
    try {
      const response = await fetch('/api/public/submit-form', {
        method: 'POST',
        body: formData
      })
      
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Error submitting form')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Test Form Submission</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input
                id="mobile"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="9876543210"
              />
            </div>
            
            <div>
              <Label htmlFor="aadhaar">Aadhaar Number</Label>
              <Input
                id="aadhaar"
                value={aadhaarNumber}
                onChange={(e) => setAadhaarNumber(e.target.value)}
                placeholder="123456789012"
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={checkDuplicates} disabled={loading}>
                {loading ? 'Checking...' : 'Check Duplicates'}
              </Button>
              <Button onClick={testSubmission} disabled={loading} variant="outline">
                {loading ? 'Submitting...' : 'Test Submission'}
              </Button>
            </div>
            
            {result && (
              <div className="mt-4 p-4 bg-gray-100 rounded">
                <h3 className="font-bold mb-2">Result:</h3>
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
