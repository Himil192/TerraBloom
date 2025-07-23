import { href, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
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
import { useEffect, useState } from 'react';
import NotFound from './pages/404';
import Login from './component/Login';
import Signup from './component/Signup';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import ProtectedRoute from './utils/ProtectedRoute';
import Unauthorized from './pages/Unauthorized';

function App() {
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Blog', href: '/blogs' },
    { name: 'Product', href: '/products' },
    { name: 'Contact Us', href: '/contact-us' },
  ];



  return (

    <>
      <Router  >
        <ThemeProvider>
          {/* Navbar */}
          <Navbar links={navLinks} />

          {/* Main container */}
          <div className="flex flex-col min-h-screen">
            <main className="flex-grow container p-6 mx-auto">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/blogs" element={<Blog />} />
                <Route path="/products" element={<Products />} />
                <Route path="/contact-us" element={<Contact />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path='/terms-and-conditions' element={<TermsAndConditions />} />
                <Route path='/login' element={<Login />} />
                <Route path='/signup' element={<Signup />} />
                <Route path='*' element={<NotFound />} />


                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* Role-based protected routes */}
                <Route
                  path="/admin-dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/user-dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['user']}>
                      <UserDashboard />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>

            <Footer />

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
      </Router>
    </>
  );
}
export default App;
