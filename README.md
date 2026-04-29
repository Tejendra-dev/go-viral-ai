# GoViral.AI — AI Content Virality Analyzer

> Built for the 8x Engineer "Go Viral" Contest

## Live Demo
🔗 [go-viral-ai.vercel.app](https://go-viral-ai.vercel.app)

## What it does
GoViral.AI analyzes your social media content and predicts its viral potential with a 0–100 score and actionable feedback.

## Features
- 🎯 Virality Score (0-100) with breakdown
- 🪝 Hook Analysis (first 3 seconds strength)
- 🖼️ Thumbnail feedback & best practices
- ✍️ Caption optimization (3 AI alternatives)
- #️⃣ 10 trending hashtags per platform
- 🎵 Trending audio recommendations
- 👥 Competitor insights
- 📊 History & Dashboard with analytics
- 🔐 Auth (signup/login/signout)

## Tech Stack
- Next.js 16 (App Router)
- TypeScript + Tailwind CSS
- Supabase (PostgreSQL + Auth)
- Groq API (Llama 3.3 70B) for AI analysis
- Vercel (deployment)

## Note on AI
Built entirely on free-tier APIs. Groq's Llama 3.3 70B powers all content analysis. With premium APIs (Gemini Vision, GPT-4V), real image/video analysis would be added in v2.

## Setup
1. Clone repo
2. `pnpm install`
3. Add env vars (Supabase + Groq keys)
4. `pnpm dev`