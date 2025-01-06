import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CiVideoOn } from "react-icons/ci";
import { PiPresentationLight } from "react-icons/pi";
import { CiImageOn } from "react-icons/ci";
import { MdOutlineFileUpload } from "react-icons/md";
import logo_white from "/imgs/WHITE.png";
import LogoBlack from "../../images/Logo-Black.png";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { authFetch, standardFetch } from "../../lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export default function CreatePath() {
  const navigate = useNavigate();
  const [isError, setIsError] = useState("");
  const [stage, setStage] = useState(1);
  const [create, setCreate] = useState<{
    type: string;
    category: string;
    name: string;
    description: string;
    file: File | null;
  }>({
    type: "",
    category: "",
    name: "",
    description: "",
    file: null
  });

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await standardFetch.get<{ id: string; name: string }[]>(
        "/api/v1/ppt/categories"
      );

      return data;
    }
  });

  const courseCreateMutation = useMutation({
    mutationFn: function () {
      const formData = new FormData();
      formData.append("category", create.category);
      formData.append("name", create.name);
      formData.append("description", create.description);
      if (create.file) {
        formData.append("file", create.file);
      }

      return authFetch.post<{ id: string }>("/api/v1/course/create", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        },
        timeout: 1000 * 60 * 5 // 5 minutes
      });
    },
    onSuccess: function ({ data }) {
      navigate(`/course/${data.id}`);
    }
  });
  const courseCreating = courseCreateMutation.isPending;

  function IncrementDecrementStage(value: string) {
    if (value === "increment") {
      if (stage === 1 && create.type === "") {
        setIsError("Please select a type of content.");
        return;
      }
      if (stage === 1 && create.type === "Presentation") {
        navigate("/upload");
        return;
      }
      if (stage === 2 && create.category === "") {
        setIsError("Please select a category.");
        return;
      }
      if (stage === 3 && (create.name === "" || create.description === "")) {
        setIsError("Please enter a name and description for your content.");
        return;
      }

      if (stage === 3 && create.description.length < 5) {
        setIsError("Description must be at least 5 characters long.");
        return;
      }

      setIsError("");
      setStage(stage >= 4 ? 4 : stage + 1);
    } else {
      setStage(stage <= 1 ? 1 : stage - 1);
    }
  }

  function handleInputChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;
    setCreate({
      ...create,
      [name]: value
    });
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files ? e.target.files[0] : null;
    if (!file) return;

    console.log(file);

    setCreate({
      ...create,
      file: file
    });
  }

  return (
    <div className="bg-primaryTwo w-full !h-[100svh] !text-white flex flex-col justify-between maxScreenMobile:justify-start items-center">
      <Helmet>
        <title>{`Create - PPTLinks `}</title>
        <meta
          name="description"
          content="Make your powerpoint presentations quickly and easily with or without a projector with PPTLinks"
        />
        <meta
          name="tags"
          content={`PPT, Presentations, Powerpoint, Create PPTLinks`}
        />

        {/* meta tags to display information on all meta platforms (facebook, instagram, whatsapp) */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://www.PPTLink.com/`} />
        <meta property="og:title" content={`Create - PPTLinks `} />
        <meta
          property="og:description"
          content="Make your powerpoint presentations quickly and easily with or without a projector with PPTLinks"
        />
        <meta property="og:image" content={LogoBlack} />

        {/* meta tags to display information on twitter  */}
        <meta property="twitter:card" content="website" />
        <meta property="twitter:url" content={`https://www.PPTLink.com/`} />

        <meta property="twitter:title" content={`Create - PPTLinks `} />
        <meta
          property="twitter:description"
          content="Make your powerpoint presentations quickly and easily with or without a projector with PPTLinks"
        />
        <meta property="twitter:image" content={LogoBlack} />
      </Helmet>
      <header className="w-full h-fit">
        <div className="container flex justify-between items-center gap-4">
          <Link to="/" className="block w-fit">
            <span className=" text-2xl md:text-3xl font-semibold maxScreenMobile:hidden">
              PPTLINKS
            </span>
            <img
              src={logo_white}
              alt={logo_white}
              className="hidden w-8 aspect-square maxScreenMobile:block"
            />
          </Link>
          <div className=" pt-4 pb-4 pl-8 flex justify-between items-center w-[calc(80%-16px)] text-sm border-l-2 border-l-white maxScreenMobile:!w-fit maxScreenMobile:!border-none">
            <span className="block w-fit maxScreenMobile:hidden">
              Step {stage} of 4
            </span>
            <Link to="/" className="text-[#FFA500]">
              Exit
            </Link>
          </div>
        </div>
      </header>

      <span className="hidden maxScreenMobile:block w-fit my-8 mx-auto">
        Step {stage} of 4
      </span>

      <section
        className={`w-3/6 mx-auto h-fit flex flex-col justify-between items-center gap-6 maxScreenMobile:!w-[90%] relative`}
      >
        {stage === 1 && (
          <>
            <motion.h1
              initial={{ y: 10, opacity: 0 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.5, type: "tween" }
              }}
              viewport={{ once: true }}
              className="w-full text-2xl md:text-3xl font-bold text-center maxScreenMobile:"
            >
              What type of content are you working on?
            </motion.h1>
            <div className="w-fit h-fit grid grid-cols-2 gap-6 maxScreenMobile:grid-cols-1 maxScreenMobile:grid-rows-2">
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    type: "spring", // Changed from "tween"
                    stiffness: 100,
                    damping: 10
                  }
                }}
                viewport={{ once: true }}
                className={`cursor-pointer p-8 maxScreenMobile:p-4 flex flex-col justify-between items-start border-[1px] ${create.type === "Courses" ? "border-[#FFA500]" : "border-white"} rounded-md`}
                onClick={() => setCreate({ ...create, type: "Courses" })}
              >
                <span className="block text-3xl mb-2">
                  <CiVideoOn />
                </span>
                <div>
                  <h6 className="text-md font-semibold mb-2">Courses</h6>
                  <p className="text-sm">
                    Uncover the simplicity of crafting compelling courses using
                    our efficient and user-friendly tool
                  </p>
                </div>
              </motion.div>
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    type: "spring", // Changed from "tween"
                    stiffness: 150,
                    damping: 10
                  }
                }}
                viewport={{ once: true }}
                className={`cursor-pointer p-8 maxScreenMobile:p-4 flex flex-col justify-between items-start border-[1px] ${create.type === "Presentation" ? "border-[#FFA500]" : "border-white"} rounded-md`}
                onClick={() => setCreate({ ...create, type: "Presentation" })}
              >
                <span className="block text-3xl mb-2">
                  <PiPresentationLight />
                </span>
                <div>
                  <h6 className="text-md font-semibold mb-2">
                    Single Presentation
                  </h6>
                  <p className="text-sm">
                    Unwind and create outstanding free presentation using our
                    hassle-free tools, making presenting a breeze
                  </p>
                </div>
              </motion.div>
            </div>
          </>
        )}
        {stage === 2 && (
          <>
            <motion.h1
              initial={{ y: 10, opacity: 0 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.5,
                  type: "spring", // Changed from "tween"
                  stiffness: 100,
                  damping: 10
                }
              }}
              viewport={{ once: true }}
              className="w-full text-2xl md:text-3xl font-bold text-center maxScreenMobile:"
            >
              Choose a category for your content.
            </motion.h1>
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.5,
                  type: "spring", // Changed from "tween"
                  stiffness: 150,
                  damping: 10
                }
              }}
              viewport={{ once: true }}
              className="w-full h-fit"
            >
              <select
                id="category"
                name="category"
                className={`bg-primaryTwo border-[1px] ${create.category !== "" ? "border-[#FFA500]" : "border-white"} rounded-md text-white !text-sm block w-full py-4 indent-4`}
                value={create.category}
                onChange={handleInputChange}
              >
                <option value="" disabled>
                  {categoriesQuery.isLoading ? "Loading Categorise..." : "Select Category"}
                </option>
                {categoriesQuery.data?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </motion.div>
          </>
        )}
        {stage === 3 && (
          <>
            <motion.h1
              initial={{ y: 10, opacity: 0 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.5,
                  type: "spring", // Changed from "tween"
                  stiffness: 100,
                  damping: 10
                }
              }}
              viewport={{ once: true }}
              className="w-full text-2xl md:text-3xl font-bold text-center maxScreenMobile:"
            >
              What fantastic name do you want to give to it?
            </motion.h1>
            <div className="w-full h-fit flex flex-col gap-4">
              <motion.input
                initial={{ y: 10, opacity: 0 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    type: "spring", // Changed from "tween"
                    stiffness: 150,
                    damping: 10
                  }
                }}
                viewport={{ once: true }}
                type="text"
                name="name"
                className={`block w-full bg-transparent border-[1px] border-solid ${create.name !== "" ? "border-[#FFA500]" : "border-white"} rounded-md py-2 text-white text-sm indent-4`}
                placeholder="Course Name"
                value={create.name}
                onChange={handleInputChange}
                required
              />
              <motion.textarea
                initial={{ y: 10, opacity: 0 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    type: "spring", // Changed from "tween"
                    stiffness: 200,
                    damping: 10
                  }
                }}
                viewport={{ once: true }}
                name="description"
                placeholder="Could you take some time to tell us more about the course you're looking to teach? We're eager to know all the details!"
                className={`block w-full !h-32 bg-transparent border-[1px] border-solid ${create.description !== "" ? "border-[#FFA500]" : "border-white"} rounded-md p-4 resize-none text-white text-sm`}
                value={create.description}
                onChange={handleInputChange}
              ></motion.textarea>
            </div>
          </>
        )}
        {stage === 4 && (
          <>
            <motion.h1
              initial={{ y: 10, opacity: 0 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.5,
                  type: "spring", // Changed from "tween"
                  stiffness: 100,
                  damping: 10
                }
              }}
              viewport={{ once: true }}
              className="w-full text-2xl md:text-3xl font-bold text-center maxScreenMobile:"
            >
              Add a thumbnail image
            </motion.h1>
            <div className="w-full md:w-72 h-fit">
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    type: "spring", // Changed from "tween"
                    stiffness: 150,
                    damping: 10
                  }
                }}
                viewport={{ once: true }}
                className={`p-8 maxScreenMobile:p-4 flex flex-col justify-center items-center border-[1px] ${create.file ? "border-[#FFA500]" : "border-white"} rounded-md`}
              >
                <span className="block text-3xl mb-2">
                  <CiImageOn />
                </span>
                <div className="mb-2">
                  <h6 className="text-md font-semibold text-center mb-2">
                    Upload an image
                  </h6>
                </div>
                <label
                  htmlFor="file"
                  className="cursor-pointer w-fit h-fit py-1 px-4 bg-primaryTwo border-[1px] border-white rounded-md flex justify-between items-center gap-2"
                >
                  <span>Select</span>
                  <MdOutlineFileUpload />
                </label>
                <input
                  type="file"
                  name="file"
                  id="file"
                  className="hidden"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                />
              </motion.div>

              {/* <motion.div
                initial={{ y: 10, opacity: 0 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    type: "spring", // Changed from "tween"
                    stiffness: 200,
                    damping: 10
                  }
                }}
                viewport={{ once: true }}
                className={`p-8 maxScreenMobile:p-4 flex flex-col justify-center items-center border-[1px] ${create.dontHave ? "border-[#FFA500]" : "border-white"} rounded-md`}
                onClick={() =>
                  setCreate({ ...create, file: null, dontHave: true })
                }
              >
                <div>
                  <h6 className="text-md font-semibold text-center mb-2">
                    I don&apos;t have one
                  </h6>
                  <p className="text-sm text-center">
                    Skip these for now, I&apos;ll do this later
                  </p>
                </div>
              </motion.div> */}
            </div>
          </>
        )}
        <p
          className={`${isError || courseCreateMutation.isError ? "block font-bold text-[red] text-md w-full text-center absolute top-[105%]" : "hidden"}`}
        >
          {isError}
          <br />
          {courseCreateMutation.isError &&
          courseCreateMutation.error instanceof AxiosError
            ? courseCreateMutation.error.response?.data.message
            : courseCreateMutation.error?.message}
        </p>
      </section>

      <footer className="w-full h-fit pb-8 pt-3 maxScreenMobile:mt-auto maxScreenMobile:mb-0 maxScreenMobile:justify-self-end">
        <div className="container flex justify-between items-center">
          <button
            className={`${stage === 1 || courseCreating ? "hidden" : "block"} py-2 px-8 bg-primaryTwo border-[1px] border-white rounded-md`}
            disabled={courseCreating}
            onClick={() => IncrementDecrementStage("decrement")}
          >
            Previous
          </button>
          <button
            className="block py-2 px-8 bg-primaryTwo border-[1px] border-white rounded-md ml-auto"
            onClick={() => {
              stage === 4
                ? courseCreateMutation.mutate()
                : IncrementDecrementStage("increment");
            }}
            disabled={courseCreating}
          >
            {stage === 4 ? (courseCreating ? "Creating" : "Create") : "Next"}
          </button>
        </div>
      </footer>
    </div>
  );
}
