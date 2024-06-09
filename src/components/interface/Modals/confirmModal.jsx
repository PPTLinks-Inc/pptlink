import { LoadingAssetBig2 } from "../../../assets/assets";
import Modal from "./Modal";

// eslint-disable-next-line react/prop-types
export default function ConfirmModal({open, onClose, onSubmit, isLoading, message, actionText}) {
    return (
      <Modal
          open={open}
          onClose={onClose}
          color="bg-black"
        >
          <form
            className="flex flex-col gap-3"
            onSubmit={onSubmit}
          >
            <h4 className="text-2xl text-white text-center">
              {message}
            </h4>
            {isLoading ? (
              <div className="flex justify-center items-center">
                <LoadingAssetBig2 />
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="bg-slate-200 p-2 w-full rounded"
                  type="button"
                >
                  Cancel
                </button>
                <button className="bg-slate-200 p-2 w-full rounded" type="submit">
                  {actionText}
                </button>
              </div>
            )}
          </form>
        </Modal>
    )
  }