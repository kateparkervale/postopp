import type { Metadata } from "next";
import FollowUpClient from "./FollowUpClient";

export const metadata: Metadata = {
  title: "Follow-Up",
  description:
    "Rate how your symptom has changed since your last log. Track your recovery over time.",
};

export default function FollowUpPage() {
  return <FollowUpClient />;
}
