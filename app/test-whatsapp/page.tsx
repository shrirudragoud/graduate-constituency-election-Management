"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle, MessageSquare, FileText } from "lucide-react"

export default function WhatsAppTestPage() {
  const [phoneNumber, setPhoneNumber] = useState("8700546080")
  const [testType, setTestType] = useState("message")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [config, setConfig] = useState<any>(null)

  const testWhatsApp = async () => {
    setLoading(true)
    setResult(null)
    
    try {
      const response = await fetch('/api/test-whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, testType })
      })
      
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ success: false, error: 'Test failed: ' + error })
    } finally {
      setLoading(false)
    }
  }

  const checkConfig = async () => {
    try {
      const response = await fetch('/api/test-whatsapp')
      const data = await response.json()
      setConfig(data)
    } catch (error) {
      console.error('Config check failed:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">WhatsApp Integration Test</h1>
          <p className="text-gray-600">Test and debug WhatsApp messaging functionality</p>
        </div>

        {/* Configuration Check */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Twilio Configuration
            </CardTitle>
            <CardDescription>Check your Twilio WhatsApp setup</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={checkConfig} className="mb-4">
              Check Configuration
            </Button>
            
            {config && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Account SID:</span>
                  <Badge variant={config.config.accountSid ? "default" : "destructive"}>
                    {config.config.accountSid ? "✅ Set" : "❌ Missing"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Auth Token:</span>
                  <Badge variant={config.config.authToken ? "default" : "destructive"}>
                    {config.config.authToken ? "✅ Set" : "❌ Missing"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">WhatsApp Number:</span>
                  <Badge variant={config.config.whatsappNumber ? "default" : "destructive"}>
                    {config.config.whatsappNumber ? "✅ Set" : "❌ Missing"}
                  </Badge>
                </div>
                
                {config.config.issues.length > 0 && (
                  <Alert className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Issues found:</strong>
                      <ul className="list-disc list-inside mt-2">
                        {config.config.issues.map((issue: string, index: number) => (
                          <li key={index}>{issue}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Test Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Send Test Message
            </CardTitle>
            <CardDescription>Test WhatsApp message sending to a phone number</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <Input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="8700546080"
                className="mb-2"
              />
              <p className="text-xs text-gray-500">
                Enter phone number without country code (will add +91 automatically)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Test Type</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="message"
                    checked={testType === "message"}
                    onChange={(e) => setTestType(e.target.value)}
                  />
                  <span>Text Message</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="pdf"
                    checked={testType === "pdf"}
                    onChange={(e) => setTestType(e.target.value)}
                  />
                  <span>PDF Attachment</span>
                </label>
              </div>
            </div>

            <Button 
              onClick={testWhatsApp} 
              disabled={loading}
              className="w-full"
            >
              {loading ? "Sending..." : "Send Test Message"}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {result.success ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                Test Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Status:</span>
                  <Badge variant={result.success ? "default" : "destructive"}>
                    {result.success ? "Success" : "Failed"}
                  </Badge>
                </div>

                {result.result?.messageId && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Message ID:</span>
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                      {result.result.messageId}
                    </code>
                  </div>
                )}

                {result.result?.error && (
                  <Alert>
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Error:</strong> {result.result.error}
                    </AlertDescription>
                  </Alert>
                )}

                <div>
                  <h4 className="font-medium mb-2">Details:</h4>
                  <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                    {JSON.stringify(result.result?.details, null, 2)}
                  </pre>
                </div>

                {result.instructions && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <div dangerouslySetInnerHTML={{ 
                        __html: result.instructions.replace(/\n/g, '<br>') 
                      }} />
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Troubleshooting Guide
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Common Issues:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><strong>No message received:</strong> Check if you're using Twilio sandbox mode</li>
                <li><strong>Invalid phone number:</strong> Ensure number is in correct format</li>
                <li><strong>Sandbox mode:</strong> Recipient must send a message to sandbox number first</li>
                <li><strong>Rate limiting:</strong> Wait a few minutes between tests</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">For Production:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Apply for WhatsApp Business API approval</li>
                <li>Use your own WhatsApp Business number</li>
                <li>No join code required for production</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
