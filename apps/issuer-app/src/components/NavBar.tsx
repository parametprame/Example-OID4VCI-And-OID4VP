"use client";

import Link from "next/link";

export const NavBar = () => {
  const handleLogOut = () => {
    localStorage.removeItem("user_id");
    location.reload();
  };

  return (
    <div className="bg-gray-900">
      <div className="container mx-auto flex h-16 items-center justify-between gap-8 px-6">
        <Link className="block text-[rgb(255,120,90)]" href={"/"}>
          <p className="font-bold text-xl">
            Issuer <span className="text-white">VC</span>
          </p>
        </Link>
        <div className="flex items-center justify-end">
          <div className="flex items-center gap-4">
            <div className="sm:flex">
              <button
                className="block rounded-md bg-[#FF5733] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#fa9e89]"
                onClick={handleLogOut}
              >
                Logout
              </button>
            </div>

            <button className="block rounded p-2.5 transition md:hidden bg-gray-800 text-white hover:text-white/75">
              <span className="sr-only">Toggle menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
