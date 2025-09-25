"use client"

import { SidebarLayout } from "@/components/sidebar-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { 
  Settings, 
  Shield, 
  Users, 
  Bell, 
  Database, 
  Globe, 
  Key, 
  Mail, 
  FileText, 
  Palette,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Upload
} from "lucide-react"
import { useState } from "react"

const systemSettings = [
  {
    id: "general",
    title: "General Settings",
    description: "Basic platform configuration and preferences",
    icon: Settings,
    color: "chart-1",
    settings: [
      {
        name: "Platform Name",
        value: "Voter Registor",
        type: "text",
        description: "The name displayed throughout the platform"
      },
      {
        name: "Default Language",
        value: "English",
        type: "select",
        description: "Primary language for the platform interface",
        options: ["English", "Spanish", "French", "German"]
      },
      {
        name: "Time Zone",
        value: "UTC-5 (EST)",
        type: "select",
        description: "Default time zone for all operations",
        options: ["UTC-5 (EST)", "UTC-6 (CST)", "UTC-7 (MST)", "UTC-8 (PST)"]
      },
      {
        name: "Maintenance Mode",
        value: false,
        type: "switch",
        description: "Enable maintenance mode to restrict access"
      }
    ]
  },
  {
    id: "security",
    title: "Security Settings",
    description: "Authentication, authorization, and security policies",
    icon: Shield,
    color: "chart-2",
    settings: [
      {
        name: "Two-Factor Authentication",
        value: true,
        type: "switch",
        description: "Require 2FA for all admin accounts"
      },
      {
        name: "Session Timeout",
        value: "30 minutes",
        type: "select",
        description: "Automatic logout after inactivity",
        options: ["15 minutes", "30 minutes", "1 hour", "2 hours"]
      },
      {
        name: "Password Policy",
        value: "Strong",
        type: "select",
        description: "Password complexity requirements",
        options: ["Basic", "Strong", "Very Strong"]
      },
      {
        name: "Login Attempts",
        value: "5",
        type: "text",
        description: "Maximum failed login attempts before lockout"
      }
    ]
  },
  {
    id: "notifications",
    title: "Notification Settings",
    description: "Email, SMS, and system notification preferences",
    icon: Bell,
    color: "chart-3",
    settings: [
      {
        name: "Email Notifications",
        value: true,
        type: "switch",
        description: "Send email notifications for important events"
      },
      {
        name: "Email Notifications",
        value: false,
        type: "switch",
        description: "Send SMS notifications for critical alerts"
      },
      {
        name: "Notification Frequency",
        value: "Immediate",
        type: "select",
        description: "How often to send notifications",
        options: ["Immediate", "Hourly", "Daily", "Weekly"]
      },
      {
        name: "Admin Email",
        value: "admin@electionenroll.com",
        type: "text",
        description: "Primary email for system notifications"
      }
    ]
  },
  {
    id: "data",
    title: "Data Management",
    description: "Database, storage, and data retention policies",
    icon: Database,
    color: "chart-4",
    settings: [
      {
        name: "Data Retention Period",
        value: "2 years",
        type: "select",
        description: "How long to keep student data after graduation",
        options: ["1 year", "2 years", "5 years", "Indefinitely"]
      },
      {
        name: "Auto Backup",
        value: true,
        type: "switch",
        description: "Automatically backup data daily"
      },
      {
        name: "Backup Location",
        value: "Cloud Storage",
        type: "select",
        description: "Where to store data backups",
        options: ["Local Server", "Cloud Storage", "Both"]
      },
      {
        name: "Data Encryption",
        value: true,
        type: "switch",
        description: "Encrypt sensitive data at rest"
      }
    ]
  }
]

const recentChanges = [
  {
    id: 1,
    setting: "Two-Factor Authentication",
    action: "Enabled",
    user: "Sarah Johnson",
    time: "2 hours ago",
    status: "success"
  },
  {
    id: 2,
    setting: "Session Timeout",
    action: "Changed to 30 minutes",
    user: "Michael Chen",
    time: "1 day ago",
    status: "success"
  },
  {
    id: 3,
    setting: "Email Notifications",
    action: "Disabled",
    user: "Admin System",
    time: "3 days ago",
    status: "warning"
  },
  {
    id: 4,
    setting: "Data Retention Period",
    action: "Updated to 2 years",
    user: "Emily Rodriguez",
    time: "1 week ago",
    status: "success"
  }
]

