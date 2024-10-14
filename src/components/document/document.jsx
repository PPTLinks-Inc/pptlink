import { NavLink } from "react-router-dom";
import documentImg from "/team/pptlink_resources/documentation-svgrepo-com (1).svg";
import searchImg from "/team/pptlink_resources/Icon material-search.png";
import initiative from "/team/pptlink_resources/initiative.png";
import planning from "/team/pptlink_resources/planning.png";
import execution from "/team/pptlink_resources/execution.png";
import controlSystem from "/team/pptlink_resources/control-system.png";
import conclusion from "/team/pptlink_resources/conclusion.png";
import others from "/team/pptlink_resources/other.png";

const sections = [
  {
    img: initiative,
    title: "WHAT IS PPTLinks",
    links: [
      {
        text: "What is PPTLinks: ",
        desc: "PPTLinks is an online platform designed to facilitate the sharing, exploration, and collaboration around presentations of all types."
      },
      {
        text: "Purpose of PPTLinks: ",
        desc: "PPTLinks serves as a central repository for presentations on a wide range of topics."
      },
      {
        text: "Key Features and Benefits: ",
        desc: "Easy upload, audience engagement, privacy and security."
      }
    ]
  },
  {
    img: planning,
    title: "GETTING STARTED",
    links: [
      {
        text: "Creating an account: ",
        desc: "To begin using PPTLinks and sharing your presentations with your audience, you need to create an account. Follow these steps to sign up"
      },
      {
        text: "Signing in: ",
        desc: "If you've already created an account, signing in is easy"
      },
      {
        text: "Navigating the Dashboard: ",
        desc: "Once you're logged in, you'll be taken to your user dashboard. Here, you can:"
      }
    ]
  },
  {
    img: execution,
    title: "UPLOADING PRESENTATIONS",
    links: [
      {
        text: "Supported File Formats: ",
        desc: "Before you begin, it's essential to ensure that your presentation is in a supported file format. PPTLinks currently supports the following file formats:"
      },
      {
        text: "Access Your Account: ",
        desc: "Sign In: If you're not already signed in to your PPTLinks account, visit https://www.pptlinks.com and click 'Sign In' in the top-right corner. Enter your sign in detail to access your account."
      },
      {
        text: "Begin the Upload Process: ",
        desc: "Navigate to Upload: Once you're logged in, click on the 'Present' button. This button is typically located in the top navigation menu or “Upload” button on your user dashboard."
      }
    ]
  },
  {
    img: controlSystem,
    title: "GUIDELINES AND RULES",
    links: [
      {
        text: "Purpose and Community Values: ",
        desc: "At PPTLinks, we are committed to fostering a positive and collaborative community. To maintain a safe and respectful environment, we ask all users to adhere to the following guidelines and rules:"
      },
      {
        text: "Posting Guidelines: ",
        desc: "Effective and respectful posting is essential to maintaining a vibrant and engaging community on PPTLinks. The following guide lines are to ensure premium experience for users."
      }
    ]
  },
  {
    img: others,
    title: "OTHERS",
    links: [
      {
        text: "Common Issues and Solutions: ",
        desc: "Sign in problems, presentation upload errors, account security concerns, contacting support"
      },
      {
        text: "Troubleshooting: ",
        desc: "In this section, you'll find guidance on identifying and resolving common issues that may arise while using PPTLinks. If you encounter any problems, please consult the following resources for assistance."
      },
      {
        text: "Frequently Asked Questions (FAQs): ",
        desc: "Presentation download, Sharing presentations, Miss a live presentation"
      }
    ]
  },
  {
    img: conclusion,
    title: "LEGAL",
    links: []
  }
];

export default function Document() {
  return (
    <>
      <section className="bg-black">
        <div className="container min-h-fit py-10 flex flex-col justify-between items-center">
          <h1 className="text-5xl font-[400] uppercase mb-5">DOCUMENTATION</h1>
          <div className="w-[150px] aspect-square mb-5">
            <img
              src={documentImg}
              alt="Documentation"
              className="block w-full h-full"
            />
          </div>
          <p className="text-center w-[80%] text-[1.1rem] mb-10">
            Welcome to PPTLinks, your premier platform for easy sharing and
            viewing power point presentations. This section provides a
            comprehensive overview of what PPTLinks is, its purpose, and
            benefits it offers to its users.
          </p>
          <div className="w-[300px] h-fit rounded-[.5rem] border border-white relative mb-5">
            <input
              type="text"
              name="searcher"
              placeholder="Search for Articles & Contents"
              className="block w-full min-h-[1rem] text-[.8rem] indent-4 p-2 rounded-[.5rem] bg-black text-white"
            />
            <img
              src={searchImg}
              alt="Search"
              className="block w-5 aspect-square absolute right-2 top-[50%] translate-y-[-50%]"
            />
          </div>
        </div>
      </section>
      <section className="container py-5 min-h-screen bg-[#FFFFF0]">
        <div className="documentationPage flex flex-wrap justify-between items-center gap-y-16 gap-x-8 w-full mt-20 mb-10">
          {sections.map((section, index) => (
            <div
              key={index}
              className="w-full min-h-[250px] bg-[#ffffff36] border border-[#FFA500] text-black rounded-md p-3 text-center text-[.8rem] flex flex-col justify-between items-center"
            >
              <div className="w-20 aspect-square mb-3">
                <img
                  src={section.img}
                  alt={section.title}
                  className="block w-full h-full"
                />
              </div>
              <h3 className="text-xl mb-2">{section.title}</h3>
              <div className="w-full">
                {section.links.map((link, i) => (
                  <NavLink
                    key={i}
                    to="#"
                    className="block w-full overflow-x-hidden whitespace-nowrap text-ellipsis mb-3 text-justify text-[.7rem]"
                  >
                    {link.text}
                    <span className="text-[#FFA500] underline decoration-[#FFA500]">
                      {link.desc}
                    </span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
