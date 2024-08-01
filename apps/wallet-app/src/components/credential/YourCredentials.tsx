"use client";

import React, { useState } from "react";
import { Modal } from "../common/Modal";
import useResolveCredential from "@/hooks/useResolveCredential";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useGetCredentialOffer from "@/hooks/useGetCredentialOffer";
import { Loading } from "../common/Loading";
import { useModal } from "@/hooks/useModal";
import { OfferCredentialCard } from "./OfferCredentialCard";

export const YourCredentials = () => {
  const [uri, setUri] = useState<string>("");

  const { isOpen, handleModal } = useModal();
  const { handleResolveCredential } = useResolveCredential();
  const { handleRequestCredentialOffer } = useGetCredentialOffer();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryFn: async () => await handleRequestCredentialOffer(),
    queryKey: ["holder"],
  });

  const handleReceiveCredential = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    await handleResolveCredential(uri);
    await queryClient.refetchQueries();
    setUri("");
    handleModal();
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex w-full justify-between items-center">
        <h2 className="font-bold text-2xl font-sans">Your Credentials</h2>
        <button
          onClick={handleModal}
          className="bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 rounded-md px-5 py-2.5"
        >
          Receive credentials
        </button>
        <Modal
          isOpen={isOpen}
          handleCloseModal={handleModal}
          handleSetUri={setUri}
          handleReceiveCredential={handleReceiveCredential}
          uri={uri}
        />
      </div>
      <div className="w-full h-0.5 bg-black"></div>
      {data && data.length > 0 && (
        <div className="flex flex-col gap-5">
          <h3 className="font-bold"> New Credential Offer ! </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {data.map((cre: any, index: number) => {
              return (
                <div key={index}>
                  <OfferCredentialCard
                    display={cre.metadata.credentialIssuerMetadata.display}
                    credentialIssuer={
                      cre.credentialOfferPayload.credential_issuer
                    }
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
