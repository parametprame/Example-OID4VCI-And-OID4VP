"use client";

import Link from "next/link";

export const NavBar = () => {
  return (
    <div className="bg-gray-900">
      <div className="container mx-auto flex h-16 items-center justify-between gap-8 px-6">
        <Link className="block text-[rgb(255,120,90)]" href={"/"}>
          <p className="font-bold text-xl">Verifier</p>
        </Link>
      </div>
    </div>
  );
};
