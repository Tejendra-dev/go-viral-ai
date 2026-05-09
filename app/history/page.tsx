import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Analysis } from "@/types";
import { TrendingUp, Zap, Clock } from "lucide-react";
import Link from "next/link";
import { SignOutButton } from "@/components/SignOutButton";

export default async function HistoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: analyses } = await supabase
    .from("analyses").select("*").eq("user_id", user.id)
    .order("created_at", { ascending: false }).limit(50);

  const items = (analyses || []) as Analysis[];

  const getColor = (score: number) =>
    score >= 75 ? "text-green-400 bg-green-400/10" : score >= 50 ? "text-amber-400 bg-amber-400/10" : "text-red-400 bg-red-400/10";

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">GoViral<span className="text-violet-400">.AI</span></span>
          </div>
         <nav className="flex items-center gap-1 text-sm">
  <a href="/" className="px-3 py-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all">Home</a>
  <a href="/analyze" className="px-3 py-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all">Analyze</a>
  <a href="/history" className="px-3 py-1.5 rounded-lg bg-violet-500/20 text-violet-300 font-semibold transition-all">History</a>
  <a href="/dashboard" className="px-3 py-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all">Dashboard</a>
  <div className="ml-2 pl-2 border-l border-white/10">
    <SignOutButton />
  </div>
</nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight">Analysis History</h1>
            <p className="text-white/40 mt-1">{items.length} analyses total</p>
          </div>
          <Link href="/analyze" className="flex items-center gap-2 bg-violet-500 hover:bg-violet-400 transition-colors text-white text-sm font-semibold px-4 py-2 rounded-lg">
            <Zap className="w-4 h-4" /> New Analysis
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-24 text-white/20">
            <TrendingUp className="w-12 h-12 mx-auto mb-4" />
            <p>No analyses yet.</p>
            <Link href="/analyze" className="mt-4 inline-block text-violet-400 hover:text-violet-300 text-sm">Go to Analyzer →</Link>
          </div>
        ) : (
          <div className="grid gap-3">
            {items.map((item) => (
              <div key={item.id} className="bg-white/3 border border-white/8 rounded-xl p-5 hover:bg-white/5 transition-all overflow-hidden">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-xs bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded-md font-medium">{item.platform}</span>
                      <span className="text-xs bg-white/5 text-white/30 px-2 py-0.5 rounded-md">{item.content_type}</span>
                      <div className="flex items-center gap-1 text-xs text-white/20 ml-auto">
                        <Clock className="w-3 h-3" />
                        {new Date(item.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                    </div>
                    <p className="text-sm text-white/60 truncate">{item.caption || "Image-only analysis"}</p>
                    <p className="text-xs text-white/30 mt-2 line-clamp-2">{item.overall_feedback}</p>
                  </div>
                  <div className={`text-center px-3 py-2 rounded-xl shrink-0 ${getColor(item.virality_score)}`}>
                    <p className="text-2xl font-black">{item.virality_score}</p>
                    <p className="text-xs opacity-70">score</p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-white/5">
                  {[
                    { label: "Hook", val: item.hook_score },
                    { label: "Visual", val: item.thumbnail_score },
                    { label: "Caption", val: item.caption_score },
                    { label: "Engage", val: item.engagement_score },
                  ].map(({ label, val }) => (
                    <div key={label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-white/30">{label}</span>
                        <span className="text-white/50">{val}</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${val >= 75 ? "bg-green-400" : val >= 50 ? "bg-amber-400" : "bg-red-400"}`}
                          style={{ width: `${val}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}