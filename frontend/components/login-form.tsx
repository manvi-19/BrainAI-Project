"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth-context"
import { toast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image";
export function LoginForm() {
  const router = useRouter()
  const { login, register } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("login")
  const [error, setError] = useState("")

  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  const [regName, setRegName] = useState("")
  const [regEmail, setRegEmail] = useState("")
  const [regPassword, setRegPassword] = useState("")
  const [regRole, setRegRole] = useState<"patient" | "doctor">("patient")
  const [loginRole, setLoginRole] = useState<"patient" | "doctor">("patient")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    try {
      await login(loginEmail, loginPassword)
      toast({ title: "Login successful", description: "Welcome back!" })
      Promise.resolve().then(() => {
        window.location.href = "/dashboard"
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    try {
      await register(regName, regEmail, regPassword, regRole)
      toast({ title: "Registration successful", description: "Account created successfully." })
      Promise.resolve().then(() => {
        window.location.href = "/dashboard"
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          {/* <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-primary-foreground">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor" />
          </svg> */}
          <Image
                            src="/brain-idea-mind-svgrepo-com.svg"
                            alt="BrainAI Logo"
                            width={36}
                            height={36}
                            className="object-contain"
                            priority
                          />
        </div>
        <span className="text-xl font-bold tracking-tight text-foreground">
          Brain<span className="text-primary">AI</span>
        </span>
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to BrainAI</CardTitle>
          <CardDescription>Sign in or create an account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="flex flex-col gap-4 pt-4">
                <div className="flex flex-col gap-2">
                  <Label>I am a</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setLoginRole("patient")}
                      className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors ${
                        loginRole === "patient"
                          ? "border-primary bg-primary/5 text-foreground"
                          : "border-border text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      <span className="text-sm font-medium">Patient</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setLoginRole("doctor")}
                      className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors ${
                        loginRole === "doctor"
                          ? "border-primary bg-primary/5 text-foreground"
                          : "border-border text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      <span className="text-sm font-medium">Doctor / Lab</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="you@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" disabled={isLoading} className="mt-2 w-full">
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="flex flex-col gap-4 pt-4">
                <div className="flex flex-col gap-2">
                  <Label>I am a</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRegRole("patient")}
                      className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors ${
                        regRole === "patient"
                          ? "border-primary bg-primary/5 text-foreground"
                          : "border-border text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      <span className="text-sm font-medium">Patient</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegRole("doctor")}
                      className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors ${
                        regRole === "doctor"
                          ? "border-primary bg-primary/5 text-foreground"
                          : "border-border text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      <span className="text-sm font-medium">Doctor / Lab</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="reg-name">Full Name</Label>
                  <Input
                    id="reg-name"
                    type="text"
                    placeholder="Dr. Jane Smith"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="reg-email">Email</Label>
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="you@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="reg-password">Password</Label>
                  <Input
                    id="reg-password"
                    type="password"
                    placeholder="Create a password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" disabled={isLoading} className="mt-2 w-full">
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        For educational and research purposes only.
      </p>
    </div>
  )
}
