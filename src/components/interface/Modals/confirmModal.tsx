import { LoadingAssetBig2 } from "../../../assets/assets";
import Modal from "./Modal";

// eslint-disable-next-line react/prop-types
export default function ConfirmModal({open, onClose, onSubmit, isLoading, message, actionText}: {open: boolean; onClose: (() => void) | null; onSubmit: (e: React.FormEvent<HTMLFormElement>) => void; isLoading: boolean; message: string; actionText: string}) {
    return (
      <Modal
          open={open}
          onClose={onClose || (() => {})}
          color="bg-black"
        >
          <form
            className="flex flex-col justify-evenly items-center gap-3"
            onSubmit={onSubmit}
          >
            <h4 className="text-xl text-white text-center">
              {message}
            </h4>
            {isLoading ? (
              <div className="flex justify-center items-center">
                <LoadingAssetBig2 />
              </div>
            ) : (
              <div className="flex gap-4 w-[200px]">
                <button
                  onClick={onClose || (() => {})}
                  className="bg-slate-200 p-1 w-[calc(100%/2)] hover:p-[calc(0.25rem-2px)] rounded text-black hover:bg-black hover:text-slate-200 hover:border-2 hover:border-slate-200"
                  type="button"
                >
                  Cancel
                </button>
                <button className="bg-slate-200 p-1 w-[calc(100%/2)] hover:p-[calc(0.25rem-2px)] rounded text-black hover:bg-black hover:text-slate-200 hover:border-2 hover:border-slate-200" type="submit">
                  {actionText}
                </button>
              </div>
            )}
          </form>
        </Modal>
    )
  }