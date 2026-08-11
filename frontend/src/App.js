import "@/App.css";
import "@/index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import Home from "@/pages/Home";
import Brand from "@/pages/Brand";
import Product from "@/pages/Product";
import Activity from "@/pages/Activity";
import Collections from "@/pages/Collections";
import { useLenis } from "@/hooks/useLenis";

function AppInner() {
  useLenis();
  return (
    <div className="App bg-rc-dark text-white min-h-screen font-body">
      <Navbar />
      <CartDrawer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/brand" element={<Brand />} />
        <Route path="/products/:handle" element={<Product />} />
        <Route path="/activities/:activity" element={<Activity />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/collections/:collection" element={<Collections />} />
      </Routes>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <AppInner />
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
