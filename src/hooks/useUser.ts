import { authFetch } from "@/lib/axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface User {
    id: string;
    email: string;
    username: string;
    presentations: number;
};

export default function useUser() {
    const queryClient = useQueryClient();

    const userQuery = useQuery({
        queryKey: ["user"],
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        queryFn: async () => {
            const { data } = await authFetch.get("/api/v1/auth/user");
            return data.user as User;
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