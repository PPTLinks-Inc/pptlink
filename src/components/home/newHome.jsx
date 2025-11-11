/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo_white from "/imgs/WHITE.png";
import { motion, useReducedMotion, useInView } from "framer-motion";
import { useTheme } from "../../hooks/useTheme";
import Modal from "../Models/model";
import { FaCirclePlay } from "react-icons/fa6";
import { HiMenu } from "react-icons/hi";
import { useMediaQuery } from "react-responsive";
import useUser from "../../hooks/useUser";
import Card from "../list/card";
import usePublicPresentation from "../../hooks/usePublicPresentation";
import icon1 from "/new/icon1.svg";
import icon4 from "/new/icon4.svg";
import icon5 from "/new/icon5.svg";
import icon6 from "/new/icon6.svg";
import icon12 from "/new/icon12.svg";
import icon13 from "/new/icon13.svg";
import icon14 from "/new/icon14.svg";
import icon11 from "/new/icon11.svg";
import Footer from "../footer/footer";
// const ViewStudents = Array.from({ length: 5 }, (_, i) => i + 1);

export default function NewHomePage() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { userQuery } = useUser();
  const user = userQuery.data;
  const { presentations, refetch } = usePublicPresentation();
  const { bg, text, border, isDark } = useTheme();
  const [menu, handleMenu] = useState(false);
  const is768PxScreen = useMediaQuery({ query: "(max-width: 768px)" });

  // framer - variants and reduced-motion handling
  const prefersReducedMotion = useReducedMotion();

  const container = {
    hidden: prefersReducedMotion ? {} : { opacity: 0 },
    show: prefersReducedMotion
      ? {}
      : {
          opacity: 1,
          transition: { staggerChildren: 0.18, delayChildren: 0.12 }
        }
  };

  const fadeUp = {
    hidden: prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 },
    show: prefersReducedMotion
      ? { opacity: 1, y: 0 }
      : { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
  };

  // Animated counters for "How It Works"
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [count3, setCount3] = useState(0);

  const howRef = useRef(null);
  const lovedRef = useRef(null);
  const readyRef = useRef(null);
  const heroHeadlineRef = useRef(null);
  const howInView = useInView(howRef, { once: true, amount: 0.22 });
  const lovedInView = useInView(lovedRef, { once: true, amount: 0.22 });
  const readyInView = useInView(readyRef, { once: true, amount: 0.22 });
  const heroHeadlineInView = useInView(heroHeadlineRef, {
    once: true,
    amount: 0.22
  });

  const animateTo = (setFn, to, duration = 700, delay = 0) => {
    if (prefersReducedMotion) {
      setFn(to);
      return null;
    }
    let raf = null;
    const start = performance.now() + delay;
    const tick = (now) => {
      const elapsed = now - start;
      if (elapsed < 0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(to * eased);
      setFn(value);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => raf && cancelAnimationFrame(raf);
  };

  useEffect(() => {
    const cancels = [];
    cancels.push(animateTo(setCount1, 1, 600, 0));
    cancels.push(animateTo(setCount2, 2, 700, 120));
    cancels.push(animateTo(setCount3, 3, 800, 240));
    return () => cancels.forEach((c) => c && c());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateClick = (e) => {
    e.preventDefault();
    if (!user) {
      // Redirect to login with return URL
      navigate("/signin?redirect=/create");
    } else {
      navigate("/create");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* pop-up modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
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
      {/* header */}
      <header
        className={`fixed top-0 left-0 right-0 w-full border-none pt-8 maxScreenMobile:pt-6 maxScreenMobile:pb-2 pb-3 flex items-center justify-center z-50 transition-colors duration-300 ${scrolled ? "bg-gradient-to-r from-black to-[#00000000]" : "bg-transparent"} ${text} maxScreenMobile:bg-black [box-shadow:0_0_65px_28px_rgba(0,0,0,0.231),0_0_65px_35px_rgba(0,0,0,0),inset_0_-5px_10px_-5px_rgba(255,255,255,0.25)]`}
      >
        <motion.div
          initial="hidden"
          animate="show"
          variants={container}
          className="container !mx-auto flex justify-start md:gap-44 maxScreenMobile:gap-4 maxScreenMobile:_w-full items-center relative maxScreenMobile:!static maxScreenMobile:justify-between"
        >
          <motion.div
            variants={fadeUp}
            className="logo_wrapper maxScreenMobile:z-20"
          >
            <Link
              to="/"
              className="w-fit h-fit !flex !items-center !justify-center gap-2"
            >
              <img
                src={logo_white}
                alt="PPTLinks Logo"
                className="block w-8 aspect-square"
              />
              <span
                className={`block w-fit h-fit text-2xl md:text-3xl font-semibold ${"text-[#FFFFF0]"}`}
              >
                PPTLinks
              </span>
            </Link>
          </motion.div>

          <motion.nav
            variants={fadeUp}
            className={`w-fit flex flex-row justify-between items-center gap-20 maxScreenMobile:gap-4 maxScreenMobile:w-full maxScreenMobile:justify-evenly maxScreenMobile:flex-col maxScreenMobile:absolute maxScreenMobile:top-0 maxScreenMobile:left-0 maxScreenMobile:right-0 maxScreenMobile:px-0 maxScreenMobile:pb-4 maxScreenMobile:bg-black maxScreenMobile:z-10 maxScreenMobile:pt-[76px] ${menu ? "maxScreenMobile:flex" : "maxScreenMobile:hidden"}`}
          >
            <Link
              to={"#"}
              className="text-white text-sm font-semibold maxScreenMobile:!border-b-[0.1px] maxScreenMobile:border-gray maxScreenMobile:block maxScreenMobile:w-full maxScreenMobile:text-center maxScreenMobile:py-2"
            >
              Pricing
            </Link>
            <Link
              to={"#"}
              className="text-white text-sm font-semibold maxScreenMobile:!border-b-[0.1px] maxScreenMobile:border-gray maxScreenMobile:block maxScreenMobile:w-full maxScreenMobile:text-center maxScreenMobile:py-2"
            >
              About
            </Link>
            <Link
              to={user ? "/signout" : "/signin"}
              className="text-white text-sm font-semibold maxScreenMobile:!border-b-[0.1px] maxScreenMobile:border-gray maxScreenMobile:block maxScreenMobile:w-full maxScreenMobile:text-center maxScreenMobile:py-2"
            >
              {user ? "Logout" : "Login"}
            </Link>
          </motion.nav>
          <button
            onClick={() => handleMenu(!menu)}
            className="hidden w-fit h-fit p-2 text-white maxScreenMobile:block maxScreenMobile:z-20"
          >
            <HiMenu size={28} />
          </button>
        </motion.div>
      </header>
      {/* banner */}
      <section
        className={`banner-section w-full min-h-screen ${text} pt-40 maxScreenMobile:!pt-[76px] md:bg-[url(/new/icon3.svg)] maxScreenMobile:bg-[url(/new/mobile-view.png)] bg-cover bg-center bg-no-repeat relative`}
      >
        {/* Background blur span - placed behind container */}
        <span className="hidden maxScreenMobile:block absolute top-0 left-0 w-full h-full backdrop-blur-[2px] bg-white/5"></span>

        <div className={`container h-fit relative z-10`}>
          <motion.div
            ref={heroHeadlineRef}
            initial="hidden"
            animate={heroHeadlineInView ? "show" : "hidden"}
            variants={container}
            className="w-full flex items-center justify-between gap-8 maxScreenMobile:!hidden"
          >
            <motion.div
              variants={fadeUp}
              onClick={() => setOpen(true)}
              className={`cursor-pointer _banner_img !w-3/6 maxScreenMobile:!w-full aspect-video mx-auto border-none rounded-0 flex justify-center items-center bg-[url(https://img.youtube.com/vi/meTNh23fYKg/hqdefault.jpg)] bg-cover bg-center relative before:block ${bg} before:absolute before:top-0 before:left-0 before:w-full before:h-full before:rounded-0 !border-2 !border-bg-gray-200`}
            >
              <span className={`block text-5xl ${text} z-10`}>
                <FaCirclePlay />
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="w-3/6 maxScreenMobile:!w-full text-5xl font-extrabold maxSmallMobile:text-left maxSmallMobile:text-4xl text-balance leading-[4rem] maxScreen:text-4xl"
            >
              Teach, Learn, and Connect, All in One Place.
            </motion.h1>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="hidden maxScreenMobile:!block maxScreenMobile:!w-full font-extrabold maxSmallMobile:text-left maxScreenMobile:!text-4xl text-balance !pt-8 maxScreenMobile:!leading-[3.5rem]"
          >
            Teach, Learn, and Connect, All in One Place.
          </motion.h1>

          <p className="text-sm w-3/6 my-6 leading-6 maxSmallMobile:text-left maxScreenMobile:!w-full">
            PPTLinks makes online teaching easier with low-data video calls,
            presentations, students tracking, and seamless collaboraton.
          </p>

          <div className="mx-[auto] flex justify-left items-center gap-4 w-full">
            <motion.div variants={fadeUp}>
              <button
                onClick={handleCreateClick}
                className={`block w-[10rem] px-10 text-center maxSmallMobile:px-4 py-1 bg-gradient-to-r from-primarySixTwo to-[#ffa60034] font-normal _text-primaryTwo responsiveText rounded-md maxSmallMobile:w-fit maxSmallMobile:mb-3`}
              >
                Create Now
              </button>
            </motion.div>

            {!user && <motion.div variants={fadeUp}>
              <Link
                to="/signup"
                className={`block w-[10rem] px-10 text-center maxSmallMobile:px-4 bg-black py-[calc(0.25rem-0.5px)] ${isDark ? "text-[#FFFFF0]" : text} _text-[#FFFFF0] font-normal responsiveText border-[0.5px] ${isDark ? "border-[#fffff06c]" : border} rounded-md maxSmallMobile:w-fit maxSmallMobile:mb-3 ${user && "_hidden"}`}
              >
                Sign Up
              </Link>
            </motion.div>}
          </div>

          <motion.div
            variants={fadeUp}
            onClick={() => setOpen(true)}
            className={`cursor-pointer _banner_img hidden mt-6 !w-3/6 maxScreenMobile:!w-full aspect-video mx-auto border-none rounded-0 maxScreenMobile:flex justify-center items-center bg-[url(https://img.youtube.com/vi/meTNh23fYKg/hqdefault.jpg)] bg-cover bg-center relative before:block ${bg} before:absolute before:top-0 before:left-0 before:w-full before:h-full before:rounded-0 !border-2 !border-bg-gray-200`}
          >
            <span className={`block text-5xl ${text} z-10`}>
              <FaCirclePlay />
            </span>
          </motion.div>
        </div>
      </section>
      {/* Everything you need to teach smarter. */}
      <section
        className={`w-full min-h-screen bg-gradient-to-b from-black to-[#222020] ${text} pt-24 pb-16`}
      >
        <div className="container">
          <h2 className="w-fit mx-auto text-4xl font-semibold maxScreenMobile:text-center">
            Everything you need to teach smarter.
          </h2>
          <p className="w-fit mx-auto text-sm text-primarySixTwo mt-4">
            Powerful features designed for modern educators
          </p>

          <div className="flex justify-center items-center gap-8 mt-20 flex-wrap maxScreenMobile:gap-6">
            <motion.div
              variants={fadeUp}
              className="relative w-64 maxScreenMobile:w-full aspect-square maxScreenMobile:aspect-video border-[0.1px] border-primarySixTwo/10 rounded-md bg-primarySix/10 p-3 feature_card flex-shrink-0 flex flex-col justify-center items-center"
            >
              <img src={icon1} alt={icon1} className="block w-fit h-fit" />
              <h3 className="text-lg text-white font-semibold mb-2">
                Course creation
              </h3>
              <p className="text-sm text-white text-balance maxScreenMobile:text-center">
                Build interractive lessons easily with our builder and
                presentation tools.
              </p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="relative w-64 maxScreenMobile:w-full aspect-square maxScreenMobile:aspect-video border-[0.1px] border-primarySixTwo/10 rounded-md bg-primarySix/10 p-3 feature_card flex-shrink-0 flex flex-col justify-center items-center"
            >
              <img src={icon5} alt={icon5} className="block w-fit h-fit" />
              <h3 className="text-lg text-white font-semibold mb-2">
                Live lessons
              </h3>
              <p className="text-sm text-white text-balance maxScreenMobile:text-center">
                Teach via audio/video or slides with low-data streaming
                optimized for all connection.
              </p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="relative w-64 maxScreenMobile:w-full aspect-square maxScreenMobile:aspect-video border-[0.1px] border-primarySixTwo/10 rounded-md bg-primarySix/10 p-3 feature_card flex-shrink-0 flex flex-col justify-center items-center"
            >
              <img src={icon4} alt={icon4} className="block w-fit h-fit" />
              <h3 className="text-lg text-white font-semibold mb-2">
                Student Tracking
              </h3>
              <p className="text-sm text-white text-balance maxScreenMobile:text-center">
                Monitor attendance, and performance with comprehensive analysis.
              </p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="relative w-64 maxScreenMobile:w-full aspect-square maxScreenMobile:aspect-video border-[0.1px] border-primarySixTwo/10 rounded-md bg-primarySix/10 p-3 feature_card flex-shrink-0 flex flex-col justify-center items-center"
            >
              <img src={icon6} alt={icon6} className="block w-fit h-fit" />
              <h3 className="text-lg text-white font-semibold mb-2">
                Earning Dashboard
              </h3>
              <p className="text-sm text-white text-balance maxScreenMobile:text-center">
                Get paid for your exparties with transparent tracking and
                flexible payment options.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      {/* How It Works */}
      <section className="w-full min-h-[80vh] bg-black text-white pt-16 px-4">
        <h2 className="text-4xl font-semibold mb-2 text-center maxScreenMobile  :text-2xl">
          How It Works
        </h2>
        <p className="text-sm text-primarySixTwo text-center mt-2 mb-16">
          Get started in 3 simple steps
        </p>

        <div
          ref={howRef}
          className="relative flex justify-between items-start container mx-auto gap-8 maxScreenMobile:flex-col maxScreenMobile:items-center maxScreenMobile:gap-16"
        >
          {/* Connecting line (only visible on larger screens) */}
          <span className="absolute top-[3rem] left-1/2 w-4/6 h-[1px] bg-primarySixTwo transform -translate-x-1/2 maxScreenMobile:hidden"></span>

          {/* STEP 1 */}
          <div className="flex flex-col items-center w-1/4 text-center relative z-10 maxScreenMobile:w-full">
            <span className="flex justify-center items-center w-24 aspect-square rounded-full bg-primarySixTwo text-primaryTwo shadow-glow mb-3 relative">
              <motion.img
                src={icon12}
                alt="step 1 icon"
                className="w-1/2 h-auto"
                initial={{ opacity: 0 }}
                animate={howInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.12 }}
              />
              <motion.span
                className="flex justify-center items-center w-8 aspect-square text-white text-xs border border-primarySixTwo rounded-full absolute top-full left-full transform -translate-x-1/2 translate-y-[-50%] z-10"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={
                  howInView
                    ? { scale: 1, opacity: 1 }
                    : { scale: 0.8, opacity: 0 }
                }
                transition={{ duration: 0.6, delay: 0.18 }}
              >
                {count1}
              </motion.span>
            </span>

            <motion.div variants={fadeUp} className="w-5/6 mt-5">
              <motion.p
                variants={fadeUp}
                className="font-semibold text-md mb-2 maxScreenMobile:text-base"
              >
                Sign up as Tutor or Learner
              </motion.p>
              <motion.p
                variants={fadeUp}
                className="text-sm text-gray-300 maxScreenMobile:text-xs"
              >
                Create your account in seconds and choose your role
              </motion.p>
            </motion.div>
          </div>

          {/* STEP 2 */}
          <div className="flex flex-col items-center w-1/4 text-center relative z-10 maxScreenMobile:w-full">
            <span className="flex justify-center items-center w-24 aspect-square rounded-full bg-primarySixTwo text-primaryTwo shadow-glow mb-3 relative">
              <motion.img
                src={icon13}
                alt="step 2 icon"
                className="w-1/2 h-auto"
                initial={{ opacity: 0 }}
                animate={howInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.18 }}
              />
              <motion.span
                className="flex justify-center items-center w-8 aspect-square text-white text-xs border border-primarySixTwo rounded-full absolute top-full left-full transform -translate-x-1/2 translate-y-[-50%] z-10"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={
                  howInView
                    ? { scale: 1, opacity: 1 }
                    : { scale: 0.8, opacity: 0 }
                }
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {count2}
              </motion.span>
            </span>

            <motion.div variants={fadeUp} className="w-5/6 mt-5">
              <motion.p
                variants={fadeUp}
                className="font-semibold text-md mb-2 maxScreenMobile:text-base"
              >
                Find or Offer Lessons
              </motion.p>
              <motion.p
                variants={fadeUp}
                className="text-sm text-gray-300 maxScreenMobile:text-xs"
              >
                Browse available lessons or create one to teach others
              </motion.p>
            </motion.div>
          </div>

          {/* STEP 3 */}
          <div className="flex flex-col items-center w-1/4 text-center relative z-10 maxScreenMobile:w-full">
            <span className="flex justify-center items-center w-24 aspect-square rounded-full bg-primarySixTwo text-primaryTwo shadow-glow mb-3 relative">
              <motion.img
                src={icon14}
                alt="step 3 icon"
                className="w-1/2 h-auto"
                initial={{ opacity: 0 }}
                animate={howInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.24 }}
              />
              <motion.span
                className="flex justify-center items-center w-8 aspect-square text-white text-xs border border-primarySixTwo rounded-full absolute top-full left-full transform -translate-x-1/2 translate-y-[-50%] z-10"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={
                  howInView
                    ? { scale: 1, opacity: 1 }
                    : { scale: 0.8, opacity: 0 }
                }
                transition={{ duration: 0.6, delay: 0.36 }}
              >
                {count3}
              </motion.span>
            </span>

            <motion.div variants={fadeUp} className="w-5/6 mt-5">
              <motion.p
                variants={fadeUp}
                className="font-semibold text-md mb-2 maxScreenMobile:text-base"
              >
                Connect and Start Learning
              </motion.p>
              <motion.p
                variants={fadeUp}
                className="text-sm text-gray-300 maxScreenMobile:text-xs"
              >
                Interact, learn, and grow through our interactive platform
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>
      {/* Popular Presentations */}
      <section className="w-full min-h-[80vh] bg-black text-white pt-8 maxScreenMobile:pt-28">
        <div className="container">
          <motion.h2
            variants={fadeUp}
            className="text-4xl font-semibold mb-4 w-fit mx-auto maxScreenMobile:text-center"
          >
            Popular Presentations
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="w-fit mx-auto text-sm text-primarySixTwo mt-4 mb-20 maxScreenMobile:mb-8"
          >
            See recently uploaded public presentations
          </motion.p>

          <div className="w-full scroll-smooth min-h-[50vh] flex flex-wrap gap-8 justify-center">
            {presentations
              .slice(0, is768PxScreen ? 4 : 12)
              .map((presentation, idx) => (
                <motion.div
                  key={presentation.id}
                  variants={fadeUp}
                  transition={{
                    duration: 0.7,
                    delay: 0.12 + idx * 0.12,
                    ease: "easeOut"
                  }}
                  className="w-[300px] maxSmallMobile:w-full min-w-[280px] flex-shrink-0"
                >
                  <Card presentation={presentation} refresh={refetch} />
                </motion.div>
              ))}
          </div>

          <Link
            to="/public_presentation"
            className="block text-sm text-center text-[#FFA500] underline mt-8"
          >
            See more
          </Link>
        </div>
      </section>
      {/* Loved By Tutor and Students */}
      <section className="w-full min-h-[70vh] bg-gradient-to-b from-black to-[#222020] text-white pt-20 pb-16">
        <motion.div
          ref={lovedRef}
          initial="hidden"
          animate={lovedInView ? "show" : "hidden"}
          variants={container}
          className="container"
        >
          <motion.h2
            variants={fadeUp}
            className="text-4xl font-semibold mb-4 w-fit mx-auto maxScreenMobile:text-center"
          >
            Loved By Tutor and Students
          </motion.h2>

          <motion.div
            variants={fadeUp}
            className="w-full h-fit inline-flex items-center justify-center"
          >
            <p className="w-fit text-sm text-primarySixTwo mt-4 mb-4 inline-flex items-center gap-2">
              <span className="inline-flex items-center gap-1">
                {Array.from({ length: 5 }, (_, i) => i + 1).map((i) => (
                  <motion.img
                    key={i.toString()}
                    src={icon11}
                    alt={`star-${i}`}
                    className="block w-3 aspect-square"
                    variants={fadeUp}
                  />
                ))}
              </span>
              <span className="mt-1">4.9 average rating</span>
            </p>
          </motion.div>

          <motion.div
            variants={container}
            className="flex justify-center items-center gap-8 mt-20 flex-wrap maxScreenMobile:gap-6"
          >
            {/* testimonials go here */}
            <motion.div
              variants={fadeUp}
              className="flex flex-col items-center border-[0.5px] border-gray-100/10 rounded-md py-8 px-4 maxScreenMobile:w-full"
            >
              <p className="text-lg font-semibold">John Doe</p>
              <p className="text-sm text-primarySixTwo">
                &quot;PPTLinks has changed the way I teach!&quot;
              </p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="flex flex-col items-center border-[0.5px] border-gray-100/10 rounded-md py-8 px-4 maxScreenMobile:w-full"
            >
              <p className="text-lg font-semibold">Jane Smith</p>
              <p className="text-sm text-primarySixTwo">
                &quot;I love the resources available on PPTLinks.&quot;
              </p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="flex flex-col items-center border-[0.5px] border-gray-100/10 rounded-md py-8 px-4 maxScreenMobile:w-full"
            >
              <p className="text-lg font-semibold">Mark Johnson</p>
              <p className="text-sm text-primarySixTwo">
                &quot;PPTLinks has made my presentations more engaging.&quot;
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>
      {/* Ready to Teach smarter with PPTLinks */}
      <section className="w-full min-h-[50vh] bg-black text-white pt-8">
        <motion.div
          ref={readyRef}
          initial="hidden"
          animate={readyInView ? "show" : "hidden"}
          variants={container}
          className="container"
        >
          <motion.h2
            variants={fadeUp}
            className="text-4xl font-semibold mb-4 w-fit mx-auto maxScreenMobile:text-center"
          >
            Ready to Teach smarter with PPTLinks
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="w-fit mx-auto text-sm text-primarySixTwo mt-4 mb-20 maxScreenMobile:text-center"
          >
            Join thousands of educators who are already transforming their
            teaching experience
          </motion.p>
          <motion.div
            variants={container}
            className="mx-auto flex justify-left items-center gap-4 w-fit"
          >
            <motion.div variants={fadeUp}>
              <Link
                to={"#"}
                className={`block w-fit px-10 text-center maxScreenMobile:px-4 py-1 bg-gradient-to-r from-primarySixTwo to-[#ffa60034] font-normal _text-primaryTwo responsiveText rounded-md maxScreenMobile:w-fit maxScreenMobile:mb-3`}
              >
                Join as Tutor
              </Link>
            </motion.div>

            <motion.div variants={fadeUp}>
              <Link
                to="#explore-courses"
                className={`block w-fit px-10 text-center maxScreenMobile:px-4 py-[calc(0.25rem-0.5px)] ${isDark ? "text-[#FFFFF0]" : text} _text-[#FFFFF0] font-normal responsiveText border-[0.5px] ${isDark ? "border-[#fffff06c]" : border} rounded-md maxScreenMobile:w-fit maxScreenMobile:mb-3 ${user && "_hidden"}`}
              >
                Explore Courses
              </Link>
            </motion.div>
          </motion.div>
          <motion.p
            variants={fadeUp}
            className="w-fit mx-auto text-sm text-primarySixTwo mt-4 mb-20"
          >
            It&apos;s free to get started. No credit card required.
          </motion.p>
        </motion.div>
      </section>
      <Footer />
    </>
  );
}
