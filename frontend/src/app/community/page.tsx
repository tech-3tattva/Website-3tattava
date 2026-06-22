import type { Metadata } from "next";
import CommunityClient from "./CommunityClient";

export const metadata: Metadata = {
  title: "Community | 3TATTAVA — Athletes, Trainers & Transformation Stories",
  description:
    "Join the 3TATTAVA Performance Ayurveda™ community. Athletes, 136+ WTF-certified trainers, BAMS doctors, and documented transformation stories from people who train hard and recover with intention.",
};

export default function CommunityPage() {
  return <CommunityClient />;
}
