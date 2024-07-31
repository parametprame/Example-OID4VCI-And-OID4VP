import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment } from "react";

interface Props {
  isOpen: boolean;
  handleCloseModal: () => void;
  handleSetUri: (uri: string) => void;
  handleReceiveCredential: (event: React.FormEvent<HTMLFormElement>) => void;
  uri: string;
}

export const Modal = ({
  isOpen,
  handleCloseModal,
  handleSetUri,
  handleReceiveCredential,
  uri,
}: Props) => {
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={handleCloseModal}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <DialogTitle
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Receive Credential
                  </DialogTitle>
                  <form onSubmit={handleReceiveCredential}>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Paste the credential offer URI.
                      </p>
                    </div>
                    <div className="mt-2">
                      <textarea
                        name="credentialUri"
                        className="border w-full rounded-lg py-2 px-2 text-sm text-gray-500"
                        cols={1}
                        rows={5}
                        value={uri}
                        onChange={(e) => handleSetUri(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-between mt-4">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                        onClick={handleCloseModal}
                      >
                        Close
                      </button>
                      <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                      >
                        Receive Credential
                      </button>
                    </div>
                  </form>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
