import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/options";

const Home = async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="w-full bg-gradient-to-tr from-blue-200 to-purple-200 rounded-2xl py-20">
        <div className="flex flex-col md:flex-row items-center px-20">
          <Image
            src={"/assets/captain.jpg"}
            alt="rogers"
            width={200}
            height={200}
            className="rounded-2xl"
          />
          <div className="flex flex-col items-center md:items-start gap-5 px-10 py-5 md:py-0 md:w-full">
            <p className="text-black font-bold text-xl font-sans">
              ID: 123456789
            </p>
            <p className="text-black font-extralight text-xl font-sans">
              Steve Rogers
            </p>
            <div className="bg-white py-3 px-2 rounded-xl md:w-96">
              <p>roger@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col mt-3 md:mt-10">
        <h3 className="font-bold font-sans text-2xl">My accounts</h3>

        <div className="bg-[#d5defb] w-full md:w-1/3 h-56 mt-10 rounded-lg">
          <div className="bg-[#f8f7fc] rounded-lg py-6 m-2">
            <p className="px-10 font-bold font-sans">Wallet 1</p>
            <p className="px-10 font-extralight font-sans break-all">
              {user?.name}
            </p>
          </div>
          <div className="flex flex-row justify-center w-full">
            <Link
              href={`https://etherscan.io/address/${user?.name}`}
              target="_blank"
              className="bg-gray-800 text-white font-extralight text-thin px-10 py-2 font-sans rounded-lg mt-5"
            >
              View balances
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
