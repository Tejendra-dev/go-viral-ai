"use client";

import { useState, useRef } from "react";
import { AnalysisResult, Platform } from "@/types";
import { ScoreRing } from "@/components/ScoreRing";
import { SignOutButton } from "@/components/SignOutButton";
import { Upload, Zap, TrendingUp, Music, Hash, Users, Target, Image as ImageIcon, FileText, Sparkles, Copy, Check, BookMarked } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const PLATFORMS: Platform[] = ["TikTok", "Instagram", "YouTube", "Twitter/X", "LinkedIn"];

const ASPECT_RATIOS: Record<Platform, { ratio: string; label: string; w: number; h: number }> = {
  "TikTok": { ratio: "9/16", label: "9:16 Vertical", w: 9, h: 16 },
  "Instagram": { ratio: "4/5", label: "4:5 Portrait", w: 4, h: 5 },
  "YouTube": { ratio: "16/9", label: "16:9 Landscape", w: 16, h: 9 },
  "Twitter/X": { ratio: "16/9", label: "16:9 Landscape", w: 16, h: 9 },
  "LinkedIn": { ratio: "1.91/1", label: "1.91:1 Banner", w: 1.91, h: 1 },
};

export default function AnalyzePage() {
  const pathname = usePathname();
  const [platform, setPlatform] = useState<Platform>("TikTok");
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImage = (file: File) => {
    setImage(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) handleImage(file);
  };

  const analyze = async () => {
    if (!caption && !image) { setError("Add a caption or upload an image."); return; }
    setLoading(true); setError(""); setResult(null); setSaved(false);
    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("platform", platform);
    if (image) formData.append("image", image);
    try {
      const res = await fetch("/api/analyze", { method: "POST", body: formData });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setResult(json.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const saveAnalysis = async () => {
    if (!result) return;
    setSaving(true);
    try {
      const res = await fetch("/api/save-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content_type: image ? "image" : "caption", caption, platform, ...result }),
      });
      const json = await res.json();
      if (json.error === "Unauthorized") {
        window.location.href = "/auth/signup?returnUrl=/analyze";
        return;
      }
      setSaved(true);
    } catch {
      // redirect to signup
      window.location.href = "/auth/signup?returnUrl=/analyze";
    } finally {
      setSaving(false);
    }
  };

  const copyHashtags = () => {
    if (result) { navigator.clipboard.writeText(result.hashtag_recommendations); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  const viralityColor = result ? result.virality_score >= 75 ? "text-green-400" : result.virality_score >= 50 ? "text-amber-400" : "text-red-400" : "text-white";
  const ar = ASPECT_RATIOS[platform];

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/analyze", label: "Analyze" },
    { href: "/history", label: "History" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="border-b border-white/5 bg-[#0a0a0f]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">GoViral<span className="text-violet-400">.AI</span></span>
          </div>
          <nav className="flex items-center gap-1 text-sm">
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href}
                className={`px-3 py-1.5 rounded-lg transition-all ${pathname === href
                  ? "bg-violet-500/20 text-violet-300 font-semibold"
                  : "text-white/40 hover:text-white hover:bg-white/5"}`}>
                {label}
              </Link>
            ))}
            <div className="ml-2 pl-2 border-l border-white/10">
              <SignOutButton />
            </div>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1.5 text-sm text-violet-300 mb-6">
            <Sparkles className="w-3.5 h-3.5" />AI-powered virality analysis
          </div>
          <h1 className="text-5xl font-black tracking-tight mb-4">
            Will your content<span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent"> go viral?</span>
          </h1>
          <p className="text-white/40 text-lg max-w-xl mx-auto">Upload your content and get an instant AI virality score with actionable feedback.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-5">
            <div>
              <label className="text-xs text-white/40 uppercase tracking-widest mb-2 block">Platform</label>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map((p) => (
                  <button key={p} onClick={() => setPlatform(p)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${platform === p ? "bg-violet-500 text-white shadow-lg shadow-violet-500/25" : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"}`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-white/40 uppercase tracking-widest mb-2 block">
                Thumbnail / Image <span className="text-white/20 normal-case">(optional · {ar.label})</span>
              </label>
              <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} onClick={() => fileRef.current?.click()}
                className="relative border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-violet-500/40 hover:bg-violet-500/5 transition-all group overflow-hidden">
                {imagePreview ? (
                  <div className="relative w-full" style={{ aspectRatio: ar.ratio }}>
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <button onClick={(e) => { e.stopPropagation(); setImage(null); setImagePreview(null); }}
                      className="absolute top-3 right-3 bg-black/70 rounded-full px-3 py-1 text-xs hover:bg-red-500 transition-colors">
                      Remove
                    </button>
                    <div className="absolute bottom-3 left-3 text-xs text-white/60 bg-black/50 px-2 py-1 rounded">
                      {ar.label}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 text-white/30 group-hover:text-white/50 transition-colors p-8"
                    style={{ aspectRatio: platform === "TikTok" || platform === "Instagram" ? "unset" : "unset" }}>
                    <Upload className="w-8 h-8" />
                    <div className="text-center">
                      <p className="text-sm">Drop image or click to upload</p>
                      <p className="text-xs mt-1 text-violet-400/60">{ar.label} — optimized for {platform}</p>
                    </div>
                  </div>
                )}
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleImage(e.target.files[0])} />
              </div>
            </div>

            <div>
              <label className="text-xs text-white/40 uppercase tracking-widest mb-2 block">Caption / Hook Text</label>
              <textarea value={caption} onChange={(e) => setCaption(e.target.value)}
                placeholder={`Write your ${platform} caption here...\n\nInclude your hook, body, and CTA for best analysis.`}
                rows={6} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white placeholder:text-white/20 resize-none focus:outline-none focus:border-violet-500/50 transition-all" />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-white/20">{caption.length} chars</span>
                {caption.length > 150 && <span className="text-xs text-amber-400">Long caption — consider trimming</span>}
              </div>
            </div>

            {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-sm text-red-400">{error}</div>}

            <button onClick={analyze} disabled={loading}
              className="w-full bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 text-base shadow-lg shadow-violet-500/20">
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Analyzing with AI...</>
              ) : (
                <><Zap className="w-5 h-5" />Analyze Virality</>
              )}
            </button>
          </div>

          <div>
            {!result && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-white/20 border-2 border-dashed border-white/5 rounded-2xl p-12">
                <TrendingUp className="w-12 h-12 mb-4" />
                <p className="text-center text-sm">Your virality score and<br />detailed feedback will appear here</p>
              </div>
            )}
            {loading && (
              <div className="h-full flex flex-col items-center justify-center gap-4 border-2 border-dashed border-violet-500/20 rounded-2xl p-12">
                <div className="w-16 h-16 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
                <p className="text-white/40 text-sm">AI is analyzing your content...</p>
              </div>
            )}
            {result && (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-violet-500/10 to-pink-500/10 border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-white/40 text-sm">Virality Score</p>
                      <p className={`text-6xl font-black ${viralityColor}`}>{result.virality_score}<span className="text-2xl text-white/20">/100</span></p>
                    </div>
                    <ScoreRing score={result.virality_score} label="Overall" size="lg" />
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    <ScoreRing score={result.hook_score} label="Hook" />
                    <ScoreRing score={result.thumbnail_score} label="Visual" />
                    <ScoreRing score={result.caption_score} label="Caption" />
                    <ScoreRing score={result.engagement_score} label="Engage" />
                  </div>
                  <button onClick={saveAnalysis} disabled={saving || saved}
                    className={`mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${saved ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-white/5 hover:bg-violet-500/20 text-white/60 hover:text-violet-300 border border-white/10 hover:border-violet-500/30"}`}>
                    {saved ? <><Check className="w-4 h-4" />Saved to History</> : saving ? "Saving..." : <><BookMarked className="w-4 h-4" />Save to History</>}
                  </button>
                </div>

                {[
                  { icon: <Zap className="w-4 h-4" />, label: "Hook Analysis", content: result.hook_feedback, color: "text-amber-400" },
                  { icon: <ImageIcon className="w-4 h-4" />, label: "Thumbnail Feedback", content: result.thumbnail_feedback, color: "text-blue-400" },
                  { icon: <FileText className="w-4 h-4" />, label: "Caption Suggestions", content: result.caption_suggestions, color: "text-green-400" },
                  { icon: <Users className="w-4 h-4" />, label: "Competitor Insights", content: result.competitor_insights, color: "text-purple-400" },
                  { icon: <Music className="w-4 h-4" />, label: "Trending Audio", content: result.audio_recommendations, color: "text-pink-400" },
                  { icon: <Target className="w-4 h-4" />, label: "Top Improvements", content: result.overall_feedback, color: "text-red-400" },
                ].map(({ icon, label, content, color }) => (
                  <div key={label} className="bg-white/3 border border-white/8 rounded-xl p-4 hover:bg-white/5 transition-all">
                    <div className={`flex items-center gap-2 mb-2 ${color}`}>
                      {icon}<span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
                    </div>
                    <p className="text-sm text-white/70 leading-relaxed whitespace-pre-line">{content}</p>
                  </div>
                ))}

                <div className="bg-white/3 border border-white/8 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-cyan-400">
                      <Hash className="w-4 h-4" /><span className="text-xs font-semibold uppercase tracking-wider">Hashtag Pack</span>
                    </div>
                    <button onClick={copyHashtags} className="flex items-center gap-1 text-xs text-white/30 hover:text-white transition-colors">
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}{copied ? "Copied!" : "Copy all"}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.hashtag_recommendations.split(" ").map((tag, i) => (
                      <span key={i} className="bg-cyan-500/10 text-cyan-300 text-xs px-2 py-1 rounded-md font-mono hover:bg-cyan-500/20 cursor-pointer transition-all">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}