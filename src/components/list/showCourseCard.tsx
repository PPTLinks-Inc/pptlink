import { NavLink } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export type CourseType = {
  id: string;
  name: string;
  published: boolean;
  updatedAt: Date;
  thumbnail: string;
  category: string;
  creator: string;
  accessType: "NONE" | "Purchased" | "Draft" | "Creator" | "Tutoring";
<<<<<<< HEAD
=======
  purchases: {
    count: string;
    firstFiveUsers: {
      id: string;
      firstLetter: string;
    }[];
  };
>>>>>>> 1e0a35973e3c09ac86e8878a49518ef039cec88a
};

export default function ShowCourseCard({ course }: { course: CourseType }) {
  return (
    <NavLink
      className={`snap_scrolling_child min-w-[16rem] grow-0 shrink-0 basis-[16rem] !aspect-[2/2.5] flex flex-col justify-between items-start py-6 px-2 border-[0.1px] rounded-lg relative before:block before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-black/40 cursor-pointer shadow-white shadow-inner before:z-10 overflow-hidden`}
      to={`/course/preview/${course.id}`}
    >
      <img
        src={course.thumbnail}
        alt={course.name}
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      />
      {course.accessType !== "NONE" && (
        <div className="absolute top-3 left-0 w-full h-full _bg-black/40 z-0 rounded-lg">
          <div className="relative w-full scale-y-80">
            <svg
              width="176"
              height="32"
              viewBox="0 0 176 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 32H176L147.294 16.3137L176 0H0V32Z"
                fill={
                  course.accessType === "Purchased"
                    ? "#0082fb"
                    : course.accessType === "Creator"
                      ? "#31aa4d"
                      : course.accessType === "Tutoring"
                        ? "#fda910"
                        : course.accessType === "Draft"
                          ? "#b3b3b3"
                          : "#666666"
                }
              />
            </svg>
            <span className="block w-[35%] absolute top-[50%] -translate-y-[50%] left-0 bg-transparent pl-2 text-sm">
              {course.accessType}
            </span>
          </div>
        </div>
      )}
      <div className="z-10 pt-6">
        <p className="text-md font-light mb-1">{course.category}</p>
        <h4 className="text-2xl font-bold">{course.name}</h4>
      </div>
      <div className="z-10">
        <p className="text-md font-light mb-3">{course.creator}</p>
        <div className="relative flex items-center justify-between gap-1 w-full">
          <span className="flex -space-x-3">
<<<<<<< HEAD
            {Array.from({ length: 7 }, (_, i) => i + 1).map((index) => (
              <Avatar
                key={index.toString()}
=======
            {course.purchases.firstFiveUsers.map((user, index) => (
              <Avatar
                key={user.id}
>>>>>>> 1e0a35973e3c09ac86e8878a49518ef039cec88a
                className="border-2 border-background block w-[1.5rem] h-[1.5rem] !rounded-[0.75rem]"
                style={{ zIndex: index + 1 }}
              >
                <AvatarImage
<<<<<<< HEAD
                  src={"/team/imoh.jpg"}
                  alt={"imoh"}
                  className="object-cover"
                />
                <AvatarFallback>{"I"}</AvatarFallback>
              </Avatar>
            ))}
          </span>
          <span className="block w-fit responsiveText">25+ enrolled</span>
=======
                  src={"/images/avatars/" + user.id + ".webp"}
                  alt={user.firstLetter}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gray-600">{user.firstLetter}</AvatarFallback>
              </Avatar>
            ))}
          </span>
<<<<<<< HEAD
          <span className="block w-fit responsiveText">{course.purchases.count}+ enrolled</span>
>>>>>>> 1e0a35973e3c09ac86e8878a49518ef039cec88a
=======
          <span className="block w-fit responsiveText">{course.purchases.count} enrolled</span>
>>>>>>> a38b2baa503bc6c857160f5f017bc2802b20b985
        </div>
      </div>
    </NavLink>
  );
}
