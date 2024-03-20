import axios from 'axios';
import React, { useRef, useState } from 'react';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    slogan: '',
    proprietorName: '',
    email: '',
    contact: '',
    address: '',
    instagramLink: '',
    addressLink: '',
    gstin: '',
    password: '',
    confirmPassword: '',
  });

  const [url, setUrl] = useState(null);
  const [actualUrl, setActualUrl] = useState(null);
  const curr = useRef();

  const FileHandler = () => {
    curr.current.value = "";
    curr.current.click();
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setActualUrl(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        setUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }

  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('companyName', formData.companyName);
      formDataToSend.append('slogan', formData.slogan);
      formDataToSend.append('proprietorName', formData.proprietorName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('contact', formData.contact);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('instagramLink', formData.instagramLink);
      formDataToSend.append('addressLink', formData.addressLink);
      formDataToSend.append('gstin', formData.gstin);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('confirmPassword', formData.confirmPassword);
      formDataToSend.append('QRcode', actualUrl);

      const config = {
        headers: { 'content-type': 'multipart/form-data' }
      }
      const response = await axios.post('/api/signup', formDataToSend, config);
      console.log('Signup successful:', response.data);
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };


  return (
    <div className="flex justify-center items-center h-fit p-4">
      <form className="w-2/3 bg-white rounded p-4 border">
        <h2 className="text-2xl font-bold mb-6 text-red-700">Sign Up</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label htmlFor="companyName" className="block text-gray-700 font-bold mb-2">
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Company Name"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="slogan" className="block text-gray-700 font-bold mb-2">
              Slogan
            </label>
            <input
              type="text"
              id="slogan"
              name="slogan"
              value={formData.slogan}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Slogan"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="proprietorName" className="block text-gray-700 font-bold mb-2">
              Proprietor Name
            </label>
            <input
              type="text"
              id="proprietorName"
              name="proprietorName"
              value={formData.proprietorName}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Proprietor Name"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Email Address"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="contact" className="block text-gray-700 font-bold mb-2">
              Contact Number
            </label>
            <input
              type="text"
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Contact Number"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="address" className="block text-gray-700 font-bold mb-2">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Address"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="addressLink" className="block text-gray-700 font-bold mb-2">
              Address Link
            </label>
            <input
              type="text"
              id="addressLink"
              name="addressLink"
              value={formData.addressLink}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Address Link"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="instagramLink" className="block text-gray-700 font-bold mb-2">
              Instagram Link
            </label>
            <input
              type="text"
              id="instagramLink"
              name="instagramLink"
              value={formData.instagramLink}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Instagram Link"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="gstin" className="block text-gray-700 font-bold mb-2">
              GSTIN No.
            </label>
            <input
              type="text"
              id="gstin"
              name="gstin"
              value={formData.gstin}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="GSTIN No."
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="QRCode" className="block text-gray-700 font-bold mb-2">
              QR Code
            </label>
            <div className="w-full flex gap-20">

              <div onClick={FileHandler} className="w-12 h-12 bg-bgColor rounded-full shadow-lg flex items-center justify-center cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#808080"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
              </div>
              {url && <div className="w-32 h-32 border">
                <img className='w-full h-full object-cover' src={url} alt="" />
              </div>}
            </div>
            <input onChange={handleImage} ref={curr} name="QRcode" className="hidden" type="file" />
          </div>


          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Password"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-gray-700 font-bold mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Confirm Password"
              required
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUpPage;
