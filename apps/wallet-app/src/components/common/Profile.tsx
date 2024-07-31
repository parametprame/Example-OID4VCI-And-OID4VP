"use client";

export const Profile: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br px-10">
      <div className="relative w-full group max-w-md min-w-0 mx-auto mt-6 mb-6 break-words bg-slate-100 border shadow-2xl md:max-w-sm rounded-xl">
        <div className="pb-6">
          <div className="mt-2 md:mt-10 text-center">
            <h3 className="mb-1 text-2xl font-bold leading-normal text-black "></h3>
            <div className="flex flex-row justify-center w-full mx-auto space-x-2 text-center">
              <div className="text-sm font-bold tracking-wide text-gray-600  font-mono md:text-xl"></div>
            </div>
          </div>
          <div className="pt-6 mx-6 mt-6 text-center border-t border-gray-200">
            <div className="flex flex-wrap justify-center">
              <div className="w-full px-6">
                <p className="mb-4 font-light leading-relaxed text-black "></p>
                <p className="mb-4 font-light leading-relaxed text-black "></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
