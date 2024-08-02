import useRejectCredentialOffer from "@/hooks/useRejectCredentialOffer";
import { useMutation, useQueryClient } from "@tanstack/react-query";

//    queryKey: ["credentialOffer"],

interface Props {
  display: any[];
  credentialIssuer: string;
  id: string;
}

export const OfferCredentialCard = ({
  display,
  credentialIssuer,
  id,
}: Props) => {
  const { handleRejectCredentialOffer } = useRejectCredentialOffer();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: string) => await handleRejectCredentialOffer(id),
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["credentialOffer"],
      });
    },
  });

  return (
    <div className="border px-5 py-5 rounded-xl">
      <p className="px-5 font-extralight font-sans break-all">
        <span className="font-bold">ID:</span> {id}
      </p>
      <p className="px-5 font-extralight font-sans break-all">
        <span className="font-bold">Name:</span> {display[0].name}
      </p>
      <p className="px-5 font-extralight font-sans ">
        <span className="font-bold">Description:</span> {display[0].description}
      </p>
      <p className="px-5 font-extralight font-sans break-all">
        <span className="font-bold"> Issuer: </span> {credentialIssuer}
      </p>
      <div className="flex px-5 mt-5 justify-between">
        <button
          onClick={() => mutation.mutate(id)}
          className="inline-flex justify-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
        >
          Reject
        </button>
        <button className="inline-flex justify-center rounded-md border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2">
          Receive
        </button>
      </div>
    </div>
  );
};
