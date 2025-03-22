import { Hero } from '../components/Hero';
import { Features } from '../components/Features';
import { FeaturedListings } from '../components/FeaturedListings';
import { Testimonials } from '../components/Testimonials';
import { CTASection } from '../components/CTASection';

export function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <FeaturedListings />
      <Testimonials />
      <CTASection />
    </>
  );
}