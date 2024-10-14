import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrdersForCustomer } from '../redux/orderSlice'; 
import egg6 from '../assets/Images/six.jpg';
import egg12 from '../assets/Images/twleve.jpg';
import egg30 from '../assets/Images/thirty.jpg';

const Orders = () => {
  const dispatch = useDispatch();

  const userData = useSelector((state) => state.user.userData);  
  const ordersData = useSelector((state) => state.orders.ordersData);
  const ordersLoading = useSelector((state) => state.orders.loading);
  const ordersError = useSelector((state) => state.orders.error);

  useEffect(() => {
    if (userData && userData.phone) {
      console.log("User Phone Number:", userData.phone);
      dispatch(fetchOrdersForCustomer(userData.phone));
    } else {
      console.error("Phone number is missing in userData.");
    }
  }, [userData, dispatch]);

  if (ordersLoading) return <p>Loading...</p>;
  if (ordersError) return <p>Error: {ordersError}</p>;

  // Sort orders by createdAt date in descending order (latest first)
  const sortedOrders = ordersData.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Function to match the product name to its corresponding image
  const getImageByName = (name) => {
    switch (name.toLowerCase()) {
      case 'e6'||1:
        return egg6;
      case 'e12'||2:
        return egg12;
      case 'e30'||3:
        return egg30;
      default:
        return egg6; 
    }
  };

  // Format date 
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).replace(' at', ','); 
  };

  // Map fetched data to product names and quantities 
  const mapOrderItems = (products) => {
    return Object.keys(products).map((productCode) => ({
      name: productCode.toLowerCase(),
      quantity: products[productCode],
    }));
  };

  // Extract the orderId 
  const extractOrderId = (docId) => {
    if (docId && docId.includes('-')) {
      return docId.split('-')[1]; 
    }
    return docId; 
  };

  return (
    <div className="h-3/4 lg:h-2/3 overflow-y-auto bg-gray-100 rounded-lg">
      {sortedOrders.length === 0 ? (
        <p className="text-black text-center text-lg">No orders done</p>
      ) : (
        <div className="space-y-4 m-4">
          {sortedOrders.map((order, index) => (
            <div
              key={index}
              className="bg-white p-4 shadow-lg flex justify-between items-center"
            >
              <div className="flex flex-col items-start">
                {/* Products images with quantity badges */}
                <div className="flex space-x-2">
                  {mapOrderItems(order.products).map((item, i) => (
                    <div key={i} className="relative">
                      {/* Quantity badge */}
                      <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                        {item.quantity || 1} {/* Default quantity if not present */}
                      </span>
                      {/* Product image */}
                      <img
                        src={getImageByName(item.name)} 
                        alt={item.name}
                        className="w-14 h-14 object-cover rounded-md"
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-2">
                  <p className="text-sm text-gray-500">Placed at {formatDate(order.createdAt)}</p>
                </div>
              </div>

              <div>
                <p className="text-lg font-semibold">₹{order.amount}</p>
                <p className="text-sm text-gray-500">
                  Order ID: {extractOrderId(order.id)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
