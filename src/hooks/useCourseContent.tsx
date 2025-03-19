import { authFetch } from "@/lib/axios";
import { useSuspenseQuery } from "@tanstack/react-query";

export default function useCourseContent(courseId: string) {
  const courseContentQuery = useSuspenseQuery({
    queryKey: ["course-content", courseId],
    queryFn: async function () {
      const { data } = await authFetch.get(
        `/api/v1/course/content/${courseId}`
      );

      return data;
    }
  });

  return courseContentQuery.data;
}
