import { useRef, useCallback, useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from 'axios';
import banner_img from "/team/pptlink_resources/slide.png";
import card_img from "/team/pptlink_resources/pexels-pixabay-270637 (1).jpg";
import anim_img1 from "/team/pptlink_resources/presentation.png";
import anim_img2 from "/team/pptlink_resources/hosting-monitors-server-svgrepo-com.png";
import anim_img3 from "/team/pptlink_resources/school-svgrepo-com.png";
import anim_img4 from "/team/pptlink_resources/presentation-education-svgrepo-com.png";
import anim_img5 from "/team/pptlink_resources/analytics-presentation-svgrepo-com.png";
import callus from "/team/pptlink_resources/Group 31.png";
import location from "/team/pptlink_resources/Group 32.png";
import Accordion from "../accordion/accordion";
import Card from "../list/card";
import { userContext } from "../../contexts/userContext";
import { LoadingAssetSmall, LoadingAssetSmall2 } from "../../assets/assets";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";

export default function NewHome() {
  // context
  const scrollRef = useRef();
  const { user, setUser } = useContext(userContext);

  const navigate = useNavigate();

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

    setValues({ ...values, msgPending: true })
  }, []);

  const scrollCards = (isLeft) => {
    const scrollAmount = 250;
    const scrollContainer = scrollRef.current;

    return isLeft ? scrollContainer.scrollTo({
      left: scrollContainer.scrollLeft - scrollAmount,
      behavior: 'smooth',
    }) : scrollContainer.scrollTo({
      left: scrollContainer.scrollLeft + scrollAmount,
      behavior: 'smooth',
    });
  }

  return (
    <section className="parent_page_wrapper min-h-screen w-full">
      <div className="banner relative w-full min-h-screen text-white">
        <div className="container h-full text-center">
          <div className="flex flex-col justify-between items-center pt-[4rem]">
            <h1 className="text-[4rem] mb-5 maxScreenMobile:text-4xl">
              GET PRESENTABLE
            </h1>
            <p className="w-3/5 text-sm leading-6 text-center mb-10 maxScreenMobile:w-full maxScreenMobile:">
              Lorem ipsum dolor sit amet, At vero eos et Lorem ipsum dolor sit
              amet consectetur adipisicing elit. Sequi animi sunt fugiat
              doloremque, iure aperiam magnam quod quia, placeat explicabo
              distinctio, doloribus mollitia quae asperiores unde perferendis
              perspiciatis quis incidunt?
            </p>
            <div className="banner_btns w-3/5 mx-[auto] flex justify-between items-center maxScreenMobile:w-full maxScreenMobile:flex-col">
              <button
                className="block w-2/5 h-[3rem] bg-[#FFFFF0] text-black text-xl rounded-[2rem] maxScreenMobile:w-full maxScreenMobile:mb-3"
                onClick={() =>
                  user ? navigate("/upload") : navigate("/signin")
                }
              >
                Present
              </button>
              <button className="block w-2/5 h-[3rem] _bg-[black] text-[#FFFFF0] text-xl border-2 border-[#FFFFF0] rounded-[2rem] maxScreenMobile:w-full maxScreenMobile:mb-3">
                Libraries
              </button>
            </div>
          </div>
          <div className="banner_img w-full m-auto">
            <img
              src={banner_img}
              alt={banner_img}
              className="w-full aspect-square"
              loading="lazy"
            />
          </div>
        </div>
      </div>
      {/* /////////////////////////////see more////////////////////////////////////////////////// */}
      <div className="recent relative w-full min-h-screen text-white text-justify md:pb-20">
        <div className="container relative pt-10">
          <div className="flex flex-col items-center text-black maxScreenMobile:pb-10">
            <h2 className="text-[3rem]">RECENT</h2>
          </div>
          <div className="scrollBtns hidden maxScreenMobile:absolute maxScreenMobile:right-0 maxScreenMobile:w-fit maxScreenMobile:h-fit maxScreenMobile:bg-[transparent] maxScreenMobile:flex maxScreenMobile:gap-5 maxScreenMobile:!pb-2">
            <button className="flex items-center justify-center w-[45px] _translate-x-[2rem] aspect-square border-none rounded-[25%] bg-[rgba(0,0,0,0.29)] _hover:scale-y-[1.3] _hover:scale-x-[1.3] _hover:bg-[rgba(0,0,0,0.5)] hover:bg-[#FFA500]">
              <FaCaretLeft onClick={() => scrollCards(true)} className="text-[1.5rem] _text-[#FFA500] text-[#FFFFF0] cursor-pointer active:text-[rgba(0,0,0,0.5)]" />
            </button>
            <button className="flex items-center justify-center w-[45px] _translate-x-[2rem] aspect-square border-none rounded-[25%] bg-[rgba(0,0,0,0.29)] _hover:scale-y-[1.3] _hover:scale-x-[1.3] _hover:bg-[rgba(0,0,0,0.5)] hover:bg-[#FFA500]">
              <FaCaretRight onClick={() => scrollCards(false)} className="text-[1.5rem] _text-[#FFA500] text-[#FFFFF0] cursor-pointer active:text-[rgba(0,0,0,0.5)]" />
            </button>
          </div>
          <div className="cards_wrapper w-full mt-20 maxScreenMobile:mt-20 mb-10 maxScreenMobile:mb-10 scroll-smooth" ref={scrollRef}>
            {Array(5)
              .fill(0)
              .map((_, i) => ({ id: i }))
              .map(({ id }) => (
                <Card key={id} img={card_img} />
              ))}
          </div>
          <NavLink
            to="/"
            className="block text-center text-[#FFA500] underline"
          >
            See more
          </NavLink>
        </div>
      </div>
      {/* /////////////////////////////see more////////////////////////////////////////////////// */}
      <div className="why_pptlinks container w-full py-20 maxScreenMobile:py-12">
        <h3 className="text-6xl text-center text-[#FFA500] mb-10">
          WHY USE PPTLINKS?
        </h3>
        <div className="wrap_circle w-full h-fit mt-40 !text-black maxScreenMobile:mt-10">
          <div
            className="wrapAnim relative w-[40rem] h-[40rem] m-auto 
                mt-20 bg-transparent rounded-[20rem] border-[2px]
                border-solid border-black maxScreenMobile:flex maxScreenMobile:flex-col maxScreenMobile:justify-between maxScreenMobile:items-center maxScreenMobile:gap-[1rem] maxScreenMobile:w-full maxScreenMobile:h-fit maxScreenMobile:!rounded-none maxScreenMobile:!border-none maxScreenMobile:!m-0 maxScreenMobile:!p-0"
          >
            {/* ///////////////////////////////////////////////////// */}
            <div className="rounded_animation absolute top-[-80px] left-[50%] translate-x-[-50%] bg-[#FFFFF0] w-[200px] h-[200px] rounded-[100px] p-3 border-[2px] border-solid border-[#FFA500] maxScreenMobile:!static maxScreenMobile:w-full maxScreenMobile:!rounded-[5px] maxScreenMobile:mb-2 maxScreenMobile:translate-x-0">
              <div className="anim_img bg-black p-2 rounded-[5px] w-[80px] h-[80px] m-auto mb-3">
                <img
                  src={anim_img1}
                  alt={anim_img1}
                  className="w-full h-full"
                  loading="lazy"
                />
              </div>

              <div className="anim_body">
                <h4 className="text-[.8rem] w-full text-ellipsis m-auto text-center font-medium">
                  Make Amazing Presentation
                </h4>
                <p className="text-[.8rem] w-4/5 text-ellipsis m-auto text-center">
                  Lorem ipsum dolor sit amet, consetetur
                </p>
              </div>
            </div>

            <div className="rounded_animation absolute top-[100px] left-[-80px] bg-[#FFFFF0] w-[200px] h-[200px] rounded-[100px] p-3 border-[2px] border-solid border-[#FFA500] maxScreenMobile:!static maxScreenMobile:w-full maxScreenMobile:!rounded-[5px] maxScreenMobile:mb-2">
              <div className="anim_img bg-black p-2 rounded-[5px] w-[80px] h-[80px] m-auto mb-3">
                <img
                  src={anim_img2}
                  alt={anim_img2}
                  className="w-full h-full"
                  loading="lazy"
                />
              </div>
              <div className="anim_body">
                <h4 className="text-[.8rem] w-full text-ellipsis m-auto text-center font-medium">
                  Host Classes with Libraries
                </h4>
                <p className="text-[.8rem] w-4/5 text-ellipsis m-auto text-center">
                  Lorem ipsum dolor sit amet, consetetur
                </p>
              </div>
            </div>

            <div className="rounded_animation absolute bottom-0 left-0 bg-[#FFFFF0] w-[200px] h-[200px] rounded-[100px] p-3 border-[2px] border-solid border-[#FFA500] maxScreenMobile:!static maxScreenMobile:w-full maxScreenMobile:!rounded-[5px] maxScreenMobile:mb-2">
              <div className="anim_img bg-black p-2 rounded-[5px] w-[80px] h-[80px] m-auto mb-3">
                <img
                  src={anim_img3}
                  alt={anim_img3}
                  className="w-full h-full"
                  loading="lazy"
                />
              </div>
              <div className="anim_body">
                <h4 className="text-[.8rem] w-full text-ellipsis m-auto text-center font-medium">
                  For Physical Presentations
                </h4>
                <p className="text-[.8rem] w-4/5 text-ellipsis m-auto text-center">
                  Lorem ipsum dolor sit amet, consetetur
                </p>
              </div>
            </div>

            <div className="rounded_animation absolute bottom-0 right-0 bg-[#FFFFF0] w-[200px] h-[200px] rounded-[100px] p-3 border-[2px] border-solid border-[#FFA500] maxScreenMobile:!static maxScreenMobile:w-full maxScreenMobile:!rounded-[5px] maxScreenMobile:mb-2">
              <div className="anim_img bg-black p-2 rounded-[5px] w-[80px] h-[80px] m-auto mb-3">
                <img
                  src={anim_img4}
                  alt={anim_img4}
                  className="w-full h-full"
                  loading="lazy"
                />
              </div>
              <div className="anim_body">
                <h4 className="text-[.8rem] w-full text-ellipsis m-auto text-center font-medium">
                  For Physical Presentations
                </h4>
                <p className="text-[.8rem] w-4/5 text-ellipsis m-auto text-center">
                  Lorem ipsum dolor sit amet, consetetur
                </p>
              </div>
            </div>

            <div className="rounded_animation absolute top-[100px] right-[-80px] bg-[#FFFFF0] w-[200px] h-[200px] rounded-[100px] p-3 border-[2px] border-solid border-[#FFA500] maxScreenMobile:!static maxScreenMobile:w-full maxScreenMobile:!rounded-[5px] maxScreenMobile:mb-2">
              <div className="anim_img bg-black p-2 rounded-[5px] w-[80px] h-[80px] m-auto mb-3">
                <img
                  src={anim_img5}
                  alt={anim_img5}
                  className="w-full h-full"
                  loading="lazy"
                />
              </div>
              <div className="anim_body">
                <h4 className="text-[.8rem] w-full text-ellipsis m-auto text-center font-medium">
                  For Business
                </h4>
                <p className="text-[.8rem] w-4/5 text-ellipsis m-auto text-center">
                  Lorem ipsum dolor sit amet, consetetur
                </p>
              </div>
            </div>
            {/* ///////////////////////////////////////////////////// */}
          </div>
        </div>
      </div>
      <div className="get_intouch bg-black text-white py-10">
        <div className="container">
          <h3 className="text-5xl mb-10">Get in touch</h3>
          <div className="wrap_contacts w-full flex justify-between items-center flex-wrap maxScreenMobile:flex-col-reverse">
            <div className="w-[50%] min-h-[30rem] text-[0.8rem] mb-10 maxScreenMobile:w-full">
              <h5 className="mb-3 text-[1.2rem]">Send a Message</h5>
              <p className="w-full mb-10">
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                diam nonumy eirmod tempor invidunt ut
              </p>
              <form onSubmit={handleMsgSubmit}>
                <div className="flex justify-between items-center gap-4 mb-8 maxScreenMobile:flex-col">
                  <div className="w-[50%] maxScreenMobile:w-full">
                    <label htmlFor="name" className="block w-full underline underline-offset-2">
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
                    <label htmlFor="email" className="block w-full underline underline-offset-2">
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
                    <label htmlFor="phone" className="block w-full underline underline-offset-2">
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
                    class="bg-black border-b border-white text-white block w-[50%] maxScreenMobile:w-full py-4"
                  >
                    <option selected className="underline underline-offset-2">Reason for writing?</option>
                    <option value="dog">Dog</option>
                    <option value="cat">Cat</option>
                    <option value="hamster">Hamster</option>
                    <option value="parrot">Parrot</option>
                    <option value="spider">Spider</option>
                    <option value="goldfish">Goldfish</option>
                  </select>
                </div>

                <div className=" mb-8">
                  <label htmlFor="message" className="block w-full underline underline-offset-2">
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
                    className="block w-full min-h-[5rem] bg-transparent border-b-[1px] border-solid border-white py-2"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="h-[2rem] w-[10rem] flex items-center justify-center bg-[#FFFFF0] ml-auto text-black text-[.8rem] font-medium rounded-[2rem] maxScreenMobile:w-full"
                >
                  {values.msgPending ? <LoadingAssetSmall /> : "Submit"}
                </button>
              </form>
            </div>
            <div className="w-2/5 min-h-[30rem] maxScreenMobile:w-full">
              <div className="w-full mb-10">
                <h4 className="mb-3">Call US</h4>
                <p className="text-[0.8rem] mb-3">
                  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                  diam nonumy eirmod tempor invidunt ut
                </p>
                <div className="flex items-center">
                  <img
                    src={callus}
                    alt={callus}
                    className="block w-5 h-5 mr-5"
                    loading="lazy"
                  />
                  <a href="tel:+2349117511763" className="text-[#FFA500]">
                    +2349117511763
                  </a>
                </div>
              </div>

              <div className="w-full mb-10">
                <h4 className="mb-3">Visit Us</h4>
                <p className="text-[0.8rem] mb-3">
                  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                  diam nonumy eirmod tempor invidunt ut
                </p>
                <div className="flex items-center">
                  <img
                    src={location}
                    alt={location}
                    className="block w-5 h-5 mr-5"
                    loading="lazy"
                  />
                  <a href="/" className="text-[#FFA500]">
                    Greece Nevada East Joanie 06918 Leonard Mission
                  </a>
                </div>
              </div>

              <div className="w-full mb-10">
                <h4 className="mb-3">Visit Us</h4>
                <p className="text-[0.8rem] mb-3">
                  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                  diam nonumy eirmod tempor invidunt ut
                </p>
                <div className="flex items-center">
                  <img
                    src={location}
                    alt={location}
                    className="block w-5 h-5 mr-5"
                    loading="lazy"
                  />
                  <a href="sms:+2349117511763" className="text-[#FFA500]">
                    SMS to +2349117511763
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container flex justify-between align-top maxScreenMobile:flex-col">
          <div className="wrapAccurdion w-2/5 pr-5 maxScreenMobile:w-full">
            <p className="mb-1">FAQs</p>
            <h3 className="text-[3rem] font-black break-all leading-[4rem] maxScreenMobile:text-[2rem]">
              Frequently <br /> Asked <br /> Questions.
            </h3>
          </div>

          <div className="accurdion w-3/5 min-h-[50vh] maxScreenMobile:w-full">
            {Array(4)
              .fill(0)
              .map((_, i) => ({ id: i }))
              .map(({ id }) => (
                <Accordion
                  key={id}
                  title="World of hives"
                  className="transition-all duration-300"
                >
                  <h3 className="text-[20px] font-semibold leading-[28px] mb-[15px]">
                    Let of kings.
                  </h3>

                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quae iusto provident neque. Nulla molestiae quam rerum velit
                    fugiat labore, quia fugit obcaecati quo architecto officiis
                    sit consectetur! Omnis, deserunt consequatur.
                  </p>
                </Accordion>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
