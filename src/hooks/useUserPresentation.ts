import { authFetch } from "@/lib/axios";
import { useInfiniteQuery } from "@tanstack/react-query";

export interface UploadPresentation {
    id: string;
    name: string;
    linkType: string;
    liveId: string;
    live: boolean;
    thumbnail: string;
    category: {
        id: string;
        name: string;
    };
    presenterName: string;
    pdfLink: string;
    createdAt: Date;
    User: {
        username: string;
        id: string;
    };
    Bookmark: {
        userId: string;
    }[];
}

export default function useUserPresentation({ enabled }: { enabled: boolean }) {
    const presentationQuery = useInfiniteQuery({
        enabled,
        queryKey: ["upload-presentations"],
        queryFn: async ({ pageParam }) => {
            const { data } = await authFetch.get(
                `/api/v1/ppt/presentations?noPerPage=20&pageNo=${pageParam}`
            );
            return data.presentations as UploadPresentation[];
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length !== 20) {
                return undefined;
            }
            return allPages.length + 1;
        }
    });

    return presentationQuery;
}