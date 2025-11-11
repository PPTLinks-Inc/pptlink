import { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
import CourseOverviewRoot from "./courseOverviewRoot";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FaAngleDown } from "react-icons/fa6";
import settings_svg from "/settings.svg";
import close_svg from "/Vector_close.svg";
import open_svg from "/Vector_open.svg";
import bank_icone from "/Vector.svg";
import card_icone from "/Group(1).svg";
import exclamation from "/exclamation.svg";
import { PieChart } from "@mui/x-charts/PieChart";
import { desktopOS, valueFormatter } from "./subComponents/data/data-fetch";
import Icon9 from "/new/icon9.svg";

const ViewStudents = Array.from({ length: 16 }, (_, i) => i + 1);
const messagesTypeArray = ["All Times", "Three Months Back", "Six Months Back"];
export default function CourseOverviewEarnings() {
  const { bg, text, border } = useTheme();
  const [view, setView] = useState({
    allTimesEarningsView: true,
    chooseWithdrawerView: false,
    withdrawDetailsView: false,
    confirmReviewView: false
  });
  const [messageView, setMessageView] = useState({
    view: false,
    value: messagesTypeArray[0]
  });
  const [isPicked, setIsPicked] = useState([
    { isBankAccount: false },
    { isPayPal: false },
    { isPayStack: false },
    { isMore: false }
  ]);

  const handleComplexsityWithState = (
    currentView: string,
    which: string = "view-message",
    isSet: boolean = true,
    paymentTypeIndex: number = 0
  ): string => {
    switch (which) {
      case "view-message":
        setMessageView((prev) => ({
          ...prev,
          view: !isSet ? false : !prev.view,
          value: currentView
        }));
        setView({
          allTimesEarningsView: !isSet ? false : true,
          chooseWithdrawerView: false,
          withdrawDetailsView: !isSet ? true : false,
          confirmReviewView: false
        });
        break;
      case "payment-type":
        setIsPicked([
          { isBankAccount: paymentTypeIndex === 0 ? true : false },
          { isPayPal: paymentTypeIndex === 1 ? true : false },
          { isPayStack: paymentTypeIndex === 2 ? true : false },
          { isMore: paymentTypeIndex === 3 ? true : false }
        ]);
        break;
    }

    return currentView;
  };

  return (
    <CourseOverviewRoot>
      <div className="flex flex-col h-full overflow-hidden">
        {/* header section */}
        <header className="w-full h-fit mb-4 flex justify-start items-center gap-4 z-10 flex-shrink-0">
          <div className="relative w-fit h-fit">
            <button
              type="button"
              onClick={() =>
                setMessageView((prev) => ({ ...prev, view: !prev.view }))
              }
              className={`flex items-center justify-start gap-4 h-10 px-2 ${bg} ${text} text-sm ${border} border-[0.1px] rounded-md cursor-pointer`}
            >
              <img src={settings_svg} alt={settings_svg} />
              <span>{messageView.value}</span>
              <span>
                <FaAngleDown />
              </span>
            </button>

            {/* Dropdown */}
            <div
              className={`${!messageView.view ? "hidden" : "flex absolute z-10 top-[2.7rem] left-0"} flex-col justify-start items-center gap-[1px] w-full h-fit ${bg} ${text} text-sm ${border} border-[0.1px] p-[0.1rem] rounded-md cursor-pointer`}
            >
              {/* dropdown content */}
              <button
                type="button"
                title="set message view"
                onClick={() => handleComplexsityWithState(messagesTypeArray[0])}
                className={`w-full h-full ${text} text-sm text-left border-[0.1px] border-gray-600/65 rounded-md outline-none py-2 px-2 ${messageView.value === messagesTypeArray[0] && "!bg-[#FFFFF0] !text-black"}`}
              >
                All Times
              </button>
              <button
                type="button"
                title="set message view"
                onClick={() => handleComplexsityWithState(messagesTypeArray[1])}
                className={`w-full h-full ${text} text-sm text-left border-[0.1px] border-gray-600/65 rounded-md outline-none py-2 px-2 ${messageView.value === messagesTypeArray[1] && "!bg-[#FFFFF0] !text-black"}`}
              >
                Two Months Back
              </button>
              <button
                type="button"
                title="set message view"
                onClick={() => handleComplexsityWithState(messagesTypeArray[2])}
                className={`w-full h-full ${text} text-sm text-left border-[0.1px] border-gray-600/65 rounded-md outline-none py-2 px-2 ${messageView.value === messagesTypeArray[2] && "!bg-[#FFFFF0] !text-black"}`}
              >
                Three Months Back
              </button>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <div className="flex-1 min-h-0 overflow-hidden">
          {/* All Times, students, tutors... area/section */}
          <div
            className={`w-full h-full relative ${!view.allTimesEarningsView && "border border-gray-200 rounded-sm"}`}
          >
            <ScrollArea className="h-full w-full">
              {/* withdrawal states */}
              {view.allTimesEarningsView && (
                <>
                  <div className="grid grid-cols-3 grid-rows-1 gap-2">
                    <div className="w-full h-full border-none rounded-sm bg-gradient-to-b from-primarySixTwo_ from-slate-200 to-primaryTwo p-4 flex flex-col justify-between">
                      <h3 className="text-md font-semibold mb-10">
                        Total Earnings
                      </h3>
                      <div className="w-full flex flex-col">
                        <p className="text-3xl font-extrabold opacity-90 ">
                          <span>${"11,250"}</span>
                        </p>
                        <p className="w-full text-sm opacity-90">
                          <span className="text-xs opacity-75">
                            ${"1,000 Monthly Average"}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="w-full h-full border-none rounded-sm bg-gradient-to-b from-primarySixTwo_ from-slate-200 to-primaryTwo p-4 flex flex-col justify-between">
                      <h3 className="text-md font-semibold mb-10">
                        Available Balance
                      </h3>
                      <div className="w-full flex flex-col">
                        <p className="text-3xl font-extrabold opacity-90 ">
                          <span>${"4,250"}</span>
                        </p>
                        <Link
                          to={"#"}
                          className="inline-block w-full underline text-xs text-orange-600 transition-colors"
                        >
                          Request Withdrawal
                        </Link>
                      </div>
                    </div>

                    <div className="w-full h-full border-none rounded-sm bg-gradient-to-b from-primarySixTwo_ from-slate-200 to-primaryTwo p-4 flex flex-col justify-between">
                      <h3 className="text-md font-semibold mb-10">
                        Last withdrawal
                      </h3>
                      <div className="w-full flex flex-col">
                        <p className="text-3xl font-extrabold opacity-90 ">
                          <span>${"250"}</span>
                        </p>
                        <p className="w-full text-sm opacity-90">
                          <span className="text-xs opacity-75">
                            ${"Jun 12, 2025"}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 grid-rows-1 gap-2 mt-2">
                    <div className="w-full h-full rounded-sm !border-[0.1px] border-white p-4 flex flex-col justify-start">
                      <div className="w-full h-fit">
                        <h3 className="text-2xl font-semibold">
                          Earnings by Course
                        </h3>
                        <p className="text-sm mb-2">
                          Revenue distributed across all courses
                        </p>
                      </div>
                      <div className="w-full h-fit !text-white">
                        <PieChart
                          series={[
                            {
                              data: desktopOS,
                              highlightScope: {
                                fade: "global",
                                highlight: "item"
                              },
                              faded: {
                                innerRadius: 30,
                                additionalRadius: -30,
                                color: "gray"
                              },
                              valueFormatter
                            }
                          ]}
                          height={200}
                          width={200}
                        />
                      </div>
                    </div>

                    <div className="w-full h-full rounded-sm !border-[0.1px] border-white p-4 flex flex-col justify-start">
                      <div className="w-full h-fit">
                        <h3 className="text-2xl font-semibold">
                          Withdraw Funds
                        </h3>
                        <p className="text-sm mb-2">
                          Manage Your Withdrawal Methods
                        </p>
                      </div>
                      <div className="rounded-sm !border-[0.1px] border-gray-100/50 p-4 mb-2 flex items-center justify-center gap-2 relative">
                        <div className="w-fit flex items-center justify-center gap-2">
                          <img
                            src={bank_icone}
                            alt={bank_icone}
                            className="block w-8 aspect-square"
                          />
                          <span className="flex text-xs font-light flex-col items-start justify-center">
                            <span className="block w-fit">Bank Account</span>
                            <span className="block w-fit">****763</span>
                          </span>
                        </div>
                        <span className="inline-block text-black font-light text-xs p-[2px] border-none rounded-sm bg-gray-100/80 mr-0 ml-auto">
                          Default
                        </span>
                      </div>
                      <div className="rounded-sm !border-[0.1px] border-gray-100/50 p-4 mb-2 flex items-center justify-start gap-2 relative">
                        <div className="w-fit flex items-center justify-center gap-2">
                          <img
                            src={card_icone}
                            alt={card_icone}
                            className="block w-8 aspect-square"
                          />
                          <span className="flex text-xs font-light flex-col items-start justify-center">
                            <span className="block w-fit">Pay Pal</span>
                            <span className="block w-fit">
                              ra****525@gmail.com
                            </span>
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setView((prev) => ({
                            ...prev,
                            allTimesEarningsView: false,
                            chooseWithdrawerView: true,
                            withdrawDetailsView: false,
                            confirmReviewView: false
                          }))
                        }
                        className="flex justify-center items-center mt-2 w-full h-fit text-xs font-light py-1.5 px-6 text-primaryTwo bg-primaryThree rounded-sm flex-shrink-0"
                      >
                        Add Payment Method
                      </button>
                      <button
                        type="button"
                        onClick={() => alert(433)}
                        className="flex justify-center items-center mt-2 w-full h-fit text-xs font-light py-1.5 px-6 text-primaryTwo bg-primaryThree rounded-sm flex-shrink-0"
                      >
                        Withdraw $4,250
                      </button>
                    </div>
                  </div>

                  <p className="text-primarySixTwo text-sm font-semibold mt-2">
                    Recent Transaction History
                  </p>
                  <div className="w-full mx-auto h-full relative grid grid-rows-[auto_1fr] grid-cols-1 rounded-sm !border-[0.1px] border-white mt-2">
                    <header className="w-full h-fit grid grid-cols-4 grid-rows-1 justify-center pt-4 pb-2 !border-b-[0.1px] border-white">
                      <span className="flex justify-center items-center w-full h-fit text-xs font-semibold">
                        Date
                      </span>
                      <span className="flex justify-center items-center w-full h-fit text-xs font-semibold">
                        Course
                      </span>
                      <span className="flex justify-center items-center w-full h-fit text-xs font-semibold">
                        Student
                      </span>
                      <span className="flex justify-center items-center w-full h-fit text-xs font-semibold">
                        Amount
                      </span>
                    </header>
                    <ScrollArea className="scrollbar-hide block w-full !h-[300px]">
                      <ul className="w-full h-fit">
                        {ViewStudents.map((students) => (
                          <li
                            key={students.toString()}
                            className="w-full h-fit grid grid-cols-4 grid-rows-1 justify-center items-center py-1 !border-b-[0.1px] border-[#8080808e]"
                          >
                            <span className="flex justify-center items-center w-full h-fit text-xs text-ellipsis py-2">
                              May 1{students}, 2025
                            </span>
                            <span className="flex justify-center items-center w-full h-fit text-xs text-ellipsis py-2">
                              Python 00{students}
                            </span>
                            <span className="flex justify-center items-center w-full h-fit text-xs text-ellipsis py-2">
                              {students % 2 ? `Ray${students} Amem` : `Grace`}
                            </span>
                            <span className="flex justify-center items-center w-full h-fit text-xs text-ellipsis py-2">
                              ${students}00.00
                            </span>
                          </li>
                        ))}
                      </ul>
                    </ScrollArea>
                  </div>

                  <p className="text-primarySixTwo text-sm font-semibold mt-2">
                    Recent Withdrawal History
                  </p>
                  <div className="w-full mx-auto h-full relative grid grid-rows-[auto_1fr] grid-cols-1 rounded-sm !border-[0.1px] border-white mt-2">
                    <header className="w-full h-fit grid grid-cols-4 grid-rows-1 justify-center pt-4 pb-2 !border-b-[0.1px] border-white">
                      <span className="flex justify-center items-center w-full h-fit text-xs font-semibold">
                        Date
                      </span>
                      <span className="flex justify-center items-center w-full h-fit text-xs font-semibold">
                        Method
                      </span>
                      <span className="flex justify-center items-center w-full h-fit text-xs font-semibold">
                        Amount
                      </span>
                      <span className="flex justify-center items-center w-full h-fit text-xs font-semibold">
                        Status
                      </span>
                    </header>
                    <ScrollArea className="scrollbar-hide block w-full !h-[300px]">
                      <ul className="w-full h-fit">
                        {ViewStudents.map((students) => (
                          <li
                            key={students.toString()}
                            className="w-full h-fit grid grid-cols-4 grid-rows-1 justify-center items-center py-1 !border-b-[0.1px] border-[#8080808e]"
                          >
                            <span className="flex justify-center items-center w-full h-fit text-xs text-ellipsis py-2">
                              May 1{students}, 2025
                            </span>
                            <span className="flex justify-center items-center w-full h-fit text-xs text-ellipsis py-2">
                              {students % 2 ? `Bank Account` : `PayPal`}
                            </span>
                            <span className="flex justify-center items-center w-full h-fit text-xs text-ellipsis py-2">
                              ${students}00.00
                            </span>
                            <span className="inline-flex items-center gap-1 w-full h-fit text-left text-xs text-ellipsis">
                              {students % 2 ? (
                                <>
                                  <img
                                    src={`${open_svg}`}
                                    alt="Present"
                                    className="w-3 h-3"
                                  />
                                  <span>Successful</span>
                                </>
                              ) : (
                                <>
                                  <img
                                    src={`${close_svg}`}
                                    alt="Absent"
                                    className="w-3 h-3"
                                  />
                                  <span>Failed</span>
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

              {/* Withdrawal details */}
              {view.chooseWithdrawerView && (
                <div className="h-full flex flex-col p-2">
                  <h3 className="text-2xl font-bold text-balance">
                    Choose Withdrawal Method
                  </h3>

                  <p className="my-1">Manage your withdrawal methods</p>
                  <div className="w-full h-fit flex flex-wrap [flex-direction:row] gap-2">
                    <div
                      onClick={() =>
                        handleComplexsityWithState(
                          messageView.value,
                          "payment-type",
                          true,
                          0
                        )
                      }
                      className={`relative w-[calc(50%-4px)] rounded-sm !border-[0.1px] ${isPicked[0].isBankAccount ? "border-primarySixTwo" : "border-gray-100/50"} p-3 mb-2 cursor-pointer`}
                    >
                      <div className="w-full flex items-center justify-start gap-2 relative">
                        <div className="w-fit flex items-center justify-center gap-2 mb-4">
                          <img
                            src={bank_icone}
                            alt={bank_icone}
                            className="block w-8 aspect-square"
                          />
                          <span className="flex text-xs font-light flex-col items-start justify-center">
                            <span className="block w-fit">Bank Account</span>
                            <span className="block w-fit">****763</span>
                          </span>
                        </div>
                        {isPicked[0].isBankAccount &&
                          !isPicked[1].isPayPal &&
                          !isPicked[2].isPayStack &&
                          !isPicked[3].isMore && (
                            <span className="inline-block text-black font-light text-xs p-[2px] border-none rounded-sm bg-gray-100/80 mr-0 ml-auto">
                              Default
                            </span>
                          )}
                      </div>
                      <p className="text-xs">Bank Transfer</p>
                      {isPicked[0].isBankAccount && (
                        <img
                          src={Icon9}
                          alt={Icon9}
                          className="absolute top-1 right-1 block w-3 aspect-square"
                        />
                      )}
                    </div>
                    <div
                      onClick={() =>
                        handleComplexsityWithState(
                          messageView.value,
                          "payment-type",
                          true,
                          1
                        )
                      }
                      className={`relative w-[calc(50%-4px)] rounded-sm !border-[0.1px] ${isPicked[1].isPayPal ? "border-primarySixTwo" : "border-gray-100/50"} p-3 mb-2 cursor-pointer`}
                    >
                      <div className="w-full flex items-center justify-start gap-2 relative">
                        <div className="w-fit flex items-center justify-center gap-2 mb-4">
                          <img
                            src={card_icone}
                            alt={card_icone}
                            className="block w-8 aspect-square"
                          />
                          <span className="flex text-xs font-light flex-col items-start justify-center">
                            <span className="block w-fit">PayStack</span>
                            <span className="block w-fit">
                              raymondamem@gmail.com
                            </span>
                          </span>
                        </div>
                      </div>
                      <p className="text-xs">PayStack</p>
                      {isPicked[1].isPayPal && (
                        <img
                          src={Icon9}
                          alt={Icon9}
                          className="absolute top-1 right-1 block w-3 aspect-square"
                        />
                      )}
                    </div>
                    <div
                      onClick={() =>
                        handleComplexsityWithState(
                          messageView.value,
                          "payment-type",
                          true,
                          2
                        )
                      }
                      className={`relative w-[calc(50%-4px)] rounded-sm !border-[0.1px] ${isPicked[2].isPayStack ? "border-primarySixTwo" : "border-gray-100/50"} p-3 mb-2 cursor-pointer`}
                    >
                      <div className="w-full flex items-center justify-start gap-2 relative">
                        <div className="w-fit flex items-center justify-center gap-2 mb-4">
                          <img
                            src={card_icone}
                            alt={card_icone}
                            className="block w-8 aspect-square"
                          />
                          <span className="flex text-xs font-light flex-col items-start justify-center">
                            <span className="block w-fit">PayPal</span>
                            <span className="block w-fit">
                              raymondamem@gmail.com
                            </span>
                          </span>
                        </div>
                      </div>
                      <p className="text-xs">PayPal</p>
                      {isPicked[2].isPayStack && (
                        <img
                          src={Icon9}
                          alt={Icon9}
                          className="absolute top-1 right-1 block w-3 aspect-square"
                        />
                      )}
                    </div>
                    <div
                      onClick={() =>
                        handleComplexsityWithState(
                          messageView.value,
                          "payment-type",
                          true,
                          3
                        )
                      }
                      className={`relative w-[calc(50%-4px)] rounded-sm !border-[0.1px] ${isPicked[3].isMore ? "border-primarySixTwo" : "border-gray-100/50"} p-3 mb-2 cursor-pointer`}
                    >
                      <div className="w-full h-full text-xs text-gray-100/50 flex justify-center items-center flex-col">
                        <span className="block w-fit">Add New Method</span>
                        <span className="block w-fit">234</span>
                      </div>
                      {isPicked[3].isMore && (
                        <img
                          src={Icon9}
                          alt={Icon9}
                          className="absolute top-1 right-1 block w-3 aspect-square"
                        />
                      )}
                    </div>
                  </div>

                  <h4 className="my-4">Processing Times</h4>
                  <ul className="list-disc pl-3">
                    <li className="text-xs mb-3">
                      Bank Transfer: 1-2 business days
                    </li>
                    <li className="text-xs mb-3">
                      PayStack: Instant to 24 hours
                    </li>
                    <li className="text-xs mb-3">PayPal: 1-2 business days</li>
                  </ul>
                </div>
              )}

              {/* Withdrawal details */}
              {view.withdrawDetailsView && (
                <div className="h-full flex flex-col p-2">
                  <h3 className="text-2xl font-bold text-balance">
                    Withdrawal Details
                  </h3>

                  <p className="my-1">
                    Enter the amount and confirm your withdrawal method
                  </p>
                  <div className="w-full h-fit flex flex-wrap [flex-direction:row] gap-2">
                    <div className="w-[calc(50%-4px)]">
                      <div className="bg-gradient-to-b from-slate-200/30 border-none rounded-sm p-4 mb-2">
                        <div className="w-fit flex items-center justify-center gap-2 mb-4">
                          <img
                            src={card_icone}
                            alt={card_icone}
                            className="block w-8 aspect-square"
                          />
                          <span className="flex text-sm font-semibold flex-col items-start justify-center">
                            <span className="block w-fit">
                              Available Balance
                            </span>
                            <span className="block w-fit text-xl">
                              ${"4,250"}
                            </span>
                          </span>
                        </div>
                      </div>

                      <h4 className="text-sm mb-2">Withdrawal Amount</h4>
                      <label htmlFor="amount" className="block w-full my-2">
                        <input
                          type="text"
                          id="amount"
                          placeholder="$   0.0"
                          className="text-sm block w-full p-2 text-white bg-black border-[0.1px] rounded-sm border-gray-100/50"
                        />
                      </label>

                      <div className="w-full rounded-sm !border-[0.1px] border-gray-100/50 p-3 mb-2">
                        <img
                          src={exclamation}
                          alt={exclamation}
                          className="block w-fit h-fit mb-2"
                        />
                        <p className="text-xs">Transaction Fees:</p>
                        <p className="text-xs text-gray-100/50">
                          Lorem, ipsum dolor sit amet consectetur adipisicing
                          elit. Aliquid, reiciendis ea iure aliquam dolorem
                          doloremque.
                        </p>
                      </div>
                    </div>

                    <div className="w-[calc(50%-4px)] h-fit rounded-sm !border-[0.1px] border-gray-100/50 p-3 mb-2">
                      <p className="text-sm mb-2">Withdrawal Summary</p>
                      <div className="text-xs w-full flex flex-col items-center justify-center gap-3 relative">
                        <p className="w-full flex justify-between items-center">
                          <span>Amount</span>
                          <span>$0.00</span>
                        </p>
                        <p className="w-full flex justify-between items-center">
                          <span>Method</span>
                          <span>PayStack (raymondamem525@gmail.com)</span>
                        </p>
                        <p className="w-full flex justify-between items-center">
                          <span>Processing Fee</span>
                          <span>Varies</span>
                        </p>
                        <hr className="w-full block" />
                        <h3 className="w-full flex justify-between items-center font-semibold">
                          <span>Net Amount</span>
                          {"  "}
                          <span>$0.00</span>
                        </h3>
                        <p className="w-full p-2 border-none rounded-sm bg-primarySixTwo/30 text-primarySixTwo text-xs">
                          Processing Time: Instant to 24 hours
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Confirm withdrawal */}
              {view.confirmReviewView && (
                <div className="h-full flex flex-col p-2">
                  <h3 className="text-2xl font-bold text-balance">
                    Review & Confirm Withdrawal
                  </h3>

                  <p className="my-1">
                    Please review your withdrawal details before confirming
                  </p>
                  <div className="w-full h-fit flex flex-wrap [flex-direction:row] gap-2">
                    <div className="w-[calc(50%-4px)]">
                      <div className="bg-gradient-to-b from-slate-200/30 border-none rounded-sm p-4 mb-2">
                        <div className="w-fit flex items-center justify-center gap-2 mb-4">
                          <img
                            src={card_icone}
                            alt={card_icone}
                            className="block w-8 aspect-square"
                          />
                          <span className="flex text-sm font-semibold flex-col items-start justify-center">
                            <span className="block w-fit">
                              Available Balance
                            </span>
                            <span className="block w-fit text-xl">
                              ${"4,250"}
                            </span>
                          </span>
                        </div>
                      </div>

                      <h4 className="text-sm mb-2">Withdrawal Amount</h4>
                      <label htmlFor="amount" className="block w-full my-2">
                        <input
                          type="text"
                          id="amount"
                          placeholder="$   0.0"
                          className="text-sm block w-full p-2 text-white bg-black border-[0.1px] rounded-sm border-gray-100/50"
                        />
                      </label>

                      <div className="w-full rounded-sm !border-[0.1px] border-gray-100/50 p-3 mb-2">
                        <img
                          src={exclamation}
                          alt={exclamation}
                          className="block w-fit h-fit mb-2"
                        />
                        <p className="text-xs">Transaction Fees:</p>
                        <p className="text-xs text-gray-100/50">
                          Lorem, ipsum dolor sit amet consectetur adipisicing
                          elit. Aliquid, reiciendis ea iure aliquam dolorem
                          doloremque.
                        </p>
                      </div>
                    </div>

                    <div className="w-[calc(50%-4px)] h-fit rounded-sm !border-[0.1px] border-gray-100/50 p-3 mb-2">
                      <p className="text-sm mb-2">Withdrawal Summary</p>
                      <div className="text-xs w-full flex flex-col items-center justify-center gap-3 relative">
                        <p className="w-full flex justify-between items-center">
                          <span>Amount</span>
                          <span>$0.00</span>
                        </p>
                        <p className="w-full flex justify-between items-center">
                          <span>Method</span>
                          <span>PayStack (raymondamem525@gmail.com)</span>
                        </p>
                        <p className="w-full flex justify-between items-center">
                          <span>Processing Fee</span>
                          <span>Varies</span>
                        </p>
                        <hr className="w-full block" />
                        <h3 className="w-full flex justify-between items-center font-semibold">
                          <span>Net Amount</span>
                          {"  "}
                          <span>$0.00</span>
                        </h3>
                        <p className="w-full p-2 border-none rounded-sm bg-primarySixTwo/30 text-primarySixTwo text-xs">
                          Processing Time: Instant to 24 hours
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        {/* back btn */}
        {(view.chooseWithdrawerView ||
          view.withdrawDetailsView ||
          view.confirmReviewView) && (
          <div className="w-full h-fit flex justify-between items-center">
            <button
              type="button"
              onClick={() =>
                setView({
                  allTimesEarningsView: view.confirmReviewView ? false : true,
                  chooseWithdrawerView: false,
                  withdrawDetailsView: view.confirmReviewView ? true : false,
                  confirmReviewView: false
                })
              }
              className="flex justify-center items-center mt-4 w-fit h-fit text-xs font-semibold py-1.5 px-6 text-primaryTwo bg-primaryThree rounded-sm flex-shrink-0"
            >
              Back
            </button>

            <button
              type="button"
              onClick={() =>
                setView({
                  allTimesEarningsView: false,
                  chooseWithdrawerView: false,
                  withdrawDetailsView: view.withdrawDetailsView ? false : true,
                  confirmReviewView: view.withdrawDetailsView ? true : false
                })
              }
              className={`flex justify-center items-center mt-4 w-fit h-fit text-xs font-semibold py-1.5 px-6 ${view.chooseWithdrawerView ? "bg-primaryTwo text-primaryThree border-[0.1px] border-gray-100/50" : "text-primaryTwo bg-primaryThree"} rounded-sm flex-shrink-0`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </CourseOverviewRoot>
  );
}
