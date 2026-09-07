import ScrollToTop from './component/ScrollToTop';
import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Navbar from './component/NavBar/Navbar';
import Home from './pages/Home';
import Blog from './pages/Blog';
import Products from './pages/Products';
import Contact from './pages/Contact';
import { ThemeProvider } from './theme/ThemeContext';
import Footer from './component/Footer';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import NotFound from './pages/404';
import Login from './component/Login';
import Signup from './component/Signup';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminDashboard from './pages/AdminDashboard';
import Overview from './pages/admin/Overview';
import AdminProducts from './pages/admin/Products';
import AdminBlogs from './pages/admin/Blogs';
import AdminOrders from './pages/admin/Orders';
import AdminCustomers from './pages/admin/Customers';
import AdminSettings from './pages/admin/Settings';
import UserDashboard from './pages/UserDashboard';
import ProtectedRoute from './utils/ProtectedRoute';
import Unauthorized from './pages/Unauthorized';
import Profile from './pages/Profile/Profile';

function AppContent() {
  const location = useLocation();

  // Hide Navbar and Footer on dashboard routes
  const hideHeaderFooter =
    location.pathname.startsWith('/admin-dashboard') ||
    location.pathname.startsWith('/user-dashboard') ||
    location.pathname === '/login' ||
    location.pathname === '/signup';

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Blog', href: '/blogs' },
    { name: 'Product', href: '/products' },
    { name: 'Contact Us', href: '/contact-us' },
  ];

  return (
    <ThemeProvider>
      {/* Conditionally show Navbar */}
      {!hideHeaderFooter && <Navbar links={navLinks} />}

      <div className="flex flex-col min-h-screen">
        <main className="flex-grow w-full">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/blogs" element={<Blog />} />
            <Route path="/products" element={<Products />} />
            <Route path="/contact-us" element={<Contact />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Admin Dashboard */}
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            >
              <Route
                index
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Overview />
                  </ProtectedRoute>
                }
              />
              <Route
                path="products"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminProducts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="blogs"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminBlogs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="orders"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminOrders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="customers"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminCustomers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="settings"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminSettings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="profile"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Profile />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* User Dashboard */}
            <Route
              path="/user-dashboard"
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <UserDashboard />
                </ProtectedRoute>
              }
            >
              <Route
                path="profile"
                element={
                  <ProtectedRoute allowedRoles={['user']}>
                    <Profile />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* 404 fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* Conditionally show Footer */}
        {!hideHeaderFooter && <Footer />}

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
    </ThemeProvider>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}

export default App;
