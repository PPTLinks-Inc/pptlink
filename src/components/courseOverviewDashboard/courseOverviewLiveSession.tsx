import { Link } from "react-router-dom";
import CourseOverviewRoot from "./courseOverviewRoot";

const UpcomingSessions = Array.from({ length: 1 }, (_, i) => i + 1);
const PreviousSessions = Array.from({ length: 3 }, (_, i) => i + 1);

export default function CourseOverviewLiveSession() {
  return (
    <CourseOverviewRoot>
      <div className="wrapper w-full h-full grid grid-cols-1 grid-rows-[1fr_1fr] gap-2">
        <div className="w-full h-full grid grid-cols-1 grid-rows-[auto_1fr] gap-2">
          <p className="text-white text-sm font-semibold">Upcoming Sessions</p>
          <div
            className={`analyticsOverview ${"grid grid-cols-[1fr_1.5fr] grid-rows-1 gap-2"} w-full h-full`}
          >
            <Link
              to={"#"}
              className="w-full h-full border-none rounded-sm bg-gradient-to-b from-primarySixTwo to-primaryTwo p-4 flex flex-col justify-between"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-semibold">Python 001</h3>
                <Link
                  to={"#"}
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
                    className="underline text-sm mt-2 text-orange-600 transition-colors"
                  >
                    Start session
                  </Link>
                </div>
              </div>
            </Link>
            <div className={`w-full h-full ${UpcomingSessions && UpcomingSessions.length > 0 ? "grid grid-cols-2 grid-rows-2 gap-2" : "flex justify-center items-center"}`}>
              {UpcomingSessions && UpcomingSessions.length > 0 ? (
                UpcomingSessions.map((index) => (
                  <Link
                    key={index.toString()}
                    to="#"
                    className="w-full h-full border-none rounded-sm bg-gradient-to-b from-primarySixTwo to-primaryTwo p-4 flex flex-col justify-between"
                  >
                    <h3 className="text-lg font-semibold">Python 00{index}</h3>
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
                          to="#"
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
                  to="#"
                  className="w-full h-full border-none rounded-sm flex justify-center items-center text-orange-600 font-semibold text-sm underline transition-colors"
                >
                  View more
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className="w-full h-full grid grid-cols-1 grid-rows-[auto_1fr] gap-2">
          <p className="text-white text-sm font-semibold">Previous Sessions</p>
          <div
            className={`w-full h-full ${PreviousSessions && PreviousSessions.length > 0 ? "grid grid-cols-4 grid-rows-2 gap-2" : "flex justify-center items-center"}`}
          >
            {PreviousSessions && PreviousSessions.length > 0 ? (
              PreviousSessions.map((index) => (
                <Link
                  key={index.toString()}
                  to="#"
                  className="w-full h-full border-none rounded-sm bg-gradient-to-b from-primarySixTwo to-primaryTwo p-4 flex flex-col justify-between"
                >
                  <h3 className="text-lg font-semibold">Python 00{index}</h3>
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
                        to="#"
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
                to="#"
                className={
                  "w-full h-full border-none rounded-sm flex justify-center items-center text-orange-600 font-semibold text-sm underline transition-colors"
                }
              >
                View more
              </Link>
            )}
          </div>
        </div>
      </div>
    </CourseOverviewRoot>
  );
}
