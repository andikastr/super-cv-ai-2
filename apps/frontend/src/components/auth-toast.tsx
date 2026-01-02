"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export function AuthToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    
    if (searchParams.get("login") === "success") {
      
      
      toast.success("Login successful! Welcome back.");

     
      const params = new URLSearchParams(searchParams.toString());
      params.delete("login");
      
      
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [searchParams, router, pathname]);

  return null; 
}