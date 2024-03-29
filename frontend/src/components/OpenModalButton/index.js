// frontend/src/components/OpenModalButton/index.js
import React from "react";
import { useModal } from "../../context/Modal";
import './OpenModalButton.css'

function OpenModalButton({
  modalComponent, // component to render inside the modal
  buttonText, // text of the button that opens the modal
  onButtonClick, // optional: callback function that will be called once the button that opens the modal is clicked
  onModalClose, // optional: callback function that will be called once the modal is closed
  className,
  style
}) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = (e) => {
    e.stopPropagation();
    if (typeof onButtonClick === "function") onButtonClick();
    if (typeof onModalClose === "function") setOnModalClose(onModalClose);
    setModalContent(modalComponent);
  };

  const buttonClassName = `post-delete-review-btn ${className || ''}`;

  // return <button className="post-delete-review-btn" onClick={onClick}>{buttonText}</button>;
  return <button className={buttonClassName} style={style} onClick={onClick}>{buttonText}</button>;
}

// const Greeting = () => {
//   return (
//     <OpenModalButton
//       buttonText="Greeting"
//       modalComponent={<h2>Hello World!</h2>}
//       onButtonClick={() => console.log("Greeting initiated")}
//       onModalClose={() => console.log("Greeting completed")}
//     />
//   );
// };

export default OpenModalButton;
