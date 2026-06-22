import React from "react";
import { WHATSAPP_NUMBER } from "../lib/assets";

export default function WhatsAppFloat() {
  const message = encodeURIComponent("Hi 3Tattava! I'd like to know more about Performance Ayurveda.");
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      data-testid="whatsapp-float"
      className="fixed bottom-6 left-6 z-[70] w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-[0_18px_40px_rgba(37,211,102,0.45)] hover:scale-110 transition-all duration-300"
      style={{ background: "#25D366" }}
    >
      <svg viewBox="0 0 32 32" width="28" height="28" fill="white" aria-hidden="true">
        <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035.888 2.722.888.345 0 .574-.13.86-.34.346-.26.793-.92.95-1.317a.81.81 0 0 0 .057-.473c-.13-.272-1.36-.764-1.86-.764zM16.16 5.92c-5.527 0-10.024 4.498-10.024 10.025 0 1.825.495 3.61 1.43 5.176l-.962 5.4 5.534-1.067a10.038 10.038 0 0 0 4.022.836c5.527 0 10.025-4.498 10.025-10.025S21.687 5.92 16.16 5.92zm-.27 17.42c-1.486 0-2.946-.4-4.222-1.155l-2.93.55.578-2.86A8.358 8.358 0 0 1 7.81 14.97c0-4.6 3.744-8.343 8.344-8.343 4.6 0 8.343 3.743 8.343 8.343 0 4.6-3.743 8.37-8.61 8.37z" />
      </svg>
    </a>
  );
}
