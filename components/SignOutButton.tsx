"use client";

import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <button
      onClick={handleSignOut}
      className="text-sm text-white/50 hover:text-red-400 transition-colors"
    >
      Sign Out
    </button>
  );
}