import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import NewsCarousel from '@/components/NewsCarousel';
import Products from '@/components/Products';
import AboutUs from '@/components/AboutUs';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      
      {/* Espaciador entre Hero y Noticias */}
      <div className="h-12 md:h-16 lg:h-20 bg-gray-50" />
      
      <NewsCarousel />
      
      {/* Espaciador entre Noticias y Productos */}
      <div className="h-12 md:h-16 lg:h-20 bg-gradient-to-b from-white to-gray-50" />
      
      <Products />
      
      {/* Espaciador entre Productos y Nosotros */}
      <div className="h-12 md:h-16 lg:h-20 bg-gradient-to-b from-gray-50 to-white" />
      
      <AboutUs />
      
      {/* Espaciador entre Nosotros y Footer */}
      <div className="h-12 md:h-16 lg:h-20" />
      
      <Footer />
    </main>
  );
}
