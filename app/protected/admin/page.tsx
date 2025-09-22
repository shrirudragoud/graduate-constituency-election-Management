import { RoleGuard } from "@/components/role-guard"
import AdminDashboard from "@/app/admin/page"

export default function ProtectedAdminPage() {
  // In a real app, you would get the current user role from your auth system
  const currentUserRole = "admin" // This would come from your auth context/session

  return (
    <RoleGuard allowedRoles={["admin"]} currentUserRole={currentUserRole}>
      <AdminDashboard />
    </RoleGuard>
  )
}
