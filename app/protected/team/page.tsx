import { RoleGuard } from "@/components/role-guard"
import TeamDashboard from "@/app/team/page"

export default function ProtectedTeamPage() {
  // In a real app, you would get the current user role from your auth system
  const currentUserRole = "team" // This would come from your auth context/session

  return (
    <RoleGuard allowedRoles={["team", "admin"]} currentUserRole={currentUserRole}>
      <TeamDashboard />
    </RoleGuard>
  )
}
