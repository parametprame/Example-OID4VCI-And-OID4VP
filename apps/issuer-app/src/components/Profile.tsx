"use client";
import { useQRCode } from "next-qrcode";
import { User } from "../hooks/useGetUser";
import useGetVC from "../hooks/useGetVC";
import { decodeOpenIDUrl } from "@/app/lib/decodeOpenIDUrl";
import { NavBar } from "./NavBar";

export const Profile: React.FC<User> = (props: User) => {
  const { name, faculty, major, status, gpa } = props;
  const { vc, handleRequestVc } = useGetVC();
  const { Canvas } = useQRCode();

  return (
    <div>
      <NavBar />
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br px-10">
        <div className="relative w-full group max-w-md min-w-0 mx-auto mt-6 mb-6 break-words bg-slate-100 border shadow-2xl md:max-w-sm rounded-xl">
          <div className="pb-6">
            <div className="mt-2 md:mt-10 text-center">
              <h3 className="mb-1 text-2xl font-bold leading-normal text-black ">
                {name}
              </h3>
              <div className="flex flex-row justify-center w-full mx-auto space-x-2 text-center">
                <div className="text-sm font-bold tracking-wide text-gray-600  font-mono md:text-xl">
                  {faculty} : {major}
                </div>
              </div>
            </div>
            <div className="pt-6 mx-6 mt-6 text-center border-t border-gray-200">
              <div className="flex flex-wrap justify-center">
                <div className="w-full px-6">
                  <p className="mb-4 font-light leading-relaxed text-black ">
                    <span className="font-bold">Status</span> : {status}
                  </p>
                  <p className="mb-4 font-light leading-relaxed text-black ">
                    <span className="font-bold"> GPA</span> : {gpa}
                  </p>
                </div>
              </div>
              {vc && (
                <div className="flex flex-col items-center gap-5">
                  <Canvas
                    text={vc}
                    options={{
                      errorCorrectionLevel: "M",
                      margin: 3,
                      scale: 4,
                      width: 200,
                      color: {
                        dark: "#010599FF",
                        light: "#FFBF60FF",
                      },
                    }}
                  />
                  <div className="w-full border overflow-x-auto px-5 py-2 rounded-lg text-wrap">
                    <p className="text-black break-words text-sm ">
                      {decodeOpenIDUrl(vc)}
                    </p>
                  </div>
                </div>
              )}
              <button
                onClick={handleRequestVc}
                className="text-black border-2 border-black rounded-lg px-10 py-2 mt-5 hover:bg-slate-100"
              >
                Request VCs
              </button>
            </div>
            <div className="relative h-6 overflow-hidden translate-y-6 rounded-b-xl">
              <div className="absolute flex -space-x-12 rounded-b-2xl">
                <div className="w-36 h-8 transition-colors duration-200 delay-75 transform skew-x-[35deg] bg-amber-400/90 group-hover:bg-amber-600/90 z-10"></div>
                <div className="w-28 h-8 transition-colors duration-200 delay-100 transform skew-x-[35deg] bg-amber-300/90 group-hover:bg-amber-500/90 z-20"></div>
                <div className="w-28 h-8 transition-colors duration-200 delay-150 transform skew-x-[35deg] bg-amber-200/90 group-hover:bg-amber-400/90 z-30"></div>
                <div className="w-28 h-8 transition-colors duration-200 delay-200 transform skew-x-[35deg] bg-amber-100/90 group-hover:bg-amber-300/90 z-40"></div>
                <div className="w-28 h-8 transition-colors duration-200 delay-300 transform skew-x-[35deg] bg-amber-50/90 group-hover:bg-amber-200/90 z-50"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
