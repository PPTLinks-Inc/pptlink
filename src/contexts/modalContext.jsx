/* eslint-disable react/prop-types */
import { createContext, useState } from "react";
import { toast } from "react-toastify";

// Create the ModalContext
export const ModalContext = createContext();

// Provide the context to children
export const ModalProvider = ({ children }) => {
  const [modal, setModal] = useState({
    isTriggered: false,
    message: "",
    actionText: "",
    cardId: ""
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
      actionText: ""
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
    navigator.clipboard && navigator.clipboard.writeText(link).then(() => {
      toast.success("Link Copied successfully");
    }).catch(() => {});
  }
  // Modal handler
  const handleCardModel = (Id, data) => {
    if (data === "share") {
      const link = `https://pptlinks/${Id}`;
      navigator?.share ? shareLink(link) : copyLink(link);
      return;
    }
    openModal({
      cardId: Id,
      message:
        data === "delete"
          ? "Are you sure you want to delete this card?"
          : data === "bookmark"
            ? "Are you sure you want to bookmark this card?"
            : data === "report"
              ? "Are you sure you want to report this card?"
              : data === "edit"
                ? "Are you sure you want to edit this card?"
                : "",
      actionText:
        data === "delete"
          ? "Delete"
          : data === "bookmark"
            ? "Bookmark"
            : data === "report"
              ? "Report"
              : data === "edit"
                ? "Edit"
                : ""
    });
    // }
  };

  return (
    <ModalContext.Provider value={{ modal, handleCardModel, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};
