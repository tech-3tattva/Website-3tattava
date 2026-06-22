import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Layout from "./components/layout/Layout";
import { CartProvider } from "./context/CartContext";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import OurStory from "./pages/OurStory";
import KnowledgeCenter from "./pages/KnowledgeCenter";
import ArticleDetail from "./pages/ArticleDetail";
import ResearchTesting from "./pages/ResearchTesting";
import Community from "./pages/Community";
import FindUs from "./pages/FindUs";
import VaidyaConnect from "./pages/VaidyaConnect";
import DoshaQuiz from "./pages/DoshaQuiz";
import PerformanceAssessment from "./pages/PerformanceAssessment";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import "./index.css";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/products" element={<Shop />} />
            <Route path="/products/:slug" element={<ProductDetail />} />
            <Route path="/our-story" element={<OurStory />} />
            <Route path="/about" element={<OurStory />} />
            <Route path="/knowledge-center" element={<KnowledgeCenter />} />
            <Route path="/education/:slug" element={<ArticleDetail />} />
            <Route path="/research-testing" element={<ResearchTesting />} />
            <Route path="/community" element={<Community />} />
            <Route path="/find-us" element={<FindUs />} />
            <Route path="/vaidyaconnect" element={<VaidyaConnect />} />
            <Route path="/dosha-quiz" element={<DoshaQuiz />} />
            <Route path="/assessment" element={<PerformanceAssessment />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/checkout/cart" element={<Checkout />} />
            <Route path="/checkout/address" element={<Checkout />} />
            <Route path="/checkout/payment" element={<Checkout />} />
            <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </CartProvider>
  );
}
