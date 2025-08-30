/* eslint-disable react/prop-types */
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CiFileOn } from "react-icons/ci";
import { CiPlay1 } from "react-icons/ci";
import { MdOutlineQuiz } from "react-icons/md";
import { IoMdLock } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import { cn } from "../../lib/utils";
import { useTheme } from "../../hooks/useTheme";

export default function CourseCard({
  content,
  locked,
  courseId,
  showProgress
}) {
  const { bg, text, border, isDark, reverseBg, reverseText, reverseBorder, lighterSwitch } =
    useTheme();
  const navigate = useNavigate();

  const [quizStartTime] = useState(content?.quiz?.startTime || null);
  const [quizEndTime] = useState(content?.quiz?.endTime || null);
  const [todayDate] = useState(new Date());

  const timeText = useMemo(
    function () {
      if (content?.quiz?.status === "not_active") {
        return [];
      }

      if (content?.quiz?.status === "active") {
        if (quizStartTime && quizEndTime) {
          const startDate = new Date(quizStartTime);
          const endDate = new Date(quizEndTime);

          if (content?.quiz?.attempt?.completedAt) {
            return [
              "Completed:",
              `${humanizeDuration(todayDate - new Date(content.quiz.attempt.completedAt), { largest: 2, round: true })} ago`
            ];
          } else if (todayDate < startDate) {
            return [
              "Start:",
              humanizeDuration(startDate - todayDate, {
                largest: 2,
                round: true
              })
            ];
          } else {
            return [
              "Deadline:",
              humanizeDuration(endDate - todayDate, {
                largest: 2,
                round: true
              }),
              "#ffa500"
            ];
          }
        } else {
          return ["Active"];
        }
      } else if (content?.quiz?.status === "completed") {
        if (content?.quiz?.attempt?.completedAt) {
          return [
            "Completed:",
            `${humanizeDuration(todayDate - new Date(content.quiz.attempt.completedAt), { largest: 2, round: true })} ago`
          ];
        } else if (content?.quiz?.attempt) {
          const attemptDate = new Date(content.quiz.attempt.completedAt);
          return [
            "Completed:",
            `${humanizeDuration(todayDate - attemptDate, { largest: 2, round: true })} ago`
          ];
        } else {
          return ["Completed:", "Quiz completed, but no attempt found"];
        }
      } else {
        return [];
      }
    },
    [
      content?.quiz?.status,
      content?.quiz?.attempt,
      quizStartTime,
      quizEndTime,
      todayDate
    ]
  );

  function viewContent() {
    if (locked) {
      return;
    }
    if (content.type === "VIDEO") {
      navigate(`/course/video/${courseId}/${content.id}`);
    } else if (content.type === "PPT") {
      navigate(`/course/ppt/${courseId}/${content.id}`);
    } else if (content.type === "QUIZ") {
      const startDate = new Date(quizStartTime);
      const endDate = new Date(quizEndTime);

      if (
        content.quiz.status === "active" &&
        !content.quiz.attempt?.completedAt &&
        todayDate >= startDate &&
        todayDate <= endDate
      ) {
        navigate(`/course/quiz/${courseId}/${content.id}`);
      }
    }
  }

  return (
    <>
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        whileInView={{
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, type: "tween" }
        }}
        viewport={{ once: true }}
        className={`card snap_scrolling_child w-full maxSmallMobile:!min-w-[285px] maxSmallMobile:!max-w-[285px] rounded-lg !pt-0 cursor-pointer maxSmallMobile:aspect-[1/1.2] border ${bg} ${text} ${border} _border-[#FFFFF0] relative`}
        onClick={viewContent}
      >
        <span
          className={cn(
            `block !w-full h-fit mb-4 z-10 border-none rounded-t-[0.33rem] ${reverseBg} ${reverseText} _bg-[#FFFFF0]`,
            timeText[2] && "bg-[#ffa500]"
          )}
        >
          <span
            className={`w-[90%] mx-auto text-black font-bold py-1 flex justify-start items-center ${content?.live === undefined && "justify-between"}`}
          >
            <span>{content.type}</span>
            {content.type === "PPT" && (
              <span
                className={`flex justify-between items-center gap-2 ${content.presentationStatus !== "LIVE" && "hidden"}`}
              >
                <span className="block w-fit h-fit p-1 bg-[red] border-none rounded-full"></span>
                <span>Live</span>
              </span>
            )}
          </span>
        </span>

        <div className="card_img rounded-lg border-[1px] border-solid border-slate-200 mx-4 maxScreenMobile:mx-2 relative">
          {content.thumbnail ? (
            <img
              src={content.thumbnail}
              alt={`${content.name} presentation thumbnail`}
              className="block w-full aspect-[1/0.8] rounded-md object-cover text-center"
              loading="lazy"
            />
          ) : (
            <div className="w-full aspect-[1/0.8] h-full bg-black/50 flex justify-center items-center" />
          )}
          <span className="absolute top-0 left-0 right-0 bottom-0 z-10 pointer-events-none text-6xl font-black flex justify-center items-center bg-black/50 border-none rounded-[0.33rem]">
            {locked || content?.quiz?.status === "not_active" ? (
              <IoMdLock />
            ) : content.type === "VIDEO" ? (
              <CiPlay1 />
            ) : content.type === "QUIZ" ? (
              <MdOutlineQuiz size={50} />
            ) : (
              <CiFileOn />
            )}
          </span>
        </div>

        <div
          className={`card_body pb-5 maxScreenMobile:pb-2 text-white mx-4 maxScreenMobile:mx-2 min-h-[120px]`}
        >
          <h3
            title={content.name}
            className="title font-medium w-full text-xl !maxScreenMobile:text-xl text-left pt-3 overflow-x-hidden whitespace-nowrap text-ellipsis"
          >
            {content.name}
          </h3>
          <div className="w-full text-[.8rem] !maxScreenMobile:text-[.8rem] pt-2 font-light overflow-x-hidden whitespace-nowrap text-ellipsis">
            {content.type === "VIDEO" ? (
              <>
                <strong>Duration: </strong>
                <em>
                  {(() => {
                    const seconds = content.duration;
                    const hours = Math.floor(seconds / 3600);
                    const minutes = Math.floor((seconds % 3600) / 60);
                    const remainingSeconds = seconds % 60;

                    if (hours > 0) {
                      return `${hours}:${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
                    }
                    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
                  })()}
                </em>
              </>
            ) : content.type === "QUIZ" ? (
              <div className="flex flex-col gap-1">
                <span className="block">
                  <strong>Duration: </strong>
                  <em>{content.quiz.duration} Minutes</em>
                </span>
                {!locked && (
                  <>
                    {showProgress && (
                      <span className="block">
                        <strong>Score: </strong>
                        <em>
                          {content.quiz?.attempt
                            ? `${content.quiz.attempt.score}%`
                            : "Not Attempted yet"}
                        </em>
                      </span>
                    )}
                    <span>
                      <strong className="font-extrabold text-[.9rem]">
                        {timeText[0]}
                      </strong>
                      <em> {timeText[1]}</em>
                    </span>
                  </>
                )}
              </div>
            ) : (
              <>
                <strong>Pages: </strong>
                <em>{content.duration}</em>
              </>
            )}
          </div>
        </div>

        {showProgress && !locked && content.type !== "QUIZ" && (
          <div className="w-[90%] maxScreenMobile:w-[95%] mb-2 mx-auto bg-[#FFFFF0] border-none rounded p-1 relative flex justify-start items-center">
            <span
              style={{
                width: `${content.progress}%`,
                transition: "width 0.3s ease-in-out"
              }}
              className={`block my-[0.2px] py-2 bg-[#FFA500] border-none rounded-lg`}
            ></span>
            <span className="text-black !text-[0.7rem] font-bold my-[0.2px] z-10 absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center">
              {content.progress}%
            </span>
          </div>
        )}
      </motion.div>
    </>
  );
}
