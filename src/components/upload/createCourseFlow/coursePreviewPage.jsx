import { Link, useLoaderData } from "react-router-dom";
import { Helmet } from "react-helmet";
import AccordionWrapper from "../../accordion/accordion";
import LogoBlack from "../../../images/Logo-Black.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CourseCard from "../../list/courseCard";
import InstructorCard from "../../list/instructorCard";
import useUser from "../../../hooks/useUser";
import { authFetch } from "../../../lib/axios";
import { useState } from "react";

export async function CoursePreviewLoader({ params }) {
  const { data } = await authFetch.get(
    `/api/v1/course/user-courses/${params.id}`
  );

  return data;
}

export default function CoursePreviewPage() {
  const { userQuery } = useUser();
  const user = userQuery.data;

  const data = useLoaderData();

  const [price] = useState(
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN"
    }).format(data.price)
  );

  return (
    <>
      <Helmet>
        <title>{`Library - PPTLinks `}</title>
        <meta
          name="description"
          content="Make your powerpoint presentations quickly and easily with or without a projector with PPTLinks"
        />
        <meta
          name="tags"
          content={`PPT, Presentations, Powerpoint, PPTLinks, publicPresentation, PPTLINKSLibrary, library, `}
        />

        {/* meta tags to display information on all meta platforms (facebook, instagram, whatsapp) */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://www.PPTLink.com/library`} />
        <meta property="og:title" content={`Library - PPTLinks `} />
        <meta
          property="og:description"
          content="Make your powerpoint presentations quickly and easily with or without a projector with PPTLinks"
        />
        <meta property="og:image" content={LogoBlack} />

        {/* meta tags to display information on twitter  */}
        <meta property="twitter:card" content="website" />
        <meta
          property="twitter:url"
          content={`https://www.PPTLink.com/library`}
        />

        <meta property="twitter:title" content={`Library - PPTLinks `} />
        <meta
          property="twitter:description"
          content="Make your powerpoint presentations quickly and easily with or without a projector with PPTLinks"
        />
        <meta property="twitter:image" content={LogoBlack} />
      </Helmet>
      <div className="bg-primaryTwo">
        <div className="container h-fit py-10 flex flex-col justify-between items-start">
          <h1 className="text-3xl maxScreenMobile:text-2xl font-[400] uppercase mb-1">
            {data.name}
          </h1>
          <p className="uppercase text-[#FFA500]">Paid Program</p>
          <p className="text-[0.9rem] pb-3 w-2/5 maxScreenMobile:w-4/5 maxSmallMobile:w-full maxSmallMobile:text-justify">
            {data.description}
          </p>
          <div className="relative flex items-center justify-between gap-4 w-fit">
            <span className="flex -space-x-4">
              {Array.from({ length: 5 }, (_, i) => i + 1).map((index) => (
                <Avatar
                  key={index.toString()}
                  className="border-2 border-background block w-[2rem] h-[2rem] !rounded-[1rem]"
                  style={{ zIndex: index + 1 }}
                >
                  <AvatarImage
                    src={"/team/imoh.jpg"}
                    alt={"imoh"}
                    className="object-cover"
                  />
                  <AvatarFallback>{"B"}</AvatarFallback>
                </Avatar>
              ))}
            </span>
            <span className="block w-fit responsiveTex text-white">
              25+ enrolled
            </span>
          </div>
          <div className="flex justify-between items-center gap-3 py-4">
            {data.creatorId !== user.id ? (
              <Link
                to="/pay"
                className="flex justify-between items-center gap-3 py-4 `w-fit px-3 text-primaryTwo font-bold h-[2.5rem] text-[.8rem] rounded-md bg-[#FFFFF0]"
              >
                Enroll Now
              </Link>
            ) : (
              <Link
                to={`/course/${data.id}`}
                className="flex justify-between items-center gap-3 py-4 `w-fit px-3 text-primaryTwo font-bold h-[2.5rem] text-[.8rem] rounded-md bg-[#FFFFF0]"
              >
                Edit Course
              </Link>
            )}
            <span className="text-[#FFA500] font-bold text-xl">{price}</span>
          </div>
        </div>
      </div>
      <div className="border-t-2 border-b-2 bg-primaryTwo border-t-white border-b-white">
        <div className="container py-3 flex justify-between items-center gap-2 maxScreenMobile:flex-col maxScreenMobile:items-start">
          {data.courseLevel && data.duration && (
            <>
              {" "}
              <p className="capitalize">
                <span>#</span>
                {data.courseLevel}
              </p>
              <p className="capitalize">
                <span>#</span>
                {data.duration.split("_").join(" ")}
              </p>
              <p className="capitalize">
                <span>#</span>Last Uploaded{" "}
                {new Date(data.updatedAt).toLocaleDateString("en-NG", {
                  day: "numeric",
                  month: "short",
                  year: "numeric"
                })}
              </p>
            </>
          )}
        </div>
      </div>
      <section className="bg-primaryTwo min-h-[30vh]">
        <h2 className="container text-3xl maxScreenMobile:text-2xl font-small uppercase text-white pt-10 pb-4">
          Courses in this Program
        </h2>
        {/* start */}
        {data.CourseSection.map((section) => (
          <div key={section.id} className="container !pb-4">
            <AccordionWrapper
              isDark={false}
              isBorder={false}
              title={
                <p className="w-full px-6 py-4 bg-[#FFFFF0] border-0 !rounded-md !font-normal">
                  <span className="block w-fit text-primaryTwo text-xl capitalize">
                    {section.title}
                  </span>
                </p>
              }
              className="transition-all duration-300"
            >
              <div className="md:my-4_ pt-4 grid grid-cols-4 auto-rows-max grid-flow-row gap-4 maxScreen:grid-cols-3  maxSmallMobile:snap_scrolling maxSmallMobile:grid-cols-none maxSmallMobile:grid-rows-none maxSmallMobile:!flex !h-fit maxSmallMobile:!overflow-x-auto maxSmallMobile:!overflow-y-hidden maxSmallMobile:pt-4_ maxSmallMobile:pr-2 maxSmallMobile:pb-2_ maxSmallMobile:!scroll-smooth">
                {/* start */}
                {section.contents.map((content) => (
                  <CourseCard
                    key={content.id}
                    img={"/team/yoh.jpg"}
                    content={content}
                  />
                ))}
                {/* end */}
              </div>
            </AccordionWrapper>
          </div>
        ))}
        {/* end */}
      </section>
      <section className="bg-primaryTwo w-full py-6">
        <h3 className="container text-3xl maxScreenMobile:text-2xl _text-center font-small pb-4 uppercase">
          Your Course Instructor
        </h3>
        <div className="instructors container my-4 grid grid-cols-4 auto-rows-max grid-flow-row gap-4 maxScreen:grid-cols-3 maxScreenMobile:grid-cols-2 maxSmallMobile:grid-cols-1">
          {/* start */}
          {data.instructors.map((instructor) => (
            <InstructorCard key={instructor.id} data={instructor} />
          ))}
          {/* end */}
        </div>
      </section>
    </>
  );
}
