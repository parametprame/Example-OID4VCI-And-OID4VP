import { useSession } from "next-auth/react";

const useDeleteCredential = () => {
  const HOLDER_URL = process.env.NEXT_PUBLIC_HOLDER_URL!;
  const { data } = useSession();

  const handleDeleteCredential = async (id: string) => {
    const response = await fetch(
      `${HOLDER_URL}/delete-credential/${id}/${data?.user?.name}`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      return true;
    }
  };

  return {
    handleDeleteCredential,
  };
};

export default useDeleteCredential;
