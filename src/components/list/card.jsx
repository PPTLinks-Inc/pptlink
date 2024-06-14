/* eslint-disable react/prop-types */
import { FaEllipsisV } from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Card({ presentation }) {
  const containerVarient = {
    initial: {
      y: 50,
      opacity: 0
    },
    inView: {
      y: 0,
      opacity: 100,
      transition: {
        duration: 1,
        staggerChildren: 0.2,
        type: "spring",
        stiffness: 120
      }
    }
    // hover: {
    //   y: 10,
    //   scale: 1.05,
    //   boxShadow: "0px 0px 15px rgba(255,166,0,0.53)"
    // }
  };

  return (
    <motion.div
      variants={containerVarient}
      // whileHover="hover"
      className="card rounded-2xl p-5 cursor-pointer aspect-[1/1.2] border border-[rgba(255,166,0,0.53)] "
    >
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
          <h3 className="title font-medium w-full text-xl text-ellipsis text-left pt-3">
            {presentation.name}
          </h3>
          <p className="w-full text-[.8rem] text-ellipsis pt-2 font-light">
            <strong>Presenter: </strong>
            <em>{presentation.User.username}</em>
          </p>
          <p className="w-full text-[.8rem] text-ellipsis pt-2 font-light">
            <strong>Cartegory: </strong>
            <em>edge computing</em>
          </p>
          <span className="block mt-2">
            <FaEllipsisV className="text-xl text-[#FFA500] cursor-pointer rotate-90" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
