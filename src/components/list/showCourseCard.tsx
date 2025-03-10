import { NavLink } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
// import purchased from "../../../public/purchasVector.svg";

export type CourseType = {
  id: string;
  name: string;
  published: boolean;
  updatedAt: Date;
  thumbnail: string;
  category: string;
  creator: string;
};

export default function ShowCourseCard({ course }: { course: CourseType }) {
  return (
    <NavLink
      style={{ ["--image-url" as string]: `url(${course.thumbnail})` }}
      className={`snap_scrolling_child min-w-[16rem] grow-0 shrink-0 basis-[16rem] !aspect-[2/2.5] bg-[image:var(--image-url)] bg-cover bg-center flex flex-col justify-between items-start py-6 px-2 border-[0.1px] rounded-lg relative before:block before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-black/40 cursor-pointer shadow-white shadow-inner z-10`}
      to={`/course/preview/${course.id}`}
    >
      <div className="absolute top-3 left-0 w-full h-full _bg-black/40 z-0 rounded-lg">
        <div className="relative w-full">
          {/* <img src={purchased} alt={purchased} className="block h-[1.5rem]" /> */}
          <svg
            width="176"
            height="32"
            viewBox="0 0 176 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 32H176L147.294 16.3137L176 0H0V32Z" fill={"gold"} />
          </svg>
          {/* <svg
            width="176"
            height="26"
            viewBox="0 0 176 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 32H176L147.294 16.3137L176 0H0V32Z" fill={"gold"} />
          </svg> */}
          <span className="block w-[35%] absolute top-[50%] -translate-y-[50%] left-0 bg-transparent pl-2 text-sm">
            {"Pendding"}
          </span>
        </div>
      </div>
      <div className="z-10 pt-6">
        <p className="text-md font-light mb-1">{course.category}</p>
        <h4 className="text-2xl font-bold">{course.name}</h4>
      </div>
      <div className="z-10">
        <p className="text-md font-light mb-3">{course.creator}</p>
        <div className="relative flex items-center justify-between gap-1 w-full">
          <span className="flex -space-x-3">
            {Array.from({ length: 7 }, (_, i) => i + 1).map((index) => (
              <Avatar
                key={index.toString()}
                className="border-2 border-background block w-[1.5rem] h-[1.5rem] !rounded-[0.75rem]"
                style={{ zIndex: index + 1 }}
              >
                <AvatarImage
                  src={"/team/imoh.jpg"}
                  alt={"imoh"}
                  className="object-cover"
                />
                <AvatarFallback>{"I"}</AvatarFallback>
              </Avatar>
            ))}
          </span>
          <span className="block w-fit responsiveText">25+ enrolled</span>
        </div>
      </div>
    </NavLink>
  );
}
