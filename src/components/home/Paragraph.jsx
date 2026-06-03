export function Paragraph({ children, title, body }) {
  return (
    <div className="flex">
      <div className="z-10">
        <div className="hidden lg:flex items-center justify-center w-26 h-26 rounded-full bg-[#80d0c7]">
          <div className="flex items-center justify-center w-20 h-20 rounded-full border-4 border-white">
            {children}
          </div>
        </div>
      </div>
      <div className="pt-5 pb-16 lg:pl-10">
        <h3 className="mb-4 text-3xl font-semibold">{title}</h3>
        <p className="text-xl font-normal mb-4 leading-10">{body}</p>
      </div>
    </div>
  );
}
