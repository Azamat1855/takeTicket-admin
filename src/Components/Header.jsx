import React from 'react';
import { IoIosSend } from "react-icons/io";


const Header = ({ category, title, send }) => {
  return (
    <div className="mb-10">
      <p className="text-gray-400">{category}</p>
      <div className="flex items-center justify-between w-full">
        <p className="text-3xl font-extrabold tracking-tight text-slate-900">
          {title}
        </p>
        <p className="text-xl p-1 rounded-lg font-extrabold text-white  items-center flex bg-blue-600"><IoIosSend />
        {send}</p>
      </div>
    </div>
  );
};

export default Header;
