import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

export default function usePublicPresentation() {
    const publicPresentationsQuery = useInfiniteQuery({
        queryKey: ["public-presentations"],
        queryFn: async ({ pageParam }) => {
            const { data } = await axios.get(
                `/api/v1/ppt/presentations?noPerPage=12&pageNo=${pageParam}&public=true`
            );
            return data.presentations;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length !== 12) {
                return undefined;
            }
            return allPages.length + 1;
        }
    });

    return {
        presentations: publicPresentationsQuery.data?.pages.flat() || [],
        refetch: publicPresentationsQuery.refetch,
        isLoading: publicPresentationsQuery.isLoading,
        isFetchingNextPage: publicPresentationsQuery.isFetchingNextPage,
        isError: publicPresentationsQuery.isError,
        isFetchNextPageError: publicPresentationsQuery.isFetchNextPageError,
        hasNextPage: publicPresentationsQuery.hasNextPage,
        fetchNextPage: publicPresentationsQuery.fetchNextPage
    };
}