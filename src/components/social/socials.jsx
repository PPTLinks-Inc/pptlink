import { FaTwitter } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa";
import { TbWorldWww } from "react-icons/tb";

export default function Socials() {
  return (
    <div className="footerIcons flex items-center maxScreenMobile:justify-between maxScreenMobile:pb-4">
      <a target="_blank" rel="noreferrer" href="https://x.com/pptlinks">
        <FaTwitter className="block text-xl mr-10 maxScreenMobile:mr-0 hover:scale-[1.5]" />
      </a>
      <a target="_blank" rel="noreferrer" href="https://www.linkedin.com/company/101626621/">
        <FaLinkedin className="block text-xl mr-10 maxScreenMobile:mr-0 hover:scale-[1.5]" />
      </a>
      <a target="_blank" rel="noreferrer" href="https://www.instagram.com/pptlinks?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==">
        <FaInstagram className="block text-xl mr-10 maxScreenMobile:mr-0 hover:scale-[1.5]" />
      </a>
      <a target="_blank" rel="noreferrer" href="https://github.com/beekay19/pptlink">
        <FaGithub className="block text-xl mr-10 maxScreenMobile:mr-0 hover:scale-[1.5]" />
      </a>
      <a target="_blank" rel="noreferrer" href="https://nascomsoft.com/">
        <TbWorldWww className="block text-xl mr-10 maxScreenMobile:mr-0 hover:scale-[1.5]" />
      </a>
    </div>
  );
}
