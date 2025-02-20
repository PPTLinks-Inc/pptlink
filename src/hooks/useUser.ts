import { authFetch, setAuthFetchToken } from "@/lib/axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface User {
    id: string;
    email: string;
    username: string;
    presentations: number;
    courses: number;
};

export default function useUser() {
    const queryClient = useQueryClient();

    const userQuery = useQuery({
        queryKey: ["user"],
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        queryFn: async () => {
            const searchParams = new URLSearchParams(location.search);
            const id = searchParams.get('id');
            const username = searchParams.get('username');
            const email = searchParams.get('email');
            const presentations = searchParams.get('presentations');
            const token = searchParams.get('token');
            const courses = searchParams.get('courses');
            

            if (token && id && username && email && presentations && courses) {
                localStorage.setItem('accessToken', token);

                if (window.opener) {
                    window.opener.postMessage(
                        { type: "SIGN_IN", payload: {
                            id,
                            username,
                            email,
                            presentations: parseInt(presentations)
                        }, token: token },
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

                setAuthFetchToken(token);
                const redirect = localStorage.getItem("redirect") ?? "/";
                localStorage.removeItem("redirect");
                location.replace(redirect);
            } else {
                const { data } = await authFetch.get("/api/v1/auth/user");
                return data.user as User;
            }
        }
    });

    function setUser(user: User) {
        queryClient.setQueryData(["user"], user);
    }

    function logOut() {
        localStorage.removeItem("accessToken");
        queryClient.clear();
    }

    return { userQuery, setUser, logOut };
}