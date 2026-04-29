import { Zap, TrendingUp, Hash, Music, Users, Target, ArrowRight, Star } from "lucide-react";
import { SignOutButton } from "@/components/SignOutButton";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-pink-600/8 rounded-full blur-[100px]" />
      </div>

      <header className="relative z-10 border-b border-white/5">
  <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
        <Zap className="w-4 h-4 text-white" />
      </div>
      <span className="font-bold text-lg tracking-tight">GoViral<span className="text-violet-400">.AI</span></span>
    </div>
    <SignOutButton />
  </div>
</header>

      <main className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="pt-24 pb-16 text-center">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1.5 text-sm text-violet-300 mb-8">
            <Star className="w-3.5 h-3.5 fill-current" />
            Trained on 59M+ views of viral content
          </div>
          <h1 className="text-6xl lg:text-7xl font-black tracking-tight leading-none mb-6">
            Know if your content<br />
            <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">will go viral</span><br />
            before you post.
          </h1>
          <p className="text-xl text-white/40 max-w-2xl mx-auto mb-10">
            Upload your content, get an instant AI virality score from 0–100 with hook analysis, caption optimization, hashtag recommendations, and competitor insights.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <a href="/analyze" className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 transition-all text-white font-bold px-8 py-4 rounded-xl text-lg">
              Analyze Your Content <ArrowRight className="w-5 h-5" />
            </a>
            <a href="/analyze" className="flex items-center gap-2 bg-white/5 hover:bg-white/10 transition-colors text-white/70 font-semibold px-8 py-4 rounded-xl text-lg">
              Try Free
            </a>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 pb-24">
          {[
            { icon: <Zap className="w-5 h-5" />, title: "Hook Analysis", desc: "AI scores your opening hook and first 3 seconds for maximum retention.", color: "text-amber-400 bg-amber-400/10" },
            { icon: <TrendingUp className="w-5 h-5" />, title: "Virality Score", desc: "0-100 score breakdown across hook, thumbnail, caption, and engagement.", color: "text-violet-400 bg-violet-400/10" },
            { icon: <Hash className="w-5 h-5" />, title: "Hashtag Pack", desc: "10 trending hashtags curated for your content type and platform.", color: "text-cyan-400 bg-cyan-400/10" },
            { icon: <Music className="w-5 h-5" />, title: "Audio Trends", desc: "Discover trending audio that boosts algorithmic reach for your niche.", color: "text-pink-400 bg-pink-400/10" },
            { icon: <Users className="w-5 h-5" />, title: "Competitor Insights", desc: "See what top creators in your niche do differently to get millions of views.", color: "text-green-400 bg-green-400/10" },
            { icon: <Target className="w-5 h-5" />, title: "Caption Optimizer", desc: "Get 3 AI-rewritten captions optimized for clicks and engagement.", color: "text-red-400 bg-red-400/10" },
          ].map(({ icon, title, desc, color }) => (
            <div key={title} className="bg-white/3 border border-white/8 rounded-2xl p-6 hover:bg-white/5 transition-all">
              <div className={`inline-flex p-2.5 rounded-xl mb-4 ${color}`}>{icon}</div>
              <h3 className="font-bold text-lg mb-2">{title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}