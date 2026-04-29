export interface AnalysisResult {
  virality_score: number;
  hook_score: number;
  thumbnail_score: number;
  caption_score: number;
  engagement_score: number;
  hook_feedback: string;
  thumbnail_feedback: string;
  caption_suggestions: string;
  hashtag_recommendations: string;
  audio_recommendations: string;
  competitor_insights: string;
  overall_feedback: string;
}

export interface Analysis extends AnalysisResult {
  id: string;
  user_id: string;
  content_type: "image" | "caption";
  caption: string;
  platform: string;
  image_url?: string;
  created_at: string;
}

export type Platform = "TikTok" | "Instagram" | "YouTube" | "Twitter/X" | "LinkedIn";