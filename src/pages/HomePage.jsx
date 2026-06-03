import { HomeHero } from '@/components/home/HomeHero';
import { Categories } from '@/components/home/Categories';
import { InformationSection } from '@/components/home/InformationSection';
import { FAQs } from '@/components/home/FAQs';

export function HomePage() {
  return (
    <div>
      <HomeHero />
      <Categories />
      <InformationSection />
      <FAQs />
    </div>
  );
}
