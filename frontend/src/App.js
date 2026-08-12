import "@/App.css";
import "@/index.css";
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/context/ThemeContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import Home from "@/pages/Home";
import { useLenis } from "@/hooks/useLenis";

const Brand = lazy(() => import("@/pages/Brand"));
const Product = lazy(() => import("@/pages/Product"));
const Activity = lazy(() => import("@/pages/Activity"));
const Collections = lazy(() => import("@/pages/Collections"));
const Quiz = lazy(() => import("@/pages/Quiz"));
const Technology = lazy(() => import("@/pages/Technology"));
const Frames = lazy(() => import("@/pages/Frames"));
const LensGallery = lazy(() => import("@/pages/LensGallery"));
const Blog = lazy(() => import("@/pages/Blog"));
const BlogPost = lazy(() => import("@/pages/BlogPost"));
const FAQ = lazy(() => import("@/pages/FAQ"));
const Contact = lazy(() => import("@/pages/Contact"));
const WarrantyReturns = lazy(() => import("@/pages/WarrantyReturns"));

function AppInner() {
  useLenis();
  return (
    <div className="App min-h-screen font-body bg-white dark:bg-rc-dark text-gray-900 dark:text-white">
      <Navbar />
      <CartDrawer />
      <Suspense fallback={<div className="min-h-screen bg-white dark:bg-rc-dark" />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/brand" element={<Brand />} />
          <Route path="/products/:handle" element={<Product />} />
          <Route path="/activities/:activity" element={<Activity />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/collections/:collection" element={<Collections />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/technology" element={<Technology />} />
          <Route path="/frames" element={<Frames />} />
          <Route path="/lenses" element={<LensGallery />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/warranty-and-returns" element={<WarrantyReturns />} />
        </Routes>
      </Suspense>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <BrowserRouter>
          <AppInner />
        </BrowserRouter>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
