"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";

export const MyAccount = () => {
  const { data } = useSession();
  const address = data?.user?.name; // TODO: Replace the key name 'name' with 'address' in the data object
  return (
    <div className="flex flex-col mt-3 md:mt-10">
      <h3 className="font-bold font-sans text-2xl">My accounts</h3>

      <div className="bg-[#d5defb] w-full md:w-1/3 h-56 mt-10 rounded-lg">
        <div className="bg-[#f8f7fc] rounded-lg py-6 m-2">
          <p className="px-10 font-bold font-sans">Wallet 1</p>
          <p className="px-10 font-extralight font-sans break-all">{address}</p>
        </div>
        <div className="flex flex-row justify-center w-full">
          <Link
            href={`https://etherscan.io/address/${address}`}
            target="_blank"
            className="bg-gray-800 text-white font-extralight text-thin px-10 py-2 font-sans rounded-lg mt-5"
          >
            View balances
          </Link>
        </div>
      </div>
    </div>
  );
};
