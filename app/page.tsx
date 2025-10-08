import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import CTASection from '@/components/CTASection';
import Products from '@/components/Products';
import AboutUs from '@/components/AboutUs';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <CTASection />
      <Products />
      <AboutUs />
      <Footer />
    </main>
  );
}
