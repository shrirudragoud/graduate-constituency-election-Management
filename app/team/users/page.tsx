"use client"

import { useState, useEffect } from "react"
import { SidebarLayout } from "@/components/sidebar-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Shield,
  Activity
} from "lucide-react"

interface User {
  id: number
  email: string
  role: 'admin' | 'volunteer' | 'supervisor'
  firstName?: string
  lastName?: string
  phone?: string
  district?: string
  taluka?: string
  isActive: boolean
  lastLogin?: string
  createdAt: string
  updatedAt: string
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showCreateUser, setShowCreateUser] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    byRole: [],
    byDistrict: []
  })

  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    role: "volunteer" as 'admin' | 'volunteer' | 'supervisor',
    district: "",
    taluka: ""
  })

  useEffect(() => {
    fetchUsers()
    fetchStats()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      const data = await response.json()
      setUsers(data.users || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/users/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleCreateUser = async () => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      })
      
      const data = await response.json()
      
      if (data.success) {
        setShowCreateUser(false)
        setNewUser({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          password: "",
          role: "volunteer",
          district: "",
          taluka: ""
        })
        fetchUsers()
        fetchStats()
        alert('User created successfully!')
      } else {
        alert(data.error || 'Failed to create user')
      }
    } catch (error) {
      console.error('Error creating user:', error)
      alert('Failed to create user')
    }
  }

  const handleToggleUserStatus = async (userId: number, isActive: boolean) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive })
      })
      
      const data = await response.json()
      
      if (data.success) {
        fetchUsers()
        fetchStats()
      } else {
        alert(data.error || 'Failed to update user')
      }
    } catch (error) {
      console.error('Error updating user:', error)
      alert('Failed to update user')
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.includes(searchTerm)
    
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && user.isActive) ||
      (statusFilter === "inactive" && !user.isActive)
    
    return matchesSearch && matchesRole && matchesStatus
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200'
      case 'supervisor': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'volunteer': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <SidebarLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">User Management</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Manage team members, roles, and permissions
            </p>
          </div>
          <Button onClick={() => setShowCreateUser(true)} className="text-xs sm:text-sm h-8 sm:h-9">
            <UserPlus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Add User</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <Card className="group hover:border-chart-1/30 transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium">Total Users</p>
                  <p className="text-2xl sm:text-3xl font-bold text-chart-1">{stats.total}</p>
                </div>
                <div className="w-10 h-10 bg-chart-1/20 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-chart-1" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:border-chart-2/30 transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium">Active Users</p>
                  <p className="text-2xl sm:text-3xl font-bold text-chart-2">{stats.active}</p>
                </div>
                <div className="w-10 h-10 bg-chart-2/20 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-chart-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:border-destructive/30 transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium">Inactive Users</p>
                  <p className="text-2xl sm:text-3xl font-bold text-destructive">{stats.inactive}</p>
                </div>
                <div className="w-10 h-10 bg-destructive/20 rounded-xl flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:border-primary/30 transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium">Admins</p>
                  <p className="text-2xl sm:text-3xl font-bold text-primary">
                    {stats.byRole.find((r: any) => r.role === 'admin')?.count || 0}
                  </p>
                </div>
                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 h-10 sm:h-12 bg-muted">
            <TabsTrigger value="users" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <Users className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">All Users</span>
              <span className="sm:hidden">Users</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <Activity className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Statistics</span>
              <span className="sm:hidden">Stats</span>
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      Team Members
                    </CardTitle>
                    <CardDescription>Manage user accounts and permissions</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search users..." 
                      className="pl-10" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="supervisor">Supervisor</SelectItem>
                      <SelectItem value="volunteer">Volunteer</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Users Table */}
                <div className="border border-border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            Loading users...
                          </TableCell>
                        </TableRow>
                      ) : filteredUsers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            <div className="flex flex-col items-center gap-2">
                              <Users className="w-8 h-8 text-muted-foreground" />
                              <p className="text-muted-foreground">No users found</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredUsers.map((user) => (
                          <TableRow key={user.id} className="hover:bg-muted/30">
                            <TableCell>
                              <div>
                                <div className="font-medium">
                                  {user.firstName} {user.lastName}
                                </div>
                                <div className="text-sm text-muted-foreground">{user.email}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getRoleBadgeColor(user.role)}>
                                {user.role.toUpperCase()}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                {user.phone && (
                                  <div className="flex items-center gap-1 text-sm">
                                    <Phone className="w-3 h-3" />
                                    {user.phone}
                                  </div>
                                )}
                                <div className="flex items-center gap-1 text-sm">
                                  <Mail className="w-3 h-3" />
                                  {user.email}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                {user.district && (
                                  <div className="flex items-center gap-1 text-sm">
                                    <MapPin className="w-3 h-3" />
                                    {user.district}
                                  </div>
                                )}
                                {user.taluka && (
                                  <div className="text-xs text-muted-foreground">
                                    {user.taluka}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={user.isActive ? "default" : "secondary"}>
                                {user.isActive ? (
                                  <><CheckCircle className="w-3 h-3 mr-1" /> Active</>
                                ) : (
                                  <><XCircle className="w-3 h-3 mr-1" /> Inactive</>
                                )}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm">
                              {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setSelectedUser(user)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleToggleUserStatus(user.id, user.isActive)}
                                >
                                  {user.isActive ? (
                                    <XCircle className="w-4 h-4" />
                                  ) : (
                                    <CheckCircle className="w-4 h-4" />
                                  )}
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Users by Role</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.byRole.map((role: any) => (
                      <div key={role.role} className="flex items-center justify-between">
                        <span className="capitalize">{role.role}</span>
                        <Badge variant="outline">{role.count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Users by District</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.byDistrict.map((district: any) => (
                      <div key={district.district} className="flex items-center justify-between">
                        <span>{district.district}</span>
                        <Badge variant="outline">{district.count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create User Dialog */}
      <Dialog open={showCreateUser} onOpenChange={setShowCreateUser}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={newUser.firstName}
                  onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={newUser.lastName}
                  onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={newUser.phone}
                onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={newUser.role} onValueChange={(value: any) => setNewUser({...newUser, role: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="volunteer">Volunteer</SelectItem>
                    <SelectItem value="supervisor">Supervisor</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="district">District</Label>
                <Input
                  id="district"
                  value={newUser.district}
                  onChange={(e) => setNewUser({...newUser, district: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="taluka">Taluka</Label>
              <Input
                id="taluka"
                value={newUser.taluka}
                onChange={(e) => setNewUser({...newUser, taluka: e.target.value})}
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateUser(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateUser}>
                Create User
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* User Details Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <p className="font-medium">{selectedUser.firstName} {selectedUser.lastName}</p>
                </div>
                <div>
                  <Label>Role</Label>
                  <Badge className={getRoleBadgeColor(selectedUser.role)}>
                    {selectedUser.role.toUpperCase()}
                  </Badge>
                </div>
              </div>
              
              <div>
                <Label>Email</Label>
                <p>{selectedUser.email}</p>
              </div>
              
              {selectedUser.phone && (
                <div>
                  <Label>Phone</Label>
                  <p>{selectedUser.phone}</p>
                </div>
              )}
              
              {(selectedUser.district || selectedUser.taluka) && (
                <div>
                  <Label>Location</Label>
                  <p>{selectedUser.district} {selectedUser.taluka && `- ${selectedUser.taluka}`}</p>
                </div>
              )}
              
              <div>
                <Label>Status</Label>
                <Badge variant={selectedUser.isActive ? "default" : "secondary"}>
                  {selectedUser.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              
              <div>
                <Label>Last Login</Label>
                <p>{selectedUser.lastLogin ? formatDate(selectedUser.lastLogin) : 'Never'}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </SidebarLayout>
  )
}
