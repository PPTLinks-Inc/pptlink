import { authFetch } from "@/lib/axios";
import safeAwait from "@/util/safeAwait";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

interface User {
    id: string;
    email: string;
    username: string;
    presentations: number;
    courses: number;
};

export default function useUser() {
    const queryClient = useQueryClient();

    const userQuery = useSuspenseQuery({
        queryKey: ["user"],
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        queryFn: async () => {
            const searchParams = new URLSearchParams(location.search);
            const id = searchParams.get('id');
            const username = searchParams.get('username');
            const email = searchParams.get('email');
            const presentations = searchParams.get('presentations');
            const courses = searchParams.get('courses');
            

            if (id && username && email && presentations && courses) {

                if (window.opener) {
                    window.opener.postMessage(
                        { type: "SIGN_IN", payload: {
                            id,
                            username,
                            email,
                            presentations: parseInt(presentations)
                        } },
                        window.location.origin // Ensure only trusted origins receive the message
                    );
                    window.close();
                    return;
                }

                setUser({
                    id,
                    username,
                    email,
                    presentations: parseInt(presentations),
                    courses: parseInt(courses)
                });

                const redirect = localStorage.getItem("redirect") ?? "/";
                localStorage.removeItem("redirect");
                location.replace(redirect);
            } else {
                const [err, res] = await safeAwait(authFetch.get("/api/v1/auth/user"));

                if (err) {
                    return null;
                }


                return res.data.user as User;
            }
        }
    });

    function setUser(user: User) {
        queryClient.setQueryData(["user"], user);
    }

    async function logOut() {
        // localStorage.removeItem("accessToken");
        const [err] = await safeAwait(authFetch.get("/api/v1/auth/logout"));
        if (err) {
            console.error("Failed to log out:", err);
            return;
        }
        queryClient.clear();
        window.location.href = '/signin';
    }

    return { userQuery, setUser, logOut };
}