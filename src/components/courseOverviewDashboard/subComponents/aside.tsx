import { Link, NavLink } from "react-router-dom";

export default function AsideForDarshboardOverview() {
  const navItems = [
    { title: "Dashboard", link: "/dashboard/overview/home" },
    { title: "Presentations", link: "/dashboard/overview/presentations" },
    { title: "My Courses", link: "/dashboard/overview/mycourses" },
    { title: "Live Sessions", link: "/dashboard/overview/live-sessions" },
    { title: "Students", link: "/dashboard/overview/students" },
    { title: "Messages", link: "/dashboard/overview/messages" },
    { title: "Earnings", link: "/dashboard/overview/earnings" },
    { title: "Settings", link: "/dashboard/overview/settings" }
  ];

  return (
    <>
      <h3 className="w-full min-h-24 font-semibold text-3xl text-white">
        Welcome Back, Raymond
      </h3>
      <nav className="w-full h-full flex flex-col justify-start items-center">
        {navItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.link}
            className={`block w-full h-fit border-none rounded-sm`}
          >
            {({ isActive }) => (
              <span
                className={`block w-full h-fit p-3 text-left border-none rounded-sm transition-colors ${
                  isActive
                    ? "bg-gradient-to-r from-primarySixTwo to-primaryTwo text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                {item.title}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
      <Link to={"/sign-out"}>Log-out</Link>
    </>
  );
}
