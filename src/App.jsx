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

function App() {
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Blog', href: '/blogs' },
    { name: 'Product', href: '/products' },
    { name: 'Contact Us', href: '/contact-us' },
  ];
  return (
    <>
      <Router basename="/TerraBloom">
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
              </Routes>
            </main>

            {/* Footer */}
            <Footer />



          </div>
        </ThemeProvider>
      </Router>

    </>
  );
}

export default App;
