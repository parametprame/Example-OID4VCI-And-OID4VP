"use client";

import useGetCredential from "@/hooks/useGetCredential";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Loading } from "../common/Loading";

interface Props {
  id: string;
}

export const YourCredential = ({ id }: Props) => {
  const { handleRequestCredential } = useGetCredential();

  const { data: credential, isLoading: credentialLoading } = useQuery({
    queryFn: async () => await handleRequestCredential(id),
    queryKey: ["credential"],
  });

  if (credentialLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="border px-5 md:px-24 py-5 rounded-xl">
        <p className="px-5 font-extralight font-sans break-all">
          <span className="font-bold">ID:</span> {id}
        </p>
        <p className="px-5 font-extralight font-sans break-all">
          <span className="font-bold">University:</span> {credential.university}
        </p>
        <p className="px-5 font-extralight font-sans break-all">
          <span className="font-bold">Name:</span> {credential.fullName}
        </p>
      </div>

      <div className="w-full h-0.5 bg-black"></div>

      <div className="flex flex-col w-full gap-5">
        <p className="text-base md:text-lg text-gray-600">{credential.vct}</p>
        <p className="text-base md:text-lg text-gray-600 break-all">
          DID: {credential.iss}
        </p>
      </div>
    </div>
  );
};
