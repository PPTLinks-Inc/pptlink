/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useRef, useCallback, useContext, useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import anim_img1 from "/team/pptlink_resources/presentation.png";
import anim_img2 from "/team/pptlink_resources/hosting-monitors-server-svgrepo-com.png";
import anim_img3 from "/team/pptlink_resources/school-svgrepo-com.png";
import anim_img4 from "/team/pptlink_resources/presentation-education-svgrepo-com.png";
import anim_img5 from "/team/pptlink_resources/analytics-presentation-svgrepo-com.png";
import callus from "/team/pptlink_resources/Group 31.png";
import location from "/team/pptlink_resources/Group 32.png";
import sms from "/team/pptlink_resources/Group 33.png";
import AccordionWrapper from "../accordion/accordion";
import Card from "../list/card";
import { userContext } from "../../contexts/userContext";
import { LoadingAssetSmall } from "../../assets/assets";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";
import { motion, stagger, useInView, useAnimate } from "framer-motion";
import FAQ from "./data";
import { publicPresentation } from "../../contexts/publicPresentationContext";
import { Helmet } from 'react-helmet';
import LogoBlack from '../../images/Logo-Black.png';

export default function NewHome() {
  // context
  const scrollRef = useRef();
  const { user } = useContext(userContext);
  const { presentations, refetch } = useContext(publicPresentation);
  const [currentView, setCurrentView] = useState(1);
  const navigate = useNavigate();

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
      y: 50,
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

  const goToLibrary = () => navigate("/library");

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
    <motion.section
      className={`parent_page_wrapper w-full`}
      variants={containertVarients}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
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
      <div className="_banner relative w-full min-h-[80vh] flex justify-center items-center tall:min-h-fit bg-black text-white py-20">
        <div className="container flex justify-between gap-14 maxScreen:flex-col-reverse tall:flex-col-reverse">
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            whileInView={{
              opacity: 1,
              y: 0,
              transition: { duration: 1, type: "tween" }
            }}
            viewport={{ once: true }}
            className="banner_img w-full aspect-[2/1] mx-auto !border-[0.5px] border-[#FFFFF0] rounded-2xl maxScreenMobile:aspect-[2/1.5]">
            <motion.iframe
              className="w-full h-full mx-auto !border-0 rounded-2xl"
              src="https://www.youtube-nocookie.com/embed/meTNh23fYKg?si=-ibyWcdA5oWJ7TTv&amp;controls=0"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen
              fetchpriority="high" >
            </motion.iframe>
          </motion.div>

          <motion.div
            variants={parentVarient}
            initial="initial"
            animate="animate"
            className="flex flex-col justify-start _pt-[3.5rem] !text-left w-full maxScreenMobile:!text-center"
          >
            <motion.h1
              variants={parentVarient}
              className="text-[2rem] mb-1 font-extrabold"
            >
              Your Courses, Their Future
            </motion.h1>
            <motion.h3
              variants={parentVarient}
              className="text-[1rem] mb-1 font-bold"
            >
              Teach Across Africa, No Data Limits.
            </motion.h3>
            <motion.p
              variants={parentVarient}
              className="w-full text-[0.8rem] leading-[2rem] opacity-5 mb-4"
            >
              Don’t let internet limitations hold you back. Our platform empowers African course creators to reach their students, no matter the location or connectivity. Present your courses smoothly, with minimal data, and make sure your lessons reach the people who need them.
            </motion.p>
            <motion.div
              variants={parentVarient}
              className="mx-[auto] flex justify-left items-center gap-4 w-full maxScreenMobile:flex-col"
            >
              <button
                className="block _w-2/5 w-fit px-8 h-[2.5rem] _bg-[black] text-[#FFFFF0] text-[1rem] border-2 border-[#FFFFF0] rounded-md maxScreenMobile:w-full maxScreenMobile:mb-3"
                onClick={() =>
                  user ? navigate("/upload") : navigate("/signin")
                }
              >
                Present
              </button>
              <button
                className="block _w-2/5 w-fit px-8 h-[2.5rem] bg-[#FFFFF0] text-black text-[1rem] rounded-md maxScreenMobile:w-full maxScreenMobile:mb-3"
                onClick={goToLibrary}
              >
                Libraries
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
      <div className="w-full bg-[#FFFFF0] py-1"></div>
      {/* /////////////////////////////see more////////////////////////////////////////////////// */}
      <div className="w-full h-fit bg-black">
        <div className="_recent public_presentations container relative min-h-[60vh] bg-transparent text-white text-justify pt-14 pb-10">
          <motion.h2
            initial={{ y: 100, opacity: 0 }}
            whileInView={{
              opacity: 1,
              y: 0,
              transition: { duration: 1, type: "tween" }
            }}
            viewport={{ once: true }}
            className="w-full text-4xl font-extrabold maxScreenMobile:font-bold maxScreenMobile:text-2xl maxScreenMobile:text-center">
            Recent Presentation
          </motion.h2>

          <div className="scrollBtns hidden maxScreenMobile:absolute maxScreenMobile:right-0 maxScreenMobile:w-fit maxScreenMobile:h-fit maxScreenMobile:bg-[transparent] maxScreenMobile:flex maxScreenMobile:gap-5 maxScreenMobile:!mt-5">
            <button className="border-[0.5px] border-[rgba(255,166,0,0.31)] flex items-center justify-center w-[45px] _translate-x-[2rem] aspect-square rounded-[25%] bg-[rgba(0,0,0,0.29)] _hover:scale-y-[1.3] _hover:scale-x-[1.3] _hover:bg-[rgba(0,0,0,0.5)] hover:bg-[#FFA500]">
              <FaCaretLeft
                onClick={() => scrollCards(true)}
                className="text-[1.5rem] _text-[#FFA500] text-[#FFFFF0] cursor-pointer active:text-[rgba(0,0,0,0.5)]"
              />
            </button>
            <button className="border-[0.5px] border-[rgba(255,166,0,0.31)] flex items-center justify-center w-[45px] _translate-x-[2rem] aspect-square rounded-[25%] bg-[rgba(0,0,0,0.29)] _hover:scale-y-[1.3] _hover:scale-x-[1.3] _hover:bg-[rgba(0,0,0,0.5)] hover:bg-[#FFA500]">
              <FaCaretRight
                onClick={() => scrollCards(false)}
                className="text-[1.5rem] _text-[#FFA500] text-[#FFFFF0] cursor-pointer active:text-[rgba(0,0,0,0.5)]"
              />
            </button>
          </div>
          <div className="min-h-[40vh] mt-24 mb-6">
            <motion.div
              variants={containerVarient}
              initial="initial"
              whileInView="inView"
              viewport={{ once: true }}
              className="cards_wrapper w-full mt-20 maxScreenMobile:mt-0 mb-10 maxScreenMobile:mb-10 scroll-smooth"
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
            className="block text-center text-[#FFA500] underline"
          >
            See more
          </NavLink>
        </div>
      </div>
      {/* /////////////////////////////see more////////////////////////////////////////////////// */}

      <div className="w-full h-fit bg-black py-14">
        <motion.h2
          initial={{ y: 100, opacity: 0 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: { duration: 1, type: "tween" }
          }}
          viewport={{ once: true }}
          className="container text-3xl font-extrabold text-center maxScreenMobile:text-2xl maxScreenMobile:font-bold">
          All the skills you need in one place
        </motion.h2>
        <motion.h2
          initial={{ y: 100, opacity: 0 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: { duration: 1, type: "tween" }
          }}
          viewport={{ once: true }}
          className="w-2/5 !mx-auto text-[0.9rem] font-extrabold text-center maxScreenMobile:!container maxScreenMobile:mt-4">
          Lorem ipsum dolor sit amet. consectetur adipisicing elit. Voluptate commodi rem, ut architecto mollitia saepe!
        </motion.h2>

        <div className="container grid grid-cols-4 grid-flow-col overflow-x-auto !mt-14">
          <span data-allcourses="1" onClick={handleView} className={`flex justify-center items-end w-full text-center cursor-pointer text-[0.9rem] maxScreenMobile:text-[0.6rem] border-b-[1px] border-[gray] _min-w-[10rem] ${currentView === 1 && "!border-[#FFFFF0] font-bold"}`}>Software development</span>
          <span data-allcourses="2" onClick={handleView} className={`flex justify-center items-end w-full text-center cursor-pointer text-[0.9rem] maxScreenMobile:text-[0.6rem] border-b-[1px] border-[gray] _min-w-[10rem] ${currentView === 2 && "!border-[#FFFFF0] font-bold"}`}>Design</span>
          <span data-allcourses="3" onClick={handleView} className={`flex justify-center items-end w-full text-center cursor-pointer text-[0.9rem] maxScreenMobile:text-[0.6rem] border-b-[1px] border-[gray] _min-w-[10rem] ${currentView === 3 && "!border-[#FFFFF0] font-bold"}`}>Fashion</span>
          <span data-allcourses="4" onClick={handleView} className={`flex justify-center items-end w-full text-center cursor-pointer text-[0.9rem] maxScreenMobile:text-[0.6rem] border-b-[1px] border-[gray] _min-w-[10rem] ${currentView === 4 && "!border-[#FFFFF0] font-bold"}`}>Barting</span>
        </div>

        <div className={`w-full max-h-[30rem] overflow-x-auto mt-8`}>
          <motion.div
            variants={containerVarient}
            initial="initial"
            whileInView="inView"
            viewport={{ once: true }}
            className={`${currentView === 1 ? "wrapAllCourses" : "hidden"} pl-6 mt-16 maxScreenMobile:mt-0 mb-10 maxScreenMobile:mb-10 scroll-smooth`}
            ref={scrollRef}
          >
            {presentations.slice(0, 12).map((presentation) => (
              <Card key={presentation.id} presentation={presentation} refresh={refetch} />
            ))}
          </motion.div>

          <motion.div
            variants={containerVarient}
            initial="initial"
            whileInView="inView"
            viewport={{ once: true }}
            className={`${currentView === 2 ? "wrapAllCourses" : "hidden"} pl-6 mt-16 maxScreenMobile:mt-0 mb-10 maxScreenMobile:mb-10 scroll-smooth`}
            ref={scrollRef}
          >
            {presentations.slice(0, 12).map((presentation) => (
              <Card key={presentation.id} presentation={presentation} refresh={refetch} />
            ))}
          </motion.div>

          <motion.div
            variants={containerVarient}
            initial="initial"
            whileInView="inView"
            viewport={{ once: true }}
            className={`${currentView === 3 ? "wrapAllCourses" : "hidden"} pl-6 mt-16 maxScreenMobile:mt-0 mb-10 maxScreenMobile:mb-10 scroll-smooth`}
            ref={scrollRef}
          >
            {presentations.slice(0, 12).map((presentation) => (
              <Card key={presentation.id} presentation={presentation} refresh={refetch} />
            ))}
          </motion.div>

          <motion.div
            variants={containerVarient}
            initial="initial"
            whileInView="inView"
            viewport={{ once: true }}
            className={`${currentView === 4 ? "wrapAllCourses" : "hidden"} pl-6 mt-16 maxScreenMobile:mt-0 mb-10 maxScreenMobile:mb-10 scroll-smooth`}
            ref={scrollRef}
          >
            {presentations.slice(0, 12).map((presentation) => (
              <Card key={presentation.id} presentation={presentation} refresh={refetch} />
            ))}
          </motion.div>
        </div>
      </div>
      {/* why use PPTLINKS */}
      <div className="why_pptlinks container w-full py-20 maxScreenMobile:py-12">
        <motion.h3
          initial={{ y: 100, opacity: 0 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: { duration: 1, type: "tween" }
          }}
          viewport={{ once: true }}
          className="text-6xl text-center text-[#FFA500] mb-10"
        >
          WHY USE PPTLINKS?
        </motion.h3>
        <div className="wrap_circle w-full h-fit mt-20 !text-black maxScreenMobile:mt-10">
          <motion.div className="grid_anim_wrapper">
            {/* ///////////////////////////////////////////////////// */}

            <motion.div
              initial={{ y: 100, opacity: 0 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: { duration: 1, type: "tween" }
              }}
              viewport={{ once: true }}
              className="bg-[#FFFFF0] w-full p-3 border-[2px] border-solid border-[#FFA500] rounded-md shadow-xl"
            >
              <div className="w-fit maxSmallMobile:mx-auto md:mr-auto flex justify-between items-start gap-6">
                <div className="bg-black p-2 rounded-[5px] w-40 aspect-square m-auto flex justify-center items-center">
                  <img
                    src={anim_img1}
                    alt={anim_img1}
                    className="block w-full h-full"
                    loading="lazy"
                  />
                </div>

                <div className="w-full !text-left">
                  <h4 className="text-[1.5rem] w-full text-ellipsis m-auto font-medium">
                    Make Amazing Presentation
                  </h4>
                  <p className="text-4 w-full text-ellipsis m-auto">
                    and carry your audience along.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 100, opacity: 0 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: { duration: 1, type: "tween" }
              }}
              viewport={{ once: true }}
              className="bg-[#FFFFF0] w-full p-3 border-[2px] border-solid border-[#FFA500] rounded-md shadow-xl"
            >
              <div className="w-fit maxSmallMobile:mx-auto md:mr-auto flex justify-between items-start gap-6">
                <div className="bg-black p-2 rounded-[5px] w-40 aspect-square m-auto flex justify-center items-center">
                  <img
                    src={anim_img2}
                    alt={anim_img2}
                    className="block w-full h-full"
                    loading="lazy"
                  />
                </div>
                <div className="w-full !text-left">
                  <h4 className="text-[1.5rem] w-full text-ellipsis m-auto font-medium">
                    Host Classes with Libraries
                  </h4>
                  <p className="text-4 w-full text-ellipsis m-auto">
                    to create engaging learning experiences for participants.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 100, opacity: 0 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: { duration: 1, type: "tween" }
              }}
              viewport={{ once: true }}
              className="bg-[#FFFFF0] w-full p-3 border-[2px] border-solid border-[#FFA500] rounded-md shadow-xl"
            >
              <div className="w-fit maxSmallMobile:mx-auto md:mr-auto flex justify-between items-start gap-6">
                <div className="bg-black p-2 rounded-[5px] w-40 aspect-square m-auto flex justify-center items-center">
                  <img
                    src={anim_img4}
                    alt={anim_img4}
                    className="block w-full h-full"
                    loading="lazy"
                  />
                </div>
                <div className="w-full !text-left">
                  <h4 className="text-[1.5rem] w-full text-ellipsis m-auto font-medium">
                    Tell your story visually
                  </h4>
                  <p className="text-4 w-full text-ellipsis m-auto">
                    to give a lasting impression.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 100, opacity: 0 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: { duration: 1, type: "tween" }
              }}
              viewport={{ once: true }}
              className="bg-[#FFFFF0] w-full p-3 border-[2px] border-solid border-[#FFA500] rounded-md shadow-xl"
            >
              <div className="w-fit maxSmallMobile:mx-auto md:mr-auto flex justify-between items-start gap-6">
                <div className="bg-black p-2 rounded-[5px] w-40 aspect-square m-auto flex justify-center items-center">
                  <img
                    src={anim_img5}
                    alt={anim_img5}
                    className="block w-full h-full"
                    loading="lazy"
                  />
                </div>
                <div className="w-full !text-left">
                  <h4 className="text-[1.5rem] w-full text-ellipsis m-auto font-medium">
                    For Business
                  </h4>
                  <p className="text-4 w-full text-ellipsis m-auto">
                    present Your ideas with Confidence and Clarity.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 100, opacity: 0 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: { duration: 1, type: "tween" }
              }}
              viewport={{ once: true }}
              className="bg-[#FFFFF0] w-full p-3 border-[2px] border-solid border-[#FFA500] rounded-md shadow-xl"
            >
              <div className="w-fit maxSmallMobile:mx-auto md:mr-auto flex justify-between items-start gap-6">
                <div className="bg-black p-2 rounded-[5px] w-40 aspect-square m-auto flex justify-center items-center">
                  <img
                    src={anim_img3}
                    alt={anim_img3}
                    className="block w-full h-full"
                    loading="lazy"
                  />
                </div>
                <div className="w-full !text-left">
                  <h4 className="text-[1.5rem] w-full text-ellipsis m-auto font-medium">
                    For Physical Presentations to Carry Everyone Alone
                  </h4>
                  <p className="text-4 w-full text-ellipsis m-auto">
                    backbenchers become part of the session.
                  </p>
                </div>
              </div>
            </motion.div>
            {/* ///////////////////////////////////////////////////// */}
          </motion.div>
        </div>
      </div>

      <div className="max-h-fit bg-black text-white py-10">
        <div className="container">
          <motion.h3
            variants={secondVarient}
            initial="initial"
            whileInView="inView"
            viewport={{ margin: "100px", once: true }}
            className="text-5xl mb-10 uppercase font-[500]"
          >
            Get in touch
          </motion.h3>
          <div className="wrap_contacts w-full flex justify-between items-center flex-wrap maxScreenMobile:flex-col-reverse">
            <motion.div
              variants={secondVarient}
              initial="initial"
              whileInView="inView"
              viewport={{ margin: "100px", once: true }}
              className="w-[50%] min-h-[30rem] text-[0.8rem] mb-10 maxScreenMobile:w-full"
            >
              <motion.h5
                variants={secondVarient}
                className="mb-3 text-[1.2rem] font-semibold"
              >
                Send a Message
              </motion.h5>
              <motion.p
                variants={secondVarient}
                className="w-full mb-16 text-[1.1rem] font-thin"
              >
                Your voice matters! Share your thought and feedback with us and
                be part of our community.
              </motion.p>
              <motion.form variants={secondVarient} onSubmit={handleMsgSubmit}>
                <div className="flex justify-between items-center gap-4 mb-8 maxScreenMobile:flex-col">
                  <div className="w-[50%] maxScreenMobile:w-full">
                    <label
                      htmlFor="name"
                      className="block w-full underline underline-offset-2"
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
                      className="block w-full bg-transparent border-b-[1px] border-solid border-white py-2"
                      required
                    />
                  </div>
                  <div className="w-[50%] maxScreenMobile:w-full">
                    <label
                      htmlFor="email"
                      className="block w-full underline underline-offset-2"
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
                      className="block w-full bg-transparent border-b-[1px] border-solid border-white py-2"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center gap-4 mb-8 maxScreenMobile:flex-col">
                  <div className="w-[50%] maxScreenMobile:w-full">
                    <label
                      htmlFor="phone"
                      className="block w-full underline underline-offset-2"
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
                      className="block w-full bg-transparent border-b-[1px] border-solid border-white py-2"
                      required
                    />
                  </div>
                  <select
                    id="countries"
                    value={values.msgReason}
                    onChange={(e) => {
                      setValues({ ...values, msgReason: e.target.value });
                    }}
                    className="bg-black border-b border-white text-white block w-[50%] maxScreenMobile:w-full py-[1.1rem]"
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

                <div className=" mb-8">
                  <label
                    htmlFor="message"
                    className="block w-full underline underline-offset-2"
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
                    className="block w-full !h-32 bg-transparent border-b-[1px] border-solid border-white py-2 resize-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="h-[2rem] w-[10rem] flex items-center justify-center bg-[#FFFFF0] ml-auto text-black text-[.8rem] font-medium rounded-md maxScreenMobile:w-full"
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
              <div className="w-full mb-10">
                <h4 className="mb-3 text-[1.1rem] font-semibold">Call Us</h4>
                <p className="text-[1.1rem] mb-3 font-thin">
                  Have a question or need guidance? Call us now and lets discuss
                  how we can help you achieve your goal.
                </p>
                <div className="flex items-center">
                  <img
                    src={callus}
                    alt={callus}
                    className="block w-5 h-5 mr-5"
                    loading="lazy"
                  />
                  <a href="tel:+2349068314394" className="text-[#FFA500]">
                    +2349068314394
                  </a>
                </div>
              </div>

              <div className="w-full mb-10">
                <h4 className="mb-3 text-[1.1rem] font-semibold">Visit Us</h4>
                <p className="text-[1.1rem] mb-3 font-thin">
                  We’d love to welcome you to our office. Visit us let’s discuss
                  your project.
                </p>
                <div className="flex items-center">
                  <img
                    src={location}
                    alt={location}
                    className="block w-5 h-5 mr-5"
                    loading="lazy"
                  />
                  <a href="/" className="text-[#FFA500]">
                    Nascomsoft in Angwan Cashew, opp Elim church, 740102, Bauchi
                    Nigeria
                  </a>
                </div>
              </div>

              <div className="w-full mb-10">
                <h4 className="mb-3 text-[1.1rem] font-semibold">Message Us</h4>
                <p className="text-[1.1rem] mb-3 font-thin">
                  Write to us through text, on linkedin or any of our social
                  handles
                </p>
                <div className="flex items-center">
                  <img
                    src={sms}
                    alt={sms}
                    className="block w-5 h-5 mr-5"
                    loading="lazy"
                  />
                  <a href="sms:+2349068314394" className="text-[#FFA500]">
                    SMS to +2349068314394
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="container flex justify-between align-top maxScreenMobile:flex-col">
          <motion.div
            className="wrapAccurdion w-2/5 pr-5 maxScreenMobile:w-full max-h-fit"
            variants={secondVarient}
            initial="initial"
            whileInView="inView"
            viewport={{ margin: "100px", once: true }}
          >
            <p className="mb-1">FAQs</p>
            <h3 className="text-[3rem] font-black break-all leading-[4rem] maxScreenMobile:text-[2rem]">
              Frequently <br /> Asked <br /> Questions.
            </h3>
          </motion.div>

          <div className="accurdion w-3/5 maxScreenMobile:w-full" ref={scope}>
            {FAQ.map((_, id) => (
              <AccordionWrapper
                key={id}
                title={_.title}
                className="transition-all duration-300"
              >
                <h3 className="!text-8 font-semibold leading-[28px] mb-[15px]">
                  {_.h3}
                </h3>
                <p className="!text-8">{_.p}</p>
              </AccordionWrapper>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
