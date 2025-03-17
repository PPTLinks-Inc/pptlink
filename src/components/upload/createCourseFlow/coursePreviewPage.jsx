import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import AccordionWrapper from "../../accordion/accordion";
import LogoBlack from "../../../images/Logo-Black.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CourseCard from "../../list/courseCard";
import InstructorCard from "../../list/instructorCard";
import useUser from "../../../hooks/useUser";
import { authFetch } from "../../../lib/axios";
import { useMemo, useState } from "react";
import { MdAccessTime } from "react-icons/md";
import { GiNetworkBars } from "react-icons/gi";
import { FiEdit } from "react-icons/fi";
import EnvelopeWithCheckmarkIcon from "/envelopeWithCheckmarkIcon.png";
import Modal from "../../Models/model";
import { useQuery } from "@tanstack/react-query";
import { LoadingAssetBig2 } from "../../../assets/assets";
import axios from "axios";
import { Button } from "../../ui/button";

export default function CoursePreviewPage() {
  const [sendMessage, setSendMessage] = useState({
    message: "",
    openMessageModal: false,
    isMessageSent: false,
    error: false
  });
  const { userQuery } = useUser();
  const params = useParams();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["course", "preview", params.id],
    queryFn: async function () {
      const { data } = await authFetch.get(
        `/api/v1/course/user-courses/${params.id}?brief=false`
      );

      return data;
    }
  });

  const price = useMemo(
    function () {
      return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN"
      }).format(data?.price ?? 0);
    },
    [data?.price]
  );

  if (isLoading) {
    return (
        <div className="bg-primaryTwo w-full h-[50vh] flex items-center justify-center flex-col">
          <LoadingAssetBig2 />

          <p>Loading Course data...</p>
        </div>
    );
  } else if (error) {
    return (
      <div className="bg-primaryTwo w-full h-[50vh] flex items-center justify-center flex-col">
        {axios.isAxiosError(error) ? (
          <p>{error.response?.data?.message || error.message || 'An error occurred'}</p>
        ) : (
          <p>Something went wrong</p>
        )}

        <Button onClick={() => refetch()} variant="outline" className="mt-4 text-primaryTwo">
          Retry
        </Button>
      </div>
    );
  }

  // Check if user is logged in and has data
  const isUserLoggedIn = !userQuery.isError && userQuery.data;
  const isCreator =
    isUserLoggedIn &&
    (data.creatorId === userQuery.data?.id ||
      data.instructors.find(
        ({ instructor }) => instructor.user.id === userQuery.data?.id
      ));

  const handleBulkMessage = async () => {
    if (sendMessage.message.length <= 15) {
      setSendMessage({ ...sendMessage, error: true });
      return;
    }
    // const response = await authFetch.post(`/api/v1/course/${data.id}/bulk-message`, {
    //   message: bulkMessage
    // }, {
    //   headers: {
    //     Authorization: `Bearer ${localStorage.getItem("accessToken")}`
    //   }
    // })
    // if (response.status === 200) {
    setSendMessage({
      ...sendMessage,
      message: "",
      isMessageSent: true,
      error: false
    });
    // }
  };

  const handleCancelBtn = () => {
    setSendMessage({
      ...sendMessage,
      message: "",
      openMessageModal: false,
      isMessageSent: false,
      error: false
    });
  };

  // useEffect(function () {
  //   console.log(sendMessage.message.length > 0 ? sendMessage.message : "No message")
  // }, [sendMessage.message])

  return (
    <>
      <Modal
        open={sendMessage.openMessageModal}
        onClose={() =>
          setSendMessage({ ...sendMessage, openMessageModal: false })
        }
        title="Course Messages"
      >
        <div className="w-[95vw] md:w-[60vw] aspect-video mx-auto !border-[0.5px] border-[#FFFFF0] rounded-md bg-black text-white">
          <h4 className="container py-6">Course Messages</h4>
          <div className="pt-4 !border-t-[0.1px] border-t-[#FFFFF0]">
            <div className="container">
              {sendMessage.openMessageModal && !sendMessage.isMessageSent ? (
                <>
                  <p className="text-md leading-8">
                    This allows you to send important updates, reminders, and
                    announcements to all your students at once. Whether you need
                    to share lesson schedules, homework assignments, or study
                    tips, this is your space to keep students informed and
                    engaged.
                  </p>
                  <textarea
                    name="courseBulkMessage"
                    id="courseBulkMessage"
                    value={sendMessage.message}
                    placeholder="Type your message here, minimum of 15 characters"
                    onChange={(e) =>
                      setSendMessage({
                        ...sendMessage,
                        message: e.target.value
                      })
                    }
                    rows={4}
                    className={`block w-full mt-4 border-[0.5px] ${sendMessage.error ? "border-[red]" : "border-[#FFFFF0]"} rounded-md p-4 resize-none bg-black`}
                  />
                </>
              ) : (
                <>
                  <h4 className="text-4xl font-bold text-center mt-4">
                    Successful
                  </h4>
                  <div className="my-8 w-fit h-fit mx-auto">
                    <img
                      src={EnvelopeWithCheckmarkIcon}
                      alt={EnvelopeWithCheckmarkIcon}
                      className="block"
                    />
                  </div>
                  <p className="text-md leading-8 text-center mb-4 text-sm">
                    Your message has been sent to all students in this course.
                  </p>
                </>
              )}
              <div className="flex items-center justify-between mt-4 pb-10">
                <button
                  onClick={handleCancelBtn}
                  className="flex justify-between items-center gap-3 py-4 w-fit px-3 text-primaryTwo font-bold h-[2.5rem] text-[.8rem] rounded-md bg-[#FFFFF0]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkMessage}
                  className={`flex justify-between items-center gap-3 py-4 w-fit px-3 text-primaryTwo font-bold h-[2.5rem] text-[.8rem] rounded-md bg-[#FFFFF0] ${sendMessage.openMessageModal && sendMessage.isMessageSent && "hidden"}`}
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <Helmet>
        <title>{`${data.name} - PPTLinks `}</title>
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
          <div className="relative flex maxSmallMobile:!flex-col items-center justify-between gap-4 w-fit maxSmallMobile:w-full maxSmallMobile:items-start maxSmallMobile:gap-2">
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
            <span className="block w-fit responsiveTex text-white mr-1">
              25+ enrolled
            </span>
            <span className="block w-fit responsiveTex text-white">
              Created by{" "}
              <Link to={"#"} className="underline text-white">
                {data.instructors[0].instructor.user.username}
              </Link>
            </span>
          </div>
          <div className="w-full maxSmallMobile:w-full">
            <div className="flex justify-between items-center gap-3 py-4 maxSmallMobile:flex-col">
              <div className="w-fit flex items-center gap-3 maxSmallMobile:ml-0 maxSmallMobile:mr-auto">
                {isCreator ? (
                  <Link
                    to={`/course/${data.id}`}
                    className="flex justify-between items-center gap-3 py-4 w-fit px-3 text-primaryTwo font-bold h-[2.5rem] text-[.8rem] rounded-md bg-[#FFFFF0]"
                  >
                    Edit Course
                  </Link>
                ) : (
                  data.published &&
                  !data.access && (
                    <Link
                      to={
                        isUserLoggedIn
                          ? `/pay/${data.id}`
                          : `/signin?redirect=/pay/${data.id}`
                      }
                      className="flex justify-between items-center gap-3 py-4 w-fit px-3 text-primaryTwo font-bold h-[2.5rem] text-[.8rem] rounded-md bg-[#FFFFF0]"
                    >
                      {isUserLoggedIn ? "Enroll Now" : "Sign in to Enroll"}
                    </Link>
                  )
                )}
                {!isCreator && data.access ? (
                  <span className="text-[#FFA500] font-bold text-xl">PAID</span>
                ) : (
                  <span className="text-[#FFA500] font-bold text-xl">
                    {price}
                  </span>
                )}
              </div>
              {isCreator && (
                <button
                  onClick={() =>
                    setSendMessage({ ...sendMessage, openMessageModal: true })
                  }
                  className="ml-auto mr-0 maxSmallMobile:ml-0 maxSmallMobile:mr-auto flex justify-between items-center gap-3 py-4 w-fit px-3 text-primaryTwo font-bold h-[2.5rem] text-[.8rem] rounded-md bg-[#FFFFF0]"
                >
                  Course Messages
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="border-t-2 border-b-2 bg-primaryTwo border-t-white border-b-white">
        <div className="container py-3 flex justify-between items-center gap-2 maxScreenMobile:flex-col maxScreenMobile:items-start">
          {data.courseLevel && data.duration && (
            <>
              {" "}
              <p className="lowercase flex items-center gap-2">
                <span>
                  <MdAccessTime />
                </span>
                <span>{data.duration.split("_").join(" ")}</span>
              </p>
              <p className="lowercase flex items-center gap-2">
                <span>
                  <GiNetworkBars />
                </span>
                <span>{data.courseLevel}</span>
              </p>
              <p className="lowercase flex items-center gap-2">
                <span>
                  <FiEdit />
                </span>
                <span>
                  Last updated{" "}
                  {new Date(data.updatedAt).toLocaleDateString("en-NG", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                  })}
                </span>
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
              <div className="pt-4 grid grid-cols-4 auto-rows-fr grid-flow-row gap-4 maxScreen:grid-cols-3  maxSmallMobile:snap_scrolling maxSmallMobile:grid-cols-none maxSmallMobile:grid-rows-none maxSmallMobile:!flex !h-fit maxSmallMobile:!overflow-x-auto maxSmallMobile:!overflow-y-hidden maxSmallMobile:pr-2  maxSmallMobile:!scroll-smooth">
                {/* start */}
                {section.contents.map((content) => (
                  <CourseCard
                    key={content.id}
                    content={content}
                    locked={!data.access}
                    courseId={data.id}
                    sectionId={section.id}
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
