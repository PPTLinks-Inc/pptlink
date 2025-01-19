import { NavLink } from "react-router-dom";

export default function InstructorCard({ img }) {

    return (
        <div className="border-2 border-[#FFFFF0] rounded-md p-3">
            <img src={img} alt={img} className="block mb-3 w-12 aspect-square border-0 rounded-md object-cover" />
            <div className="flex flex-col justify-between items-start gap-2">
                <h3 className="font-semibold text-base">{"Ideation and Validation"}</h3>
                <p className="text-sm">{"Lorem ipsum dolor sit amet consectetur, adipisicing elit. Amet, dolor qui beatae corrupti at numquam delectus iusto quia in, dignissimos alias. Minus repudiandae at incidunt hic nihil unde nulla odit?"}</p>
                <NavLink to={"#"} target="_blank" className="block underline">Learn More...</NavLink>
            </div>
        </div>
    )
}