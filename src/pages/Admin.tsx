import { Navigate } from "react-router-dom"
import { useAuthState } from "@/hooks/useAuthState"
import { AdminDashboard } from "@/components/admin/AdminDashboard"

export default function Admin() {
  const { user, loading } = useAuthState()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  return <AdminDashboard />
}