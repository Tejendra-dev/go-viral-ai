# AI Build Log — GoViral.AI

## Tool Used
Claude (Anthropic) — claude.ai

## Summary
Built entire GoViral.AI application using Claude as primary development assistant over 2 days.

## Key AI-Assisted Steps

### 1. Project Setup
- Prompted Claude to analyze contest requirements
- Asked Claude to plan full tech architecture
- Claude suggested: Next.js 16 + Groq API + Supabase stack

### 2. Database Design
- Asked Claude to design Supabase schema for analyses table
- Claude created SQL with RLS policies

### 3. API Route Development
- Claude wrote entire /api/analyze/route.ts with Groq integration
- Iterated on JSON prompt engineering for structured AI output
- Debugged Gemini API 404/429 errors → switched to Groq

### 4. UI Components
- Claude built analyze page with score rings, feedback cards
- Built history and dashboard pages with real data
- Created ScoreRing SVG component

### 5. Auth & Deployment
- Debugged Supabase publishable key format issues
- Fixed middleware redirect loops
- Resolved Vercel env variable whitespace issues

## Iterations
- Model switch: gemini-1.5-flash → gemini-2.0-flash → gemini-1.5-flash-8b → groq llama-3.3-70b
- Sign out: form POST → fetch POST → client-side supabase.auth.signOut()
- Nav: Link tags → anchor tags to fix redirect loops