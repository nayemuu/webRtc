import React from "react";

const Button = ({ handleClick, disable = false, active, children }) => {
  let myClASS = "";
  if (active) {
    myClASS = "bg-green-500";
  } else if (disable) {
    myClASS = "bg-[#4e5a65] cursor-not-allowed";
  } else {
    myClASS = "bg-gradient-to-b from-[#D13F96] to-[#833586]";
  }

  return (
    <button
      type="button"
      className={`text-white rounded-[5px] px-5 py-1 text-lg ${myClASS}`}
      disabled={disable}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

export default Button;
