import useDeleteCredential from "@/hooks/useDeleteCredential";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

interface Props {
  id: string;
  fullName: string;
  university: string;
  iss: string;
}

export const CredentialCard = ({ id, fullName, university, iss }: Props) => {
  const { handleDeleteCredential } = useDeleteCredential();
  const queryClient = useQueryClient();

  const mutationDeleteCredential = useMutation({
    mutationFn: async (id: string) => await handleDeleteCredential(id),
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["credentials"],
      });
    },
  });

  return (
    <div className="border px-5 py-5 rounded-xl">
      <p className="px-5 font-extralight font-sans break-all">
        <span className="font-bold">ID:</span> {id}
      </p>
      <p className="px-5 font-extralight font-sans break-all">
        <span className="font-bold">Issuer DID:</span> {iss}
      </p>
      <p className="px-5 font-extralight font-sans break-all">
        <span className="font-bold">University:</span> {university}
      </p>
      <p className="px-5 font-extralight font-sans break-all">
        <span className="font-bold">Name:</span> {fullName}
      </p>

      <div className="flex px-5 mt-5 justify-between">
        <button
          onClick={() => mutationDeleteCredential.mutate(id)}
          className="inline-flex justify-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
        >
          Delete
        </button>
        <Link
          href={`credentials/${id}`}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
        >
          View
        </Link>
      </div>
    </div>
  );
};
