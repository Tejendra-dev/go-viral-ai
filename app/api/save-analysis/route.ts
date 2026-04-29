import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { error } = await supabase.from("analyses").insert({
      user_id: user.id,
      content_type: body.content_type,
      caption: body.caption,
      platform: body.platform,
      virality_score: body.virality_score,
      hook_score: body.hook_score,
      thumbnail_score: body.thumbnail_score,
      caption_score: body.caption_score,
      engagement_score: body.engagement_score,
      hook_feedback: body.hook_feedback,
      thumbnail_feedback: body.thumbnail_feedback,
      caption_suggestions: body.caption_suggestions,
      hashtag_recommendations: body.hashtag_recommendations,
      audio_recommendations: body.audio_recommendations,
      competitor_insights: body.competitor_insights,
      overall_feedback: body.overall_feedback,
    });

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Save error:", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}