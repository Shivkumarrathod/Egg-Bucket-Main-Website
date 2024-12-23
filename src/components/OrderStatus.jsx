import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"; // Add this line
import { fetchOrdersForCustomer } from "../redux/orderSlice";
import egg6 from "../assets/Images/six.jpg";
import egg12 from "../assets/Images/twleve.jpg";
import egg30 from "../assets/Images/thirty.jpg";

const Orders = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.userData);
  const ordersData = useSelector((state) => state.orders.ordersData);
  const ordersLoading = useSelector((state) => state.orders.loading);
  const ordersError = useSelector((state) => state.orders.error);

  // State to manage expanded order
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    if (userData && userData.phone) {
      console.log("User Phone Number:", userData.phone);
      dispatch(fetchOrdersForCustomer(userData.phone));
    } else {
      console.error("Phone number is missing in userData.");
    }
  }, [userData, dispatch]);

  useEffect(() => {
    console.log("Fetched Orders Data:", ordersData); // This will log whenever the ordersData changes
  }, [ordersData]);

  if (ordersLoading) return <p>Loading...</p>;
  if (ordersError) return <p>Error: {ordersError}</p>;

  // Sort orders by createdAt date in descending order (latest first)
  const sortedOrders = ordersData
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  console.log("Sorted orders is=", sortedOrders); // Check the structure after sorting

  // Function to match the product name to its corresponding image
  const getImageByName = (name) => {
    switch (name.toLowerCase()) {
      case "e6":
        return egg6;
      case "e12":
        return egg12;
      case "e30":
        return egg30;
      default:
        return egg6;
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date
      .toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .replace(" at", ",");
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
    if (docId && docId.includes("-")) {
      return docId.split("-")[1];
    }
    return docId;
  };

  // Handle order click to toggle expanded state
  const handleOrderClick = (orderId) => {
    setExpandedOrderId((prevId) => (prevId === orderId ? null : orderId));
  };

  return (
    <div className="h-3/4 lg:h-2/3 overflow-y-auto bg-gray-100 rounded-lg">
      {sortedOrders.length === 0 ? (
        <p className="text-black text-center text-lg">No orders done</p>
      ) : (
        <div className="space-y-4 m-4">
          {sortedOrders.map((order) => (
            <div key={order.id}>
              <div
                className="bg-white p-4 shadow-lg flex justify-between items-center cursor-pointer"
                onClick={() => handleOrderClick(order.id)}
              >
                <div className="flex flex-col items-start">
                  {/* Products images with quantity badges */}
                  <div className="flex space-x-2">
                    {mapOrderItems(order.products).map((item, i) => (
                      <div key={i} className="relative">
                        {/* Quantity badge */}
                        <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                          {item.quantity || 1}{" "}
                          {/* Default quantity if not present */}
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
                    <p className="text-sm text-gray-500">
                      Placed at {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-lg font-semibold">₹{order.amount}</p>
                  <p className="text-sm text-gray-500">
                    Order ID: {extractOrderId(order.id)}
                  </p>
                </div>
              </div>

              {/* Expanded details section with animation */}
              <div
                className={`overflow-hidden transition-max-height duration-500 ease-in-out ${
                  expandedOrderId === order.id ? "max-h-96" : "max-h-0"
                }`}
              >
                {expandedOrderId === order.id && (
                  <div className="bg-gray-50 p-4 mt-2 rounded-md shadow-md">
                    <h3 className="font-semibold text-lg">Order Details</h3>
                    <p>
                      <strong>Shipping Address:</strong>
                      {order.address && order.address.fullAddress
                        ? `${order.address.fullAddress.flatNo}, ${
                            order.address.fullAddress.addressLine2 ||
                            "No Address Found"
                          }, ${
                            order.address.fullAddress.area || "No Address Found"
                          }, ${
                            order.address.fullAddress.city || "No Address Found"
                          }, ${
                            order.address.fullAddress.state ||
                            "No Address Found"
                          }, ${
                            order.address.fullAddress.zipCode ||
                            "No Address Found"
                          }, ${
                            order.address.fullAddress.country ||
                            "No Address Found"
                          }`
                        : "No address available"}
                    </p>
                    <p>
                      <strong>Status:</strong> {order.status}
                    </p>
                    <h4 className="mt-2 font-semibold">Products:</h4>
                    {mapOrderItems(order.products).map((item, i) => (
                      <div key={i} className="flex items-center mt-1">
                        <img
                          src={getImageByName(item.name)}
                          alt={item.name}
                          className="w-10 h-10 object-cover rounded-md"
                        />
                        <p className="ml-2">
                          {item.name.toUpperCase()} - Quantity: {item.quantity}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
