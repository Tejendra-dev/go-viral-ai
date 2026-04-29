"use client";

interface ScoreRingProps {
  score: number;
  label: string;
  size?: "sm" | "lg";
}

export function ScoreRing({ score, label, size = "sm" }: ScoreRingProps) {
  const isLg = size === "lg";
  const radius = isLg ? 54 : 36;
  const stroke = isLg ? 8 : 6;
  const dim = (radius + stroke) * 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 75 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={dim} height={dim} className="-rotate-90">
        <circle cx={dim/2} cy={dim/2} r={radius} fill="none" stroke="#ffffff10" strokeWidth={stroke} />
        <circle cx={dim/2} cy={dim/2} r={radius} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease" }} />
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle"
          style={{ fill: color, fontSize: isLg ? "22px" : "14px", fontWeight: 700,
            transform: "rotate(90deg)", transformOrigin: "center", transformBox: "fill-box" }}>
          {score}
        </text>
      </svg>
      <span className="text-xs text-white/50 text-center">{label}</span>
    </div>
  );
}