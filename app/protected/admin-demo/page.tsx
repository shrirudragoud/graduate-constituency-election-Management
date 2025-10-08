import { RoleGuard } from "@/components/role-guard"
import AdminDemoDashboard from "@/app/admin-demo/page"

export default function ProtectedAdminDemoPage() {
  // In a real app, you would get the current user role from your auth system
  const currentUserRole = "admin" // This would come from your auth context/session

  return (
    <RoleGuard allowedRoles={["admin"]} currentUserRole={currentUserRole}>
      <AdminDemoDashboard />
    </RoleGuard>
  )
}
