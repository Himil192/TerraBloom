// import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
// import './App.css';
// import Navbar from './component/NavBar/Navbar';
// import Home from './pages/Home';
// import Blog from './pages/Blog';
// import Products from './pages/Products';
// import Contact from './pages/Contact';
// import { ThemeProvider } from './theme/ThemeContext';
// import Footer from './component/Footer';
// import PrivacyPolicy from './pages/PrivacyPolicy';
// import TermsAndConditions from './pages/TermsAndConditions';
// import NotFound from './pages/404';
// import Login from './component/Login';
// import Signup from './component/Signup';
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import AdminDashboard from './pages/AdminDashboard';
// import UserDashboard from './pages/UserDashboard';
// import ProtectedRoute from './utils/ProtectedRoute';
// import Unauthorized from './pages/Unauthorized';
// import Profile from './pages/Profile/Profile';

// function App() {
//   const navLinks = [
//     { name: 'Home', href: '/' },
//     { name: 'Blog', href: '/blogs' },
//     { name: 'Product', href: '/products' },
//     { name: 'Contact Us', href: '/contact-us' },
//   ];

//   return (
//     <Router>
//       <ThemeProvider>
//         {/* Navbar */}
//         <Navbar links={navLinks} />

//         {/* Main container */}
//         <div className="flex flex-col min-h-screen">
//           <main className="flex-grow container">
//             <Routes>
//               {/* Public routes */}
//               <Route path="/" element={<Home />} />
//               <Route path="/blogs" element={<Blog />} />
//               <Route path="/products" element={<Products />} />
//               <Route path="/contact-us" element={<Contact />} />
//               <Route path="/privacy-policy" element={<PrivacyPolicy />} />
//               <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
//               <Route path="/login" element={<Login />} />
//               <Route path="/signup" element={<Signup />} />
//               <Route path="/unauthorized" element={<Unauthorized />} />

//               {/* Admin Dashboard (with nested routes) */}
//               <Route
//                 path="/admin-dashboard"
//                 element={
//                   <ProtectedRoute allowedRoles={['admin']}>
//                     <AdminDashboard />
//                   </ProtectedRoute>
//                 }
//               >
//                 <Route
//                   path="profile"
//                   element={
//                     <ProtectedRoute allowedRoles={['admin']}>
//                       <Profile />
//                     </ProtectedRoute>
//                   }
//                 />
//               </Route>

//               {/* User Dashboard (with nested routes) */}
//               <Route
//                 path="/user-dashboard"
//                 element={
//                   <ProtectedRoute allowedRoles={['user']}>
//                     <UserDashboard />
//                   </ProtectedRoute>
//                 }
//               >
//                 <Route
//                   path="profile"
//                   element={
//                     <ProtectedRoute allowedRoles={['user']}>
//                       <Profile />
//                     </ProtectedRoute>
//                   }
//                 />
//               </Route>

//               {/* 404 fallback */}
//               <Route path="*" element={<NotFound />} />
//             </Routes>
//           </main>

//           {/* Footer */}
//           <Footer className="fixed bottom-0" />

//           {/* Toast notifications */}
//           <ToastContainer
//             position="top-right"
//             autoClose={3000}
//             hideProgressBar={false}
//             newestOnTop={false}
//             closeOnClick
//             rtl={false}
//             pauseOnFocusLoss
//             draggable
//             pauseOnHover
//             theme="colored"
//           />
//         </div>
//       </ThemeProvider>
//     </Router>
//   );
// }

// export default App;


// import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
// import './App.css';
// import Navbar from './component/NavBar/Navbar';
// import Home from './pages/Home';
// import Blog from './pages/Blog';
// import Products from './pages/Products';
// import Contact from './pages/Contact';
// import { ThemeProvider } from './theme/ThemeContext';
// import Footer from './component/Footer';
// import PrivacyPolicy from './pages/PrivacyPolicy';
// import TermsAndConditions from './pages/TermsAndConditions';
// import NotFound from './pages/404';
// import Login from './component/Login';
// import Signup from './component/Signup';
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import AdminDashboard from './pages/AdminDashboard';
// import UserDashboard from './pages/UserDashboard';
// import ProtectedRoute from './utils/ProtectedRoute';
// import Unauthorized from './pages/Unauthorized';
// import Profile from './pages/Profile/Profile';
// import { useEffect } from 'react';

