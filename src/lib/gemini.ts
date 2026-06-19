import { BusinessPlan } from "../types";

export async function generateBusinessPlan(category: string): Promise<BusinessPlan> {
  const response = await fetch("/api/generate-plan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ category }),
  });
  if (!response.ok) throw new Error("Failed to generate plan");
  return response.json();
}

export async function chatWithAI(message: string, history?: any[]) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
  });
  if (!response.ok) throw new Error("Failed to chat");
  return response.json();
}
