import { FaEllipsisV } from "react-icons/fa";

export default function Card({ img }) {
  return (
    <div className="card rounded-2xl p-5 cursor-pointer">
      <div className="card_img rounded-2xl border-[1px] border-solid border-slate-200">
        <img
          src={img}
          alt={img}
          className="w-full h-[150px] rounded-2xl object-cover"
          loading="lazy"
        />
      </div>
      <div className="card_body pb-5">
        <h3 className="title font-medium w-full text-xl text-ellipsis pt-3">
          Lorem, ipsum dolor.
        </h3>
        <p className="w-full text-[.8rem] text-ellipsis pt-2 font-light">
          <strong>Presenter: </strong>
          <em>Rvau Alayna</em>
        </p>
        <p className="w-full text-[.8rem] text-ellipsis pt-2 font-light">
          <strong>Topic: </strong>
          <em>edge computing</em>
        </p>
        <span className="block mt-2">
          <FaEllipsisV className="text-xl text-[#FFA500] cursor-pointer rotate-90" />
        </span>
      </div>
    </div>
  );
}
