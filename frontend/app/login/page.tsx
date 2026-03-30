"use client"

import { LoginForm } from "@/components/login-form"
import { AuthProvider } from "@/lib/auth-context"

export default function LoginPage() {
  return (
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  )
}
