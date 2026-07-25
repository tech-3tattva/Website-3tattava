import type { Metadata } from "next";
import FindUsLaunchingSoon from "./FindUsLaunchingSoon";
// Experience-center finder is pre-launch. To restore the live WTF finder at launch:
//   import FindUsClient from "./FindUsClient";  and return <FindUsClient />.

export const metadata: Metadata = {
  title: "Find Us | 3TATTAVA — Experience Centers Launching Soon",
  description:
    "3TATTAVA offline experience centers are launching soon. Join the founding waitlist to be the first to know when centers open near you.",
};

export default function FindUsPage() {
  return <FindUsLaunchingSoon />;
}
