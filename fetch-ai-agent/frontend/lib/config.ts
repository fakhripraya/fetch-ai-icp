// lib/config.ts
import axios from "axios";

// Helper to throw error if env is missing
function required(key: string, value: string | undefined): string {
  if (typeof value === "undefined" || value === "") {
    throw new Error(`❌ Missing required env var: ${key}`);
  }
  return value;
}

export const config = {
  agentApiUrl: required("NEXT_PUBLIC_AGENT_API_URL", process.env.NEXT_PUBLIC_AGENT_API_URL),
  icpApiUrl: required("NEXT_PUBLIC_ICP_API_URL", process.env.NEXT_PUBLIC_ICP_API_URL),

  // Optional with fallback
  nodeEnv: process.env.NODE_ENV ?? "development",
};
