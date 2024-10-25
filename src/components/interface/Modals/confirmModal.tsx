import { LoadingAssetBig } from "../../../assets/assets";
import Modal from "./Modal";

// eslint-disable-next-line react/prop-types
export default function ConfirmModal({open, onClose, onSubmit, isLoading, message, actionText}: {open: boolean; onClose: (() => void) | null; onSubmit: (e: React.FormEvent<HTMLFormElement>) => void; isLoading: boolean; message: string; actionText: string}) {
    return (
      <Modal
          open={open}
          onClose={onClose || (() => {})}
          color="bg-[#FFFFDB]"
        >
          <form
            className="flex flex-col justify-evenly items-center gap-3 min-w-32"
            onSubmit={onSubmit}
          >
            <h4 className="text-xl text-black text-center mb-2">
              {message}
            </h4>
            {isLoading ? (
              <div className="flex justify-center items-center">
                <LoadingAssetBig />
              </div>
            ) : (
              <div className="flex gap-4 w-[200px]">
                <button
                  onClick={onClose || (() => {})}
                  className="bg-black p-1 w-[calc(100%/2)] hover:p-[calc(0.25rem-2px)] rounded text-white"
                  type="button"
                >
                  Cancel
                </button>
                <button className="bg-black p-1 w-[calc(100%/2)] hover:p-[calc(0.25rem-2px)] rounded text-white" type="submit">
                  {actionText}
                </button>
              </div>
            )}
          </form>
        </Modal>
    )
  }