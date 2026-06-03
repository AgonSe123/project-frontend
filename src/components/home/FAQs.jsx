import { useState } from 'react';
import graph from '@/assets/faq-graphic.jpg';
import { faqSection } from '@/content/homeSections';
import { Accordion } from '@/components/home/Accordion';
import { FullBleed } from '@/components/home/FullBleed';

export function FAQs() {
  const structure = faqSection;
  const [openTab, setOpenTab] = useState(structure.questions[0].title);

  return (
    <FullBleed>
      <div id="faqs" className="container mx-auto py-25 px-12">
        <h2 className="mb-6 text-5xl font-bold w-full lg:w-[500px]">
          {structure.title}
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-10">
          <div className="w-full sm:w-[500px]">
            <img src={graph} alt="" />
          </div>
          <div className="flex flex-col gap-1 w-full sm:w-[500px] md:w-[600px] lg:w-[700px]">
            {structure.questions.map((question) => (
              <Accordion
                key={question.title}
                title={question.title}
                description={question.body}
                isOpen={openTab === question.title}
                setTab={setOpenTab}
              />
            ))}
          </div>
        </div>
      </div>
    </FullBleed>
  );
}
