import { RoleGuard } from "@/components/role-guard"
import StudentPortal from "@/app/student/page"

export default function ProtectedStudentPage() {
  // In a real app, you would get the current user role from your auth system
  const currentUserRole = "student" // This would come from your auth context/session

  return (
    <RoleGuard allowedRoles={["student"]} currentUserRole={currentUserRole}>
      <StudentPortal />
    </RoleGuard>
  )
}
