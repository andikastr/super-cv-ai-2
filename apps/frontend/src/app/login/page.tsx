"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (isLogin) {
      // LOGIN
      const res = await signIn("credentials", { redirect: false, email, password });
      if (res?.error) {
        alert("Invalid Credentials");
        setIsLoading(false);
      } else {
        router.push("/");
        router.refresh();
      }
    } else {
      // REGISTER
      try {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
        const res = await fetch(`${backendUrl}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name }),
        });
        if (!res.ok) throw new Error(await res.text());
        
        // Auto-login
        await signIn("credentials", { redirect: false, email, password });
        router.push("/");
      } catch (error: any) {
        alert("Error: " + error.message);
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[128px] pointer-events-none" />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-10 w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl">
        <h1 className="text-2xl font-serif font-bold text-white mb-6 text-center">{isLogin ? "Welcome Back" : "Create Account"}</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && <input type="text" placeholder="Name" className="w-full bg-slate-950/50 border border-white/10 rounded-xl p-3 text-white" value={name} onChange={e => setName(e.target.value)} required />}
          <input type="email" placeholder="Email" className="w-full bg-slate-950/50 border border-white/10 rounded-xl p-3 text-white" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" className="w-full bg-slate-950/50 border border-white/10 rounded-xl p-3 text-white" value={password} onChange={e => setPassword(e.target.value)} required />
          <Button disabled={isLoading} className="w-full bg-amber-500 text-slate-900 font-bold h-12 rounded-xl">{isLoading ? <Loader2 className="animate-spin" /> : (isLogin ? "Sign In" : "Register")}</Button>
        </form>

        <div className="my-6 text-center text-xs text-slate-500 uppercase">Or continue with</div>
        <Button onClick={() => signIn("google", { callbackUrl: "/" })} className="w-full h-12 bg-white text-slate-900 font-medium rounded-xl">Google</Button>
        
        <p className="mt-6 text-center text-sm text-slate-400">
          <button onClick={() => setIsLogin(!isLogin)} className="text-amber-400 hover:underline">{isLogin ? "Need an account? Sign Up" : "Have an account? Sign In"}</button>
        </p>
      </motion.div>
    </div>
  );
}