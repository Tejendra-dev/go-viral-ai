import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Analysis } from "@/types";
import { Zap, TrendingUp, BarChart2, Target, Award } from "lucide-react";
import Link from "next/link";
import { SignOutButton } from "@/components/SignOutButton";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: analyses } = await supabase
    .from("analyses").select("*").eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const items = (analyses || []) as Analysis[];
  const total = items.length;
  const avgScore = total ? Math.round(items.reduce((a, b) => a + b.virality_score, 0) / total) : 0;
  const best = total ? Math.max(...items.map((i) => i.virality_score)) : 0;
  const viral = items.filter((i) => i.virality_score >= 75).length;

  const byPlatform = items.reduce((acc, item) => {
    acc[item.platform] = (acc[item.platform] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const recent7 = items.slice(0, 7).reverse();

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
  <a href="/history" className="px-3 py-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all">History</a>
  <a href="/dashboard" className="px-3 py-1.5 rounded-lg bg-violet-500/20 text-violet-300 font-semibold transition-all">Dashboard</a>
  <div className="ml-2 pl-2 border-l border-white/10">
    <SignOutButton />
  </div>
</nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight">Your Dashboard</h1>
          <p className="text-white/40 mt-1">Track your content virality over time</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: <BarChart2 className="w-5 h-5" />, label: "Total Analyses", value: total, color: "text-violet-400" },
            { icon: <TrendingUp className="w-5 h-5" />, label: "Avg Score", value: avgScore, color: "text-blue-400" },
            { icon: <Award className="w-5 h-5" />, label: "Best Score", value: best, color: "text-amber-400" },
            { icon: <Target className="w-5 h-5" />, label: "Viral (75+)", value: viral, color: "text-green-400" },
          ].map(({ icon, label, value, color }) => (
            <div key={label} className="bg-white/3 border border-white/8 rounded-xl p-5">
              <div className={`${color} mb-3`}>{icon}</div>
              <p className="text-3xl font-black">{value}</p>
              <p className="text-xs text-white/30 mt-1">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white/3 border border-white/8 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-6">Recent Score Trend</h2>
            {recent7.length === 0 ? (
              <p className="text-white/20 text-sm text-center py-8">No data yet</p>
            ) : (
              <div className="flex items-end gap-3 h-32">
                {recent7.map((item, i) => {
                  const h = (item.virality_score / 100) * 100;
                  const color = item.virality_score >= 75 ? "bg-green-400" : item.virality_score >= 50 ? "bg-amber-400" : "bg-red-400";
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-xs text-white/30">{item.virality_score}</span>
                      <div className={`w-full rounded-t-md ${color} opacity-80`} style={{ height: `${h}%` }} />
                      <span className="text-xs text-white/20">{item.platform.slice(0, 2)}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-white/3 border border-white/8 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-6">Platform Breakdown</h2>
            {Object.keys(byPlatform).length === 0 ? (
              <p className="text-white/20 text-sm text-center py-8">No data yet</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(byPlatform).sort((a, b) => b[1] - a[1]).map(([platform, count]) => (
                  <div key={platform}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/60">{platform}</span>
                      <span className="text-white/30">{count} analyses</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full"
                        style={{ width: `${(count / total) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {total === 0 && (
          <div className="mt-8 text-center py-12 border-2 border-dashed border-white/5 rounded-2xl">
            <TrendingUp className="w-10 h-10 text-white/10 mx-auto mb-4" />
            <p className="text-white/20 text-sm mb-4">Analyze your first piece of content to see stats here</p>
            <Link href="/analyze" className="inline-flex items-center gap-2 bg-violet-500 hover:bg-violet-400 transition-colors text-white text-sm font-semibold px-5 py-2.5 rounded-lg">
              <Zap className="w-4 h-4" /> Start Analyzing
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}