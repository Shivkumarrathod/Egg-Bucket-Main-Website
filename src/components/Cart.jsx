import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiChevronDown } from "react-icons/fi";

const Cart = ({ addToCart, removeFromCart, toggleCart, selectedAddress: headerSelectedAddress }) => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showSelectAlert, setShowSelectAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [userToken, setUserToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setUserToken(token);

    // Load cart items from localStorage
    const savedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(savedCartItems);

    // Use the address passed from the header if available, else fallback to the first address from userData
    if (headerSelectedAddress) {
      setSelectedAddress(headerSelectedAddress);
    } else if (userData?.addresses?.length > 0) {
      setSelectedAddress(userData.addresses[0].fullAddress);
    }
  }, [headerSelectedAddress, userData]);

  const [localQuantities, setLocalQuantities] = useState({});

  useEffect(() => {
    // Update localQuantities when cartItems change
    const newLocalQuantities = cartItems.reduce((acc, item) => {
      acc[item.id] = item.quantity;
      return acc;
    }, {});
    setLocalQuantities(newLocalQuantities);
  }, [cartItems]);

  const saveCartToLocalStorage = (updatedCart) => {
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
  };

  const handleRemoveFromCart = (productId) => {
    const updatedCartItems = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedCartItems);
    
    const { [productId]: _, ...updatedQuantities } = localQuantities;
    setLocalQuantities(updatedQuantities);
    
    saveCartToLocalStorage(updatedCartItems);
    removeFromCart(productId);
  };

  const incrementQuantity = (product) => {
    const updatedQuantity = (localQuantities[product.id] || 0) + 1;
    setLocalQuantities({ ...localQuantities, [product.id]: updatedQuantity });
    const updatedCartItems = cartItems.map(item =>
      item.id === product.id ? { ...item, quantity: updatedQuantity } : item
    );
    setCartItems(updatedCartItems);
    saveCartToLocalStorage(updatedCartItems);
    addToCart({ ...product, quantity: updatedQuantity });
  };

  const decrementQuantity = (product) => {
    if (localQuantities[product.id] === 1) {
      removeFromCart(product.id);
      const updatedCartItems = cartItems.filter(item => item.id !== product.id);
      setCartItems(updatedCartItems);
      saveCartToLocalStorage(updatedCartItems);
      const { [product.id]: _, ...rest } = localQuantities;
      setLocalQuantities(rest);
    } else {
      const updatedQuantity = localQuantities[product.id] - 1;
      setLocalQuantities({ ...localQuantities, [product.id]: updatedQuantity });
      const updatedCartItems = cartItems.map(item =>
        item.id === product.id ? { ...item, quantity: updatedQuantity } : item
      );
      setCartItems(updatedCartItems);
      saveCartToLocalStorage(updatedCartItems);
      addToCart({ ...product, quantity: updatedQuantity });
    }
  };

  const subtotal = cartItems.reduce(
    (acc, product) => acc + product.price * localQuantities[product.id], 0
  );
  const shipping = 0;
  const totalPrice = subtotal + shipping;

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setShowSelectAlert(true);
      return;
    }

    const customer = userData;
    if (!customer) {
      console.error('No customer data found in Redux');
      return;
    }

    const products = cartItems.reduce((acc, item) => {
      let mappedId;
      if (item.id === 1) {
        mappedId = "E30";
      } else if (item.id === 2) {
        mappedId = "E6";
      } else if (item.id === 3) {
        mappedId = "E12";
      } else {
        mappedId = item.id;
      }
      acc[mappedId] = localQuantities[item.id];
      return acc;
    }, {});

    const orderPayload = {
      address: selectedAddress,
      amount: totalPrice,
      products,
      outletId: "OP_1",
      customerName: customer.name || "Anonymous",
      customerId: customer.phone,
      deliveryPartnerId: "partner789",
    };

    try {
      setIsLoading(true); // Set loading to true
      const response = await axios.post(
        'https://b2c-49u4.onrender.com/api/v1/order/order',
        orderPayload
      );

      if (response.status === 201 && response.data.message === "Order created and customer totalExpenditure updated") {
        const city = selectedAddress.city || "your location";
        setSuccessMessage(`Order placed successfully! Delivering to: ${city}`);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      setSuccessMessage('Failed to place order. Please try again.');
    } finally {
      setIsLoading(false); // Set loading to false
      setTimeout(() => {
        clearCart();
        setSuccessMessage("Order placed successfully!");
      }, 1000);
    }
  };

  const clearCart = () => {
    cartItems.forEach(item => removeFromCart(item.id));
    setCartItems([]);
    setLocalQuantities({});
    saveCartToLocalStorage([]);
  };

  const handleLoginRedirect = () => {
    navigate('/order/login');
  };

  const handleToggleCart = () => {
    toggleCart();
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
                    <p>₹{item.price.toFixed(2)} x {localQuantities[item.id]}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="bg-gray-200 px-2 py-1" onClick={() => decrementQuantity(item)}>
                    -
                  </button>
                  <span className="px-2 py-1 font-bold">{localQuantities[item.id]}</span>
                  <button className="bg-gray-200 px-2 py-1" onClick={() => incrementQuantity(item)}>
                    +
                  </button>
                  <button className="bg-red-500 text-white px-2 py-1" onClick={() => handleRemoveFromCart(item.id)}>
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-4">
            <div className="flex justify-between">
              <p className="font-semibold">Subtotal:</p>
              <p className="font-semibold">₹{subtotal.toFixed(2)}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-semibold">Shipping:</p>
              <p className="font-semibold">₹{shipping.toFixed(2)}</p>
            </div>
            <div className="flex justify-between mt-2">
              <p className="font-bold">Total:</p>
              <p className="font-bold">₹{totalPrice.toFixed(2)}</p>
            </div>
          </div>

          <div className="relative mt-4">
            <div onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex justify-between items-center cursor-pointer border p-2 rounded-md">
              <span>{selectedAddress ? `${selectedAddress.flatNo}, ${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.state}` : 'Select Address'}</span>
              <FiChevronDown />
            </div>
            {isDropdownOpen && (
              <ul className="absolute bg-white border rounded-md shadow-lg mt-1 w-full z-30">
                {userData?.addresses?.map((address, index) => (
                  <li 
                    key={index} 
                    onClick={() => {
                      setSelectedAddress(address.fullAddress);
                      setIsDropdownOpen(false);
                    }} 
                    className="p-2 cursor-pointer hover:bg-orange-200"
                  >
                    {`${address.fullAddress.flatNo}, ${address.fullAddress.area}, ${address.fullAddress.city}, ${address.fullAddress.state}, ${address.fullAddress.country}-${address.fullAddress.zipCode}`}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-4">
            {userToken ? (
              <button 
                onClick={handlePlaceOrder} 
                className={`bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={isLoading} // Disable button during loading
              >
                {isLoading ? "Placing Order..." : "Place Order"} {/* Show loader text */}
              </button>
            ) : (
              <button 
                onClick={handleLoginRedirect} 
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              >
                Login
              </button>
            )}
          </div>
        </>
      )}

      {successMessage && (
        <div className="mt-4 p-2 bg-green-500 text-white rounded-md">
          {successMessage}
        </div>
      )}

      {showSelectAlert && (
        <div className="mt-4 p-2 bg-red-500 text-white rounded-md">
          Please select a delivery address
        </div>
      )}
    </div>
  );
};

export default Cart;
