/* eslint-disable react/prop-types */
import { useContext, useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { FaEllipsisV } from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaRegEdit } from "react-icons/fa";
import { FiDelete } from "react-icons/fi";
import { FaRegBookmark } from "react-icons/fa6";
import { FaBookmark } from "react-icons/fa6";
import { IoShareSocialOutline, IoCopyOutline } from "react-icons/io5";
import { MdOutlineReportProblem } from "react-icons/md";
import { userContext } from "../../contexts/userContext";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
// import { useLocation } from "react-router-dom";
// handleCardDelete passed to Card to handle delete model or any other model
export default function Card({ presentation, handleCardModel }) {
  // const [getlocation] = React.useState(
  //   useLocation().pathname === "/publicPresentation"
  //     ? true : false
  // );
  const { user } = useContext(userContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [bookmarked, setBookmarked] = useState(presentation?.Bookmark[0]?.userId === user.id);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const bookmarkPresentation = useMutation({
    mutationFn: async function (id) {
      setBookmarked((prev) => !prev);
      const { data } = await axios.get(
        `/api/v1/ppt/presentations/bookmark/${id}/toggle`
      );
      return data;
    },
    onSuccess: function (data) {
      if (data.bookmarked) {
        toast.success("Presentation added to your Bookmarks");
      } else {
        toast.success("Presentation removed from your Bookmarks");
      }
    },
    onError: function () {
      setBookmarked((prev) => !prev);
      toast.error("An error occured while bookmarking presentation");
    }
  });

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
      className="card rounded-2xl p-5 maxScreenMobile:p-2 cursor-pointer aspect-[1/1.2] md:aspect-square border border-[rgba(255,166,0,0.53)] "
    >
      <Link to={`/${presentation.liveId}`}>
        <div className="card_img rounded-2xl border-[1px] border-solid border-slate-200">
          <img
            src={presentation.thumbnail}
            alt={`${presentation.name} presentation thumbnail`}
            className="w-full aspect-video maxScreenMobile:aspect-[1/0.8] rounded-2xl object-cover"
            loading="lazy"
          />
        </div>

        <div className={`card_body pb-5 maxScreenMobile:pb-0 text-white`}>
          <h3 className="title font-medium w-full text-xl !maxScreenMobile:text-xl text-left pt-3 overflow-x-hidden whitespace-nowrap text-ellipsis">
            {presentation.name}
          </h3>
          <p className="w-full text-[.8rem] !maxScreenMobile:text-[.8rem] pt-2 font-light overflow-x-hidden whitespace-nowrap text-ellipsis">
            <strong>Presenter: </strong>
            <em>{presentation.User.username}</em>
          </p>
          <p className="w-full text-[.8rem] !maxScreenMobile:text-[.8rem] pt-2 font-light overflow-x-hidden whitespace-nowrap text-ellipsis">
            <strong>Cartegory: </strong>
            <em>edge computing</em>
          </p>
          <span
            className="block w-fit mt-2 ml-[-1.2rem]"
            onClick={(e) => e.preventDefault()}
          >
            <Button
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            >
              <FaEllipsisV className="text-xl text-[#FFA500] cursor-pointer rotate-90" />
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button"
              }}
              PaperProps={{
                style: {
                  backgroundColor: "#252525",
                  color: "white"
                }
              }}
            >
              <div className="w-full h-full _bg-black _text-white">
                {user && user.id === presentation.User.id && (
                  <>
                    <MenuItem
                      onClick={() => {
                        handleCardModel(
                          presentation.id,
                          "edit"
                        );
                      }}
                      sx={{
                        color: "white",
                        "&:hover": {
                          backgroundColor: "#FFA500",
                          fontWeight: "bolder"
                        }
                      }}
                    >
                      <span className="block w-32 text-[.9rem]">
                        Edit
                      </span>
                      <FaRegEdit />
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleCardModel(
                          presentation.id,
                          "delete"
                        );
                      }}
                      sx={{
                        color: "white",
                        "&:hover": {
                          backgroundColor: "#FFA500",
                          fontWeight: "bolder"
                        }
                      }}
                    >
                      <span className="block w-32 text-[.9rem]">
                        Delete
                      </span>
                      <FiDelete />
                    </MenuItem>
                  </>
                )}
                {user && (
                  <MenuItem
                    disabled={bookmarkPresentation.isPending}
                    onClick={() => {
                      bookmarkPresentation.mutate(presentation.id);
                    }}
                    sx={{
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#FFA500",
                        fontWeight: "bolder"
                      }
                    }}
                  >
                    <span className="block w-32 text-[.9rem]">
                      Bookmark
                    </span>
                    {bookmarked ? (
                      <span className="text-[#FFA500]">
                        <FaBookmark />
                      </span>
                    ) : (
                      <FaRegBookmark />
                    )}
                  </MenuItem>
                )}
                <MenuItem
                  onClick={() => {
                    handleCardModel(
                      presentation.liveId,
                      "share"
                    );
                  }}
                  sx={{
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#FFA500",
                      fontWeight: "bolder"
                    }
                  }}
                >
                  <span className="block w-32 text-[.9rem]">
                    {navigator?.share ? "Share" : "Copy Link"}
                  </span>{" "}
                  {navigator?.share ? (
                    <IoShareSocialOutline />
                  ) : (
                    <IoCopyOutline />
                  )}
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleCardModel(
                      presentation.id,
                      "report"
                    );
                  }}
                  sx={{
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#FFA500",
                      fontWeight: "bolder"
                    }
                  }}
                >
                  <span className="block w-32 text-[.9rem]">
                    Report
                  </span>
                  <MdOutlineReportProblem />
                </MenuItem>
              </div>
            </Menu>
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
