import { useContext } from "react";
import { CiSearch } from "react-icons/ci";
import { UtilityProvider } from "../../contexts/utilityContext";
import { useTheme } from "../../hooks/useTheme";

export default function Search() {
  const { dropdown, search, setSearch } = useContext(UtilityProvider);
  const { bg, text, isDark } = useTheme();

  return (
    <>
      <button
        onClick={() =>
          setSearch({ ...search, isMobileSearch: !search.isMobileSearch })
        }
        className={`hidden bg-[#FFFFF0] p-1 text-primaryTwo ${(dropdown || !isDark) ? "border-primaryTwo" : ""} text-[1.3rem] 
          !border-[0.1px] maxScreenMobile:rounded-sm maxScreenMobile:!block _pointer-events-none`}
      >
        <CiSearch />
      </button>

      <label
        htmlFor="searchAnything"
        className={`flex justify-center items-center w-3/5 h-fit relative overflow-y-hidden maxScreenMobile:hidden ${search.isMobileSearch ? "maxScreenMobile:!flex maxScreenMobile:fixed maxScreenMobile:top-28 maxScreenMobile:left-[50%] maxScreenMobile:translate-x-[-50%] _maxScreenMobile:translate-y-[-50%] maxScreenMobile:w-4/5 maxScreenMobile:rounded-lg maxScreenMobile:py-4 maxScreenMobile:z-50 maxScreenMobile:bg-white maxScreenMobile:shadow-lg maxScreenMobile:px-4" : "maxScreenMobile:!hidden"}`}
      >
        <span
          className={`block text-xl absolute top-[50%] -translate-y-[50%] left-3 maxScreenMobile:text-2xl maxScreenMobile:text-slate-200 maxScreenMobile:ml-2 pointer-events-none`}
        >
          <CiSearch />
        </span>
        <input
          type="text"
          id="searchAnything"
          value={search.search}
          onChange={(e) =>
            setSearch({
              search: e.target.value,
              isMobileSearch: search.isMobileSearch
            })
          }
          placeholder="Search for anything..."
          className={`block !w-full text-sm maxScreen:!w-full border-[0.5px] rounded-md py-[0.35rem] indent-12 maxScreenMobile:indent-8 maxScreenMobile:rounded-lg ${bg} ${text} ${search !== "" ? "!border-[#FFA500]" : "!border-[#FFFFF0]"}`}
        />
      </label>
    </>
  );
}
