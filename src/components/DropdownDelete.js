import React, { useState, useRef, useEffect } from "react";
import More from "../assets/More";
import DeleteButton from "./DeleteButton";

const DropdownDelete = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="dropdown" ref={dropdownRef}>
      <button
        className={`dropbtn ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <More />
      </button>
      <div
        className={`${
          isOpen && "translate-y-0 opacity-100 scale-100"
        } absolute transition-all ease-out top-full origin-top right-3 mt-2 -translate-y-full opacity-0 scale-0`}
      >
        <DeleteButton onClick={props.onDelete} />
      </div>
    </div>
  );
};

export default DropdownDelete;
