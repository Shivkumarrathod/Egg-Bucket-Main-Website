import React, { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

// Alert Component
const Alert = ({ message, onClose }) => {
  return (
    <div className="fixed top-0 left-0 right-0 mt-20 mx-auto w-96 bg-orange-500 text-white p-4 rounded-md shadow-lg z-50">
      <p>{message}</p>
      <button 
        onClick={onClose} 
        className="mt-2 bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded"
      >
        Close
      </button>
    </div>
  );
};

// Cart Component
const Cart = ({ cartItems, addToCart, removeFromCart, toggleCart }) => {
  const [selectedAddress, setSelectedAddress] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showSelectAlert, setShowSelectAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const addresses = [
    "123 Main St, Springfield, IL",
    "456 Elm St, Springfield, IL",
    "789 Maple Avenue, Springfield, IL",
    "100 Oak Street, Springfield, IL",
    "555 Birch Lane, Springfield, IL",
    "777 Pine Road, Springfield, IL",
  ];

  // Local state to manage quantity for display
  const [localQuantities, setLocalQuantities] = useState(
    cartItems.reduce((acc, item) => {
      acc[item.id] = item.quantity;
      return acc;
    }, {})
  );

  // Increment quantity
  const incrementQuantity = (product) => {
    const updatedQuantity = localQuantities[product.id] + 1;
    setLocalQuantities({ ...localQuantities, [product.id]: updatedQuantity });
    addToCart({ ...product, quantity: updatedQuantity });
  };

  // Decrement quantity
  const decrementQuantity = (product) => {
    if (localQuantities[product.id] === 1) {
      removeFromCart(product.id);
      const { [product.id]: _, ...rest } = localQuantities;
      setLocalQuantities(rest);
    } else {
      const updatedQuantity = localQuantities[product.id] - 1;
      setLocalQuantities({ ...localQuantities, [product.id]: updatedQuantity });
      addToCart({ ...product, quantity: updatedQuantity });
    }
  };

  const subtotal = cartItems.reduce((acc, product) => acc + product.price * localQuantities[product.id], 0);
  const shipping = 0; // Assuming free shipping for now
  const totalPrice = subtotal + shipping;

  // Place Order Handler
  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      setShowSelectAlert(true);
    } else {
      setSuccessMessage(`Order placed successfully! Delivering to: ${selectedAddress}`);
    }
  };

  // Close Alerts
  const closeSelectAlert = () => {
    setShowSelectAlert(false);
  };

  const handleToggleCart = () => {
    toggleCart();
    // No reset for successMessage, let it persist
  };

  return (
    <div className="fixed right-0 top-0 w-96 h-full bg-white shadow-lg p-4 z-50">
      <button
        className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        onClick={handleToggleCart}
      >
        Close
      </button>
      <h2 className="text-lg font-bold mb-4">Your Cart</h2>
      <div className="border-b-2 border-orange-500 mb-4" />

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {cartItems.map(item => (
              <li key={item.id} className="flex justify-between items-center">
                <div className="flex items-center">
                  <img src={item.image} alt={item.name} className="w-16 h-16 mr-4" />
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p>${item.price.toFixed(2)} x {localQuantities[item.id]}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    className="bg-gray-200 px-2 py-1" 
                    onClick={() => decrementQuantity(item)} 
                  >
                    -
                  </button>
                  <span className="px-2 py-1 font-bold">{localQuantities[item.id]}</span>
                  <button 
                    className="bg-gray-200 px-2 py-1" 
                    onClick={() => incrementQuantity(item)}
                  >
                    +
                  </button>
                  <button 
                    className="bg-red-500 text-white px-2 py-1" 
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <div className="flex justify-between">
              <p className="font-semibold">Subtotal:</p>
              <p className="font-semibold">${subtotal.toFixed(2)}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-semibold">Shipping:</p>
              <p className="font-semibold">${shipping.toFixed(2)}</p>
            </div>
            <div className="flex justify-between mt-2">
              <p className="font-bold">Total:</p>
              <p className="font-bold">${totalPrice.toFixed(2)}</p>
            </div>
          </div>
          <div className="relative mt-4">
            <div onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex justify-between items-center cursor-pointer border p-2 rounded-md">
              <span>Select Address</span>
              <FiChevronDown />
            </div>
            {isDropdownOpen && (
              <ul className="absolute bg-white border rounded-md shadow-lg mt-1 w-full z-30">
                {addresses.map((address, index) => (
                  <li 
                    key={index} 
                    onClick={() => {
                      setSelectedAddress(address);
                      setIsDropdownOpen(false);
                    }} 
                    className="p-2 cursor-pointer hover:bg-orange-200"
                  >
                    {address}
                  </li>
                ))}
              </ul>
            )}
            {selectedAddress && (
              <p className="mt-2 overflow-x-auto whitespace-nowrap">
                Delivery to: {selectedAddress}
              </p>
            )}
          </div>
          <div className="mt-4">
            <button 
              onClick={handlePlaceOrder} 
              className="bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600"
            >
              Place Order
            </button>
          </div>
          
          {/* Success Message */}
          {successMessage && (
            <div className="mt-4 p-2 bg-green-500 text-white rounded-md">
              {successMessage}
            </div>
          )}
        </>
      )}

      {/* Show Select Alert */}
      {showSelectAlert && (
        <Alert 
          message={`Please select an address before placing the order!`} 
          onClose={closeSelectAlert} 
        />
      )}
    </div>
  );
};

export default Cart;





