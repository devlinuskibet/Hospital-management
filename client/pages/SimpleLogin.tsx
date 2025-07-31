import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart } from "lucide-react";

export default function SimpleLogin() {
  const [email, setEmail] = useState("admin@kutrrh.go.ke");
  const [password, setPassword] = useState("admin123");

  const handleLogin = async () => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Login response:", data);

      if (response.ok) {
        localStorage.setItem("auth_token", data.token);
        window.location.href = "/dashboard";
      } else {
        alert("Login failed: " + data.error);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-medical-50 to-medical-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center">
              <Heart className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">KUTRRH</h1>
              <p className="text-sm text-muted-foreground">
                Hospital Management
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button onClick={handleLogin} className="w-full">
            Sign In
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            <p>Demo: admin@kutrrh.go.ke / admin123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
