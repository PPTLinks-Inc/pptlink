import { useState, useContext, useCallback } from "react";
import { Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import CourseOverviewRoot from "./courseOverviewRoot";
import { CourseOverview } from "@/contexts/courseOverviewContext";
import { useTheme } from "../../hooks/useTheme";
import close_svg from "/Vector_close.svg";
import open_svg from "/Vector_open.svg";
import clock_svg from "/clock.svg";

const UpcomingSessions = Array.from({ length: 3 }, (_, i) => i + 1);
const PreviousSessions = Array.from({ length: 7 }, (_, i) => i + 1);
const ViewStudentsAttendance = Array.from({ length: 16 }, (_, i) => i + 1);

export default function CourseOverviewLiveSession() {
  const { bg, text, border } = useTheme();
  const { scheduleSession, handleScheduleSession } = useContext(CourseOverview);
  const [currentView, setCurrentView] = useState(1);
  const [values, setValues] = useState({
    msgName: "",
    msgEmail: "",
    msgDate: "",
    msgTime: "",
    msgPhone: "",
    msgReason: "",
    msg: "",

    msgPending: false,
    msgError: [],
    msgSuccess: ""
  });

  const handleBackword = () => {
    setCurrentView(1);
    handleScheduleSession(false);
  };

  const handleMsgSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      setValues({ ...values, msgPending: true });
    },
    [values]
  );

  return (
    <CourseOverviewRoot>
      <ScrollArea
        className={`wrapper w-full ${!(currentView === 1 && !scheduleSession) && "px-4"} [&_*::-webkit-scrollbar]:hidden! [-ms-overflow-style:none]! [scrollbar-width:none]!`}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          minHeight: `${"calc(100vh-144px)"}`
        }}
      >
        {currentView === 1 && !scheduleSession && (
          <>
            <div className="w-full h-full grid grid-cols-1 grid-rows-[auto_1fr] gap-2">
              <p className="text-white text-sm font-semibold">
                Upcoming Sessions
              </p>
              <div
                className={`analyticsOverview ${"grid grid-cols-[1fr_1.5fr] grid-rows-1 gap-2"} w-full h-full`}
              >
                <Link
                  to={"#"}
                  onClick={() => setCurrentView(2)}
                  className="w-full h-full border-none rounded-sm bg-gradient-to-b from-primarySixTwo to-primaryTwo p-3 flex flex-col justify-between"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-semibold">Python 001</h3>
                    <Link
                      to={"#"}
                      onClick={() => setCurrentView(2)}
                      className="underline text-sm mt-2 text-orange-600 transition-colors"
                    >
                      Reschedule
                    </Link>
                  </div>
                  <div className="w-full flex flex-col">
                    <p className="text-xl opacity-90">
                      <span>Co-host: {"Raymond A. Amem"}</span>
                    </p>
                    <div className="w-full flex items-center justify-between">
                      <p className="text-sm opacity-90">
                        <span className="text-xs opacity-75">
                          October 1, 10:00 AM
                        </span>
                      </p>
                      <Link
                        to={"#"}
                        onClick={() => setCurrentView(2)}
                        className="underline text-sm mt-2 text-orange-600 transition-colors"
                      >
                        Start session
                      </Link>
                    </div>
                  </div>
                </Link>
                <div
                  className={`w-full h-full ${UpcomingSessions && UpcomingSessions.length > 0 ? "grid grid-cols-2 grid-rows-2 gap-2" : "flex justify-center items-center"}`}
                >
                  {UpcomingSessions && UpcomingSessions.length > 0 ? (
                    UpcomingSessions.map((index) => (
                      <Link
                        key={index.toString()}
                        to={"#"}
                        onClick={() => setCurrentView(2)}
                        className="w-full h-full border-none rounded-sm bg-gradient-to-b from-primarySixTwo to-primaryTwo p-3 flex flex-col justify-between"
                      >
                        <h3 className="text-lg font-semibold">
                          Python 00{index}
                        </h3>
                        <div className="w-full flex flex-col">
                          <p className="text-md opacity-90">
                            <span>Co-host: Raymond{index} A. Amem</span>
                          </p>
                          <div className="w-full flex items-center justify-between">
                            <p className="text-sm opacity-90">
                              <span className="text-xs opacity-75">
                                October {index}, 10:00 AM
                              </span>
                            </p>
                            <Link
                              to={"#"}
                              onClick={() => setCurrentView(2)}
                              className="underline text-sm mt-2 text-orange-600 transition-colors"
                            >
                              Reschedule
                            </Link>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="w-full h-full flex justify-center items-center">
                      <p className="text-sm text-orange-600">
                        No more upcoming sessions available
                      </p>
                    </div>
                  )}

                  {/* View More always at the end */}
                  {UpcomingSessions && UpcomingSessions.length > 0 && (
                    <Link
                      to={"#"}
                      onClick={() => setCurrentView(2)}
                      className="w-full h-full border-none rounded-sm flex justify-center items-center text-orange-600 font-semibold text-sm underline transition-colors"
                    >
                      View more
                    </Link>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full h-full grid grid-cols-1 grid-rows-[auto_1fr] gap-2">
              <p className="text-white text-sm font-semibold">
                Previous Sessions
              </p>
              <div
                className={`w-full h-full ${PreviousSessions && PreviousSessions.length > 0 ? "grid grid-cols-4 grid-rows-2 gap-2" : "flex justify-center items-center"}`}
              >
                {PreviousSessions && PreviousSessions.length > 0 ? (
                  PreviousSessions.map((index) => (
                    <Link
                      key={index.toString()}
                      to={"#"}
                      onClick={() => setCurrentView(2)}
                      className="w-full h-full border-none rounded-sm bg-gradient-to-b from-primarySixTwo to-primaryTwo p-3 flex flex-col justify-between"
                    >
                      <h3 className="text-lg font-semibold">
                        Python 00{index}
                      </h3>
                      <div className="w-full flex flex-col">
                        <p className="text-md opacity-90">
                          <span>Co-host: Raymond{index} A. Amem</span>
                        </p>
                        <div className="w-full flex items-center justify-between">
                          <p className="text-sm opacity-90">
                            <span className="text-xs opacity-75">
                              October {index}, 10:00 AM
                            </span>
                          </p>
                          <Link
                            to={"#"}
                            onClick={() => setCurrentView(2)}
                            className="underline text-sm mt-2 text-orange-600 transition-colors"
                          >
                            Reschedule
                          </Link>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="w-full h-full flex justify-center items-center">
                    <p className="text-sm text-orange-600">
                      No previous sessions available
                    </p>
                  </div>
                )}

                {/* View More always at the end */}
                {PreviousSessions && PreviousSessions.length > 0 && (
                  <Link
                    to={"#"}
                    onClick={() => setCurrentView(2)}
                    className={
                      "w-full h-full border-none rounded-sm flex justify-center items-center text-orange-600 font-semibold text-sm underline transition-colors"
                    }
                  >
                    View more
                  </Link>
                )}
              </div>
            </div>
          </>
        )}
        {currentView === 2 && !scheduleSession && (
          <>
            <button
              onClick={() => setCurrentView(1)}
              className="block w-fit text-white text-sm font-semibold"
            >
              Previous Sessions
            </button>
            <div
              className={`w-full min-h-full px-4 !border-[0.1px] border-white py-4`}
            >
              <ul className="block w-full h-fit">
                <li className="grid grid-cols-[1fr_2fr] gap-1 mb-4">
                  <span className="block w-full h-fit font-semibold text-sm text-white">
                    Title:{" "}
                  </span>
                  <span className="block w-full h-fit text-sm text-[gray]">
                    Python 001
                  </span>
                </li>

                <li className="grid grid-cols-[1fr_2fr] gap-1 mb-4">
                  <span className="block w-full h-fit font-semibold text-sm text-white">
                    Date & Time:{" "}
                  </span>
                  <span className="block w-full h-fit text-sm text-[gray]">
                    October 1, 10:47AM-11:47AM
                  </span>
                </li>

                <li className="grid grid-cols-[1fr_2fr] gap-1 mb-4">
                  <span className="block w-full h-fit font-semibold text-sm text-white">
                    Duration:{" "}
                  </span>
                  <span className="block w-full h-fit text-sm text-[gray]">
                    100Min
                  </span>
                </li>

                <li className="grid grid-cols-[1fr_2fr] gap-1 mb-4">
                  <span className="block w-full h-fit font-semibold text-sm text-white">
                    Co-host:{" "}
                  </span>
                  <span className="block w-full h-fit text-sm text-[gray]">
                    Raymond A. AMem
                  </span>
                </li>

                <li className="grid grid-cols-[1fr_2fr] gap-1 mb-4">
                  <span className="block w-full h-fit font-semibold text-sm text-white">
                    Attendance Rate:{" "}
                  </span>
                  <span className="block w-full h-fit text-sm text-[gray]">
                    12 of 20 Students (68%)
                  </span>
                </li>
              </ul>

              <div className="flex justify-between items-center pt-16">
                <Link
                  to={"#"}
                  onClick={() => setCurrentView(1)}
                  className="flex justify-center items-center w-fit h-fit text-xs font-semibold py-1.5 px-6 text-primaryTwo bg-primaryThree rounded-sm"
                >
                  Back
                </Link>
                <Link
                  to={"#"}
                  onClick={() => setCurrentView(3)}
                  className="flex justify-center items-center w-fit h-fit text-xs font-semibold py-1.5 px-6 text-primaryTwo bg-primaryThree rounded-sm"
                >
                  View Attendance
                </Link>
              </div>
            </div>
          </>
        )}
        {currentView === 3 && !scheduleSession && (
          <>
            <div className="w-full h-fit">
              <div className="w-full flex items-center gap-8 mb-6">
                <button
                  onClick={() => setCurrentView(2)}
                  className="text-white text-sm font-semibold"
                >
                  Previous Sessions
                </button>
                <button
                  onClick={() => setCurrentView(3)}
                  className="text-primarySixTwo text-sm font-semibold"
                >
                  Attendance
                </button>
              </div>
              <div className="w-full grid grid-cols-[1fr_2fr_1.5fr] grid-rows-1 items-center gap-8">
                <h3 className="w-fit text-white text-xl font-bold">
                  Python 001
                </h3>
                <p className="w-fit text-xs font-semibold">
                  October 1, 10:47AM-11:47AM
                </p>
                <p className="w-fit text-xs font-semibold">
                  Co-host: Raymond A. Amem
                </p>
              </div>
            </div>
            <div className="w-full h-full  _bg-gray-700 relative grid grid-rows-[auto_1fr] grid-cols-1 px-4 rounded-sm !border-[0.1px] border-white">
              <header className="w-full h-fit grid grid-cols-3 grid-rows-1 justify-center pt-4 pb-2 !border-b-[0.1px] border-white">
                <span className="flex justify-center items-center w-full h-fit text-xs font-semibold">
                  Students Name
                </span>
                <span className="flex justify-center items-center w-full h-fit text-xs font-semibold">
                  Duration
                </span>
                <span className="flex justify-center items-center w-full h-fit text-xs font-semibold">
                  Status
                </span>
              </header>
              <ScrollArea className="scrollbar-hide block w-full !h-[350px]">
                <ul className="w-full h-fit">
                  {ViewStudentsAttendance.map((students) => (
                    <li
                      key={students.toString()}
                      className="w-full h-fit grid grid-cols-3 grid-rows-1 justify-center items-center py-3 !border-b-[0.1px] border-[#8080808e]"
                    >
                      <span className="flex justify-center items-center w-full h-fit text-xs text-ellipsis">
                        Raymond{students} A. Amem
                      </span>
                      <span className="flex justify-center items-center w-full h-fit text-xs text-ellipsis">
                        {students} Minutes
                      </span>
                      <span className="flex justify-center items-center gap-1 w-full h-fit text-xs text-ellipsis">
                        {students % 2 ? (
                          <>
                            <img
                              src={`${open_svg}`}
                              alt="Present"
                              className="w-3 h-3"
                            />
                            <span>Present</span>
                          </>
                        ) : (
                          <>
                            <img
                              src={`${close_svg}`}
                              alt="Absent"
                              className="w-3 h-3"
                            />
                            <span>Absent</span>
                          </>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </div>
          </>
        )}
        {scheduleSession && (
          <>
            <button
              onClick={() => setCurrentView(1)}
              className="block w-fit text-white text-sm font-semibold px-4"
            >
              Schedule your live session
            </button>
            <div className={`w-full min-h-full py-4`}>
              <form onSubmit={handleMsgSubmit}>
                <div className="flex justify-between items-center gap-2 mb-8 maxScreenMobile:flex-col">
                  <div className="w-[50%] maxScreenMobile:w-full">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={values.msgName}
                      onChange={(e) => {
                        setValues({ ...values, msgName: e.target.value });
                      }}
                      className={`block w-full text-sm bg-transparent border-[1px] border-solid ${values.msgName !== "" ? "!border-[#FFA500]" : `${border}`} rounded-md py-2 ${text} _text-white indent-4`}
                      placeholder="Session title"
                      required
                    />
                  </div>
                  <div className="w-[50%] h-fit maxScreenMobile:w-full">
                    <select
                      id="reason"
                      value={values.msgReason}
                      onChange={(e) => {
                        setValues({ ...values, msgReason: e.target.value });
                      }}
                      className={`${bg} border-[1px] ${values.msgReason !== "" ? "!border-[#FFA500]" : `${border}`} rounded-md ${text} block w-full text-sm py-[0.5rem] pl-3`}
                    >
                      <option value="" disabled>
                        Select course
                      </option>
                      <option value="Perfomance issues">
                        Slow platform and frequent lags
                      </option>

                      <option value="Technical bugs">Frequent crashes</option>

                      <option value="Interface design issues">
                        Difficulty in navigation and design
                      </option>

                      <option value="Compatibility issues">
                        Poor compatibility with operating systems or device
                      </option>

                      <option value="UPload/Download problems">
                        Problems uploading or downloading file
                      </option>

                      <option value="Features request">
                        Missing essential features
                      </option>

                      <option value="Customer Support">
                        Slow or unhelpful customer support
                      </option>

                      <option value="Account Management">
                        Difficulties with account settings or access
                      </option>

                      <option value="Security Concerns">
                        Concerns about data security and privacy
                      </option>

                      <option value="Other">Other messages</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-between items-end gap-2 mb-8 maxScreenMobile:flex-col">
                  <div className="w-[50%] maxScreenMobile:w-full">
                    <input
                      type="date"
                      id="date"
                      name="date"
                      inputMode="numeric"
                      value={values.msgDate}
                      onChange={(e) => {
                        setValues({ ...values, msgDate: e.target.value });
                      }}
                      className={`block w-full text-sm bg-transparent border-[1px] border-solid ${values.msgDate !== "" ? "!border-[#FFA500]" : `${border}`} rounded-md py-2 ${text} indent-4`}
                      placeholder="Date"
                      required
                    />
                  </div>
                  <div className="w-[50%] maxScreenMobile:w-full">
                    <input
                      type="time"
                      id="time"
                      name="time"
                      inputMode="numeric"
                      value={values.msgTime}
                      onChange={(e) => {
                        setValues({ ...values, msgTime: e.target.value });
                      }}
                      className={`block w-full text-sm bg-transparent border-[1px] border-solid ${values.msgTime !== "" ? "!border-[#FFA500]" : `${border}`} rounded-md py-2 ${text} indent-4`}
                      placeholder="Time"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr_1fr] grid-rows-[1fr] gap-2 mb-8 maxScreenMobile:grid-cols-1 maxScreenMobile:grid-rows-2">
                  <div className="w-full h-fit">
                    <div className="w-full h-fit mb-6">
                      <select
                        id="reason2"
                        value={values.msgReason}
                        onChange={(e) => {
                          setValues({ ...values, msgReason: e.target.value });
                        }}
                        className={`${bg} border-[1px] ${values.msgReason !== "" ? "!border-[#FFA500]" : `${border}`} rounded-md ${text} block w-full text-sm py-[0.5rem] pl-3`}
                      >
                        <option value="" disabled>
                          Duration
                        </option>
                        <option value="Perfomance issues">
                          Slow platform and frequent lags
                        </option>

                        <option value="Technical bugs">Frequent crashes</option>

                        <option value="Interface design issues">
                          Difficulty in navigation and design
                        </option>

                        <option value="Compatibility issues">
                          Poor compatibility with operating systems or device
                        </option>

                        <option value="UPload/Download problems">
                          Problems uploading or downloading file
                        </option>

                        <option value="Features request">
                          Missing essential features
                        </option>

                        <option value="Customer Support">
                          Slow or unhelpful customer support
                        </option>

                        <option value="Account Management">
                          Difficulties with account settings or access
                        </option>

                        <option value="Security Concerns">
                          Concerns about data security and privacy
                        </option>

                        <option value="Other">Other messages</option>
                      </select>
                    </div>

                    <div className="w-full h-fit">
                      <select
                        id="reason3"
                        value={values.msgReason}
                        onChange={(e) => {
                          setValues({ ...values, msgReason: e.target.value });
                        }}
                        className={`${bg} border-[1px] ${values.msgReason !== "" ? "!border-[#FFA500]" : `${border}`} rounded-md ${text} block w-full text-sm py-[0.5rem] pl-3`}
                      >
                        <option value="" disabled>
                          Add Co-host
                        </option>
                        <option value="Perfomance issues">
                          Slow platform and frequent lags
                        </option>

                        <option value="Technical bugs">Frequent crashes</option>

                        <option value="Interface design issues">
                          Difficulty in navigation and design
                        </option>

                        <option value="Compatibility issues">
                          Poor compatibility with operating systems or device
                        </option>

                        <option value="UPload/Download problems">
                          Problems uploading or downloading file
                        </option>

                        <option value="Features request">
                          Missing essential features
                        </option>

                        <option value="Customer Support">
                          Slow or unhelpful customer support
                        </option>

                        <option value="Account Management">
                          Difficulties with account settings or access
                        </option>

                        <option value="Security Concerns">
                          Concerns about data security and privacy
                        </option>

                        <option value="Other">Other messages</option>
                      </select>
                    </div>
                  </div>

                  <div className="w-full h-full">
                    <input
                      type="file"
                      accept=".ppt"
                      id="phone"
                      name="phone"
                      inputMode="numeric"
                      value={values.msgPhone}
                      onChange={(e) => {
                        setValues({ ...values, msgPhone: e.target.value });
                      }}
                      className={`block w-full h-full text-sm bg-transparent border-[1px] border-solid ${values.msgPhone !== "" ? "!border-[#FFA500]" : `${border}`} rounded-md py-2 ${text} indent-4 relative before:block before:absolute before:z-10 before:top-0 before:left-0 before:bottom-0 before:right-0 before:bg-black`}
                      placeholder="Add slide"
                      required
                    />
                  </div>
                </div>

                <div className=" mb-8">
                  <textarea
                    name="message"
                    id="message"
                    cols={30}
                    rows={5}
                    value={values.msg}
                    placeholder="Note/Occupation (Otional)"
                    onChange={(e) => {
                      setValues({ ...values, msg: e.target.value });
                    }}
                    className={`block w-full text-sm !h-32 bg-transparent border-[1px] border-solid ${values.msg !== "" ? "!border-[#FFA500]" : `${border}`} rounded-md py-1 indent-4 resize-none ${text}`}
                  ></textarea>
                </div>
              </form>

              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={handleBackword}
                  className="flex justify-center items-center w-fit h-fit text-xs font-semibold py-1.5 px-6 text-primaryTwo bg-primaryThree rounded-sm"
                >
                  Back
                </button>
                <Link
                  to={"#"}
                  onClick={() => alert("Session created successfully")}
                  className="flex justify-center items-center w-fit h-fit text-xs font-semibold py-1.5 px-6 text-primaryTwo bg-primaryThree rounded-sm"
                >
                  Schedule
                </Link>
              </div>
            </div>
          </>
        )}
      </ScrollArea>
    </CourseOverviewRoot>
  );
}
