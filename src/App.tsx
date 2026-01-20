import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import MainLayout from './layouts/MainLayout/MainLayout';
import Home from './pages/Home/Home';
import Experience from './pages/Experience/Experience';
import Education from './pages/Education/Education';
import Blog from './pages/Blog/Blog';
import BlogPost from './pages/BlogPost/BlogPost';
import Contact from './pages/Contact/Contact';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Router>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/experience" element={<Experience />} />
              <Route path="/education" element={<Education />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </MainLayout>
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
