"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

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
        alert("Invalid Email or Password");
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

        // Auto-login after success
        await signIn("credentials", { redirect: false, email, password });
        router.push("/");
      } catch (error: any) {
        alert("Registration Failed: " + error.message);
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[128px] pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
        <Link href="/" className="inline-flex items-center text-slate-500 hover:text-amber-400 mb-6 text-sm transition-colors"><ArrowLeft size={16} className="mr-1"/> Back to Home</Link>
        
        <h1 className="text-2xl font-serif font-bold text-white mb-2 text-center">{isLogin ? "Welcome Back" : "Join Super CV"}</h1>
        <p className="text-slate-400 text-sm text-center mb-8">{isLogin ? "Sign in to access your dashboard." : "Create an account to start analyzing."}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input type="text" placeholder="Full Name" required className="w-full bg-slate-950/50 border border-white/10 rounded-xl p-3 text-white focus:border-amber-500/50 outline-none transition-all" value={name} onChange={e => setName(e.target.value)} />
          )}
          <input type="email" placeholder="Email Address" required className="w-full bg-slate-950/50 border border-white/10 rounded-xl p-3 text-white focus:border-amber-500/50 outline-none transition-all" value={email} onChange={e => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" required className="w-full bg-slate-950/50 border border-white/10 rounded-xl p-3 text-white focus:border-amber-500/50 outline-none transition-all" value={password} onChange={e => setPassword(e.target.value)} />

          <button disabled={isLoading} className="w-full bg-amber-500 text-slate-900 font-bold h-12 rounded-xl hover:bg-amber-400 transition-colors flex items-center justify-center">
            {isLoading ? <Loader2 className="animate-spin" /> : (isLogin ? "Sign In" : "Create Account")}
          </button>
        </form>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px bg-white/10 flex-1" />
          <span className="text-xs uppercase text-slate-500">Or continue with</span>
          <div className="h-px bg-white/10 flex-1" />
        </div>

        <button onClick={() => signIn("google", { callbackUrl: "/" })} className="w-full h-12 bg-white text-slate-900 font-medium rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
          Google
        </button>

        <p className="mt-6 text-center text-sm text-slate-400">
          <button onClick={() => setIsLogin(!isLogin)} className="text-amber-400 hover:underline">
            {isLogin ? "New here? Create an account" : "Already have an account? Sign In"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}