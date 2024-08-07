import { YourCredential } from "@/components/credential/YourCredential";

export default async function Credential({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="container mx-auto px-6 py-10">
      <div className="flex flex-col items-center">
        <YourCredential id={params.id} />
      </div>
    </div>
  );
}
