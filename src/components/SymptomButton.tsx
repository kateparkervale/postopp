"use client";

import Link from "next/link";
import type { Symptom } from "@/types";

interface SymptomButtonProps {
  symptom: Symptom;
}

export default function SymptomButton({ symptom }: SymptomButtonProps) {
  return (
    <Link
      href={`/log/${symptom.id}`}
      className="flex flex-col items-center justify-center rounded-2xl transition-transform active:scale-95 focus:outline-none focus:ring-3 focus:ring-white"
      style={{ backgroundColor: symptom.color }}
      aria-label={`Log ${symptom.name}`}
    >
      <span className="text-5xl mb-2" aria-hidden="true">
        {symptom.icon}
      </span>
      <span className="text-xl font-bold text-white">{symptom.shortName}</span>
    </Link>
  );
}