export default function SettingsPage() {
  const [hasChanges, setHasChanges] = useState(false)

  return (
    <SidebarLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">System Settings</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Configure platform settings, security policies, and system preferences. (Admin Only)
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" className="text-xs sm:text-sm h-8 sm:h-9">
              <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Reset to Default</span>
            </Button>
            <Button 
              className={`text-xs sm:text-sm h-8 sm:h-9 ${hasChanges ? 'bg-chart-1' : ''}`}
              disabled={!hasChanges}
            >
              <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Save Changes</span>
              <span className="sm:hidden">Save</span>
            </Button>
          </div>
        </div>

        {/* System Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <Card className="border-chart-1/20 bg-gradient-to-br from-background to-chart-1/5">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">System Status</p>
                  <p className="text-xl sm:text-2xl font-bold text-chart-1">Healthy</p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-chart-1/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-chart-1" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-1 sm:mt-2">
                <span className="text-[10px] sm:text-xs text-chart-1">All systems operational</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-chart-2/20 bg-gradient-to-br from-background to-chart-2/5">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Security Level</p>
                  <p className="text-xl sm:text-2xl font-bold text-chart-2">High</p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-chart-2/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-chart-2" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-1 sm:mt-2">
                <span className="text-[10px] sm:text-xs text-chart-2">2FA enabled</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-chart-3/20 bg-gradient-to-br from-background to-chart-3/5">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Last Backup</p>
                  <p className="text-xl sm:text-2xl font-bold text-chart-3">2h ago</p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-chart-3/20 rounded-lg flex items-center justify-center">
                  <Database className="w-4 h-4 sm:w-5 sm:h-5 text-chart-3" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-1 sm:mt-2">
                <span className="text-[10px] sm:text-xs text-chart-3">Auto backup active</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-chart-4/20 bg-gradient-to-br from-background to-chart-4/5">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Active Users</p>
                  <p className="text-xl sm:text-2xl font-bold text-chart-4">24</p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-chart-4/20 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-chart-4" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-1 sm:mt-2">
                <span className="text-[10px] sm:text-xs text-chart-4">3 online now</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="general" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-10 sm:h-12 bg-muted">
            <TabsTrigger value="general" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-1 sm:px-3">
              <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">General</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-1 sm:px-3">
              <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-1 sm:px-3">
              <Bell className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-1 sm:px-3">
              <Database className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Data</span>
            </TabsTrigger>
          </TabsList>

          {/* General Settings Tab */}
          <TabsContent value="general" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-chart-1" />
                  General Settings
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Basic platform configuration and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                {systemSettings[0].settings.map((setting, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Label className="text-sm font-medium">{setting.name}</Label>
                        <p className="text-xs text-muted-foreground">{setting.description}</p>
                      </div>
                      <div className="ml-4">
                        {setting.type === "text" && (
                          <Input 
                            value={setting.value as string} 
                            className="w-48 text-sm"
                            onChange={() => setHasChanges(true)}
                          />
                        )}
                        {setting.type === "select" && (
                          <Select defaultValue={setting.value as string}>
                            <SelectTrigger className="w-48 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {setting.options?.map((option) => (
                                <SelectItem key={option} value={option}>{option}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                        {setting.type === "switch" && (
                          <Switch 
                            checked={setting.value as boolean}
                            onCheckedChange={() => setHasChanges(true)}
                          />
                        )}
                      </div>
                    </div>
                    {index < systemSettings[0].settings.length - 1 && <Separator />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings Tab */}
          <TabsContent value="security" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-chart-2" />
                  Security Settings
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Authentication, authorization, and security policies
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                {systemSettings[1].settings.map((setting, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Label className="text-sm font-medium">{setting.name}</Label>
                        <p className="text-xs text-muted-foreground">{setting.description}</p>
                      </div>
                      <div className="ml-4">
                        {setting.type === "text" && (
                          <Input 
                            value={setting.value as string} 
                            className="w-48 text-sm"
                            onChange={() => setHasChanges(true)}
                          />
                        )}
                        {setting.type === "select" && (
                          <Select defaultValue={setting.value as string}>
                            <SelectTrigger className="w-48 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {setting.options?.map((option) => (
                                <SelectItem key={option} value={option}>{option}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                        {setting.type === "switch" && (
                          <Switch 
                            checked={setting.value as boolean}
                            onCheckedChange={() => setHasChanges(true)}
                          />
                        )}
                      </div>
                    </div>
                    {index < systemSettings[1].settings.length - 1 && <Separator />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Settings Tab */}
          <TabsContent value="notifications" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-chart-3" />
                  Notification Settings
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Email, SMS, and system notification preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                {systemSettings[2].settings.map((setting, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Label className="text-sm font-medium">{setting.name}</Label>
                        <p className="text-xs text-muted-foreground">{setting.description}</p>
                      </div>
                      <div className="ml-4">
                        {setting.type === "text" && (
                          <Input 
                            value={setting.value as string} 
                            className="w-48 text-sm"
                            onChange={() => setHasChanges(true)}
                          />
                        )}
                        {setting.type === "select" && (
                          <Select defaultValue={setting.value as string}>
                            <SelectTrigger className="w-48 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {setting.options?.map((option) => (
                                <SelectItem key={option} value={option}>{option}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                        {setting.type === "switch" && (
                          <Switch 
                            checked={setting.value as boolean}
                            onCheckedChange={() => setHasChanges(true)}
                          />
                        )}
                      </div>
                    </div>
                    {index < systemSettings[2].settings.length - 1 && <Separator />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Management Tab */}
          <TabsContent value="data" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Database className="w-4 h-4 sm:w-5 sm:h-5 text-chart-4" />
                  Data Management
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Database, storage, and data retention policies
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                {systemSettings[3].settings.map((setting, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Label className="text-sm font-medium">{setting.name}</Label>
                        <p className="text-xs text-muted-foreground">{setting.description}</p>
                      </div>
                      <div className="ml-4">
                        {setting.type === "text" && (
                          <Input 
                            value={setting.value as string} 
                            className="w-48 text-sm"
                            onChange={() => setHasChanges(true)}
                          />
                        )}
                        {setting.type === "select" && (
                          <Select defaultValue={setting.value as string}>
                            <SelectTrigger className="w-48 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {setting.options?.map((option) => (
                                <SelectItem key={option} value={option}>{option}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                        {setting.type === "switch" && (
                          <Switch 
                            checked={setting.value as boolean}
                            onCheckedChange={() => setHasChanges(true)}
                          />
                        )}
                      </div>
                    </div>
                    {index < systemSettings[3].settings.length - 1 && <Separator />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Recent Changes */}
        <Card>
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">Recent Changes</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Track recent configuration changes and system updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentChanges.map((change) => (
                <div key={change.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      change.status === 'success' ? 'bg-chart-1/20' : 
                      change.status === 'warning' ? 'bg-chart-4/20' : 'bg-muted'
                    }`}>
                      {change.status === 'success' ? (
                        <CheckCircle className="w-4 h-4 text-chart-1" />
                      ) : change.status === 'warning' ? (
                        <AlertTriangle className="w-4 h-4 text-chart-4" />
                      ) : (
                        <Clock className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{change.setting}</p>
                      <p className="text-xs text-muted-foreground">
                        {change.action} by {change.user} • {change.time}
                      </p>
                    </div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      change.status === 'success' ? 'bg-chart-1/10 text-chart-1 border-chart-1/20' :
                      change.status === 'warning' ? 'bg-chart-4/10 text-chart-4 border-chart-4/20' :
                      'bg-muted text-muted-foreground'
                    }`}
                  >
                    {change.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarLayout>
  )
}
