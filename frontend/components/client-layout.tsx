"use client"

import { usePathname } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = pathname === '/login' || pathname === '/register'

  return isAuthPage ? children : <DashboardLayout>{children}</DashboardLayout>
} 