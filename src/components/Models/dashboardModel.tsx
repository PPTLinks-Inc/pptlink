import { LoadingAssetBig2 } from "../../assets/assets";
import Modal from "./model";

// eslint-disable-next-line react/prop-types
export default function PopUpModal({
  open,
  onClose,
  onSubmit,
  isLoading,
  message,
  actionText
}: {
  open: boolean;
  onClose: (() => void) | null;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  message: string;
  actionText: string;
}) {
  return (
    <Modal open={open} onClose={onClose || (() => {})} color="bg-[#FFFFF0]">
      <form
        className="flex flex-col justify-evenly items-center gap-3 max-w-[20rem]"
        onSubmit={onSubmit}
      >
        <h3 className="mx-auto font-light text-black pt-3">NOTIFICATION</h3>
        <p className="w-2/3 mx-auto text-md text-black text-center mb-2">{message}</p>
        {isLoading ? (
          <div className="flex justify-center items-center">
            <LoadingAssetBig2 />
          </div>
        ) : (
          <div className="flex border-t-[2px] border-black w-full">
            <div className="w-[calc(100%/2)] p-1 border-r-[1px] border-black">
              <button
                onClick={onClose || (() => {})}
                className="bg-[#FFFFF0]  border-[0.1px] border-black py-2 px-4 w-full rounded-bl text-black hover:shadow-md hover:font-extrabold"
                type="button"
              >
                Cancel
              </button>
            </div>

            <div className="w-[calc(100%/2)] p-1 border-l-[1px] border-black">
              <button
                className="bg-[#FFFFF0]  border-[0.1px] border-black py-2 px-4 w-full rounded-br text-black hover:shadow-md hover:font-extrabold"
                type="submit"
              >
                {actionText}
              </button>
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
}
