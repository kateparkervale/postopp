"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import LogFlow from "@/components/LogFlow";

function LogPageInner() {
  const searchParams = useSearchParams();
  const symptomId = searchParams.get("s");

  if (!symptomId) {
    return (
      <div className="flex items-center justify-center h-[calc(100dvh-4rem)]">
        <p className="text-xl text-gray-400">No symptom selected</p>
      </div>
    );
  }

  return <LogFlow symptomId={symptomId} />;
}

export default function LogPage() {
  return (
    <Suspense>
      <LogPageInner />
    </Suspense>
  );
}
