"use client";

import { useParams } from "next/navigation";
import LogFlow from "@/components/LogFlow";

export default function LogClient() {
  const params = useParams();
  const symptomId = params.symptomId as string;
  return <LogFlow symptomId={symptomId} />;
}
