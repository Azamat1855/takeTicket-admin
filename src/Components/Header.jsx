import React from 'react';
import { IoIosSend } from "react-icons/io";


const Header = ({ title, send }) => {
  return (
    <div>
      <div className="flex items-center  justify-between w-full content-start mb-2">
       <p className="text-3xl font-extrabold tracking-tight text-accent ">
          {title}
        </p>
        <button className="btn btn-accent rounded-xl">
          <IoIosSend className="font-bold"/>{send}</button>
       </div>
      </div>
  );
};

export default Header;
