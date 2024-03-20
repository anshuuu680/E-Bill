import { useState } from 'react';
import { BiSearch, BiLogOut } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import Modal from 'react-modal';

const Header = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [deleteIsOpen, setDeleteIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get(`/api/logout`);
      navigate('/login')

    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };


  return (
    <div className="w-full  h-[48px] bg-[#fcfbfb] pl-4 flex items-center justify-between px-3 shadow-lg">
      <div
        className={`left w-[240px] h-4/6 border bg-[#e6e5e5] rounded-md flex items-center transition-all duration-500 ${isFocused ? 'focus w-[280px] border-blue-500' : ''
          }`}
        onMouseEnter={() => setIsFocused(true)}
      >
        <input
          className='h-full bg-transparent w-[95%] outline-none p-2 text-sm'
          type="text"
          placeholder='Search by bill Number'
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <h1 className='flex items-center h-full justify-around w-[50px]'>
          <span className='text-gray-300'>| </span>
          <BiSearch className='cursor-pointer' size={18} />
        </h1>
      </div>
      <div className="right w-1/6 h-full flex items-center gap-4 justify-center">
        <div onClick={() => (navigate('/owner/profile'))} className="w-10 h-10  rounded-full border-2 border-green-200 overflow-hidden cursor-pointer">
          <img className='w-full h-full object-cover rounded-full' src="https://images.unsplash.com/photo-1613323593608-abc90fec84ff?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8aW1hZ2V8ZW58MHx8MHx8fDA%3D" alt="" />
        </div>
        <div onClick={()=>setDeleteIsOpen(true)} className="flex items-center gap-1 cursor-pointer">
          <BiLogOut color='red' size={20} />
          <h1 className='text-sm font-semibold'>Sign Out</h1>
        </div>
      </div>

      <Modal
        isOpen={deleteIsOpen}
        onRequestClose={() => setDeleteIsOpen(false)}
        style={{
          content: {
            width: '260px',
            height: '150px',
            margin: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap:'30px',
            border: '1px solid #ccc',
            background: '#f8f8f8',
            borderRadius: '20px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          },
          overlay: {
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
          },
        }}
      >
        <h1 className="font-bold">Do you want to Sign Out?</h1>
        <div className="flex justify-end items-end w-full gap-4">
          <button onClick={() => setDeleteIsOpen(false)} className="flex items-center px-3 h-[30px] border rounded-lg border-black text-md cursor-pointer">No</button>
          <button onClick={handleLogout} className="px-3 h-[30px] font-bold rounded-lg bg-red-600 text-white text-md cursor-pointer">Yes</button>
        </div>
      </Modal>
    </div>
  );
};

export default Header;
