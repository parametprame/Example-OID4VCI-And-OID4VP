import { useSession } from "next-auth/react";

const useReceiveCredential = () => {
  const HOLDER_URL = process.env.NEXT_PUBLIC_HOLDER_URL!;
  const { data } = useSession();

  const handleReceiveCredential = async (credentialOfferId: string) => {
    const response = await fetch(`${HOLDER_URL}/accept-credential-offer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ credentialOfferId, address: data?.user?.name }),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  };

  return {
    handleReceiveCredential,
  };
};

export default useReceiveCredential;
