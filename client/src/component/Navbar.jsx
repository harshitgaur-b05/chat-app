import axios from 'axios';
import React, { useState } from 'react';
import { FaSearch } from "react-icons/fa";
import { IoExitOutline } from "react-icons/io5";
import { MdGroups } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

const Navbar =  () => {
  const navigate=useNavigate()
  const search =useState[false];
  // Handler for search button
  const handleSearch = (e) => {
    e.preventDefault();
     

  };

  // Handler for exit button
  const handleExit = async (e) => {
   e.preventDefault();
   await axios.post('http://localhost:5001/api/auth/logout')
    navigate("/login");

  };

  // Handler for groups button
  const handleGroups = (e) => {
    e.preventDefault();
    navigate("/group")
  };

  return (
    <div className='flex text-2xl justify-between text-center text-amber-50' style={{height:"20vh", background:"#111111"}}>
      <div className='flex items-center justify-center pl-4  w-40 px-4 rounded-r-lg'>
        <p className='font-bold'>Chat App</p>
      </div>
      
      <div className='flex items-center justify-center w-60 gap-6 text-3xl px-6 rounded-l-lg space-x-4'>
        <button 
          onClick={handleSearch}
          className='p-2 hover:text-blue-500  text-2xl rounded-lg transition-colors duration-200 text-white'
          title="Search"
        >
          <FaSearch />
        </button>
        
      
        
        <button 
          onClick={handleGroups}
          className='p-2 hover:text-blue-500 rounded-lg transition-colors duration-200 text-white '
          title="Groups"
        >
          <MdGroups />
        </button>
          <button 
          onClick={handleExit}
          className='p-2 hover:text-blue-500 rounded-lg text-3xl transition-colors duration-200 text-white'
          title="Exit"
        >
          <IoExitOutline />
        </button>
      </div>
    </div>
  );
};

export default Navbar;