// function AppContent() {
//   const location = useLocation();

//   // Hide footer on dashboard routes
//   const hideFooter =
//     location.pathname.startsWith('/admin-dashboard') ||
//     location.pathname.startsWith('/user-dashboard');

//   const navLinks = [
//     { name: 'Home', href: '/' },
//     { name: 'Blog', href: '/blogs' },
//     { name: 'Product', href: '/products' },
//     { name: 'Contact Us', href: '/contact-us' },
//   ];

//   return (
//     <ThemeProvider>
//       {/* Navbar */}
//       <Navbar links={navLinks} />

//       {/* Main container */}
//       <div className="flex flex-col min-h-screen">
//         <main className="flex-grow container">
//           <Routes>
//             {/* Public routes */}
//             <Route path="/" element={<Home />} />
//             <Route path="/blogs" element={<Blog />} />
//             <Route path="/products" element={<Products />} />
//             <Route path="/contact-us" element={<Contact />} />
//             <Route path="/privacy-policy" element={<PrivacyPolicy />} />
//             <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/signup" element={<Signup />} />
//             <Route path="/unauthorized" element={<Unauthorized />} />

//             {/* Admin Dashboard */}
//             <Route
//               path="/admin-dashboard"
//               element={
//                 <ProtectedRoute allowedRoles={['admin']}>
//                   <AdminDashboard />
//                 </ProtectedRoute>
//               }
//             >
//               <Route
//                 path="profile"
//                 element={
//                   <ProtectedRoute allowedRoles={['admin']}>
//                     <Profile />
//                   </ProtectedRoute>
//                 }
//               />
//             </Route>

//             {/* User Dashboard */}
//             <Route
//               path="/user-dashboard"
//               element={
//                 <ProtectedRoute allowedRoles={['user']}>
//                   <UserDashboard />
//                 </ProtectedRoute>
//               }
//             >
//               <Route
//                 path="profile"
//                 element={
//                   <ProtectedRoute allowedRoles={['user']}>
//                     <Profile />
//                   </ProtectedRoute>
//                 }
//               />
//             </Route>

//             {/* 404 fallback */}
//             <Route path="*" element={<NotFound />} />
//           </Routes>
//         </main>

//         {/* ✅ Conditionally show footer */}
//         {!hideFooter && <Footer />}

//         <ToastContainer
//           position="top-right"
//           autoClose={3000}
//           hideProgressBar={false}
//           newestOnTop={false}
//           closeOnClick
//           rtl={false}
//           pauseOnFocusLoss
//           draggable
//           pauseOnHover
//           theme="colored"
//         />
//       </div>
//     </ThemeProvider>
//   );
// }

// function App() {
//   return (
//     <Router>
//       <AppContent />
//     </Router>
//   );
// }

// export default App;
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
import UserDashboard from './pages/UserDashboard';
import ProtectedRoute from './utils/ProtectedRoute';
import Unauthorized from './pages/Unauthorized';
import Profile from './pages/Profile/Profile';

function AppContent() {
  const location = useLocation();

  // Hide Navbar and Footer on dashboard routes
  const hideHeaderFooter =
    location.pathname.startsWith('/admin-dashboard') ||
    location.pathname.startsWith('/user-dashboard');

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Blog', href: '/blogs' },
    { name: 'Product', href: '/products' },
    { name: 'Contact Us', href: '/contact-us' },
  ];

  return (
    <ThemeProvider>
      {/* ✅ Conditionally show Navbar */}
      {!hideHeaderFooter && <Navbar links={navLinks} />}

      <div className="flex flex-col min-h-screen">
        <main className="flex-grow container">
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

        {/* ✅ Conditionally show Footer */}
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
      <AppContent />
    </Router>
  );
}

export default App;
