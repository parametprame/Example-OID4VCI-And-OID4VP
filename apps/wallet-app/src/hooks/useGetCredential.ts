import { useSession } from "next-auth/react";

const useGetCredential = () => {
  const { data } = useSession();

  const HOLDER_URL = process.env.NEXT_PUBLIC_HOLDER_URL!;

  const handleRequestCredential = async (id: string) => {
    try {
      const response = await fetch(
        `${HOLDER_URL}/credential/${id}/${data?.user?.name}`,
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
    handleRequestCredential,
  };
};

export default useGetCredential;
