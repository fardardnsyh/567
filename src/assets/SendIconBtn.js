import React from "react";

function SendIconBtn(props) {
  return (
    <>
      {!props.mobile ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 1l-9.9 9.9M19 1l-6.3 18-3.6-8.1L1 7.3 19 1z"
          ></path>
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="17"
          fill="none"
          viewBox="0 0 16 17"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 1.5L7.3 9.2M15 1.5l-4.9 14-2.8-6.3L1 6.4l14-4.9z"
          ></path>
        </svg>
      )}
    </>
  );
}

export default SendIconBtn;
