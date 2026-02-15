import type { Symptom } from "@/types";

export const SYMPTOM_CATALOG: Symptom[] = [
  { id: "ptsd", name: "PTSD Episode", shortName: "PTSD", icon: "🧠", color: "#5B4FCF", category: "mental-health" },
  { id: "migraine", name: "Migraine", shortName: "Migraine", icon: "⚡", color: "#CF4F4F", category: "neurological" },
  { id: "hip-pain", name: "Hip Pain", shortName: "Hip Pain", icon: "🦴", color: "#CF8F4F", category: "musculoskeletal" },
  { id: "sinus", name: "Sinus Infection", shortName: "Sinus", icon: "🤧", color: "#4FA0CF", category: "respiratory" },
  { id: "back-pain", name: "Back Pain", shortName: "Back", icon: "💪", color: "#8B6F47", category: "musculoskeletal" },
  { id: "knee-pain", name: "Knee Pain", shortName: "Knee", icon: "🦵", color: "#A0522D", category: "musculoskeletal" },
  { id: "tinnitus", name: "Tinnitus", shortName: "Tinnitus", icon: "👂", color: "#708090", category: "neurological" },
  { id: "anxiety", name: "Anxiety", shortName: "Anxiety", icon: "😰", color: "#6A5ACD", category: "mental-health" },
  { id: "depression", name: "Depression", shortName: "Depression", icon: "🌧️", color: "#4169E1", category: "mental-health" },
  { id: "insomnia", name: "Insomnia", shortName: "Insomnia", icon: "🌙", color: "#2F4F4F", category: "mental-health" },
  { id: "gi-issues", name: "GI Issues", shortName: "Stomach", icon: "🫃", color: "#6B8E23", category: "gastrointestinal" },
  { id: "shoulder", name: "Shoulder Pain", shortName: "Shoulder", icon: "🤷", color: "#B8860B", category: "musculoskeletal" },
  { id: "neck-pain", name: "Neck Pain", shortName: "Neck", icon: "🔝", color: "#CD853F", category: "musculoskeletal" },
  { id: "fatigue", name: "Fatigue", shortName: "Fatigue", icon: "😴", color: "#696969", category: "general" },
  { id: "dizziness", name: "Dizziness", shortName: "Dizzy", icon: "💫", color: "#9370DB", category: "neurological" },
  { id: "headache", name: "Headache", shortName: "Headache", icon: "🤕", color: "#DC143C", category: "neurological" },
];

export const DEFAULT_ACTIVE_IDS = ["ptsd", "migraine", "hip-pain", "sinus"];

export function getSymptomById(id: string): Symptom | undefined {
  return SYMPTOM_CATALOG.find((s) => s.id === id);
}
