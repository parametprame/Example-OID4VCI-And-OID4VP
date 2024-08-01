import { useSession } from "next-auth/react";

const useGetCredentialOffer = () => {
  const { data } = useSession();
  const HOLDER_URL = process.env.NEXT_PUBLIC_HOLDER_URL!;

  const handleRequestCredentialOffer = async () => {
    try {
      const response = await fetch(
        `${HOLDER_URL}/credential-offer/${data?.user?.name}`,
        {
          method: "GET",
        }
      );
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return {
    handleRequestCredentialOffer,
  };
};

export default useGetCredentialOffer;
