import { href, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './component/NavBar/Navbar';
import Home from './pages/Home';
import Blog from './pages/Blog';
import Products from './pages/Products';
import Contact from './pages/Contact';

function App() {
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Blog', href: '/blogs' },
    { name: 'Product', href: '/products' },
    { name: 'Contact Us', href: '/contact-us' },
  ];
  return (
    <>
      <Router>
        <Navbar links={navLinks} />
        {/*main contains */}
        <div className='container p-6 mx-auto '>
          <Routes>

            <Route path='/' element={<Home />} />
            <Route path="/blogs" element={<Blog />} />
            <Route path='/products' element={<Products />} />
            <Route path='/contact-us' element={<Contact />} />
          </Routes>
        </div>
      </Router>

    </>
  );
}

export default App;
