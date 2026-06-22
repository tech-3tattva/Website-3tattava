import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import AnnouncementBar from "./AnnouncementBar";
import CartDrawer from "../CartDrawer";
import Chatbot from "../Chatbot";
import WhatsAppFloat from "../WhatsAppFloat";
import PillarJourney from "../PillarJourney";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
      <Chatbot />
      <WhatsAppFloat />
      <PillarJourney />
    </div>
  );
}
