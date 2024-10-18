/* eslint-disable react/prop-types */
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { createContext, ReactNode } from "react";

interface PresentationContextProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  presentations: any[];
  refetch: () => void;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  isError: boolean;
  isFetchNextPageError: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
}

export const publicPresentation = createContext<PresentationContextProps>({
  presentations: [],
  refetch: () => {},
  isLoading: false,
  isFetchingNextPage: false,
  isError: false,
  isFetchNextPageError: false,
  hasNextPage: false,
  fetchNextPage: () => {}
});

const PublicPresentationProvider: React.FC<{ children: ReactNode }> = (
  props
) => {
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

  return (
    <publicPresentation.Provider
      value={{
        presentations: publicPresentationsQuery.data?.pages.flat() || [],
        refetch: publicPresentationsQuery.refetch,
        isLoading: publicPresentationsQuery.isLoading,
        isFetchingNextPage: publicPresentationsQuery.isFetchingNextPage,
        isError: publicPresentationsQuery.isError,
        isFetchNextPageError: publicPresentationsQuery.isFetchNextPageError,
        hasNextPage: publicPresentationsQuery.hasNextPage,
        fetchNextPage: publicPresentationsQuery.fetchNextPage
      }}
    >
      {props.children}
    </publicPresentation.Provider>
  );
};

export default PublicPresentationProvider;
