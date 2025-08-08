import { CiSearch } from "react-icons/ci";
import { useContext } from "react";
import { UtilityProvider } from "../../contexts/utilityContext";

export default function Search({ isBackMenu }) {
    const { search, setSearch } = useContext(UtilityProvider);
    return (
        <>
            <button onClick={() => setSearch({ ...search, isMobileSearch: !search.isMobileSearch })} className={`hidden bg-[#FFFFF0] p-1 text-primaryTwo ${isBackMenu && "border-primaryTwo"} text-[1.3rem] 
          !border-[0.1px] maxScreenMobile:rounded-sm maxScreenMobile:!block _pointer-events-none`}><CiSearch /></button>

            <label htmlFor="searchAnything" className={`flex justify-center items-center w-3/5 h-fit relative overflow-y-hidden maxScreenMobile:hidden ${search.isMobileSearch ? "maxScreenMobile:!block absolute top-[100%] left-0 right-0 -bottom-[100%]" : "maxScreenMobile:!hidden"}`}>
                <span className={`block text-xl absolute top-[50%] -translate-y-[50%] left-3 maxScreenMobile:text-3xl maxScreenMobile:border-2 maxScreenMobile:rounded-sm pointer-events-none`}><CiSearch /></span>
                <input
                    type="text"
                    id="searchAnything"
                    value={search.search}
                    onChange={(e) => setSearch({ search: e.target.value, isMobileSearch: search.isMobileSearch })}
                    placeholder="Search for anything..."
                    className={`block !w-full text-sm maxScreen:!w-full border-[0.5px] rounded-md py-[0.35rem] indent-12  ${!isBackMenu ? "text-white bg-primaryTwo" : "!border-primaryTwo text-primaryTwo bg-[#FFFFF0]"} ${search !== "" ? "!border-[#FFA500]" : "!border-[#FFFFF0]"}`}
                />
            </label>
        </>
    );
}
