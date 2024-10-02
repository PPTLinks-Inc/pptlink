/* eslint-disable react/prop-types */
import { createContext, useState } from "react";

// Create the ModalContext
export const ModalContext = createContext();

// Provide the context to children
export const ModalProvider = ({ children }) => {
  const [modal, setModal] = useState({
    isTriggered: false,
    message: "",
    actionText: "",
    cardId: "",
  });

  // Function to open the modal
  const openModal = (data) => {
    setModal({
      isTriggered: data.isTriggered || true,
      message: data.message,
      actionText: data.actionText,
      cardId: data.cardId || "",
    });
  };

  // Function to close the modal
  const closeModal = () => {
    setModal((prev) => ({
      ...prev,
      isTriggered: false,
      message: "",
      actionText: "",
    }));
  };

  return (
    <ModalContext.Provider value={{ modal, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};
