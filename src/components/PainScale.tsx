"use client";

import { getPainColor } from "@/lib/constants";

interface PainScaleProps {
  value: number | null;
  onChange: (level: number) => void;
}

export default function PainScale({ value, onChange }: PainScaleProps) {
  return (
    <div className="grid grid-cols-5 gap-3" role="radiogroup" aria-label="Pain level from 1 to 10">
      {Array.from({ length: 10 }, (_, i) => i + 1).map((level) => {
        const isSelected = value === level;
        const color = getPainColor(level);
        return (
          <button
            key={level}
            onClick={() => onChange(level)}
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold transition-transform active:scale-95 focus:outline-none focus:ring-3 focus:ring-white"
            style={{
              backgroundColor: isSelected ? color : "rgba(255,255,255,0.1)",
              color: isSelected ? "#fff" : color,
              border: isSelected ? "3px solid #fff" : `2px solid ${color}`,
            }}
            role="radio"
            aria-checked={isSelected}
            aria-label={`Pain level ${level} out of 10`}
          >
            {level}
          </button>
        );
      })}
    </div>
  );
}
