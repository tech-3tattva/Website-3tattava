import type { Metadata } from "next";
import FindUsClient from "./FindUsClient";

export const metadata: Metadata = {
  title: "Find Us | 3TATTAVA — Experience Centers & WTF Gyms",
  description:
    "Find 3TATTAVA experience centers and WTF gym partner locations near you. 28 centers across Delhi NCR — search by city or pincode.",
};

export default function FindUsPage() {
  return <FindUsClient />;
}
