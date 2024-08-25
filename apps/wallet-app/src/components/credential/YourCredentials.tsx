"use client";

import React, { useState } from "react";
import { Modal } from "../common/Modal";
import useResolveCredential from "@/hooks/useResolveCredential";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useGetCredentialOffer from "@/hooks/useGetCredentialOffer";
import { Loading } from "../common/Loading";
import { useModal } from "@/hooks/useModal";
import { OfferCredentialCard } from "./OfferCredentialCard";
import useGetCredentials from "@/hooks/useGetCredentials";
import { CredentialCard } from "./CredentialCard";

export const YourCredentials = () => {
  const [uri, setUri] = useState<string>("");

  const { isOpen, handleModal } = useModal();
  const { handleResolveCredential } = useResolveCredential();
  const { handleRequestCredentialOffer } = useGetCredentialOffer();
  const { handleRequestCredentials } = useGetCredentials();
  const queryClient = useQueryClient();

  const { data: credentialsOffer, isLoading: credentialsOfferLoding } =
    useQuery({
      queryFn: async () => await handleRequestCredentialOffer(),
      queryKey: ["credentialOffer"],
    });

  const { data: credentials, isLoading: credentialsLoading } = useQuery({
    queryFn: async () => await handleRequestCredentials(),
    queryKey: ["credentials"],
  });

  const handleReceiveCredential = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    await handleResolveCredential(uri);
    await queryClient.refetchQueries({
      queryKey: ["credentialOffer"],
    });
    setUri("");
    handleModal();
  };

  if (credentialsOfferLoding || credentialsLoading) {
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
          Receive or Present credentials
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
      {credentialsOffer && credentialsOffer.length > 0 && (
        <>
          <div className="flex flex-col gap-5">
            <h3 className="font-bold"> New Credential Offer ! </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {credentialsOffer.map((cre: any, index: number) => {
                return (
                  <div key={index}>
                    <OfferCredentialCard
                      id={cre.id}
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
          <div className="w-full h-0.5 bg-black"></div>
        </>
      )}
      {credentials && credentials.length > 0 && (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {credentials.map((cre: any, index: number) => {
              return (
                <div key={index}>
                  <CredentialCard
                    id={cre.id}
                    iss={cre.iss}
                    fullName={cre.fullName}
                    university={cre.university}
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
