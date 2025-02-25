/* eslint-disable react/prop-types */
import { NavLink } from "react-router-dom";

export default function InstructorCard({ data }) {

    return (
        <div className="aspect-square border-2 border-[#FFFFF0] rounded-md p-3">
            <img src={data.instructor.photo} alt={data.instructor.user.username} className="block mb-3 w-12 aspect-square border-0 rounded-full object-cover" />
            <div className="flex flex-col justify-between items-start gap-2">
                <h3 className="font-semibold text-base">{data.instructor.user.username}</h3>
                <p className="text-sm line-clamp-4 whitespace-pre-wrap w-full">{data.instructor.bio}</p>
                <NavLink to={"#"} target="_blank" className="block underline">Learn More...</NavLink>
            </div>
        </div>
    )
}