import React from 'react';
import { IoIosSend } from "react-icons/io";


const Header = ({ title }) => {
  return (
    <div>
      <div className="flex items-center  justify-between w-full  ">
       <p className="text-3xl font-extrabold tracking-tight text-accent ">
          {title}
        </p>
      </div>
      
      </div>
  );
};

export default Header;
