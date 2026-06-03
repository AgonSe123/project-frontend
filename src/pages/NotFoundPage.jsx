import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { FullBleed } from '@/components/home/FullBleed';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <>
      <FullBleed>
        <header className="header-gradient py-37 text-center">
          <div className="container mx-auto flex flex-col gap-4 px-6">
            <h1 className="mb-2 w-full text-4xl font-bold text-white sm:text-5xl md:text-6xl">
              404
            </h1>
            <h2 className="mb-2 text-1xl font-semibold text-[#13547a] sm:text-2xl">
              Page Not Found!
            </h2>
          </div>
        </header>
      </FullBleed>

      <div className="container mx-auto my-25 flex justify-center px-12">
        <Button variant="secondary" onClick={() => navigate('/')}>
          Go to Home
        </Button>
      </div>
    </>
  );
}
