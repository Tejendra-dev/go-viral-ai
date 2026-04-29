import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const caption = formData.get("caption") as string;
    const platform = formData.get("platform") as string;
    const imageFile = formData.get("image") as File | null;

    const prompt = `You are a viral content strategist who has analyzed 59M+ views of social media content. Analyze this ${platform} content.

Caption: "${caption || "No caption provided"}"
Platform: ${platform}
${imageFile ? "Note: User also uploaded a thumbnail image. Provide thumbnail feedback based on best practices for this platform." : ""}

Respond ONLY with valid JSON, no markdown, no extra text:
{
  "virality_score": <0-100 integer>,
  "hook_score": <0-100 integer>,
  "thumbnail_score": <0-100 integer>,
  "caption_score": <0-100 integer>,
  "engagement_score": <0-100 integer>,
  "hook_feedback": "<specific feedback on opening hook strength>",
  "thumbnail_feedback": "<specific feedback on visual best practices for ${platform}>",
  "caption_suggestions": "<3 improved captions numbered 1. 2. 3.>",
  "hashtag_recommendations": "#hashtag1 #hashtag2 #hashtag3 #hashtag4 #hashtag5 #hashtag6 #hashtag7 #hashtag8 #hashtag9 #hashtag10",
  "audio_recommendations": "<3 trending audio types numbered 1. 2. 3.>",
  "competitor_insights": "<3 specific tactics top creators in this niche use>",
  "overall_feedback": "<top 3 highest-impact changes ranked by virality boost>"
}`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1500,
    });

    const text = completion.choices[0]?.message?.content || "";
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return NextResponse.json({ success: true, data: parsed });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json({ success: false, error: "Analysis failed." }, { status: 500 });
  }
}