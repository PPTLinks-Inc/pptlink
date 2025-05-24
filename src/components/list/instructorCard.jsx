/* eslint-disable react/prop-types */
import { NavLink } from "react-router-dom";
import { FaUser } from "react-icons/fa6";

export default function InstructorCard({ data }) {
  return (
    <div className="w-full h-fit border-[1px] border-[#FFFFF0] rounded-md p-3 flex flex-col justify-between items-start gap-3">
      {data.instructor.photo ? (
        <img
          src={data.instructor.photo}
          alt={data.instructor.user.username}
          className="block mb-3 !w-12 !aspect-square border-0 rounded-full object-cover text-sm overflow-hidden"
        />
      ) : (
        <div className="mb-3 !w-12 !aspect-square rounded-full bg-gray-200 flex items-center justify-center">
          <FaUser className="text-gray-400 text-xl" />
        </div>
      )}
      
      <div className="flex flex-col justify-between items-start gap-2">
        <h3 className="font-semibold text-base line-clamp-2 whitespace-pre-wrap text-ellipsis">
          {data.instructor.user.username}
        </h3>
        
        <div className="flex flex-col gap-1">
          <p className="text-sm text-gray-600">{data.instructor.role}</p>
          <p className="text-sm text-gray-600">{data.instructor.experience} years of experience</p>
        </div>

        <p className="text-sm line-clamp-4 whitespace-pre-wrap w-full h-20 overflow-x-hidden text-ellipsis">
          {data.instructor.bio}
        </p>
        <NavLink to={"#"} target="_blank" className="block underline">
          Learn More...
        </NavLink>
      </div>
    </div>
  );
}
