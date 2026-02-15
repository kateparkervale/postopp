import { SYMPTOM_CATALOG } from "@/db/symptoms";
import LogClient from "./LogClient";

export function generateStaticParams() {
  return SYMPTOM_CATALOG.map((s) => ({ symptomId: s.id }));
}

export default function LogPage() {
  return <LogClient />;
}
