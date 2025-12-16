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
      <NewsCarousel />
      <Products />
      <AboutUs />
      <Footer />
    </main>
  );
}
