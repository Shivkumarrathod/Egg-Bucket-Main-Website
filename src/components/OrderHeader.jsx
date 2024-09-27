import React, { useState } from "react";
import { Link } from "react-router-dom";
import bglogo from "../assets/Images/logo.png";
import { AiOutlineShoppingCart, AiOutlineMenu, AiOutlineClose, AiOutlineDown, AiOutlinePlus } from "react-icons/ai";
import Cart from "./Cart";

const Header = ({ cartItems, addToCart, removeFromCart }) => {
  const [nav, setNav] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showAddressPopup, setShowAddressPopup] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("Patli Gali, Mota Bazzar, Jammu");
  const [temporaryAddress, setTemporaryAddress] = useState(null);

  const handleNav = () => setNav(!nav);
  const toggleCart = () => setIsCartOpen(!isCartOpen);
  const toggleAddressPopup = () => setShowAddressPopup(!showAddressPopup);

  const handleAddressSelect = (address) => setTemporaryAddress(address);
  
  const saveSelectedAddress = () => {
    if (temporaryAddress) {
      setSelectedAddress(temporaryAddress);
    }
    toggleAddressPopup();
  };

  console.log("Cart Items:", cartItems); // Debugging

  return (
    <>
      {isCartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40" onClick={toggleCart}></div>
      )}

      <nav className={`w-full bg-white shadow-md fixed top-0 z-50 transition-all duration-300 ease-in-out ${isCartOpen ? 'blur-sm' : ''}`}>
        <div className="flex flex-col md:flex-row justify-between items-center px-4 py-3 md:px-8">
          <div className="flex items-center justify-between w-full md:w-auto">
            <img src={bglogo} className="h-[40px] w-[80px] md:h-[55px] md:w-[100px]" alt="Logo" />
            <div className="md:hidden flex items-center space-x-4">
              <AiOutlineDown className="text-gray-600 hover:text-orange-500 text-2xl" onClick={toggleAddressPopup} />
              <AiOutlineShoppingCart size={25} className="cursor-pointer text-gray-600 hover:text-orange-500 transition-transform transform hover:scale-110" onClick={toggleCart} />
              <Link className="bg-orange-500 text-white px-3 py-2 rounded-md hover:bg-orange-600 transition-transform duration-300 transform hover:scale-105">Login</Link>
              {!nav ? (
                <AiOutlineMenu size={25} className="cursor-pointer transition-transform transform hover:scale-110" onClick={handleNav} />
              ) : (
                <AiOutlineClose size={25} className="cursor-pointer transition-transform transform hover:scale-110" onClick={handleNav} />
              )}
            </div>
          </div>

          <ul className="hidden md:flex lg:space-x-8 md:space-x-4 text-gray-800 left-[150px] absolute">
            <li className="relative lg:text-lg md:text-base hover:text-orange-500 cursor-pointer transition-transform transform hover:scale-105 group">About Us<span className="absolute bottom-0 left-0 w-0 h-1 bg-orange-500 transition-all duration-1000 group-hover:w-full"></span></li>
            <li className="relative lg:text-lg md:text-base hover:text-orange-500 cursor-pointer transition-transform transform hover:scale-105 group">Subscribe<span className="absolute bottom-0 left-0 w-0 h-1 bg-orange-500 transition-all duration-1000 group-hover:w-full"></span></li>
          </ul>

          <div className="absolute lg:right-[200px] md:right-[170px]">
            <div className="hidden md:flex items-center space-x-2 cursor-pointer" onClick={toggleAddressPopup}>
              <span className="text-lg hover:text-orange-500 text-gray-800 truncate md:text-base lg:text-lg">{selectedAddress}</span>
              <AiOutlineDown className="text-gray-800" />
            </div>
            {showAddressPopup && (
              <div className="md:absolute mt-[70px] md:mt-9 w-[300px] md:w-[370px] md:right-[150px] bg-white p-6 rounded-lg shadow-lg z-20">
                <h2 className="text-lg md:text-xl font-bold mb-4">Select an Address</h2>
                <ul className="space-y-3">
                  {["Patli Gali, Mota Bazzar, Jammu", "Slim Street, Fat Market, Bengaluru"].map((address, index) => (
                    <li key={index} onClick={() => handleAddressSelect(address)} className={`cursor-pointer p-2 rounded-md transition-all duration-300 md:text-lg text-sm transform ${temporaryAddress === address ? "border-2 border-orange-500 text-gray-800 scale-105" : "bg-gray-200 text-gray-800 hover:border-orange-400 hover:border-2"}`} style={{ backgroundColor: temporaryAddress === address ? "white" : "" }}>
                      {address}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex justify-between">
                  <button className="bg-green-500 md:text-lg text-sm text-white px-4 py-2 rounded-md hover:bg-green-600 transition-transform duration-300 flex items-center transform hover:scale-105" onClick={() => alert("Add new address functionality coming soon!")}>
                    <AiOutlinePlus className="mr-2" /> Add New Address
                  </button>
                  <button className="bg-orange-500 md:text-lg text-sm text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-transform transform hover:scale-105 duration-300" onClick={saveSelectedAddress}>
                    Save
                  </button>
                </div>
                <button className="mt-4 w-full md:text-lg text-sm bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-transform transform hover:scale-105 duration-300" onClick={toggleAddressPopup}>Close</button>
              </div>
            )}
          </div>

          <div className="hidden md:flex items-center md:space-x-3 lg:space-x-6 mx-3">
            <AiOutlineShoppingCart size={25} className="cursor-pointer text-gray-800 hover:text-orange-500 transition-transform transform hover:scale-110" onClick={toggleCart} />
            <Link className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-transform duration-300 transform hover:scale-105" to="/order/account/orders">Login</Link>
          </div>
        </div>

        <div className={`fixed top-16 left-0 right-0 bg-white p-6 my-4 text-center transition-transform duration-300 ease-in-out transform rounded-lg shadow-lg ${nav ? "translate-x-0" : "-translate-x-full"} md:hidden`}>
          <div className="p-4 text-left">
            <ul className="space-y-4">
              <li onClick={toggleCart} className="text-lg cursor-pointer hover:text-orange-500">Cart</li>
              <li className="text-lg cursor-pointer hover:text-orange-500" onClick={() => alert("Functionality coming soon!")}>About Us</li>
              <li className="text-lg cursor-pointer hover:text-orange-500" onClick={() => alert("Functionality coming soon!")}>Subscribe</li>
              <li className="text-lg cursor-pointer hover:text-orange-500" onClick={() => alert("Functionality coming soon!")}>Login</li>
            </ul>
          </div>
        </div>
      </nav>
      {/* {isCartOpen && <Cart cartItems={cartItems} addToCart={addToCart} removeFromCart={removeFromCart} toggleCart={toggleCart} />} */}
      {isCartOpen && <Cart cartItems={cartItems} removeFromCart={removeFromCart} toggleCart={toggleCart} addToCart={addToCart}  />}
    </>
  );
};

export default Header;
