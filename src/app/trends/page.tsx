import type { Metadata } from "next";
import TrendsClient from "./TrendsClient";

export const metadata: Metadata = {
  title: "Trends",
  description:
    "Visualize symptom trends over time — see weekly, monthly, and quarterly pain patterns to share with your care team.",
};

export default function TrendsPage() {
  return <TrendsClient />;
}
