export function FullBleed({ children }) {
  return (
    <div className="relative left-1/2 w-screen -translate-x-1/2">
      {children}
    </div>
  );
}
