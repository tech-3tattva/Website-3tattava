import React, { useEffect, useState } from "react";
import { ANNOUNCEMENT_MESSAGES } from "../../lib/brandContent";

export default function AnnouncementBar() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % ANNOUNCEMENT_MESSAGES.length), 5000);
    return () => clearInterval(t);
  }, []);
  return (
    <div data-testid="announcement-bar" className="bg-ink text-cream text-center py-2.5 overflow-hidden relative">
      <div key={idx} className="animate-fade-in eyebrow" style={{ fontSize: 10.5, letterSpacing: "0.32em" }}>
        {ANNOUNCEMENT_MESSAGES[idx]}
      </div>
    </div>
  );
}
