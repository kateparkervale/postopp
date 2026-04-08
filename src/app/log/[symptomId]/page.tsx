import type { Metadata } from "next";
import { SYMPTOM_CATALOG } from "@/db/symptoms";
import LogClient from "./LogClient";

export function generateStaticParams() {
  return SYMPTOM_CATALOG.map((s) => ({ symptomId: s.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ symptomId: string }>;
}): Promise<Metadata> {
  const { symptomId } = await params;
  const symptom = SYMPTOM_CATALOG.find((s) => s.id === symptomId);
  const name = symptom?.name ?? "Symptom";
  return {
    title: `Log ${name}`,
    description: `Rate your ${name.toLowerCase()} on a 1-10 pain scale and track it over time.`,
  };
}

export default function LogPage() {
  return <LogClient />;
}
