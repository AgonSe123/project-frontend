import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="size-6"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
      />
    </svg>
  );
}

export function HomeHero() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  function handleSearch() {
    const trimmed = query.trim();
    if (!trimmed) return;
    navigate(`/products?search=${encodeURIComponent(trimmed)}`);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }

  return (
    <header
      id="home"
      className="header-gradient relative left-1/2 mb-8 w-screen -translate-x-1/2 py-24 text-center sm:py-32 md:py-36 lg:py-37"
    >
      <div className="container mx-auto flex flex-col items-center px-6">
        <h1 className="mb-2 w-full text-4xl font-bold text-white sm:text-5xl md:text-6xl">
          TechScout
        </h1>
        <h2 className="mb-2 text-lg font-semibold text-brand-dark sm:text-2xl">
          Your shortcut to smart shopping
        </h2>

        <div className="mx-auto mt-6 flex h-18 w-9/10 max-w-[900px] items-center justify-between rounded-[100px] bg-white py-3 pr-2 pl-2 md:w-[700px] lg:w-[900px]">
          <div className="flex w-full items-center">
            <span className="px-4 text-brand-dark">
              <SearchIcon />
            </span>
            <input
              className="w-full py-4 pr-4 text-base text-muted outline-none sm:text-xl"
              type="search"
              placeholder="Search for products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <button
            type="button"
            onClick={handleSearch}
            className="mr-1 hidden cursor-pointer rounded-[100px] bg-brand px-8 py-3 text-xl font-semibold text-white transition duration-200 hover:bg-brand-dark sm:inline"
          >
            Search
          </button>
        </div>
      </div>
    </header>
  );
}
