import type { Metadata } from "next";
import FindUsClient from "./FindUsClient";

export const metadata: Metadata = {
  title: "Find Us | 3TATTAVA — 28 WTF Gym Experience Centers Across NCR",
  description:
    "Experience 3TATTAVA offline at 28 WTF Gym Experience Centers across Delhi NCR. Enter your pincode to find the nearest center. Try before you buy, meet trained staff, and consult with experts.",
};

export default function FindUsPage() {
  return <FindUsClient />;
}
