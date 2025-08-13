/* eslint-disable react/prop-types */
import { useState } from "react";
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
import { useMutation } from "@tanstack/react-query";
import PopUpModal from "../Models/dashboardModel";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../../lib/axios";
import useUser from "../../hooks/useUser";
import { useTheme } from "../../hooks/useTheme";

export default function Card({ presentation, refresh }) {
  const { bg, text, border, isDark } = useTheme();
  const { userQuery } = useUser();
  const user = userQuery.data;
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [bookmarked, setBookmarked] = useState(
    presentation?.Bookmark[0]?.userId === user?.id
  );
  const [modal, setModal] = useState({
    isTriggered: false,
    message: "",
    actionText: "",
    cardId: ""
  });

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const deletePresentation = useMutation({
    mutationFn: async function (id) {
      const { data } = await authFetch.delete(
        `/api/v1/ppt/presentations/${id}`
      );
      return data;
    },
    onSuccess: function () {
      closeModal();
      refresh();
      toast({
        description: "Presentation deleted successfully"
      });
    },
    onError: function () {
      toast({
        description: "An error occured while deleting presentation",
        variant: "destructive"
      });
    }
  });

  const bookmarkPresentation = useMutation({
    mutationFn: async function (id) {
      setBookmarked((prev) => !prev);
      const { data } = await authFetch.get(
        `/api/v1/ppt/presentations/bookmark/${id}/toggle`
      );
      return data;
    },
    onSuccess: function (data, id) {
      if (data.bookmarked) {
        toast({
          description: "Presentation added to your Bookmarks",
          action: (
            <ToastAction
              onClick={() => bookmarkPresentation.mutate(id)}
              altText="undo"
            >
              Undo
            </ToastAction>
          )
        });
      } else {
        toast({
          description: "Presentation removed from your Bookmarks",
          action: (
            <ToastAction
              onClick={() => bookmarkPresentation.mutate()}
              altText="undo"
            >
              Undo
            </ToastAction>
          )
        });
      }
    },
    onError: function () {
      setBookmarked((prev) => !prev);
      toast({
        description: "An error occured while bookmarking presentation",
        variant: "destructive"
      });
    }
  });

  // Function to open the modal
  const openModal = (data) => {
    setModal({
      isTriggered: data.isTriggered || true,
      message: data.message,
      actionText: data.actionText,
      cardId: data.cardId || ""
    });
  };

  // Function to close the modal
  const closeModal = () => {
    setModal((prev) => ({
      ...prev,
      isTriggered: false,
      message: "",
      actionText: "",
      cardId: ""
    }));
  };

  function shareLink(link) {
    navigator
      .share({
        title: "PPTLinks",
        text: "Join the presentation",
        url: link
      })
      .catch(() => {});
  }

  function copyLink(link) {
    navigator.clipboard &&
      navigator.clipboard
        .writeText(link)
        .then(() => {
          toast({
            description: "Link Copied successfully"
          });
        })
        .catch(() => {});
  }
  // Modal handler
  const handleCardModel = (Id, data) => {
    if (data === "share") {
      const link = `https://pptlinks.com/${Id}`;
      navigator?.share ? shareLink(link) : copyLink(link);
      return;
    }
    openModal({
      cardId: Id,
      message:
        data === "delete"
          ? "Are you sure you want to delete this presentation?"
          : data === "report"
            ? "Are you sure you want to report this presentation?"
            : data === "edit"
              ? "Are you sure you want to edit this presentation?"
              : "",
      actionText:
        data === "delete"
          ? "Delete"
          : data === "report"
            ? "Report"
            : data === "edit"
              ? "Edit"
              : ""
    });
  };

  function onSubmitModal(e) {
    e.preventDefault();
    if (modal.actionText === "Delete") {
      deletePresentation.mutate(modal.cardId);
    } else if (modal.actionText === "Edit") {
      if (presentation.live) {
        toast({
          description: "You can't edit a live presentation",
          variant: "destructive"
        });
        return;
      }

      navigate(`/upload?edit=${presentation.id}`);
    }
  }

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
    <>
      <PopUpModal
        open={modal.isTriggered}
        onClose={closeModal}
        onSubmit={onSubmitModal}
        isLoading={deletePresentation.isPending}
        message={modal.message}
        actionText={modal.actionText}
      />
      <motion.div
        variants={containerVarient}
        className={`card rounded-lg p-4 maxScreenMobile:p-2 cursor-pointer aspect-[1/1.2] md:aspect-square border _border-[rgba(255,166,0,0.53)] ${border} _border-slate-200`}
      >
        <Link to={`/${presentation.liveId}`} viewTransition>
          <div className={`card_img rounded-lg border-[1px] border-solid ${border} _border-slate-200`}>
            <img
              src={presentation.thumbnail}
              alt={`${presentation.name} presentation thumbnail`}
              className={"block w-full aspect-video maxScreenMobile:aspect-[1/0.8] rounded-md object-cover text-center"}
              loading="lazy"
            />
          </div>

          <div className={`card_body pb-5 maxScreenMobile:pb-0 ${text}`}>
            <h3 className="title font-medium w-full text-xl !maxScreenMobile:text-xl text-left pt-3 overflow-x-hidden whitespace-nowrap text-ellipsis">
              {presentation.name}
            </h3>
            <p className="w-full text-[.8rem] !maxScreenMobile:text-[.8rem] pt-2 font-light overflow-x-hidden whitespace-nowrap text-ellipsis">
              <strong>Presenter: </strong>
              <em>{presentation.User.username}</em>
            </p>
            <p className="w-full text-[.8rem] !maxScreenMobile:text-[.8rem] pt-2 font-light overflow-x-hidden whitespace-nowrap text-ellipsis">
              <strong>Category: </strong>
              <em>{presentation.category.name}</em>
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
                <FaEllipsisV className={`text-xl _text-[#FFA500] ${text} _text-slate-200 cursor-pointer rotate-90`} />
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
                <div className="w-full h-full _bg-primaryTwo _text-white">
                  {user && user.id === presentation.User.id && (
                    <>
                      <MenuItem
                        onClick={() => {
                          handleCardModel(presentation.id, "edit");
                          handleClose();
                        }}
                        sx={{
                          color: "white",
                          "&:hover": {
                            backgroundColor: "#FFA500",
                            fontWeight: "bolder"
                          }
                        }}
                      >
                        <span className="block w-32 text-[.9rem]">Edit</span>
                        <FaRegEdit />
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          handleCardModel(presentation.id, "delete");
                          handleClose();
                        }}
                        disabled={deletePresentation.isPending}
                        sx={{
                          color: "white",
                          "&:hover": {
                            backgroundColor: "#FFA500",
                            fontWeight: "bolder"
                          }
                        }}
                      >
                        <span className="block w-32 text-[.9rem]">
                          {deletePresentation.isPending
                            ? "Deleting..."
                            : "Delete"}
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
                        handleClose();
                      }}
                      sx={{
                        color: "white",
                        "&:hover": {
                          backgroundColor: "#FFA500",
                          fontWeight: "bolder"
                        }
                      }}
                    >
                      <span className="block w-32 text-[.9rem]">Bookmark</span>
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
                      handleCardModel(presentation.liveId, "share");
                      handleClose();
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
                      handleCardModel(presentation.id, "report");
                      handleClose();
                    }}
                    sx={{
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#FFA500",
                        fontWeight: "bolder"
                      }
                    }}
                  >
                    <span className="block w-32 text-[.9rem]">Report</span>
                    <MdOutlineReportProblem />
                  </MenuItem>
                </div>
              </Menu>
            </span>
          </div>
        </Link>
      </motion.div>
    </>
  );
}
