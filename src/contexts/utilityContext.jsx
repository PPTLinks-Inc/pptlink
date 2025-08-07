import { createContext, useCallback, useState, useEffect } from "react";

export const UtilityProvider = createContext();

export default function UtilityProviderFunc({
    children
}) {
    const [search, setSearch] = useState("");
    const [darkTheme, setDarkTheme] = useState(false);
    const [dropdown, setDropdown] = useState(false);

    const handleDropdown = () => {
        setDropdown((prevState) => !prevState);
    };

    const handleDarkTheme = () => {
        setDarkTheme((prevState) => !prevState);
    };

    console.log("Test: ", { search, darkTheme, dropdown });

    return (
        <UtilityProvider.Provider value={{ search, setSearch, darkTheme, handleDarkTheme, dropdown, handleDropdown }}>
            {children}
        </UtilityProvider.Provider>
    );
}
