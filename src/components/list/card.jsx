/* eslint-disable react/prop-types */
import { FaEllipsisV } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Card({ presentation }) {
  return (
    <div className="card rounded-2xl p-5 cursor-pointer aspect-[1/1.2]">
      <Link to={`/${presentation.liveId}`}>
        <div className="card_img rounded-2xl border-[1px] border-solid border-slate-200">
          <img
            src={presentation.thumbnail}
            alt={`${presentation.name} presentation thumbnail`}
            className="w-full h-[180px] rounded-2xl object-cover"
            loading="lazy"
          />
        </div>
        <div className="card_body pb-5">
          <h3 className="title font-medium w-full text-xl text-ellipsis pt-3">
            {presentation.name}
          </h3>
          <p className="w-full text-[.8rem] text-ellipsis pt-2 font-light">
            <strong>Presenter: </strong>
            <em>{presentation.user}</em>
          </p>
          <p className="w-full text-[.8rem] text-ellipsis pt-2 font-light">
            <strong>Topic: </strong>
            <em>edge computing</em>
          </p>
          <span className="block mt-2">
            <FaEllipsisV className="text-xl text-[#FFA500] cursor-pointer rotate-90" />
          </span>
        </div>
      </Link>
    </div>
  );
}
