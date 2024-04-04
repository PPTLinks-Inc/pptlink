import { NavLink } from "react-router-dom";
import facebook from "/team/pptlink_resources/Icon simple-facebook.svg";
import twitter from "/team/pptlink_resources/Icon awesome-twitter.svg";
import linkedin from "/team/pptlink_resources/Icon ionic-logo-linkedin.svg";
import instagram from "/team/pptlink_resources/Icon simple-instagram.svg";
import github from "/team/pptlink_resources/Icon awesome-github.svg";
import www from "/team/pptlink_resources/Path 115.svg";
export default function Socials() {
  return (
    <div className="footerIcons flex items-center">
      <NavLink to="#Socials">
        <img
          loading="lazy"
          src={facebook}
          alt={facebook}
          className="block w-4 aspect-square mr-10 hover:relative hover:z-10 hover:scale-[1.5] rounded shadow-md"
        />
      </NavLink>
      <NavLink to="#Socials">
        <img
          loading="lazy"
          src={twitter}
          alt={twitter}
          className="block w-4 aspect-square mr-10 hover:relative hover:z-10 hover:scale-[1.5] rounded shadow-md"
        />
      </NavLink>
      <NavLink to="#Socials">
        <img
          loading="lazy"
          src={linkedin}
          alt={linkedin}
          className="block w-4 aspect-square mr-10 hover:relative hover:z-10 hover:scale-[1.5] rounded shadow-md"
        />
      </NavLink>
      <NavLink to="#Socials">
        <img
          loading="lazy"
          src={instagram}
          alt={instagram}
          className="block w-4 aspect-square mr-10 hover:relative hover:z-10 hover:scale-[1.5] rounded shadow-md"
        />
      </NavLink>
      <NavLink to="#Socials">
        <img
          loading="lazy"
          src={github}
          alt={github}
          className="block w-4 aspect-square mr-10 hover:relative hover:z-10 hover:scale-[1.5] rounded shadow-md"
        />
      </NavLink>
      <NavLink to="#Socials">
        <img
          loading="lazy"
          src={www}
          alt={www}
          className="block w-4 aspect-square mr-10 hover:relative hover:z-10 hover:scale-[1.5] rounded shadow-md"
        />
      </NavLink>
    </div>
  );
}
