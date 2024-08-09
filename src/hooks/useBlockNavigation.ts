/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect } from "react";
import { useNavigate, UNSAFE_NavigationContext as NavigationContext } from "react-router-dom";

function useBlockNavigation(message: string, when: boolean) {
    const { navigator } = useContext(NavigationContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!when) return;

        const unblock = navigator.block((tx: any) => {
            if (window.confirm(message)) {
                unblock();
                tx.retry();
            }
        });

        return unblock;
    }, [navigator, message, when, navigate]);
}

export default useBlockNavigation;