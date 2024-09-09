import { LuMessagesSquare } from "react-icons/lu";
import { IoSendOutline } from "react-icons/io5";
import Menu from "./Menu";

export default function MessageMenu({
  open,
  onClose,
  color
}: {
  open: boolean;
  onClose: () => void;
  color?: string;
}) {
  return (
    <Menu open={open} onClose={onClose}>
      <div className="rounded-t-xl p-5 flex items-center justify-between border-b-2 border-[#BFBFA4] fixed w-full bg-[#FFFFDB]">
        <div className="flex items-center">
          <h4 className="text-2xl text-center text-black font-bold">
            Live Chat
          </h4>
          <div className="w-fit">
            <div className="rounded-full p-3">
              <LuMessagesSquare size={18} />
            </div>
          </div>
        </div>

        <button className="h-2 w-6 bg-black" onClick={onClose}></button>
      </div>

      <div className="flex flex-col items-center justify-end h-full">
        <div className="w-full p-3 flex flex-col gap-3 overflow-y-auto">
        {Array.from({ length: 30 }).map((_, index) => (
            <div key={index} className="w-full flex items-center gap-4">
                <img
                    className="w-12 rounded-full"
                    src={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=yohanna`}
                    alt={`user Image`}
                />

                <p>Yohanna</p>
                <p className="font-bold">What are we having today</p>
            </div>
        ))}
        </div>
        <div className="w-full flex p-3 gap-2 border-t-[1px] border-[#FF8B1C]">
          <input
            type="text"
            className="bg-white w-full flex-grow p-4 border-[1px] border-[#FF8B1C] rounded-lg"
          />
          <button className="bg-[#1F1F1A] flex-grow-[2] w-20 rounded-lg text-center flex justify-center items-center">
            <IoSendOutline color="#F1F1F1" size="24" />
          </button>
        </div>
      </div>
    </Menu>
  );
}
