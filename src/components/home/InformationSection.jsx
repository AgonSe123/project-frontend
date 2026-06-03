import backgroundImage from '@/assets/information-section-background.jpg';
import { informationSection } from '@/content/homeSections';
import { Paragraph } from '@/components/home/Paragraph';
import { FullBleed } from '@/components/home/FullBleed';

export function InformationSection() {
  const structure = informationSection;

  return (
    <FullBleed>
      <div
        id="information"
        className="py-24 bg-no-repeat bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(19, 84, 122, 0.82), rgba(128, 208, 199, 0.82)), url(${backgroundImage})`,
        }}
      >
        <div className="container mx-auto px-6 text-white">
          <h2 className="mb-6 font-bold text-center text-5xl">
            {structure.title}
          </h2>

          <div className="relative text-center lg:text-start">
            <div className="hidden lg:block w-[8px] h-79/100 bg-[#80d0c7] absolute top-0 left-[48px] box-border z-0" />

            <Paragraph
              title={structure.questions[0].title}
              body={structure.questions[0].body}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="size-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </Paragraph>
            <Paragraph
              title={structure.questions[1].title}
              body={structure.questions[1].body}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="size-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605"
                />
              </svg>
            </Paragraph>
            <Paragraph
              title={structure.questions[2].title}
              body={structure.questions[2].body}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="size-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                />
              </svg>
            </Paragraph>
          </div>
        </div>
      </div>
    </FullBleed>
  );
}
