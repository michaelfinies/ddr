"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "../lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
import { IconLoader } from "@tabler/icons-react";

export function LoginForm({ className, ...props }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { setUser, user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("zus: " + user);
  }, [user]);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    const res = await fetch("/api/auth", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });

    const result = await res.json();

    if (res.ok) {
      setUser(result.user);
      if (result.hasOnboarded === false) {
        router.push("/onboarding");
      } else {
        router.push("/books");
      }
    } else {
      setLoading(false);
      setError(result.error);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 h-[550px]">
        <CardContent className="grid p-0 md:grid-cols-2 h-full">
          <form
            onSubmit={handleSubmit}
            className="p-6 w-96 md:p-8 bg-gray-50 flex items-center justify-center"
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="text-center mt-5">
                  <h1 className="text-3xl h-20 md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-sky-400 to-indigo-500 drop-shadow-xl animate-fade-in">
                    Readify
                  </h1>
                  <p className="text-muted-foreground text-balance -mt-6">
                    Unlock knowledge and get rewarded
                  </p>
                </div>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder=""
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button disabled={loading} type="submit" className="w-full">
                {loading ? (
                  <IconLoader className="w-6 h-6 animate-spin" />
                ) : (
                  "Log in"
                )}
              </Button>

              <div className="h-8 text-xs text-red-500 w-full text-center">
                {error ? error : null}
              </div>

              <div className="text-center text-sm -mt-6">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            </div>
          </form>

          <div className="bg-muted relative hidden md:block">
            <img
              src="/login-hero2.png"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
            <div className="z-[100] absolute text-blue-100 right-0 p-4">
              powered by blockchain technology
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
