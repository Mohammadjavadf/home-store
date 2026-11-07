import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "sonner";

// Layout
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ScrollToTop from "./components/layout/ScrollToTop";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Admin
import AdminRoute from "./admin/AdminRoute";
import AdminLayout from "./admin/components/AdminLayout";
import AdminLogin from "./admin/pages/AdminLogin";
import Dashboard from "./admin/pages/Dashboard";
import ProductsList from "./admin/pages/ProductsList";
import CategoriesList from "./admin/pages/CategoriesList";
import OrdersList from "./admin/pages/OrdersList";
import CouponsList from "./admin/pages/CouponsList";
import BlogList from "./admin/pages/BlogList";
import CommentsList from "./admin/pages/CommentsList";
import UsersList from "./admin/pages/UsersList";
import RewardsList from "./admin/pages/RewardsList";
import Settings from "./admin/pages/Settings";
import ProductForm from "./admin/pages/ProductForm";
import OrderDetail from "./admin/pages/OrderDetail";
import BlogForm from "./admin/pages/BlogForm";

// Pages
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Compare from "./pages/Compare";

// Auth
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Account
import AccountLayout from "./pages/account/AccountLayout";
import Profile from "./pages/account/Profile";
import Orders from "./pages/account/Orders";
import Wishlist from "./pages/account/Wishlist";
import Addresses from "./pages/account/Addresses";

// Blog
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";

// Rewards
import Rewards from "./pages/Rewards";

// Compare Bar
import CompareBar from "./components/product/CompareBar";

// Theme
import { useThemeStore } from "./store/themeStore";

function AppContent() {
  const theme = useThemeStore((s) => s.theme);
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);

  return (
    <>
      <ScrollToTop />
      <Toaster
        position="top-center"
        dir="rtl"
        richColors
        closeButton
        toastOptions={{
          style: { fontFamily: "Vazirmatn, sans-serif" },
        }}
      />

      {isAdminRoute ? (
        /* ============ پنل مدیریت ============ */
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="products" element={<ProductsList />} />
            <Route path="products" element={<ProductsList />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/:id/edit" element={<ProductForm />} />
            <Route path="categories" element={<CategoriesList />} />
            <Route path="orders" element={<OrdersList />} />
            <Route path="orders" element={<OrdersList />} />
            <Route path="orders/:id" element={<OrderDetail />} />
            <Route path="coupons" element={<CouponsList />} />
            <Route path="blog" element={<BlogList />} />
            <Route path="blog/new" element={<BlogForm />} />
            <Route path="blog/:slug/edit" element={<BlogForm />} />
            <Route path="comments" element={<CommentsList />} />
            <Route path="users" element={<UsersList />} />
            <Route path="rewards" element={<RewardsList />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      ) : (
        /* ============ فروشگاه ============ */
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* عمومی */}
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />

              {/* وبلاگ */}
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />

              {/* احراز هویت */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* باشگاه (مستقل) */}
              <Route path="/rewards" element={<Rewards />} />

              {/* پنل کاربری */}
              <Route
                path="/account"
                element={
                  <ProtectedRoute>
                    <AccountLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Profile />} />
                <Route path="orders" element={<Orders />} />
                <Route path="wishlist" element={<Wishlist />} />
                <Route path="addresses" element={<Addresses />} />
                <Route path="rewards" element={<Rewards />} />
              </Route>

              {/* ۴۰۴ */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <CompareBar />
        </div>
      )}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
