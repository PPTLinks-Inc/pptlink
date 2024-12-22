/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useRef, useCallback, useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import callus from "/team/pptlink_resources/Group 31.png";
import location from "/team/pptlink_resources/Group 32.png";
import sms from "/team/pptlink_resources/Group 33.png";
import AccordionWrapper from "../accordion/accordion";
import Card from "../list/card";
import { LoadingAssetSmall } from "../../assets/assets";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";
import { motion, stagger, useInView, useAnimate } from "framer-motion";
import FAQ from "./data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaCirclePlay } from "react-icons/fa6";
import Modal from "../Models/model";
import { Helmet } from "react-helmet";
import LogoBlack from "../../images/Logo-Black.png";
import usePublicPresentation from "../../hooks/usePublicPresentation";
import useUser from "../../hooks/useUser";

export default function NewHome() {
  // context
  const scrollRef = useRef();
  const scrollRefTwo = useRef();
  const { userQuery } = useUser();
  const user = userQuery.data;
  const { presentations, refetch } = usePublicPresentation();
  const [currentView, setCurrentView] = useState(1);
  const [open, setOpen] = useState(false);

  const handleView = (e) => {
    setCurrentView(parseInt(e.target.dataset.allcourses));
  };

  const [values, setValues] = useState({
    msgName: "",
    msgEmail: "",
    msgPhone: "",
    msgReason: "",
    msg: "",

    msgPending: false,
    msgError: [],
    msgSuccess: ""
  });

  const handleMsgSubmit = useCallback((e) => {
    e.preventDefault();

    setValues({ ...values, msgPending: true });
  }, []);

  const scrollCards = (isLeft) => {
    const scrollAmount = 250;
    const scrollContainer = scrollRef.current;

    return isLeft
      ? scrollContainer.scrollTo({
        left: scrollContainer.scrollLeft - scrollAmount,
        behavior: "smooth"
      })
      : scrollContainer.scrollTo({
        left: scrollContainer.scrollLeft + scrollAmount,
        behavior: "smooth"
      });
  };

  const scrollCardsTwo = (isLeft) => {
    const scrollAmount = 290;
    const scrollContainer = scrollRefTwo.current;

    return isLeft
      ? scrollContainer.scrollTo({
        left: scrollContainer.scrollLeft - scrollAmount,
        behavior: "smooth"
      })
      : scrollContainer.scrollTo({
        left: scrollContainer.scrollLeft + scrollAmount,
        behavior: "smooth"
      });
  };
  // framer
  const parentVarient = {
    initial: {
      // y: 5,
      opacity: 0
    },
    animate: {
      y: 0,
      opacity: 100,
      transition: { duration: 1, staggerChildren: 0.5 }
    }
  };
  const containerVarient = {
    initial: {
      y: 20,
      opacity: 0
    },
    inView: {
      y: 0,
      opacity: 100,
      transition: {
        duration: 1,
        staggerChildren: 0.2,
        type: "spring",
        stiffness: 120
      }
    }
  };
  const secondVarient = {
    initial: {
      y: 50,
      opacity: 0
    },
    inView: {
      y: 0,
      opacity: 100,
      transition: {
        duration: 1,
        staggerChildren: 0.2,
        when: "beforeChildren"
        // type: "spring",
        // stiffness: 120
      }
    }
  };

  // const goToLibrary = () => navigate("/library");

  const [scope, animate] = useAnimate();
  const isInView = useInView(scope, { once: true });
  useEffect(() => {
    if (isInView) {
      animate(
        "div",
        { opacity: 1 },
        {
          delay: stagger(0.15, { from: "first" }),
          duration: 1,
          at: "<"
        }
      );
    } else {
      animate("div", { opacity: 0 });
    }
  }, [isInView]);

  const containertVarients = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.5,
        duration: 1.5
      }
    },
    exit: {
      x: "-100vw",
      transition: {
        ease: "easeInOut"
      }
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <motion.iframe
          className="w-[95vw] md:w-[60vw] aspect-video mx-auto !border-0 rounded-md"
          src={`${open && "https://www.youtube-nocookie.com/embed/meTNh23fYKg?autoplay=1&controls=1&rel=0"}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          fetchPriority="high"
        ></motion.iframe>
      </Modal>

      <section className={`parent_page_wrapper w-full max-h-fit`}>
        <Helmet>
          <title>{`Home - PPTLinks `}</title>
          <meta
            name='description'
            content='Make your powerpoint presentations quickly and easily with or without a projector with PPTLinks'
          />
          <meta
            name='tags'
            content={`PPT, Presentations, Powerpoint, PPTLinks`}
          />

          {/* meta tags to display information on all meta platforms (facebook, instagram, whatsapp) */}
          <meta property='og:type' content='website' />
          <meta property='og:url' content={`https://www.PPTLink.com/`} />
          <meta property='og:title' content={`Home - PPTLinks `} />
          <meta
            property='og:description'
            content='Make your powerpoint presentations quickly and easily with or without a projector with PPTLinks'
          />
          <meta property='og:image' content={LogoBlack} />

          {/* meta tags to display information on twitter  */}
          <meta property='twitter:card' content='website' />
          <meta
            property='twitter:url'
            content={`https://www.PPTLink.com/`}
          />

          <meta property='twitter:title' content={`Home - PPTLinks `} />
          <meta
            property='twitter:description'
            content='Make your powerpoint presentations quickly and easily with or without a projector with PPTLinks'
          />
          <meta property='twitter:image' content={LogoBlack} />
        </Helmet>
        <div className="relative w-full h-fit flex justify-center items-center tall:min-h-fit bg-black text-white py-6">
          <div className="container flex justify-between gap-20 maxScreenMobile:gap-4 maxScreen:flex-col-reverse _tall:flex-col-reverse !pt-16">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: { duration: 1, type: "tween" }
              }}
              viewport={{ once: true }}
              onClick={() => setOpen(true)}
              className={`cursor-pointer banner_img w-full aspect-video mx-auto !border-[0.5px] border-[#FFFFF0] rounded-lg _maxScreenMobile:aspect-[2/1.5] flex justify-center items-center bg-[url(https://img.youtube.com/vi/meTNh23fYKg/hqdefault.jpg)] bg-cover bg-center relative before:block before:bg-black/50 before:absolute before:top-0 before:left-0 before:w-full before:h-full before:rounded-lg`}>
              <span className="block text-5xl text-[#FFFFF0] z-10"><FaCirclePlay /></span>
            </motion.div>

            <motion.div
              variants={parentVarient}
              initial="initial"
              animate="animate"
              className="flex flex-col justify-start !text-left w-full maxScreenMobile:gap-4 maxScreenMobile:!text-lefts"
            >
              <motion.h1
                variants={parentVarient}
                className="text-5xl mb-1 md:mb-3 font-extrabold maxScreenMobile:text-4xl"
              >
                Your Courses, Their Future
              </motion.h1>
              <motion.h3
                variants={parentVarient}
                className="responsiveText mb-1 md:mb-3 font-bold maxScreen:!text-2xl"
              >
                Teach Across Africa, No Data Limits.
              </motion.h3>
              <motion.p
                variants={parentVarient}
                className="w-full responsiveText leading-[2rem] opacity-5 mb-1 md:mb-3 md:text-justify"
              >
                Don’t let internet limitations hold you back. Our platform empowers African course creators to reach their students, no matter the location or connectivity. Present your courses smoothly, with minimal data, and make sure your lessons reach the people who need them.
              </motion.p>
              <motion.div
                variants={parentVarient}
                className="mx-[auto] flex justify-left items-center gap-4 w-full _maxScreenMobile:flex-col"
              >
                <Link
                  to="create"
                  className="block w-fit px-6 py-1 bg-[#FFFFF0] text-black responsiveText rounded-md maxScreenMobile:w-fit maxScreenMobile:mb-3"
                >
                  Create Now
                </Link>
                <Link
                  to="/signin"
                  className={`block w-fit px-6 py-1 _bg-[black] text-[#FFFFF0] responsiveText border-[0.5px] border-[#FFFFF0] rounded-md maxScreenMobile:w-fit maxScreenMobile:mb-3 ${user && "hidden"}`}
                >
                  Sign In
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
        {/* ////////////////////////////All the skills you need in one place////////////////////////////////////////////////// */}
        <div className="w-full h-fit bg-black py-6 relative text-[#FFFFF0] !pt-16">
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            whileInView={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, type: "tween" }
            }}
            viewport={{ once: true }}
            className="container text-4xl font-extrabold text-center maxScreenMobile:text-3xl maxScreenMobile:font-bold !mb-2">
            All the skills you need in one place
          </motion.h2>
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            whileInView={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, type: "tween" }
            }}
            viewport={{ once: true }}
            className="w-2/5 mx-auto text-sm text-center  maxScreenMobile:w-[90%]">
            Checkout all available skills you will need to kick start a carrier in the tech industry
          </motion.p>

          <div className="container grid grid-cols-4 grid-flow-col overflow-x-auto !mt-6">
            <span data-allcourses="1" onClick={handleView} className={`flex justify-center items-end w-full text-center cursor-pointer responsiveText maxScreenMobile:text-[0.5rem] border-b-[1px] border-[gray] _min-w-[10rem] ${currentView === 1 && "!border-[#FFFFF0] font-bold"}`}>Software</span>
            <span data-allcourses="2" onClick={handleView} className={`flex justify-center items-end w-full text-center cursor-pointer responsiveText maxScreenMobile:text-[0.5rem] border-b-[1px] border-[gray] _min-w-[10rem] ${currentView === 2 && "!border-[#FFFFF0] font-bold"}`}>Design</span>
            <span data-allcourses="3" onClick={handleView} className={`flex justify-center items-end w-full text-center cursor-pointer responsiveText maxScreenMobile:text-[0.5rem] border-b-[1px] border-[gray] _min-w-[10rem] ${currentView === 3 && "!border-[#FFFFF0] font-bold"}`}>Fashion</span>
            <span data-allcourses="4" onClick={handleView} className={`flex justify-center items-end w-full text-center cursor-pointer responsiveText maxScreenMobile:text-[0.5rem] border-b-[1px] border-[gray] _min-w-[10rem] ${currentView === 4 && "!border-[#FFFFF0] font-bold"}`}>Barting</span>
          </div>

          <div className="_hidden flex justify-end items-center  gap-5 maxScreenMobile:justify-end container mx-auto h-fit bg-[transparent] py-4">
            <button className="border-[0.5px] border-[rgba(255,166,0,0.31)] flex items-center justify-center w-[45px] aspect-square rounded-[25%] bg-[rgba(0,0,0,0.29)] hover:bg-[#FFA500]">
              <FaCaretLeft
                onClick={() => scrollCardsTwo(true)}
                className="text-[1.5rem] text-[#FFFFF0] cursor-pointer active:text-[rgba(0,0,0,0.5)]"
              />
            </button>
            <button className="border-[0.5px] border-[rgba(255,166,0,0.31)] flex items-center justify-center w-[45px] aspect-square rounded-[25%] bg-[rgba(0,0,0,0.29)] hover:bg-[#FFA500]">
              <FaCaretRight
                onClick={() => scrollCardsTwo(false)}
                className="text-[1.5rem] text-[#FFFFF0] cursor-pointer active:text-[rgba(0,0,0,0.5)]"
              />
            </button>
          </div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{
              opacity: 1,
              y: 0,
              transition: { duration: 1, type: "tween" }
            }}
            viewport={{ once: true }}
            ref={scrollRefTwo}
            className="snap_scrolling container flex gap-8 h-fit overflow-x-auto overflow-y-hidden pr-2 pb-6 mb-6 scroll-smooth">
            {(currentView === 1 ||
              currentView === 2 ||
              currentView === 3 ||
              currentView === 4) && Array.from({ length: 10 }, (_, i) => i + 1).map(idx => (
                <NavLink
                  key={idx.toString()}
                  className="snap_scrolling_child min-w-[18rem] grow-0 shrink-0 basis-[15rem] !aspect-[2/2.5] bg-[url('/cod.png')] bg-cover bg-center flex flex-col justify-between items-start py-6 px-2 border-[0.1px] rounded-lg relative before:block before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-black/25 cursor-pointer shadow-white shadow-inner z-10"
                  to="/libraryPage"
                >
                  <div className="z-10">
                    <p className="text-md font-light mb-1">Software Development</p>
                    <h4 className="text-2xl font-bold">Mobile Development Basics</h4>
                  </div>
                  <div className="z-10">
                    <p className="text-md font-light mb-3">David A. Spencer</p>
                    <div className="relative flex items-center justify-between gap-1 w-full">
                      <span className="flex -space-x-3">
                        {Array.from({ length: 7 }, (_, i) => i + 1).map(index => (
                          <Avatar
                            key={index.toString()}
                            className="border-2 border-background block w-[1.5rem] h-[1.5rem] !rounded-[0.75rem]"
                            style={{ zIndex: index + 1 }}
                          >
                            <AvatarImage src={"/team/baraka.jpg"} alt={"baraka"} className="object-cover" />
                            <AvatarFallback>{"B"}</AvatarFallback>
                          </Avatar>
                        ))}
                      </span>
                      <span className="block w-fit responsiveText">25+ enrolled</span>
                    </div>
                  </div>
                </NavLink>
              ))}
          </motion.div>
          <NavLink
            to="#"
            className="block text-center text-[#FFA500] underline"
          >
            See more
          </NavLink>
        </div>
        {/* ////////////////////////////End All the skills you need in one place////////////////////////////////////////////////// */}
        {/* /////////////////////////////Popular Presentations////////////////////////////////////////////////// */}
        <div className="w-full h-fit bg-black !pt-16">
          <div className="_recent public_presentations container relative min-h-[60vh] bg-transparent text-[#FFFFF0] flex flex-col text-justify items-center">
            <motion.h2
              initial={{ y: 10, opacity: 0 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: { duration: 1, type: "tween" }
              }}
              viewport={{ once: true }}
              className="w-full text-4xl font-extrabold mb-6 maxScreenMobile:mb-4 maxScreenMobile:font-bold maxScreenMobile:text-3xl maxScreenMobile:text-center">
              Popular Presentations
            </motion.h2>

            <div className="hidden maxScreenMobile:flex gap-5 justify-end w-[90%] mx-auto mb-4 h-fit bg-[transparent]">
              <button className="border-[0.5px] border-[rgba(255,166,0,0.31)] flex items-center justify-center w-[45px]  aspect-square rounded-[25%] bg-[rgba(0,0,0,0.29)] hover:bg-[#FFA500]">
                <FaCaretLeft
                  onClick={() => scrollCards(true)}
                  className="text-[1.5rem] text-[#FFFFF0] cursor-pointer active:text-[rgba(0,0,0,0.5)]"
                />
              </button>
              <button className="border-[0.5px] border-[rgba(255,166,0,0.31)] flex items-center justify-center w-[45px]  aspect-square rounded-[25%] bg-[rgba(0,0,0,0.29)] hover:bg-[#FFA500]">
                <FaCaretRight
                  onClick={() => scrollCards(false)}
                  className="text-[1.5rem] text-[#FFFFF0] cursor-pointer active:text-[rgba(0,0,0,0.5)]"
                />
              </button>
            </div>

            <div className="w-full min-h-[40vh]">
              <motion.div
                variants={containerVarient}
                initial="initial"
                whileInView="inView"
                viewport={{ once: true }}
                className="cards_wrapper w-full scroll-smooth"
                ref={scrollRef}
              >
                {presentations.slice(0, 12).map((presentation) => (
                  <Card
                    key={presentation.id}
                    presentation={presentation}
                    refresh={refetch}
                  />
                ))}
              </motion.div>
            </div>
            <NavLink
              to="/public_presentation"
              className="block text-center text-[#FFA500] underline mt-6"
            >
              See more
            </NavLink>
          </div>
        </div>
        {/* ////////////////////////////End Popular Presentations////////////////////////////////////////////////// */}
        <div className="max-h-fit bg-black text-white pt-8">
          <div className="container !pt-16">
            <motion.h3
              variants={secondVarient}
              initial="initial"
              whileInView="inView"
              viewport={{ margin: "100px", once: true }}
              className="text-5xl mb-8 uppercase font-[500]"
            >
              Get in touch
            </motion.h3>
            <div className="wrap_contacts w-full flex justify-between items-center flex-wrap maxScreenMobile:flex-col-reverse">
              <motion.div
                // variants={secondVarient}
                // initial="initial"
                // whileInView="inView"
                // viewport={{ margin: "100px", once: true }}
                className="w-[50%] min-h-[30rem] text-sm maxScreenMobile:w-full"
              >
                <motion.h5
                  variants={secondVarient}
                  className="mb-2 text-xl font-semibold"
                >
                  Send a message
                </motion.h5>
                <motion.p
                  variants={secondVarient}
                  className="w-full mb-4 responsiveText font-thin"
                >
                  Your voice matters! Share your thought and feedback with us and
                  be part of our community.
                </motion.p>
                <motion.form variants={secondVarient} onSubmit={handleMsgSubmit}>
                  <div className="flex justify-between items-center gap-4 mb-8 maxScreenMobile:flex-col">
                    <div className="w-[50%] maxScreenMobile:w-full">
                      <label
                        htmlFor="name"
                        className="block w-full text-sm mb-2"
                      >
                        Name:
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={values.msgName}
                        onChange={(e) => {
                          setValues({ ...values, msgName: e.target.value });
                        }}
                        className="block w-full bg-transparent border-[1px] border-solid border-white rounded-md py-2 text-white indent-4"
                        placeholder="Enter fullname"
                        required
                      />
                    </div>
                    <div className="w-[50%] maxScreenMobile:w-full">
                      <label
                        htmlFor="email"
                        className="block w-full text-sm mb-2"
                      >
                        Email Address:
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={values.msgEmail}
                        onChange={(e) => {
                          setValues({ ...values, msgEmail: e.target.value });
                        }}
                        className="block w-full bg-transparent border-[1px] border-solid border-white rounded-md py-2 text-white indent-4"
                        placeholder="Enter email"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-end gap-4 mb-8 maxScreenMobile:flex-col">
                    <div className="w-[50%] maxScreenMobile:w-full">
                      <label
                        htmlFor="phone"
                        className="block w-full text-sm mb-2"
                      >
                        Phone Number:
                      </label>
                      <input
                        type="text"
                        id="phone"
                        name="phone"
                        inputMode="numeric"
                        value={values.msgPhone}
                        onChange={(e) => {
                          setValues({ ...values, msgPhone: e.target.value });
                        }}
                        className="block w-full bg-transparent border-[1px] border-solid border-white rounded-md py-2 text-white indent-4"
                        placeholder="Enter phone number"
                        required
                      />
                    </div>

                    <div className="w-[50%] h-fit maxScreenMobile:w-full">
                      <label
                        htmlFor="reason"
                        className="block w-full text-sm mb-2"
                      >
                        Choose reason:
                      </label>
                      <select
                        id="reason"
                        value={values.msgReason}
                        onChange={(e) => {
                          setValues({ ...values, msgReason: e.target.value });
                        }}
                        className="bg-black border-[1px] border-white rounded-md text-white block w-full py-[0.5rem]"
                      >
                        <option value="" disabled>
                          Reason for writing?
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

                  <div className=" mb-8">
                    <label
                      htmlFor="message"
                      className="block w-full text-sm mb-2"
                    >
                      Message:
                    </label>
                    <textarea
                      name="message"
                      id="message"
                      cols="auto"
                      rows="auto"
                      value={values.msg}
                      onChange={(e) => {
                        setValues({ ...values, msg: e.target.value });
                      }}
                      className="block w-full !h-32 bg-transparent border-[1px] border-solid border-white rounded-md py-1 indent-4 resize-none text-white"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="h-[2rem] w-[10rem] flex items-center justify-center bg-[#FFFFF0] ml-auto text-black text-[.8rem] font-medium rounded-md"
                  >
                    {values.msgPending ? <LoadingAssetSmall /> : "Submit"}
                  </button>
                </motion.form>
              </motion.div>

              <motion.div
                variants={secondVarient}
                initial="initial"
                whileInView="inView"
                viewport={{ margin: "100px", once: true }}
                className="w-2/5 min-h-[30rem] maxScreenMobile:w-full relative parallel_lines"
              >
                <div className="w-full mb-8">
                  <h4 className="mb-3 text-[1.1rem] font-semibold">Call Us</h4>
                  <p className="text-sm mb-3 font-thin">
                    Have a question or need guidance? Call us now and lets discuss
                    how we can help you achieve your goal.
                  </p>
                  <div className="flex items-center">
                    <img
                      src={callus}
                      alt={callus}
                      className="block w-5 h-5 mr-1"
                      loading="lazy"
                    />
                    <a href="tel:+2349068314394" className="text-[#FFA500] text-sm">
                      +2349068314394
                    </a>
                  </div>
                </div>

                <div className="w-full mb-8">
                  <h4 className="mb-3 text-[1.1rem] font-semibold">Visit Us</h4>
                  <p className="text-sm mb-3 font-thin">
                    We’d love to welcome you to our office. Visit us let’s discuss
                    your project.
                  </p>
                  <div className="flex items-center">
                    <img
                      src={location}
                      alt={location}
                      className="block w-5 h-5 mr-1"
                      loading="lazy"
                    />
                    <a href="/" className="text-[#FFA500] text-sm">
                      Nascomsoft in Angwan Cashew, opp Elim church, 740102, Bauchi
                      Nigeria
                    </a>
                  </div>
                </div>

                <div className="w-full mb-8">
                  <h4 className="mb-3 text-[1.1rem] font-semibold">Message Us</h4>
                  <p className="text-sm mb-3 font-thin">
                    Write to us through text, on linkedin or any of our social
                    handles
                  </p>
                  <div className="flex items-center">
                    <img
                      src={sms}
                      alt={sms}
                      className="block w-5 h-5 mr-1"
                      loading="lazy"
                    />
                    <a href="sms:+2349068314394" className="text-[#FFA500] text-sm">
                      SMS to +2349068314394
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="container flex justify-between align-top maxScreenMobile:flex-col py-8 !pt-16">
            <motion.div
              className="w-2/5 pr-5 maxScreenMobile:w-full max-h-fit"
              variants={secondVarient}
              initial="initial"
              whileInView="inView"
              viewport={{ margin: "100px", once: true }}
            >
              <p className="mb-1">FAQs</p>
              <h3 className="text-[3rem] font-black break-all leading-[4rem] maxScreenMobile:text-[2rem]">
                Frequently <br /> Asked <br /> Questions.
              </h3>
            </motion.div >

            <div className="w-3/5 maxScreenMobile:w-full" ref={scope}>
              {FAQ.map((_, id) => (
                <AccordionWrapper
                  key={id}
                  title={_.title}
                  className="transition-all duration-300"
                >
                  <h3 className="w-full text-lg font-semibold mb-[15px]">
                    {_.h3}
                  </h3>
                  <p className="w-full text-md">{_.p}</p>
                </AccordionWrapper>
              ))}
            </div>
          </div >
        </div >
      </section >
    </>
  );
}
