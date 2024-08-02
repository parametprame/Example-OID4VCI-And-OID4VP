import { useSession } from "next-auth/react";

const useRejectCredentialOffer = () => {
  const HOLDER_URL = process.env.NEXT_PUBLIC_HOLDER_URL!;
  const { data } = useSession();

  const handleRejectCredentialOffer = async (id: string) => {
    const response = await fetch(
      `${HOLDER_URL}/reject-credential-offer/${id}/${data?.user?.name}`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      return true;
    }
  };

  return {
    handleRejectCredentialOffer,
  };
};

export default useRejectCredentialOffer;
